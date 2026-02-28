import type { Locale } from "./config";

const dictionaries = {
  en: () => import("@/lib/dictionaries/en.json").then((module) => module.default),
  tr: () => import("@/lib/dictionaries/tr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
