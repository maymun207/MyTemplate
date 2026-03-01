"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Modal = "howItWorks" | "pricing" | "about" | null;

export default function Navbar({
  locale,
  dictionary,
}: {
  locale: string;
  dictionary: Record<string, string>;
}) {
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const otherLocale = locale === "en" ? "tr" : "en";

  const toggleModal = (modal: Modal) => {
    setActiveModal(activeModal === modal ? null : modal);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-[var(--bg-border)] transition-colors duration-1000"
        style={{ background: "var(--glass-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-xl text-[var(--color-secondary)]">✦</span>
            <span className="text-lg font-bold text-[var(--text-primary)] tracking-tight">AstroYou</span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <button onClick={() => toggleModal("howItWorks")}
              className={`text-sm font-medium transition-colors ${activeModal === "howItWorks" ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {dictionary.how_it_works || "How It Works"}
            </button>
            <button onClick={() => toggleModal("pricing")}
              className={`text-sm font-medium transition-colors ${activeModal === "pricing" ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {dictionary.pricing || "Pricing"}
            </button>
            <button onClick={() => toggleModal("about")}
              className={`text-sm font-medium transition-colors ${activeModal === "about" ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {dictionary.about || "About"}
            </button>
            <Link href={`/${otherLocale}`}
              className="px-3 py-1 rounded-full text-xs font-medium border border-[var(--bg-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary)] transition-colors">
              {locale === "en" ? "🇹🇷 TR" : "🇬🇧 EN"}
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--text-secondary)]" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen
                ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div className="md:hidden border-t border-[var(--bg-border)] px-4 py-3 space-y-2"
              style={{ background: "var(--glass-bg)" }}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              {(["howItWorks", "pricing", "about"] as Modal[]).map((m) => (
                <button key={m} onClick={() => toggleModal(m)}
                  className="block w-full text-left text-sm font-medium text-[var(--text-secondary)] py-2">
                  {m === "howItWorks" ? dictionary.how_it_works || "How It Works"
                    : m === "pricing" ? dictionary.pricing || "Pricing"
                    : dictionary.about || "About"}
                </button>
              ))}
              <Link href={`/${otherLocale}`} className="block text-sm font-medium text-[var(--text-muted)] py-2">
                {locale === "en" ? "🇹🇷 Türkçe" : "🇬🇧 English"}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Modal backdrop + content */}
      <AnimatePresence>
        {activeModal && (
          <>
            <motion.div className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)} />
            <motion.div
              className="fixed inset-x-4 top-16 md:inset-x-auto md:left-1/2 md:w-[600px] md:-translate-x-1/2 z-[71] max-h-[80vh] overflow-y-auto rounded-2xl border border-[var(--bg-border)] p-6 md:p-8"
              style={{ background: "var(--bg-primary)" }}
              initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {activeModal === "howItWorks" ? dictionary.how_it_works || "How It Works"
                    : activeModal === "pricing" ? dictionary.pricing || "Pricing"
                    : dictionary.about || "About AstroYou"}
                </h2>
                <button onClick={() => setActiveModal(null)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
              </div>

              {/* HOW IT WORKS */}
              {activeModal === "howItWorks" && (
                <div className="space-y-6">
                  {[
                    { icon: "🌍", title: dictionary.step1_title || "1. Enter Your Birth Data", desc: dictionary.step1_desc || "Date, time, and location." },
                    { icon: "🤖", title: dictionary.step2_title || "2. Three AI Agents Analyze", desc: dictionary.step2_desc || "Western, Vedic & Chinese agents process your chart." },
                    { icon: "✦", title: dictionary.step3_title || "3. Receive Your Unified Insight", desc: dictionary.step3_desc || "One synthesized daily insight with guidance." },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                        style={{ background: "var(--card-glow)" }}>{step.icon}</div>
                      <div>
                        <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">{step.title}</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center gap-3 pt-4 border-t border-[var(--bg-border)] text-sm">
                    <span style={{ color: "#FFD700" }}>☉ Western</span>
                    <span className="text-[var(--text-muted)]">+</span>
                    <span style={{ color: "#8B5CF6" }}>🕉 Vedic</span>
                    <span className="text-[var(--text-muted)]">+</span>
                    <span style={{ color: "#06B6D4" }}>🐉 Chinese</span>
                    <span className="text-[var(--text-muted)]">→</span>
                    <span className="font-bold text-[var(--color-secondary)]">✦ Insight</span>
                  </div>
                </div>
              )}

              {/* PRICING */}
              {activeModal === "pricing" && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Free */}
                    <div className="rounded-xl border border-[var(--bg-border)] p-5">
                      <h3 className="font-bold text-[var(--text-primary)] mb-1">{locale === "en" ? "Free" : "Ücretsiz"}</h3>
                      <div className="text-3xl font-bold text-[var(--text-primary)] mb-3">$0</div>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        {["Daily Harmony + Guidance", "1 Current per Day", "Daily Astro Card"].map((f) => (
                          <li key={f} className="flex items-center gap-2"><span className="text-emerald-500">✓</span>{f}</li>
                        ))}
                      </ul>
                    </div>
                    {/* Premium */}
                    <div className="rounded-xl border-2 border-[var(--color-secondary)]/40 p-5 relative" style={{ boxShadow: "0 0 20px rgba(255,215,0,0.08)" }}>
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: "linear-gradient(135deg, var(--color-secondary), var(--color-primary))", color: "#000" }}>
                        {locale === "en" ? "Most Popular" : "En Popüler"}
                      </div>
                      <h3 className="font-bold text-[var(--color-secondary)] mb-1">Premium</h3>
                      <div className="text-3xl font-bold text-[var(--text-primary)] mb-3">
                        <span style={{ color: "var(--color-secondary)" }}>$7.99</span>
                        <span className="text-sm text-[var(--text-muted)]">/{locale === "en" ? "mo" : "ay"}</span>
                      </div>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        {["All 3 Currents", "Energy Navigator", "Transit Alarms", "Daily Rituals", "Ad-Free"].map((f) => (
                          <li key={f} className="flex items-center gap-2"><span className="text-emerald-500">✓</span>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* ABOUT */}
              {activeModal === "about" && (
                <div className="space-y-5">
                  {[
                    { icon: "🔬", title: locale === "en" ? "Real Astronomical Data" : "Gerçek Astronomik Veri", desc: locale === "en" ? "Swiss Ephemeris precision — the same engine used by professional astrologers worldwide." : "Swiss Ephemeris hassasiyeti — profesyonel astrologlar tarafından kullanılan motor." },
                    { icon: "✦", title: locale === "en" ? "3 Systems, 1 Unified AI" : "3 Sistem, 1 Birleşik AI", desc: locale === "en" ? "Western, Vedic & Chinese astrology analyzed simultaneously by specialized AI agents." : "Batı, Vedik ve Çin astrolojisi eş zamanlı AI ajanları tarafından analiz edilir." },
                    { icon: "🔒", title: locale === "en" ? "Encrypted & Private" : "Şifrelenmiş ve Gizli", desc: locale === "en" ? "Your birth data is encrypted and never shared. We believe your cosmic data is sacred." : "Doğum verileriniz şifrelenir ve paylaşılmaz." },
                    { icon: "⚡", title: locale === "en" ? "Gets Smarter Over Time" : "Zamanla Daha Akıllı", desc: locale === "en" ? "The Quantum Mirror learns from your feedback, making every reading more accurate." : "Kuantum Ayna geri bildirimlerinizden öğrenir." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-0.5">{item.title}</h3>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
