import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";

import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "../../../core/services/auth.service";
import {
  PageService,
  PageSlugAlreadyExistsError,
} from "../../../core/services/page.service";
import { Page } from "../../../core/models/page.model";

@Component({
  selector: "app-page-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./page-form.component.html",
  styleUrl: "./page-form.component.scss",
})
export class PageFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private authService = inject(AuthService);
  private pageService = inject(PageService);

  pageId: string | null = null;
  loading = false;
  isEditing = false;

  serviceInput = "";

  services: string[] = [];

  form = this.fb.nonNullable.group({
    name: [""],
    url: [""],
    profession: [""],

    showDescription: [false],
    description: [""],

    showTitle: [false],
    title: [""],

    showSubtitle: [false],
    subtitle: [""],

    showLinkedIn: [false],
    linkedIn: [""],

    showInstagram: [false],
    instagram: [""],

    showWhatsApp: [false],
    whatsApp: [""],

    showBusinessPhone: [false],
    businessPhone: [""],

    showEmail: [false],
    email: [""],

    showAddress: [false],
    address: [""],
  });

  errorMessage = "";
  msgNotFound = "Não encontrado ou sem permissão.";

  async ngOnInit(): Promise<void> {
    this.pageId = this.route.snapshot.paramMap.get("id");
    this.isEditing = !!this.pageId;

    if (this.pageId) {
      await this.loadPage(this.pageId);
    }
  }

  async loadPage(id: string): Promise<void> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      await this.router.navigate(["/login"]);
      return;
    }

    this.loading = true;

    try {
      const page = await this.pageService.getById(id, user.uid);

      if (!page) {
        window.alert("Conteúdo não encontrado.");
        await this.router.navigate(["/main"]);
        return;
      }

      this.form.patchValue({
        name: page.name,
        url: page.url,
        profession: page.profession,

        showDescription: page.showDescription,
        description: page.description,

        showTitle: page.showTitle,
        title: page.title,

        showSubtitle: page.showSubtitle,
        subtitle: page.subtitle,

        showLinkedIn: page.showLinkedIn,
        linkedIn: page.linkedIn,

        showInstagram: page.showInstagram,
        instagram: page.instagram,

        showWhatsApp: page.showWhatsApp,
        whatsApp: page.whatsApp,

        showBusinessPhone: page.showBusinessPhone,
        businessPhone: page.businessPhone,

        showEmail: page.showEmail,
        email: page.email,

        showAddress: page.showAddress,
        address: page.address,
      });

      this.services = [...(page.services ?? [])];
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      this.loading = false;
    }
  }

  addService(): void {
    const service = this.serviceInput.trim();

    if (!service) {
      return;
    }

    if (this.services.includes(service)) {
      return;
    }

    this.services.push(service);
    this.serviceInput = "";
  }

  removeService(index: number): void {
    this.services.splice(index, 1);
  }

  async save(): Promise<void> {
    if (this.form.invalid || this.loading) {
      return;
    }

    const user = this.authService.getCurrentUser();

    if (!user) {
      await this.router.navigate(["/login"]);
      return;
    }

    this.loading = true;
    this.errorMessage = "";

    const page: Page = {
      ...this.form.getRawValue(),
      userId: user.uid,
      services: [...this.services],
    };

    try {
      if (this.isEditing && this.pageId) {
        await this.pageService.update(this.pageId, page);
      } else {
        await this.pageService.create(page);
      }

      await this.router.navigate(["/main"]);
    } catch (error) {
      if (error instanceof PageSlugAlreadyExistsError) {
        this.errorMessage = "Esta URL já está cadastrada. Escolha outra URL.";
      } else {
        this.errorMessage = "Não foi possível salvar.";
        console.error(error);
      }
    } finally {
      this.loading = false;
    }
  }

  async cancel(): Promise<void> {
    const confirmed = window.confirm(
      "Tem certeza de que deseja cancelar? As alterações não salvas serão perdidas.",
    );

    if (confirmed) {
      await this.router.navigate(["/main"]);
    }
  }

  async delete(): Promise<void> {
    if (!this.pageId) {
      return;
    }

    const confirmed = window.confirm("Tem certeza de que deseja excluir?");

    if (!confirmed) {
      return;
    }

    this.loading = true;

    try {
      const user = this.authService.getCurrentUser();

      if (!user) {
        await this.router.navigate(["/login"]);
        return;
      }

      const existingPage = await this.pageService.getById(
        this.pageId,
        user.uid,
      );

      if (!existingPage) {
        throw new Error(this.msgNotFound);
      }

      await this.pageService.delete(this.pageId, user.uid);

      await this.router.navigate(["/main"]);
    } catch (error) {
      console.error("Erro ao excluir:", error);
      window.alert("Não foi possível excluir.");
    } finally {
      this.loading = false;
    }
  }
}
