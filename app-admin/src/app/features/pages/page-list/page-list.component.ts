import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Page } from '../../../core/models/page.model';
import { SearchField } from '../../../core/models/search-field';
import { PageService } from '../../../core/services/page.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-page-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.scss',
})
export class PageListComponent implements OnInit {
  private pageService = inject(PageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  pages: Page[] = [];
  loading = true;

  searchValue = '';
  searchField = 'all';

  searchFields: SearchField[] = [
    { value: 'name', label: 'Nome', show: null },
    { value: 'url', label: 'URL', show: null },
    { value: 'profession', label: 'Profissão', show: null },
    { value: 'description', label: 'Descrição', show: 'showDescription' },
    { value: 'title', label: 'Título', show: 'showTitle' },
    { value: 'subtitle', label: 'Subtítulo', show: 'showSubtitle' },
    { value: 'linkedIn', label: 'LinkedIn', show: 'showLinkedIn' },
    { value: 'instagram', label: 'Instagram', show: 'showInstagram' },
    { value: 'whatsApp', label: 'WhatsApp', show: 'showWhatsApp' },
    {
      value: 'businessPhone',
      label: 'Telefone comercial',
      show: 'showBusinessPhone',
    },
    { value: 'email', label: 'E-mail', show: 'showEmail' },
    { value: 'address', label: 'Endereço', show: 'showAddress' },
    { value: 'services', label: 'Serviços', show: null },
  ];

  get filteredPages(): Page[] {
    const search = this.normalize(this.searchValue);

    if (!search) {
      return this.pages;
    }

    return this.pages.filter((page) => {
      const fields =
        this.searchField === 'all'
          ? this.searchFields
          : this.searchFields.filter(
              (field) => field.value === this.searchField,
            );

      return fields.some(({ value }) => {
        const fieldValue = page[value as keyof Page];

        return this.matches(fieldValue, search);
      });
    });
  }

  private matches(value: unknown, search: string): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (Array.isArray(value)) {
      return value.some((item) => this.matches(item, search));
    }

    if (typeof value === 'object') {
      return Object.values(value).some((item) => this.matches(item, search));
    }

    return this.normalize(String(value)).includes(search);
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  isFieldVisible(page: Page, show: string | null): boolean {
    if (!show) {
      return true;
    }

    return page[show as keyof Page] === true;
  }

  clearSearch(): void {
    this.searchValue = '';
    this.searchField = 'all';
  }

  async ngOnInit(): Promise<void> {
    await this.loadPages();
  }

  async loadPages(): Promise<void> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      await this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    try {
      this.pages = await this.pageService.getAll(user.uid);
    } catch (error) {
      console.error('Erro ao carregar:', error);
    } finally {
      this.loading = false;
    }
  }

  editPage(id: string): void {
    this.router.navigate(['/main/edit', id]);
  }

  async deletePage(id: string): Promise<void> {
    const confirmed = window.confirm('Tem certeza de que deseja excluir?');

    if (!confirmed) {
      return;
    }

    const user = this.authService.getCurrentUser();

    if (!user) {
      await this.router.navigate(['/login']);
      return;
    }

    try {
      await this.pageService.delete(id, user.uid);
      await this.loadPages();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      window.alert('Não foi possível excluir.');
    }
  }

  getWhatsAppUrl(phone: string): string {
    const number = phone.replace(/\D/g, '');

    return `https://wa.me/${number}`;
  }

  getInstagramUrl(handle: string): string {
    const username = handle
      .trim()
      .replace(/^@/, '')
      .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
      .replace(/\/.*$/, '');

    return `https://www.instagram.com/${username}/`;
  }

  getMapsUrl(address: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  getDefaultUrl(url: string): string {
    return `https://app-profile-display.vercel.app/${encodeURIComponent(url)}`;
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }
}
