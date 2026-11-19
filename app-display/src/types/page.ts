export interface PageColors {
  screenBackgroundColor: string;
  cardBackgroundColor: string;
  cardBorderColor: string;
  cardInnerBackgroundColor: string;
  cardInnerBorderColor: string;
  nameColor: string;
  labelColor: string;
  valueColor: string;
}

export interface Page {
  id: string;
  userId: string;
  userName: string;
  slug: string;

  name: string;
  url: string;
  profession: string;

  services: string[];

  showDescription: boolean;
  description: string;

  showTitle: boolean;
  title: string;

  showSubtitle: boolean;
  subtitle: string;

  showLinkedIn: boolean;
  linkedIn: string;

  showInstagram: boolean;
  instagram: string;

  showWhatsApp: boolean;
  whatsApp: string;

  showBusinessPhone: boolean;
  businessPhone: string;

  showEmail: boolean;
  email: string;

  showAddress: boolean;
  address: string;

  colors?: PageColors;
}
