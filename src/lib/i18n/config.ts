export const i18n = {
  defaultLocale: "tr" as const,
  locales: ["en", "tr"] as const,
};

export type Locale = (typeof i18n)["locales"][number];
