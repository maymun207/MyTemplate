export type Locale = "en" | "tr";

export interface Dictionary {
  nav: {
    home: string;
    about: string;
    caseStudies: string;
    careers: string;
    contact: string;
    [key: string]: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    [key: string]: string;
  };
  about: {
    title: string;
    description: string;
    [key: string]: string;
  };
  footer: {
    copyright: string;
    [key: string]: string;
  };
  caseStudies: {
    title: string;
    subtitle: string;
    [key: string]: unknown;
  };
  careers: {
    title: string;
    subtitle: string;
    [key: string]: unknown;
  };
  contact: {
    title: string;
    subtitle: string;
    [key: string]: unknown;
  };
  roi: {
    title: string;
    subtitle: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
