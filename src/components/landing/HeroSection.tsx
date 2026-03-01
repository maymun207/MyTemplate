"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTimeTheme } from "@/components/providers/TimeThemeProvider";

export default function HeroSection({
  dictionary,
}: {
  dictionary: Record<string, string>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeTheme = useTimeTheme();

  // Starfield — only renders dots during night and sunset themes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const isStarry = timeTheme === "night" || timeTheme === "sunset";

    interface Star { x: number; y: number; size: number; opacity: number; speed: number; }
    const stars: Star[] = isStarry
      ? Array.from({ length: 120 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random(),
          speed: Math.random() * 0.5 + 0.1,
        }))
      : [];

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (isStarry) {
        stars.forEach((star) => {
          star.opacity += Math.sin(Date.now() * 0.001 * star.speed) * 0.01;
          star.opacity = Math.max(0.1, Math.min(1, star.opacity));
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle =
            timeTheme === "night"
              ? `rgba(255, 215, 0, ${star.opacity * 0.5})`
              : `rgba(255, 180, 50, ${star.opacity * 0.3})`;
          ctx.fill();
        });
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [timeTheme]);

  const timeEmoji = {
    morning: "☀️",
    afternoon: "☁️",
    sunset: "🌅",
    night: "🌙",
  }[timeTheme];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-hero pt-16">
      {/* Starfield canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Subtle glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-[100px] animate-pulse-glow opacity-30"
        style={{ background: timeTheme === "night" ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.08)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full blur-[80px] animate-pulse-glow opacity-30"
        style={{ background: timeTheme === "night" ? "rgba(6,182,212,0.12)" : "rgba(6,182,212,0.06)", animationDelay: "1.5s" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--bg-border)] text-sm text-[var(--text-secondary)] mb-8"
            style={{ background: "var(--glass-bg)" }}>
            <span className="animate-pulse-glow">{timeEmoji}</span>
            {dictionary.badge || "AI-Powered Personal Astrology"}
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-[var(--text-primary)]">
            {dictionary.title_line1 || "Three Ancient Wisdoms."}
          </span>
          <br />
          <span className="bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
            {dictionary.title_line2 || "One Personal Insight."}
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {dictionary.subtitle ||
            "AI that reads your stars across Western, Vedic & Chinese astrology — so you know exactly when to act, when to wait, and what to do."}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <a
            href="#onboarding"
            className="px-8 py-4 rounded-full text-white font-semibold text-lg hover:scale-105 transition-transform glow-violet"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
          >
            {dictionary.cta_primary || "Discover Your Insight"}
          </a>
        </motion.div>

        {/* System badges */}
        <motion.div
          className="mt-14 flex flex-wrap justify-center gap-6 text-sm text-[var(--text-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <span className="flex items-center gap-2">
            <span style={{ color: "#FFD700" }}>☉</span> Western
          </span>
          <span className="text-[var(--bg-border)]">·</span>
          <span className="flex items-center gap-2">
            <span style={{ color: "#8B5CF6" }}>🕉</span> Vedic
          </span>
          <span className="text-[var(--bg-border)]">·</span>
          <span className="flex items-center gap-2">
            <span style={{ color: "#06B6D4" }}>🐉</span> Chinese
          </span>
          <span className="text-[var(--bg-border)]">·</span>
          <span className="flex items-center gap-2">
            <span style={{ color: "#FFD700" }}>✦</span> AI-Synthesized
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs">{dictionary.scroll || "Scroll"}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>
    </section>
  );
}
