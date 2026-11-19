
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "../config/firebase";
import type { Page } from "../types/page";

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const slugRef = doc(db, "page-slugs", slug);
  const slugSnapshot = await getDoc(slugRef);

  if (!slugSnapshot.exists()) {
    return null;
  }

  const { pageId } = slugSnapshot.data();

  if (!pageId || typeof pageId !== "string") {
    return null;
  }

  const pageRef = doc(db, "pages", pageId);
  const pageSnapshot = await getDoc(pageRef);

  if (!pageSnapshot.exists()) {
    return null;
  }

  return {
    id: pageSnapshot.id,
    ...pageSnapshot.data(),
    slug,
  } as Page;
}

export async function getAllPages(): Promise<Page[]> {
  const slugsRef = collection(db, "page-slugs");
  const slugsSnapshot = await getDocs(slugsRef);

  const results = await Promise.all(
    slugsSnapshot.docs.map(async (slugDocument) => {
      const { pageId } = slugDocument.data();

      if (!pageId || typeof pageId !== "string") {
        return null;
      }

      const pageRef = doc(db, "pages", pageId);
      const pageSnapshot = await getDoc(pageRef);

      if (!pageSnapshot.exists()) {
        return null;
      }

      return {
        id: pageSnapshot.id,
        ...pageSnapshot.data(),
        slug: slugDocument.id,
      } as Page;
    }),
  );

  return results.filter((page): page is Page => page !== null);
}
