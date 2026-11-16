import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

import { Page } from "../../../core/models/page.model";
import { PageService } from "../../../core/services/page.service";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-page-list",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./page-list.component.html",
  styleUrl: "./page-list.component.scss",
})
export class PageListComponent implements OnInit {
  private pageService = inject(PageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  pages: Page[] = [];
  loading = true;

  async ngOnInit(): Promise<void> {
    await this.loadPages();
  }

  async loadPages(): Promise<void> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      await this.router.navigate(["/login"]);
      return;
    }

    this.loading = true;

    try {
      this.pages = await this.pageService.getAll(user.uid);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      this.loading = false;
    }
  }

  editPage(id: string): void {
    this.router.navigate(["/main/edit", id]);
  }

  async deletePage(id: string): Promise<void> {
    const confirmed = window.confirm("Tem certeza de que deseja excluir?");

    if (!confirmed) {
      return;
    }

    const user = this.authService.getCurrentUser();

    if (!user) {
      await this.router.navigate(["/login"]);
      return;
    }

    try {
      await this.pageService.delete(id, user.uid);
      await this.loadPages();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      window.alert("Não foi possível excluir.");
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(["/login"]);
  }
}
