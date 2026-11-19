import { Page } from "./page.model";

export type PageKey = Extract<keyof Page, string>;

export type SearchField = {
  value: PageKey;
  label: string;
  show: PageKey | null;
};
