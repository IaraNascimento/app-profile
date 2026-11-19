import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import {
  PageService,
  PageSlugAlreadyExistsError,
} from '../../../core/services/page.service';
import { Page } from '../../../core/models/page.model';
import { FormSection } from '../../../core/models/form-fields';

@Component({
  selector: 'app-page-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './page-form.component.html',
  styleUrl: './page-form.component.scss',
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

  serviceInput = '';

  services: string[] = [];

  sections: FormSection[] = [
    {
      title: 'Informações principais',
      type: 'fields',
      fields: [
        {
          key: 'name',
          label: 'Nome',
          placeholder: 'ex: Fulane da Silva Sauro',
          type: 'text',
        },
        {
          key: 'url',
          label: 'URL',
          placeholder: 'ex: fulane-silva-sauro',
          type: 'text',
        },
        {
          key: 'profession',
          label: 'Profissão',
          placeholder: 'ex: Dentista',
          type: 'text',
        },
      ],
    },
    {
      title: 'Conteúdo',
      type: 'fields',
      fields: [
        {
          key: 'description',
          label: 'Descrição',
          show: 'showDescription',
          showLabel: 'Mostrar Descrição',
          placeholder: 'Aqui vai o resumo do perfil profissional...',
          multiline: true,
        },
        {
          key: 'title',
          label: 'Título',
          show: 'showTitle',
          showLabel: 'Mostrar Título',
          placeholder: 'ex: Atendimento humanizado',
          multiline: true,
        },
        {
          key: 'subtitle',
          label: 'Subtítulo',
          show: 'showSubtitle',
          showLabel: 'Mostrar Subtítulo',
          placeholder:
            'ex: Oferecemos diversos serviços de forma profissional e com preços que cabem no seu bolso.',
          multiline: true,
        },
      ],
    },
    {
      title: 'Contato e redes sociais',
      type: 'fields',
      fields: [
        {
          key: 'linkedIn',
          label: 'LinkedIn URL',
          show: 'showLinkedIn',
          showLabel: 'Mostrar LinkedIn',
          placeholder: 'ex: https://www.linkedin.com/in/fulane-silva-sauro/',
          type: 'text',
        },
        {
          key: 'instagram',
          label: 'Instagram',
          show: 'showInstagram',
          showLabel: 'Mostrar Instagram',
          placeholder: 'ex: @fulane-silva-sauro',
          type: 'text',
        },
        {
          key: 'whatsApp',
          label: 'WhatsApp',
          show: 'showWhatsApp',
          showLabel: 'Mostrar WhatsApp',
          placeholder: 'ex: +55 (11) 91234-5678',
          type: 'text',
        },
        {
          key: 'businessPhone',
          label: 'Telefone Comercial',
          show: 'showBusinessPhone',
          showLabel: 'Mostrar Telefone Comercial',
          placeholder: 'ex: +55 (11) 1234-5678',
          type: 'text',
        },
        {
          key: 'email',
          label: 'E-mail',
          show: 'showEmail',
          showLabel: 'Mostrar E-mail',
          placeholder: 'ex: fulane-silva-sauro@gmail.com',
          type: 'email',
        },
        {
          key: 'address',
          label: 'Endereço',
          show: 'showAddress',
          showLabel: 'Mostrar Endereço',
          placeholder: 'ex: Avenida Paulista, 1234, São Paulo - SP, Brasil',
          type: 'text',
        },
      ],
    },
    {
      title: 'Serviços',
      type: 'services',
    },
    {
      title: 'Personalização de cores',
      type: 'colors',
      description: 'Deixe os campos vazios para utilizar as cores padrão.',
      fields: [
        {
          key: 'screenBackgroundColor',
          label: 'Fundo da página',
          placeholder: '#f8fafc',
        },
        {
          key: 'cardBackgroundColor',
          label: 'Fundo do cartão',
          placeholder: '#ffffff',
        },
        {
          key: 'cardBorderColor',
          label: 'Borda do cartão',
          placeholder: '#e2e8f0',
        },
        {
          key: 'nameColor',
          label: 'Nome',
          placeholder: '#1e293b',
        },
        {
          key: 'labelColor',
          label: 'Rótulos dos campos',
          placeholder: '#334155',
        },
        {
          key: 'valueColor',
          label: 'Valores dos campos',
          placeholder: '#475569',
        },
      ],
    },
  ];

  form = this.fb.nonNullable.group({
    name: [''],
    url: [''],
    profession: [''],

    showDescription: [false],
    description: [''],

    showTitle: [false],
    title: [''],

    showSubtitle: [false],
    subtitle: [''],

    showLinkedIn: [false],
    linkedIn: [''],

    showInstagram: [false],
    instagram: [''],

    showWhatsApp: [false],
    whatsApp: [''],

    showBusinessPhone: [false],
    businessPhone: [''],

    showEmail: [false],
    email: [''],

    showAddress: [false],
    address: [''],

    colors: this.fb.nonNullable.group({
      screenBackgroundColor: [
        '',
        Validators.pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      ],
      cardBackgroundColor: [
        '',
        Validators.pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      ],
      cardBorderColor: [
        '',
        Validators.pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      ],
      nameColor: ['', Validators.pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)],
      labelColor: [
        '',
        Validators.pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      ],
      valueColor: [
        '',
        Validators.pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      ],
    }),
  });

  isFieldVisible(control: string): boolean {
    return this.form.get(control)?.value === true;
  }

  errorMessage = '';
  msgNotFound = 'Não encontrado ou sem permissão.';

  async ngOnInit(): Promise<void> {
    this.pageId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.pageId;

    if (this.pageId) {
      await this.loadPage(this.pageId);
    }
  }

  async loadPage(id: string): Promise<void> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      await this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    try {
      const page = await this.pageService.getById(id, user.uid);

      if (!page) {
        window.alert('Conteúdo não encontrado.');
        await this.router.navigate(['/main']);
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

        colors: {
          screenBackgroundColor: page.colors?.screenBackgroundColor ?? '',
          cardBackgroundColor: page.colors?.cardBackgroundColor ?? '',
          cardBorderColor: page.colors?.cardBorderColor ?? '',
          nameColor: page.colors?.nameColor ?? '',
          labelColor: page.colors?.labelColor ?? '',
          valueColor: page.colors?.valueColor ?? '',
        },
      });

      this.services = [...(page.services ?? [])];
    } catch (error) {
      console.error('Erro ao carregar:', error);
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
    this.serviceInput = '';
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
      await this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const page: Page = {
      ...this.form.getRawValue(),
      userId: user.uid,
      userName: user.displayName || user.email || 'Usuário desconhecido',
      services: [...this.services],
    };

    try {
      if (this.isEditing && this.pageId) {
        await this.pageService.update(this.pageId, page);
      } else {
        await this.pageService.create(page);
      }

      await this.router.navigate(['/main']);
    } catch (error) {
      if (error instanceof PageSlugAlreadyExistsError) {
        this.errorMessage = 'Esta URL já está cadastrada. Escolha outra URL.';
      } else {
        this.errorMessage = 'Não foi possível salvar.';
        console.error(error);
      }
    } finally {
      this.loading = false;
    }
  }

  async cancel(): Promise<void> {
    const confirmed = window.confirm(
      'Tem certeza de que deseja cancelar? As alterações não salvas serão perdidas.',
    );

    if (confirmed) {
      await this.router.navigate(['/main']);
    }
  }

  async delete(): Promise<void> {
    if (!this.pageId) {
      return;
    }

    const confirmed = window.confirm('Tem certeza de que deseja excluir?');

    if (!confirmed) {
      return;
    }

    this.loading = true;

    try {
      const user = this.authService.getCurrentUser();

      if (!user) {
        await this.router.navigate(['/login']);
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

      await this.router.navigate(['/main']);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      window.alert('Não foi possível excluir.');
    } finally {
      this.loading = false;
    }
  }
}
