"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const plans = [
  {
    id: "free",
    popular: false,
    features: [
      { key: "daily_theme", included: true },
      { key: "one_scenario", included: true },
      { key: "astro_card", included: true },
      { key: "all_scenarios", included: false },
      { key: "energy_navigator", included: false },
      { key: "transit_alarms", included: false },
      { key: "quantum_mirror", included: false },
      { key: "daily_rituals", included: false },
      { key: "ad_free", included: false },
    ],
  },
  {
    id: "premium",
    popular: true,
    features: [
      { key: "daily_theme", included: true },
      { key: "all_scenarios", included: true },
      { key: "astro_card_hd", included: true },
      { key: "energy_navigator", included: true },
      { key: "transit_alarms", included: true },
      { key: "quantum_mirror", included: true },
      { key: "daily_rituals", included: true },
      { key: "relational_intel", included: true },
      { key: "ad_free", included: true },
    ],
  },
];

export default function PricingSection({ dictionary }: { dictionary: Record<string, string> }) {
  const [annual, setAnnual] = useState(true);

  const featureLabels: Record<string, string> = {
    daily_theme: dictionary.f_daily_theme || "Daily Harmony + Guidance",
    one_scenario: dictionary.f_one_scenario || "1 Current per Day",
    astro_card: dictionary.f_astro_card || "Daily Astro Card",
    all_scenarios: dictionary.f_all_scenarios || "All 3 Currents",
    astro_card_hd: dictionary.f_astro_card_hd || "HD Astro Card",
    energy_navigator: dictionary.f_energy_nav || "Energy Navigator",
    transit_alarms: dictionary.f_transit_alarms || "Transit Alarms",
    quantum_mirror: dictionary.f_quantum_mirror || "Quantum Mirror",
    daily_rituals: dictionary.f_daily_rituals || "Daily Rituals",
    relational_intel: dictionary.f_relational || "Relational Intelligence",
    ad_free: dictionary.f_ad_free || "Ad-Free",
  };

  return (
    <section id="pricing" className="section-padding relative" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">{dictionary.title || "Choose Your Path"}</h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto mb-8">{dictionary.subtitle || "Start free, upgrade when you're ready"}</p>

          <div className="inline-flex items-center gap-1 rounded-full p-1 border border-[var(--bg-border)]" style={{ background: "var(--bg-surface)" }}>
            <button onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!annual ? "bg-[var(--color-primary)] text-white shadow-sm" : "text-[var(--text-muted)]"}`}>
              {dictionary.monthly || "Monthly"}
            </button>
            <button onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${annual ? "bg-[var(--color-primary)] text-white shadow-sm" : "text-[var(--text-muted)]"}`}>
              {dictionary.annual || "Annual"} <span className="ml-1 text-xs text-emerald-500">-33%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={plan.id} className={`glass-card p-8 relative ${plan.popular ? "border-[var(--color-secondary)]/40" : ""}`}
              style={plan.popular ? { boxShadow: "0 0 30px rgba(255,215,0,0.1)" } : {}}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}>

              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, var(--color-secondary), var(--color-primary))", color: "#000" }}>
                  {dictionary.popular || "Most Popular"}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: plan.popular ? "var(--color-secondary)" : "var(--text-primary)" }}>
                  {dictionary[`plan_${plan.id}`] || (plan.id === "free" ? "Free" : "Premium")}
                </h3>
                <div className="text-4xl font-bold mb-1 text-[var(--text-primary)]">
                  {plan.id === "free" ? (dictionary.free_price || "$0") :
                    <><span style={{ color: "var(--color-secondary)" }}>{annual ? (dictionary.annual_price || "$7.99") : (dictionary.monthly_price || "$11.99")}</span><span className="text-lg text-[var(--text-muted)]">/{dictionary.month || "mo"}</span></>}
                </div>
                {plan.id === "premium" && annual && <div className="text-xs text-emerald-500">{dictionary.annual_save || "Save $48/year"}</div>}
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <div key={f.key} className="flex items-center gap-3 text-sm">
                    {f.included ? <span className="text-emerald-500">✓</span> : <span className="text-[var(--text-muted)]">—</span>}
                    <span className={f.included ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"}>{featureLabels[f.key]}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-full font-semibold text-sm transition-all ${plan.popular
                ? "text-black hover:scale-105" : "border border-[var(--bg-border)] text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--text-primary)]"}`}
                style={plan.popular ? { background: "linear-gradient(135deg, var(--color-secondary), var(--color-primary))" } : {}}>
                {plan.id === "free" ? dictionary.cta_free || "Start Free" : dictionary.cta_premium || "Go Premium"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
