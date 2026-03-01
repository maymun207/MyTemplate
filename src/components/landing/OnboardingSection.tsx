"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingData {
  birthDate: string;
  birthTime: string;
  birthTimeKnown: boolean;
  birthCity: string;
}

export default function OnboardingSection({
  dictionary,
}: {
  dictionary: Record<string, string>;
}) {
  const [data, setData] = useState<OnboardingData>({
    birthDate: "",
    birthTime: "",
    birthTimeKnown: true,
    birthCity: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const isValid = data.birthDate && data.birthCity && (data.birthTimeKnown ? data.birthTime : true);

  return (
    <section id="onboarding" className="section-padding relative" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-2xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            {dictionary.title || "Begin Your Journey"}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
            {dictionary.subtitle || "Enter your birth data to unlock your personal oracle."}
          </p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {dictionary.birth_date || "Date of Birth"} <span className="text-red-500">*</span>
            </label>
            <input type="date" required value={data.birthDate} onChange={(e) => setData({ ...data, birthDate: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
          </div>

          {/* Birth Time */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                {dictionary.birth_time || "Time of Birth"}{data.birthTimeKnown && <span className="text-red-500 ml-1">*</span>}
              </label>
              <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer">
                <input type="checkbox" checked={!data.birthTimeKnown}
                  onChange={(e) => setData({ ...data, birthTimeKnown: !e.target.checked, birthTime: "" })}
                  className="rounded border-[var(--bg-border)]" />
                {dictionary.dont_know_time || "I don't know my birth time"}
              </label>
            </div>
            <AnimatePresence>
              {data.birthTimeKnown ? (
                <motion.input type="time" required={data.birthTimeKnown} value={data.birthTime}
                  onChange={(e) => setData({ ...data, birthTime: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} />
              ) : (
                <motion.div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm text-amber-700"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  ⚠️ {dictionary.reduced_accuracy || "Reduced accuracy without exact birth time."}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Birth City */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {dictionary.birth_city || "City of Birth"} <span className="text-red-500">*</span>
            </label>
            <input type="text" required placeholder={dictionary.city_placeholder || "e.g. Istanbul, London, New York..."}
              value={data.birthCity} onChange={(e) => setData({ ...data, birthCity: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
            <p className="mt-1 text-xs text-[var(--text-muted)]">{dictionary.city_hint || "We use this for precise astronomical calculations."}</p>
          </div>

          {/* Privacy */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[var(--color-primary)]/20"
            style={{ background: "var(--card-glow)" }}>
            <span className="text-lg mt-0.5">🔒</span>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {dictionary.privacy_notice || "Your birth data is encrypted and never shared."}
            </p>
          </div>

          {/* Submit */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" className="text-center py-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <div className="text-4xl mb-2">✦</div>
                <p className="text-[var(--color-secondary)] font-semibold">{dictionary.success || "Your stars are being calculated..."}</p>
              </motion.div>
            ) : (
              <motion.button key="submit" type="submit" disabled={!isValid}
                className="w-full py-4 rounded-full font-semibold text-lg text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed glow-violet transition-transform"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                {dictionary.submit || "✦ Generate My Oracle"}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}
