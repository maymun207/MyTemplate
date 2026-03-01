"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const energyZones = [
  { id: "career", label: "Career", color: "#FFD700", intensity: 0.85, angle: 0 },
  { id: "love", label: "Love", color: "#EC4899", intensity: 0.6, angle: 60 },
  { id: "health", label: "Health", color: "#22C55E", intensity: 0.75, angle: 120 },
  { id: "finance", label: "Finance", color: "#06B6D4", intensity: 0.5, angle: 180 },
  { id: "creativity", label: "Creativity", color: "#8B5CF6", intensity: 0.9, angle: 240 },
  { id: "spiritual", label: "Spiritual", color: "#F97316", intensity: 0.7, angle: 300 },
];

function createPieSlicePath(startAngle: number, endAngle: number, radius: number) {
  const start = {
    x: 150 + radius * Math.cos((Math.PI / 180) * (startAngle - 90)),
    y: 150 + radius * Math.sin((Math.PI / 180) * (startAngle - 90)),
  };
  const end = {
    x: 150 + radius * Math.cos((Math.PI / 180) * (endAngle - 90)),
    y: 150 + radius * Math.sin((Math.PI / 180) * (endAngle - 90)),
  };
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M 150 150 L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export default function EnergyCalendarSection({
  dictionary,
}: {
  dictionary: Record<string, string>;
}) {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const sliceAngle = 360 / energyZones.length;

  const activeData = energyZones.find((z) => z.id === activeZone);

  const explanations: Record<string, string> = {
    career: dictionary.career_exp || "Mars trines your 10th house — a power window for career moves opens between 10 AM and 1 PM.",
    love: dictionary.love_exp || "Venus squares Neptune — romantic energy is dreamy but unreliable today. Wait for clarity.",
    health: dictionary.health_exp || "Your Wood element is strong — physical energy peaks in the morning. Ideal for exercise.",
    finance: dictionary.finance_exp || "Saturn's influence asks for caution. Avoid large purchases until the weekend.",
    creativity: dictionary.creativity_exp || "Mercury conjunct your natal Uranus — expect flashes of brilliance. Capture every idea.",
    spiritual: dictionary.spiritual_exp || "Moon enters your Nakshatra — a deeply contemplative day. Perfect for meditation.",
  };

  return (
    <section className="section-padding bg-cosmic relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {dictionary.title || "Energy Navigator"}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">
            {dictionary.subtitle || "See your energy flows. Plan your life accordingly."}
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Pie Chart */}
          <motion.div
            className="relative w-[300px] h-[300px] flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {energyZones.map((zone, i) => {
                const startAngle = i * sliceAngle;
                const endAngle = startAngle + sliceAngle;
                const radius = 60 + zone.intensity * 80;
                const isActive = activeZone === zone.id;
                return (
                  <path
                    key={zone.id}
                    d={createPieSlicePath(startAngle, endAngle, radius)}
                    fill={zone.color}
                    fillOpacity={isActive ? 0.5 : 0.2}
                    stroke={zone.color}
                    strokeWidth={isActive ? 2 : 0.5}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      filter: isActive ? `drop-shadow(0 0 12px ${zone.color}80)` : "none",
                    }}
                    onMouseEnter={() => setActiveZone(zone.id)}
                    onMouseLeave={() => setActiveZone(null)}
                    onClick={() => setActiveZone(isActive ? null : zone.id)}
                  />
                );
              })}
              {/* Center circle */}
              <circle cx="150" cy="150" r="35" fill="var(--color-cosmic-deep)" stroke="var(--color-cosmic-border)" strokeWidth="1" />
              <text x="150" y="147" textAnchor="middle" fill="var(--color-secondary)" fontSize="18" fontFamily="serif">
                ✦
              </text>
              <text x="150" y="162" textAnchor="middle" fill="var(--color-text-muted)" fontSize="7" fontFamily="sans-serif">
                {dictionary.energy || "ENERGY"}
              </text>

              {/* Labels */}
              {energyZones.map((zone, i) => {
                const midAngle = (i * sliceAngle + sliceAngle / 2 - 90) * (Math.PI / 180);
                const labelRadius = 135;
                return (
                  <text
                    key={`label-${zone.id}`}
                    x={150 + labelRadius * Math.cos(midAngle)}
                    y={150 + labelRadius * Math.sin(midAngle)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={activeZone === zone.id ? zone.color : "var(--color-text-muted)"}
                    fontSize="9"
                    fontFamily="sans-serif"
                    fontWeight={activeZone === zone.id ? "bold" : "normal"}
                    className="pointer-events-none transition-colors"
                  >
                    {dictionary[`zone_${zone.id}`] || zone.label}
                  </text>
                );
              })}
            </svg>
          </motion.div>

          {/* Explanation panel */}
          <div className="flex-1 min-h-[200px]">
            <AnimatePresence mode="wait">
              {activeData ? (
                <motion.div
                  key={activeData.id}
                  className="glass-card p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${activeData.color}20`, boxShadow: `0 0 15px ${activeData.color}30` }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ background: activeData.color }} />
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: activeData.color }}>
                        {dictionary[`zone_${activeData.id}`] || activeData.label}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)]">
                        {dictionary.intensity || "Intensity"}: {Math.round(activeData.intensity * 100)}%
                      </div>
                    </div>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    {explanations[activeData.id]}
                  </p>
                  <div className="mt-4 text-xs text-[var(--color-text-muted)]">
                    ✦ {dictionary.source || "Synthesized from Western, Vedic & Chinese analysis"}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="glass-card p-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-4xl mb-4">👆</div>
                  <p className="text-[var(--color-text-muted)]">
                    {dictionary.hover_hint || "Hover over a zone to see your energy analysis"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
