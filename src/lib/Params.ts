import type { Locale } from "@/types";

interface Params {
  locale: Locale;
}

export type PageParams = {
  params: Promise<Params>;
};
