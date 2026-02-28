"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/types";

interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary;
}

export default function Header({ locale, dictionary }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: dictionary.nav.home, href: `/${locale}` },
    { label: dictionary.nav.about, href: `/${locale}/about` },
    { label: dictionary.nav.caseStudies, href: `/${locale}/case-studies` },
    { label: dictionary.nav.careers, href: `/${locale}/careers` },
    { label: dictionary.nav.contact, href: `#contact` },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="text-2xl font-bold font-heading text-primary">
            ASTROTECH
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-accent transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            {/* Language Switcher */}
            <Link
              href={locale === "en" ? "/tr" : "/en"}
              className="text-xs bg-primary/20 hover:bg-primary/40 px-3 py-1 rounded-full text-primary transition-colors"
            >
              {locale === "en" ? "TR" : "EN"}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-300 hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
