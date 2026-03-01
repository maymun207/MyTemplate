"use client";

import { motion } from "framer-motion";

const ritualSystems = [
  { symbol: "☉", name: "Western", color: "#FFD700", glow: "glow-gold" },
  { symbol: "🕉", name: "Vedic", color: "#8B5CF6", glow: "glow-violet" },
  { symbol: "🐉", name: "Chinese", color: "#06B6D4", glow: "glow-cyan" },
];

export default function RitualsSection({
  dictionary,
}: {
  dictionary: Record<string, string>;
}) {
  return (
    <section className="section-padding bg-cosmic relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {dictionary.title || "Ritual Architect"}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">
            {dictionary.subtitle || "2-minute personalized rituals to ground your daily energy"}
          </p>
        </motion.div>

        {/* 3 systems → 1 flame visual */}
        <div className="flex flex-col items-center">
          {/* System cards */}
          <div className="grid md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
            {ritualSystems.map((system, i) => (
              <motion.div
                key={system.name}
                className={`glass-card p-6 text-center ${system.glow}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="text-3xl mb-3">{system.symbol}</div>
                <div className="font-semibold mb-2" style={{ color: system.color }}>
                  {dictionary[`system_${system.name.toLowerCase()}`] || system.name}
                </div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {dictionary[`ritual_${system.name.toLowerCase()}`] ||
                    `${system.name} wisdom informs your ritual`}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Convergence lines */}
          <motion.div
            className="flex justify-center gap-0 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <svg width="200" height="60" viewBox="0 0 200 60" className="text-[var(--color-cosmic-border)]">
              <line x1="30" y1="0" x2="100" y2="55" stroke="#FFD700" strokeWidth="0.8" opacity="0.4" />
              <line x1="100" y1="0" x2="100" y2="55" stroke="#8B5CF6" strokeWidth="0.8" opacity="0.4" />
              <line x1="170" y1="0" x2="100" y2="55" stroke="#06B6D4" strokeWidth="0.8" opacity="0.4" />
            </svg>
          </motion.div>

          {/* Unified ritual card */}
          <motion.div
            className="glass-card p-8 max-w-md w-full text-center border-[var(--color-secondary)]/30"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-4xl mb-3 animate-pulse-glow">🔥</div>
            <div className="text-lg font-bold text-[var(--color-secondary)] mb-2">
              {dictionary.unified_ritual || "Your Morning Ritual"}
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
              {dictionary.ritual_example ||
                '"Stand facing east. Take 3 deep breaths, feeling the Metal element ground you. Organize one small space on your desk — this channels today\'s scattered Fire energy into focus."'}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
              <span>⏱ 2 {dictionary.minutes || "minutes"}</span>
              <span>·</span>
              <span>✦ {dictionary.synthesized || "Synthesized"}</span>
            </div>
          </motion.div>

          {/* Premium upsell */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            <span className="px-4 py-2 rounded-full text-sm border border-[var(--color-secondary)]/30 text-[var(--color-text-muted)]">
              {dictionary.free_limit || "Free: 1 ritual/week"} · <span className="text-[var(--color-secondary)]">{dictionary.premium_daily || "Premium: Daily rituals"}</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
