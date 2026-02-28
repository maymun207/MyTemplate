import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/types";

interface FooterProps {
  locale: Locale;
  dictionary: Dictionary;
}

export default function Footer({ locale, dictionary }: FooterProps) {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="text-2xl font-bold font-heading text-primary">
              ASTROTECH
            </Link>
            <p className="mt-2 text-sm text-gray-400">
              AI-Powered Digital Transformation
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/about`} className="text-sm text-gray-400 hover:text-accent transition-colors">
                  {dictionary.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/case-studies`} className="text-sm text-gray-400 hover:text-accent transition-colors">
                  {dictionary.nav.caseStudies}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/careers`} className="text-sm text-gray-400 hover:text-accent transition-colors">
                  {dictionary.nav.careers}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">{dictionary.nav.contact}</h3>
            <p className="text-sm text-gray-400">Istanbul, Turkey</p>
            <p className="text-sm text-gray-400">contact@astrotech.com.tr</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-gray-500">{dictionary.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
