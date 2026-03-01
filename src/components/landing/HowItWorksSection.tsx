"use client";

import { motion } from "framer-motion";

const steps = [
  {
    icon: "🌍",
    color: "var(--color-secondary)",
    glowClass: "glow-gold",
  },
  {
    icon: "🤖",
    color: "var(--color-primary)",
    glowClass: "glow-violet",
  },
  {
    icon: "✦",
    color: "var(--color-accent)",
    glowClass: "glow-cyan",
  },
];

const agents = [
  { symbol: "☉", label: "Western", color: "#FFD700" },
  { symbol: "🕉", label: "Vedic", color: "#8B5CF6" },
  { symbol: "🐉", label: "Chinese", color: "#06B6D4" },
];

export default function HowItWorksSection({
  dictionary,
}: {
  dictionary: Record<string, string>;
}) {
  const stepTitles = [
    dictionary.step1_title || "Enter Your Birth Data",
    dictionary.step2_title || "3 AI Agents Analyze",
    dictionary.step3_title || "Receive Your Unified Signal",
  ];

  const stepDescriptions = [
    dictionary.step1_desc || "Date, time, and location of birth. That's all we need.",
    dictionary.step2_desc || "Western, Vedic & Chinese agents process your chart simultaneously.",
    dictionary.step3_desc || "One synthesized daily oracle with actionable guidance.",
  ];

  return (
    <section id="how-it-works" className="section-padding bg-cosmic relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--color-text-primary)]">
            {dictionary.title || "How It Works"}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">
            {dictionary.subtitle || "Three steps to your personal oracle"}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="glass-card p-8 text-center relative group hover:border-[var(--color-primary)] transition-colors"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-4">
                {dictionary.step_label || "Step"} {i + 1}
              </div>
              <div
                className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl ${step.glowClass}`}
                style={{ background: `${step.color}15` }}
              >
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">{stepTitles[i]}</h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{stepDescriptions[i]}</p>
            </motion.div>
          ))}
        </div>

        {/* Agent cards */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {agents.map((agent, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${agent.color}15`, boxShadow: `0 0 20px ${agent.color}30` }}
              >
                {agent.symbol}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: agent.color }}>
                  {agent.label}
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {dictionary[`agent_${agent.label.toLowerCase()}`] || "Agent"}
                </div>
              </div>
              {i < agents.length - 1 && (
                <span className="hidden md:block text-[var(--color-cosmic-border)] ml-4 text-xl">→</span>
              )}
            </div>
          ))}
          <span className="hidden md:block text-[var(--color-cosmic-border)] ml-2 text-xl">→</span>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-[var(--color-secondary)]/20 to-[var(--color-primary)]/20 glow-gold">
              ✦
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--color-secondary)]">
                {dictionary.synthesis || "Synthesis"}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {dictionary.unified || "Unified Oracle"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
