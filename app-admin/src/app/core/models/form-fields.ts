interface FormField {
  key: string;
  label: string;
  placeholder: string;
  type?: string;
  show?: string;
  showLabel?: string;
  multiline?: boolean;
  fullWidth?: boolean;
}

export interface FormSection {
  title: string;
  type: 'fields' | 'colors' | 'services';
  description?: string;
  fields?: FormField[];
}
