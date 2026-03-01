import type { Metadata } from "next";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Navbar from "@/components/layout/Navbar";
import AgentPanel from "@/components/ui/AgentPanel";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);

  return {
    title: {
      default: "AstroYou | Personal Insight & Energy System",
      template: "%s | AstroYou",
    },
    description: dictionary.hero.subtitle,
    openGraph: {
      title: "AstroYou",
      description: dictionary.hero.subtitle,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      type: "website",
    },
    alternates: {
      languages: { en: "/en", tr: "/tr" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const landing = (dictionary as any).landing || {};

  return (
    <>
      <Navbar
        locale={locale}
        dictionary={{
          how_it_works: landing.footer?.how_it_works || "How It Works",
          pricing: landing.footer?.pricing || "Pricing",
          about: locale === "en" ? "About" : "Hakkında",
          hiw_title: landing.howItWorks?.title || "How It Works",
          step1_title: `1. ${landing.howItWorks?.step1_title || "Enter Your Birth Data"}`,
          step1_desc: landing.howItWorks?.step1_desc || "Date, time, and location of birth.",
          step2_title: `2. ${landing.howItWorks?.step2_title || "3 AI Agents Analyze"}`,
          step2_desc: landing.howItWorks?.step2_desc || "Western, Vedic & Chinese agents process your chart.",
          step3_title: `3. ${landing.howItWorks?.step3_title || "Receive Your Unified Signal"}`,
          step3_desc: landing.howItWorks?.step3_desc || "One synthesized daily oracle with actionable guidance.",
        }}
      />
      <div className="page-content">{children}</div>
      <AgentPanel locale={locale} />
    </>
  );
}
