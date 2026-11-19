export type SearchField = "all" | "user" | "name" | "url";

export interface SearchFieldOption {
  value: SearchField;
  label: string;
}

export const searchFields: SearchFieldOption[] = [
  { value: "user", label: "Usuário" },
  { value: "name", label: "Nome" },
  { value: "url", label: "URL" },
];