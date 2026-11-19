interface FormField {
  key: string;
  label: string;
  placeholder: string;
  type?: string;
  show?: string;
  showLabel?: string;
  multiline?: boolean;
}

export interface FormSection {
  title: string;
  type: 'fields' | 'colors' | 'services';
  description?: string;
  fields?: FormField[];
}
