"use client";

import Link from "next/link";

export default function LandingFooter({ locale, dictionary }: { locale: string; dictionary: Record<string, string> }) {
  return (
    <footer className="py-12 px-6 border-t border-[var(--bg-border)]" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl text-[var(--color-secondary)]">✦</span>
              <span className="font-bold text-lg text-[var(--text-primary)]">AstroYou</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{dictionary.tagline || "Three ancient wisdoms. One personal oracle."}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-[var(--text-secondary)]">{dictionary.product || "Product"}</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">{dictionary.how_it_works || "How It Works"}</a></li>
              <li><a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">{dictionary.pricing || "Pricing"}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-[var(--text-secondary)]">{dictionary.legal || "Legal"}</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">{dictionary.privacy || "Privacy Policy"}</a></li>
              <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors">{dictionary.terms || "Terms of Service"}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-[var(--text-secondary)]">{dictionary.language || "Language"}</h4>
            <div className="flex gap-2 mb-4">
              <Link href="/tr" className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${locale === "tr" ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white" : "border-[var(--bg-border)] text-[var(--text-muted)]"}`}>🇹🇷 Türkçe</Link>
              <Link href="/en" className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${locale === "en" ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white" : "border-[var(--bg-border)] text-[var(--text-muted)]"}`}>🇬🇧 English</Link>
            </div>
            <h4 className="font-semibold text-sm mb-2 text-[var(--text-secondary)]">{dictionary.newsletter || "Newsletter"}</h4>
            <form className="flex gap-2">
              <input type="email" placeholder={dictionary.email_placeholder || "your@email.com"}
                className="flex-1 px-3 py-2 bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)]" />
              <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--color-primary)" }}>→</button>
            </form>
          </div>
        </div>
        <div className="border-t border-[var(--bg-border)] pt-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">© 2026 AstroYou. {dictionary.rights || "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
}
