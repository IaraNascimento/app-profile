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
  icon?: string;
  type?: "description" | "link" | "instagram" | "whatsapp" | "map" | "text";
}

export const profileFields: ProfileField[] = [
  { value: "services", label: "Serviços", show: null },
  {
    value: "description",
    label: "Descrição",
    show: "showDescription",
    icon: "🕮",
    type: "description",
  },
  {
    value: "linkedIn",
    label: "LinkedIn",
    show: "showLinkedIn",
    icon: "in",
    type: "link",
  },
  {
    value: "instagram",
    label: "Instagram",
    show: "showInstagram",
    icon: "◎",
    type: "instagram",
  },
  {
    value: "whatsApp",
    label: "WhatsApp",
    show: "showWhatsApp",
    icon: "✆",
    type: "whatsapp",
  },
  {
    value: "businessPhone",
    label: "Telefone comercial",
    show: "showBusinessPhone",
    icon: "☏",
    type: "text",
  },
  {
    value: "email",
    label: "E-mail",
    show: "showEmail",
    icon: "✉",
    type: "text",
  },
  {
    value: "address",
    label: "Endereço",
    show: "showAddress",
    type: "map",
  },
];
