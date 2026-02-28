import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-primary">
          {dictionary.caseStudies.title}
        </h1>
        <p className="text-lg text-gray-300 mb-12">
          {dictionary.caseStudies.subtitle}
        </p>
        {/* Case study cards go here */}
      </div>
    </div>
  );
}
