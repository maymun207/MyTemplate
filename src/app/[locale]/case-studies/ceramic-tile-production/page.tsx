import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export default async function CeramicTileProductionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-primary">
          Ceramic Tile Production
        </h1>
        <p className="text-lg text-gray-300">
          Case study content goes here.
        </p>
      </div>
    </div>
  );
}
