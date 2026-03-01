import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import DashboardPage from "@/components/landing/DashboardPage";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const landing = (dictionary as any).landing || {};

  return (
    <DashboardPage
      locale={locale}
      dictionary={{
        hero: landing.hero || {},
        onboarding: landing.onboarding || {},
        oracle: landing.oraclePreview || {},
        energy: landing.energyCalendar || {},
      }}
    />
  );
}
