"use client";

import { motion } from "framer-motion";

const badges = [
  { icon: "🔬", color: "#06B6D4" },
  { icon: "✦", color: "#FFD700" },
  { icon: "🔒", color: "#8B5CF6" },
  { icon: "⚡", color: "#22C55E" },
];

export default function TrustSection({ dictionary }: { dictionary: Record<string, string> }) {
  const labels = [
    dictionary.badge_data || "Real Astronomical Data",
    dictionary.badge_systems || "3 Systems, 1 Unified AI",
    dictionary.badge_privacy || "Encrypted & Private",
    dictionary.badge_learning || "Gets Smarter Over Time",
  ];
  const descriptions = [
    dictionary.badge_data_desc || "Swiss Ephemeris precision.",
    dictionary.badge_systems_desc || "Western, Vedic & Chinese analyzed simultaneously.",
    dictionary.badge_privacy_desc || "Your birth data is encrypted and never shared.",
    dictionary.badge_learning_desc || "Quantum Mirror learns from your feedback.",
  ];

  return (
    <section className="section-padding relative" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">{dictionary.title || "Built for Trust"}</h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">{dictionary.subtitle || "Not another horoscope app."}</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {badges.map((badge, i) => (
            <motion.div key={i} className="glass-card p-6 flex items-start gap-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${badge.color}12`, boxShadow: `0 0 15px ${badge.color}15` }}>{badge.icon}</div>
              <div>
                <h3 className="font-semibold mb-1 text-[var(--text-primary)]">{labels[i]}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{descriptions[i]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
