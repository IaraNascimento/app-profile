import { Injectable, inject } from "@angular/core";

import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  runTransaction,
} from "@angular/fire/firestore";

import { Page } from "../models/page.model";

export class PageSlugAlreadyExistsError extends Error {
  constructor() {
    super("PAGE_SLUG_ALREADY_EXISTS");
    this.name = "PageSlugAlreadyExistsError";
  }
}

@Injectable({
  providedIn: "root",
})
export class PageService {
  private firestore = inject(Firestore);

  private collectionRef = collection(this.firestore, "pages");

  private getSlug(url: string): string {
    const slug = url
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();

    if (!slug) {
      throw new Error("INVALID_PAGE_SLUG");
    }

    return encodeURIComponent(slug);
  }

  private getPageId(slug: string): string {
    return slug;
  }

  private getPageRef(id: string) {
    return doc(this.firestore, "pages", id);
  }

  private getSlugRef(slug: string) {
    return doc(this.firestore, "page-slugs", slug);
  }

  async getAll(userId: string): Promise<Page[]> {
    const pagesQuery = query(this.collectionRef, where("userId", "==", userId));

    const snapshot = await getDocs(pagesQuery);

    return snapshot.docs.map(
      (document) =>
        ({
          id: document.id,
          ...document.data(),
        }) as Page,
    );
  }

  async getById(id: string, userId: string): Promise<Page | null> {
    const snapshot = await getDoc(this.getPageRef(id));

    if (!snapshot.exists()) {
      return null;
    }

    const page = snapshot.data() as Page;

    if (page.userId !== userId) {
      return null;
    }

    return {
      ...page,
      id: snapshot.id,
    };
  }

  async create(page: Page): Promise<string> {
    const now = Date.now();

    const slug = this.getSlug(page.url);
    const pageId = this.getPageId(slug);

    const slugRef = this.getSlugRef(slug);
    const pageRef = this.getPageRef(pageId);

    await runTransaction(this.firestore, async (transaction) => {
      const slugSnapshot = await transaction.get(slugRef);

      if (slugSnapshot.exists()) {
        throw new PageSlugAlreadyExistsError();
      }

      transaction.set(slugRef, {
        userId: page.userId,
        pageId,
        createdAt: now,
      });

      transaction.set(pageRef, {
        ...page,
        createdAt: now,
        updatedAt: now,
      });
    });

    return pageId;
  }

  async update(id: string, page: Page): Promise<string> {
    const now = Date.now();

    const newSlug = this.getSlug(page.url);
    const newPageId = this.getPageId(newSlug);

    const oldPageRef = this.getPageRef(id);
    const oldSlugRef = this.getSlugRef(id);

    const newPageRef = this.getPageRef(newPageId);
    const newSlugRef = this.getSlugRef(newSlug);

    await runTransaction(this.firestore, async (transaction) => {
      const oldPageSnapshot = await transaction.get(oldPageRef);

      if (!oldPageSnapshot.exists()) {
        throw new Error("PAGE_NOT_FOUND");
      }

      const oldPage = oldPageSnapshot.data() as Page;

      if (oldPage.userId !== page.userId) {
        throw new Error("UNAUTHORIZED_PAGE_UPDATE");
      }

      const oldSlugSnapshot = await transaction.get(oldSlugRef);

      const slugChanged = id !== newSlug;

      // URL não foi alterada
      if (!slugChanged) {
        if (oldSlugSnapshot.exists()) {
          const slugData = oldSlugSnapshot.data();

          if (slugData["userId"] !== page.userId || slugData["pageId"] !== id) {
            throw new PageSlugAlreadyExistsError();
          }
        } else {
          transaction.set(oldSlugRef, {
            userId: page.userId,
            pageId: id,
            createdAt: now,
          });
        }

        transaction.update(oldPageRef, {
          ...page,
          createdAt: oldPage["createdAt"] ?? now,
          updatedAt: now,
        });

        return;
      }

      // URL foi alterada
      const newSlugSnapshot = await transaction.get(newSlugRef);

      if (newSlugSnapshot.exists()) {
        throw new PageSlugAlreadyExistsError();
      }

      if (
        oldSlugSnapshot.exists() &&
        (oldSlugSnapshot.data()["userId"] !== page.userId ||
          oldSlugSnapshot.data()["pageId"] !== id)
      ) {
        throw new Error("UNAUTHORIZED_SLUG_UPDATE");
      }

      // Reserva a nova URL
      transaction.set(newSlugRef, {
        userId: page.userId,
        pageId: newPageId,
        createdAt: now,
      });

      // Cria o documento com o novo ID
      transaction.set(newPageRef, {
        ...page,
        createdAt: oldPage["createdAt"] ?? now,
        updatedAt: now,
      });

      // Remove o documento antigo
      transaction.delete(oldPageRef);

      // Libera a URL anterior
      if (oldSlugSnapshot.exists()) {
        transaction.delete(oldSlugRef);
      }
    });

    return newPageId;
  }

  async delete(id: string, userId: string): Promise<void> {
    const pageRef = this.getPageRef(id);
    const slugRef = this.getSlugRef(id);

    await runTransaction(this.firestore, async (transaction) => {
      const pageSnapshot = await transaction.get(pageRef);

      if (!pageSnapshot.exists()) {
        throw new Error("PAGE_NOT_FOUND");
      }

      const page = pageSnapshot.data() as Page;

      if (page.userId !== userId) {
        throw new Error("UNAUTHORIZED_PAGE_DELETE");
      }

      const slugSnapshot = await transaction.get(slugRef);

      if (
        slugSnapshot.exists() &&
        (slugSnapshot.data()["userId"] !== userId ||
          slugSnapshot.data()["pageId"] !== id)
      ) {
        throw new Error("UNAUTHORIZED_SLUG_DELETE");
      }

      transaction.delete(pageRef);

      if (slugSnapshot.exists()) {
        transaction.delete(slugRef);
      }
    });
  }
}
