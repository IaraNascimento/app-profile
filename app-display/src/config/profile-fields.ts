import type { Page } from "../types/page";

export type PageField = Exclude<
  keyof Page,
  | "id"
  | "userId"
  | "userName"
  | "showDescription"
  | "showTitle"
  | "showSubtitle"
  | "showLinkedIn"
  | "showInstagram"
  | "showWhatsApp"
  | "showBusinessPhone"
  | "showEmail"
  | "showAddress"
>;

export type VisibilityField = Extract<keyof Page, `show${string}`>;

export interface ProfileField {
  value: PageField;
  label: string;
  show: VisibilityField | null;
}

export const profileFields: ProfileField[] = [
  { value: "description", label: "Descrição", show: "showDescription" },
  { value: "title", label: "Título", show: "showTitle" },
  { value: "subtitle", label: "Subtítulo", show: "showSubtitle" },
  { value: "linkedIn", label: "LinkedIn", show: "showLinkedIn" },
  { value: "instagram", label: "Instagram", show: "showInstagram" },
  { value: "whatsApp", label: "WhatsApp", show: "showWhatsApp" },
  {
    value: "businessPhone",
    label: "Telefone comercial",
    show: "showBusinessPhone",
  },
  { value: "email", label: "E-mail", show: "showEmail" },
  { value: "address", label: "Endereço", show: "showAddress" },
  { value: "services", label: "Serviços", show: null },
];
