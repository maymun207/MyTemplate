"use client";

import { motion } from "framer-motion";

export default function OraclePreviewSection({
  dictionary,
}: {
  dictionary: Record<string, string>;
}) {
  return (
    <section className="section-padding bg-cosmic relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {dictionary.title || "Your Daily Oracle"}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">
            {dictionary.subtitle || "A glimpse of what awaits you every morning"}
          </p>
        </motion.div>

        <motion.div
          className="glass-card p-8 md:p-12 max-w-3xl mx-auto relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
                {dictionary.date_label || "Today's Oracle"}
              </div>
              <div className="text-2xl font-bold text-[var(--color-secondary)]">
                ✦ {dictionary.sample_theme || "Day of Inner Fire"}
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-secondary)]/20 to-[var(--color-primary)]/20 flex items-center justify-center text-2xl glow-gold animate-float">
              🔮
            </div>
          </div>

          {/* Scenarios */}
          <div className="space-y-4 mb-8">
            {/* Best case */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <span className="text-emerald-400 text-lg mt-0.5">▲</span>
              <div>
                <div className="text-sm font-semibold text-emerald-400 mb-1">
                  {dictionary.best_case || "Best Case"}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {dictionary.best_desc || "A surge of creative energy. Your ideas will be well-received — share them with confidence today."}
                </p>
              </div>
            </div>

            {/* Typical */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
              <span className="text-[var(--color-primary)] text-lg mt-0.5">◆</span>
              <div>
                <div className="text-sm font-semibold text-[var(--color-primary)] mb-1">
                  {dictionary.typical || "Typical"}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {dictionary.typical_desc || "Steady progress on existing projects. Focus on details after 2 PM when Mercury trines your natal Moon."}
                </p>
              </div>
            </div>

            {/* Challenge — blurred (premium) */}
            <div className="relative">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 blur-sm select-none">
                <span className="text-amber-400 text-lg mt-0.5">▼</span>
                <div>
                  <div className="text-sm font-semibold text-amber-400 mb-1">Challenge</div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Potential tension in close relationships. Avoid major decisions between 4-6 PM.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 py-2 bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)]/40 rounded-full text-[var(--color-secondary)] text-sm font-semibold">
                  🔒 {dictionary.premium_unlock || "Premium"}
                </span>
              </div>
            </div>
          </div>

          {/* Guidance */}
          <div className="p-4 rounded-xl bg-[var(--color-cosmic-surface)] border border-[var(--color-cosmic-border)]">
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
              {dictionary.guidance_label || "Today's Guidance"}
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed italic">
              &quot;{dictionary.guidance_text || "Trust the process. Your fire element is strong today — channel it into creation, not conflict. The evening brings clarity."}&quot;
            </p>
          </div>

          {/* Personalized tag */}
          <div className="mt-6 text-center">
            <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-cosmic-surface)] px-3 py-1.5 rounded-full border border-[var(--color-cosmic-border)]">
              ✦ {dictionary.personalized || "This is personalized for you"}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
