import type { Metadata } from "next";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/structured-data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidgetWrapper from "@/components/layout/ChatWidgetWrapper";

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
      default: "ASTROTECH | AI-Powered Digital Transformation",
      template: "%s | ASTROTECH",
    },
    description: dictionary.hero.subtitle,
    openGraph: {
      title: "ASTROTECH",
      description: dictionary.hero.subtitle,
      url: `https://astrotech.com.tr/${locale}`,
      siteName: "ASTROTECH",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: `https://astrotech.com.tr/${locale}`,
      languages: {
        en: "https://astrotech.com.tr/en",
        tr: "https://astrotech.com.tr/tr",
      },
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

  const organizationSchema = generateOrganizationSchema({
    name: "ASTROTECH",
    url: "https://astrotech.com.tr",
    logo: "https://astrotech.com.tr/images/logo.png",
    description: dictionary.hero.subtitle,
  });

  const localBusinessSchema = generateLocalBusinessSchema({
    name: "ASTROTECH",
    url: "https://astrotech.com.tr",
    logo: "https://astrotech.com.tr/images/logo.png",
    description: dictionary.hero.subtitle,
    address: {
      streetAddress: "",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
    telephone: "",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <Header locale={locale} dictionary={dictionary} />
      <main>{children}</main>
      <Footer locale={locale} dictionary={dictionary} />
      <ChatWidgetWrapper locale={locale} />
    </>
  );
}
