import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <div>
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {dictionary.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            {dictionary.hero.subtitle}
          </p>
          <button className="bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
            {dictionary.hero.cta}
          </button>
        </div>
      </section>
    </div>
  );
}
