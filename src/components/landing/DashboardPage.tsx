"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTimeTheme, type TimeTheme } from "@/components/providers/TimeThemeProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import Image from "next/image";

/* ─── Time-aware greeting ─── */
function getGreeting(theme: TimeTheme, locale: string): { emoji: string; text: string } {
  const greetings: Record<TimeTheme, { emoji: string; en: string; tr: string }> = {
    morning: { emoji: "☀️", en: "Good Morning", tr: "Günaydın" },
    afternoon: { emoji: "☁️", en: "Good Afternoon", tr: "İyi Günler" },
    sunset: { emoji: "🌅", en: "Good Evening", tr: "İyi Akşamlar" },
    night: { emoji: "🌙", en: "Good Night", tr: "İyi Geceler" },
  };
  const g = greetings[theme];
  return { emoji: g.emoji, text: locale === "tr" ? g.tr : g.en };
}

function getMoonPhase(): string {
  const phases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
  const day = new Date().getDate();
  return phases[day % 8];
}

/* ─── Sample insight data ─── */
const sampleInsight = {
  en: {
    theme: "Flow & Structure",
    text: "The Fire element surges through your chart today. Mars trines your 10th house, opening a power window for career moves between 10 AM and 1 PM. Mercury conjunct natal Uranus brings flashes of brilliance — capture every idea. The evening brings clarity as Moon enters your Nakshatra, creating a deeply contemplative atmosphere perfect for meditation.",
    guidance: "Trust the process. Channel fire energy into creation, not conflict.",
    harmony: "A surge of creative energy. Share your ideas with confidence.",
    alignment: "Steady progress on existing projects. Focus on details after 2 PM.",
    suggestedWindow: { start: "14:15", end: "14:45", label: "High Focus" },
    microRitual: "Briefly organize your physical space to align with today's 'Metal' influence.",
  },
  tr: {
    theme: "Akış & Yapı",
    text: "Ateş elementi bugün haritanızda yükseliyor. Mars 10. evinizi trigon yaparak, kariyer hamleleri için sabah 10 ile öğle 1 arasında bir güç penceresi açıyor. Merkür natal Uranüs'le kavuşum yaparak parlak fikirler getiriyor. Akşam, Ay Nakşatranıza girerek meditasyon için mükemmel bir atmosfer yaratıyor.",
    guidance: "Sürece güvenin. Ateş enerjisini çatışmaya değil, yaratıma yönlendirin.",
    harmony: "Yaratıcı enerji patlaması. Fikirlerinizi güvenle paylaşın.",
    alignment: "Mevcut projelerde istikrarlı ilerleme. Öğleden sonra detaylara odaklanın.",
    suggestedWindow: { start: "14:15", end: "14:45", label: "Yüksek Odak" },
    microRitual: "Bugünün 'Metal' etkisiyle uyum sağlamak için fiziksel alanınızı kısa bir süreliğine düzenleyin.",
  },
};

/* ─── Energy zones data ─── */
const energyZones = [
  { key: "career", color: "#FFD700", intensity: 85 },
  { key: "love", color: "#EC4899", intensity: 45 },
  { key: "health", color: "#22C55E", intensity: 72 },
  { key: "finance", color: "#06B6D4", intensity: 38 },
  { key: "creativity", color: "#8B5CF6", intensity: 90 },
  { key: "spiritual", color: "#A855F7", intensity: 65 },
];

export default function DashboardPage({
  locale,
  dictionary,
}: {
  locale: string;
  dictionary: Record<string, Record<string, string>>;
}) {
  const timeTheme = useTimeTheme();
  const { user, login, logout, saveBirthData } = useAuth();
  const greeting = getGreeting(timeTheme, locale);
  const insight = locale === "tr" ? sampleInsight.tr : sampleInsight.en;
  const d = dictionary;

  const [energyExpanded, setEnergyExpanded] = useState(false);
  const [birthData, setBirthData] = useState({ date: "", time: "", timeKnown: true, city: "" });
  const [showInsight, setShowInsight] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("insight");
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const [nasaPhoto, setNasaPhoto] = useState<{ url: string; title: string; copyright: string } | null>(null);

  // Fetch NASA Astronomy Picture of the Day
  useEffect(() => {
    fetch("/api/nasa-apod")
      .then((r) => r.json())
      .then((data) => {
        if (data.url) setNasaPhoto(data);
      })
      .catch(() => {});
  }, []);

  // Auto-show insight if logged-in user has saved birth data
  useEffect(() => {
    if (user?.birthData) {
      setBirthData({
        date: user.birthData.date,
        time: user.birthData.time,
        timeKnown: !!user.birthData.time,
        city: user.birthData.city,
      });
      setShowInsight(true);
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const err = await login(loginUsername, loginPassword);
    setLoginLoading(false);
    if (err) {
      setLoginError(locale === "en" ? "Invalid username or password" : "Geçersiz kullanıcı adı veya şifre");
    } else {
      setLoginUsername("");
      setLoginPassword("");
    }
  };

  const isValid = birthData.date && birthData.city && (birthData.timeKnown ? birthData.time : true);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowInsight(true);
    // Save birth data if logged in
    if (user) {
      saveBirthData({ date: birthData.date, time: birthData.time, city: birthData.city });
    }
  };

  const zoneLabels: Record<string, string> = {
    career: d.energy?.zone_career || "Career",
    love: d.energy?.zone_love || "Love",
    health: d.energy?.zone_health || "Health",
    finance: d.energy?.zone_finance || "Finance",
    creativity: d.energy?.zone_creativity || "Creativity",
    spiritual: d.energy?.zone_spiritual || "Spiritual",
  };

  const today = new Date().toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
    month: "long", day: "numeric", year: "numeric",
  }).toUpperCase();

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Greeting */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            <span className="mr-2">{greeting.emoji}</span>
            {greeting.text}{user ? `, ${user.displayName}` : ""}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {d.hero?.badge || "AI-Powered Personal Astrology"}
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-5 gap-8">

          {/* ═══════ LEFT COLUMN (2/5) ═══════ */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {!showInsight ? (
                /* ── PRE-SUBMISSION: Birth Form ── */
                <motion.form
                  key="birth-form"
                  onSubmit={handleGenerate}
                  className="glass-card p-6 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    {d.onboarding?.title || "Begin Your Journey"}
                  </h2>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                      {d.onboarding?.birth_date || "Date of Birth"} <span className="text-red-500">*</span>
                    </label>
                    <input type="date" required value={birthData.date}
                      onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
                  </div>

                  {/* Time */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-[var(--text-secondary)]">
                        {d.onboarding?.birth_time || "Time of Birth"}{birthData.timeKnown && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      <label className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] cursor-pointer">
                        <input type="checkbox" checked={!birthData.timeKnown}
                          onChange={(e) => setBirthData({ ...birthData, timeKnown: !e.target.checked, time: "" })}
                          className="rounded border-[var(--bg-border)] w-3 h-3" />
                        {d.onboarding?.dont_know_time || "I don't know"}
                      </label>
                    </div>
                    <AnimatePresence>
                      {birthData.timeKnown ? (
                        <motion.input type="time" required={birthData.timeKnown} value={birthData.time}
                          onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
                          className="w-full px-3 py-2.5 text-sm bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} />
                      ) : (
                        <motion.p className="text-[10px] text-amber-600 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          ⚠️ {d.onboarding?.reduced_accuracy || "Reduced accuracy without exact time."}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                      {d.onboarding?.birth_city || "City of Birth"} <span className="text-red-500">*</span>
                    </label>
                    <input type="text" required placeholder={d.onboarding?.city_placeholder || "e.g. Istanbul"}
                      value={birthData.city} onChange={(e) => setBirthData({ ...birthData, city: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
                  </div>

                  {/* Privacy */}
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                    <span>🔒</span>
                    {d.onboarding?.privacy_notice || "Your data is encrypted and never shared."}
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={!isValid}
                    className="w-full py-3 rounded-full font-semibold text-sm text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-transform"
                    style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                    {d.onboarding?.submit || "✦ Generate My Insight"}
                  </button>
                </motion.form>
              ) : (
                /* ── POST-SUBMISSION: Tabbed Horoscope Views ── */
                <motion.div
                  key="insight-tabs"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-0"
                >
                  {/* Section Label */}
                  <p className="text-[10px] font-semibold tracking-widest text-[var(--text-muted)] mb-2 px-1">
                    {locale === "en" ? "📅 TODAY'S READINGS" : "📅 BUGÜNÜN OKUMALARI"}
                  </p>

                  {/* Tab Navigation */}
                  <div className="flex gap-1 p-1 rounded-t-xl" style={{ background: "var(--bg-surface)" }}>
                    {([
                      { id: "insight", label: locale === "en" ? "✦ Insight" : "✦ İçgörü" },
                      { id: "western", label: locale === "en" ? "☉ Western" : "☉ Batı" },
                      { id: "vedic", label: locale === "en" ? "🕉 Vedic" : "🕉 Vedik" },
                      { id: "chinese", label: locale === "en" ? "🐉 Chinese" : "🐉 Çin" },
                    ] as { id: string; label: string }[]).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 px-1 text-[11px] font-semibold rounded-lg transition-all ${
                          activeTab === tab.id
                            ? "bg-white text-[var(--color-primary)] shadow-sm"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === "insight" && (
                      <motion.div key="tab-insight" className="glass-card p-6 space-y-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[var(--color-secondary)]">✦</span>
                              <h3 className="font-bold text-[var(--text-primary)]">{d.oracle?.title || (locale === "en" ? "Today's Insight" : "Bugünün İçgörüsü")}</h3>
                            </div>
                            <p className="text-sm text-[var(--color-primary)] font-medium">{insight.theme}</p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-1 italic">
                              {locale === "en" ? "✦ Synthesized from Western, Vedic & Chinese astrology analysis" : "✦ Batı, Vedik ve Çin astrolojisi analizinden sentezlenmiştir"}
                            </p>
                          </div>
                          <button onClick={() => setShowInsight(false)} className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-lg border border-[var(--bg-border)] transition-colors">
                            {locale === "en" ? "✎ Edit" : "✎ Düzenle"}
                          </button>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{insight.text}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="px-3 py-3 rounded-xl border border-emerald-200" style={{ background: "rgba(34,197,94,0.05)" }}>
                            <p className="text-[10px] font-semibold text-emerald-600 mb-1">{d.oracle?.best_case || "Harmony"} ✦</p>
                            <p className="text-xs text-[var(--text-secondary)]">{insight.harmony}</p>
                          </div>
                          <div className="px-3 py-3 rounded-xl border border-blue-200" style={{ background: "rgba(59,130,246,0.05)" }}>
                            <p className="text-[10px] font-semibold text-blue-600 mb-1">{d.oracle?.typical || "Alignment"} ○</p>
                            <p className="text-xs text-[var(--text-secondary)]">{insight.alignment}</p>
                          </div>
                        </div>
                        <div className="px-3 py-3 rounded-xl border border-[var(--bg-border)]" style={{ background: "var(--card-glow)" }}>
                          <p className="text-[10px] font-semibold text-[var(--color-primary)] mb-1">{d.oracle?.guidance_label || "Guidance"} 🧭</p>
                          <p className="text-xs text-[var(--text-secondary)] italic">{insight.guidance}</p>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "western" && (
                      <motion.div key="tab-western" className="glass-card p-6 space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">☉</span>
                          <h3 className="font-bold text-[var(--text-primary)]">{locale === "en" ? "Western Horoscope" : "Batı Burç Haritası"}</h3>
                        </div>
                        <div className="space-y-2">
                          {[
                            { icon: "☉", label: locale === "en" ? "Sun" : "Güneş", sign: "Virgo ♍", degree: "29°22'", house: "10th" },
                            { icon: "☽", label: locale === "en" ? "Moon" : "Ay", sign: "Sagittarius ♐", degree: "14°08'", house: "1st" },
                            { icon: "↑", label: locale === "en" ? "Ascendant" : "Yükselen", sign: "Sagittarius ♐", degree: "8°15'", house: "1st" },
                            { icon: "♀", label: "Venus", sign: "Leo ♌", degree: "22°41'", house: "8th" },
                            { icon: "♂", label: "Mars", sign: "Gemini ♊", degree: "5°30'", house: "7th" },
                            { icon: "♃", label: "Jupiter", sign: "Aquarius ♒", degree: "18°12'", house: "3rd" },
                          ].map((p) => (
                            <div key={p.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "var(--bg-surface)" }}>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{p.icon}</span>
                                <span className="text-xs font-medium text-[var(--text-primary)]">{p.label}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-[var(--color-primary)] font-medium">{p.sign}</span>
                                <span className="text-[10px] text-[var(--text-muted)] ml-2">{p.degree} · H{p.house}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="px-3 py-3 rounded-xl border border-[var(--bg-border)]" style={{ background: "var(--card-glow)" }}>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {locale === "en" ? "With Sun in Virgo in the 10th house, your career identity is built on precision and service. Moon in Sagittarius rising gives you an adventurous emotional nature and an optimistic public presence." : "10. evde Başak burcundaki Güneş ile kariyer kimliğiniz titizlik ve hizmet üzerine kuruludur. Yay burcunda yükselen Ay, maceracı bir duygusal doğa ve iyimser bir kamusal imaj verir."}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "vedic" && (
                      <motion.div key="tab-vedic" className="glass-card p-6 space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🕉</span>
                          <h3 className="font-bold text-[var(--text-primary)]">{locale === "en" ? "Vedic Horoscope" : "Vedik Burç Haritası"}</h3>
                        </div>
                        <div className="space-y-2">
                          {[
                            { label: locale === "en" ? "Lagna (Ascendant)" : "Lagna (Yükselen)", value: "Dhanu (Sagittarius)", extra: "Mula" },
                            { label: locale === "en" ? "Moon Sign (Rashi)" : "Ay Burcu (Rashi)", value: "Dhanu", extra: "Purva Ashadha" },
                            { label: "Nakshatra", value: "Purva Ashadha ⭐", extra: locale === "en" ? "Venus ruled" : "Venüs yönetimli" },
                            { label: locale === "en" ? "Dasha Period" : "Dasha Dönemi", value: "Venus Mahadasha", extra: "2022–2042" },
                            { label: locale === "en" ? "Sun (Surya)" : "Güneş (Surya)", value: "Simha (Leo)", extra: "Uttara Phalguni" },
                            { label: "Yoga", value: "Budhaditya Yoga", extra: locale === "en" ? "Intelligence" : "Zekâ" },
                          ].map((p) => (
                            <div key={p.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "var(--bg-surface)" }}>
                              <span className="text-xs font-medium text-[var(--text-primary)]">{p.label}</span>
                              <div className="text-right">
                                <span className="text-xs text-[var(--color-primary)] font-medium">{p.value}</span>
                                <span className="text-[10px] text-[var(--text-muted)] ml-2">{p.extra}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="px-3 py-3 rounded-xl border border-[var(--bg-border)]" style={{ background: "var(--card-glow)" }}>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {locale === "en" ? "Your Purva Ashadha Nakshatra, ruled by Venus, gives you an invincible spirit and artistic sensibility. The current Venus Mahadasha (2022–2042) amplifies creativity, relationships, and luxury." : "Venüs yönetimindeki Purva Ashadha Nakshatra’nız yenilmez bir ruh ve sanatsal duyarlılık verir. Venüs Mahadasha dönemi (2022–2042) yaratıcılığı, ilişkileri ve lüksü güçlendirir."}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "chinese" && (
                      <motion.div key="tab-chinese" className="glass-card p-6 space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🐉</span>
                          <h3 className="font-bold text-[var(--text-primary)]">{locale === "en" ? "Chinese Horoscope" : "Çin Burç Haritası"}</h3>
                        </div>
                        <div className="space-y-2">
                          {[
                            { label: locale === "en" ? "Year Pillar" : "Yıl Direği", animal: "🐂", element: locale === "en" ? "Wood Ox (乙丑)" : "Ahşap Öküz (乙丑)" },
                            { label: locale === "en" ? "Month Pillar" : "Ay Direği", animal: "🐍", element: locale === "en" ? "Wood Snake (乙巳)" : "Ahşap Yılan (乙巳)" },
                            { label: locale === "en" ? "Day Pillar" : "Gün Direği", animal: "🐒", element: locale === "en" ? "Water Monkey (壬申)" : "Su Maymunu (壬申)" },
                            { label: locale === "en" ? "Hour Pillar" : "Saat Direği", animal: "🐏", element: locale === "en" ? "Fire Goat (丁未)" : "Ateş Keçisi (丁未)" },
                          ].map((p) => (
                            <div key={p.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "var(--bg-surface)" }}>
                              <span className="text-xs font-medium text-[var(--text-primary)]">{p.label}</span>
                              <div className="text-right flex items-center gap-1">
                                <span className="text-sm">{p.animal}</span>
                                <span className="text-xs text-[var(--color-primary)] font-medium">{p.element}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold tracking-widest text-[var(--text-muted)] mb-2">{locale === "en" ? "FIVE ELEMENTS BALANCE" : "BEŞ ELEMENT DENGESİ"}</p>
                          <div className="flex gap-2">
                            {[
                              { el: "🪵", name: locale === "en" ? "Wood" : "Ahşap", pct: 35, color: "#22C55E" },
                              { el: "🔥", name: locale === "en" ? "Fire" : "Ateş", pct: 15, color: "#EF4444" },
                              { el: "🌍", name: locale === "en" ? "Earth" : "Toprak", pct: 20, color: "#A16207" },
                              { el: "🪙", name: "Metal", pct: 10, color: "#94A3B8" },
                              { el: "💧", name: locale === "en" ? "Water" : "Su", pct: 20, color: "#3B82F6" },
                            ].map((e) => (
                              <div key={e.name} className="flex-1 text-center">
                                <div className="text-lg mb-1">{e.el}</div>
                                <div className="h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${e.pct}%`, background: e.color }} />
                                </div>
                                <p className="text-[9px] text-[var(--text-muted)] mt-1">{e.pct}%</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="px-3 py-3 rounded-xl border border-[var(--bg-border)]" style={{ background: "var(--card-glow)" }}>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {locale === "en" ? "As a Water Monkey day master with strong Wood, you are resourceful and adaptable. Wood dominance suggests growth-oriented energy — this year favors career expansion and learning new skills." : "Güçlü Ahşap elementli Su Maymunu gün efendisi olarak becerikli ve uyumlusünuz. Ahşap baskınlığı büyüme odaklı enerjiyi işaret eder — bu yıl kariyer genişlemesi ve yeni beceriler öğrenmeyi destekler."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Section — always visible */}
            <motion.div
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {user ? (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white"
                      style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                      {user.displayName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{user.displayName}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {locale === "en" ? "Your readings are being saved" : "Okumalarınız kaydediliyor"}
                      </p>
                    </div>
                  </div>
                  <button onClick={logout}
                    className="w-full py-2 rounded-xl text-xs font-medium border border-[var(--bg-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-red-300 transition-colors">
                    {locale === "en" ? "Sign Out" : "Çıkış Yap"}
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {locale === "en" ? "Save Your Insights" : "İçgörülerinizi Kaydedin"}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mb-4">
                    {locale === "en"
                      ? "Sign in to keep your readings & unlock daily updates"
                      : "Okumalarınızı kaydetmek ve günlük güncellemeleri açmak için giriş yapın"}
                  </p>

                  <form onSubmit={handleLogin} className="space-y-2.5">
                    <input type="text" placeholder={locale === "en" ? "Username" : "Kullanıcı adı"}
                      value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} required
                      className="w-full px-3 py-2.5 text-sm bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
                    <input type="password" placeholder={locale === "en" ? "Password" : "Şifre"}
                      value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required
                      className="w-full px-3 py-2.5 text-sm bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors" />

                    {loginError && (
                      <p className="text-xs text-red-500 px-1">{loginError}</p>
                    )}

                    <button type="submit" disabled={loginLoading}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                      {loginLoading
                        ? (locale === "en" ? "Signing in..." : "Giriş yapılıyor...")
                        : (locale === "en" ? "Sign In" : "Giriş Yap")}
                    </button>
                  </form>

                  <div className="flex items-center gap-3 py-3">
                    <div className="flex-1 h-px bg-[var(--bg-border)]" />
                    <span className="text-[10px] text-[var(--text-muted)]">{locale === "en" ? "coming soon" : "yakında"}</span>
                    <div className="flex-1 h-px bg-[var(--bg-border)]" />
                  </div>

                  <div className="space-y-2 opacity-50">
                    <button disabled className="w-full flex items-center gap-3 px-4 py-2 rounded-xl border border-[var(--bg-border)] text-sm text-[var(--text-muted)] cursor-not-allowed"
                      style={{ background: "var(--bg-surface)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#ccc"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#ccc"/></svg>
                      Google
                    </button>
                    <button disabled className="w-full flex items-center gap-3 px-4 py-2 rounded-xl border border-[var(--bg-border)] text-sm text-[var(--text-muted)] cursor-not-allowed"
                      style={{ background: "var(--bg-surface)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#ccc"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                      Apple
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* ═══════ RIGHT COLUMN (3/5) ═══════ */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {showInsight ? (
                <motion.div
                  key="insight-card"
                  className="space-y-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                >
                  {/* ═══════ YOUR BIRTH CHARTS — Tab Bar ═══════ */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-[var(--text-muted)] mb-2 px-1">
                      {locale === "en" ? "🪐 YOUR BIRTH CHARTS" : "🪐 DOĞUM HARİTALARINIZ"}
                    </p>
                    <div className="flex gap-1 p-1 rounded-xl mb-0" style={{ background: "var(--bg-surface)" }}>
                      {([
                        { id: "bc-western", label: locale === "en" ? "☉ Western" : "☉ Batı" },
                        { id: "bc-vedic", label: locale === "en" ? "🕉 Vedic" : "🕉 Vedik" },
                        { id: "bc-chinese", label: locale === "en" ? "🐉 Chinese" : "🐉 Çin" },
                      ] as { id: string; label: string }[]).map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setExpandedChart(expandedChart === tab.id ? null : tab.id)}
                          className={`flex-1 py-2 px-1 text-[11px] font-semibold rounded-lg transition-all ${
                            expandedChart === tab.id
                              ? "bg-white text-[var(--color-primary)] shadow-sm"
                              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Birth Chart Content Panel */}
                  <AnimatePresence mode="wait">
                    {expandedChart === "bc-western" && (
                      <motion.div key="bc-western" className="glass-card p-5 space-y-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">☉</span>
                            <h3 className="font-bold text-[var(--text-primary)] text-sm">{locale === "en" ? "Western Birth Chart" : "Batı Doğum Haritası"}</h3>
                          </div>
                          <button onClick={() => setExpandedChart(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg transition-colors">✕</button>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            { icon: "☉", label: locale === "en" ? "Sun" : "Güneş", value: "Virgo ♍ 29°22' · H10", desc: locale === "en" ? "Core identity: analytical, service-oriented, detail-focused" : "Temel kimlik: analitik, hizmet odaklı, detaycı" },
                            { icon: "☽", label: locale === "en" ? "Moon" : "Ay", value: "Sagittarius ♐ 14°08' · H1", desc: locale === "en" ? "Emotions: adventurous, optimistic, freedom-loving" : "Duygular: maceracı, iyimser, özgürlüksever" },
                            { icon: "↑", label: locale === "en" ? "Rising" : "Yükselen", value: "Sagittarius ♐ 8°15'", desc: locale === "en" ? "Others see: enthusiastic, philosophical, worldly" : "Görünüm: coşkulu, felsefi, dünyevi" },
                            { icon: "♀", label: "Venus", value: "Leo ♌ 22°41' · H8", desc: locale === "en" ? "Love: dramatic, generous, passionate" : "Aşk: dramatik, cömert, tutkulu" },
                            { icon: "♂", label: "Mars", value: "Gemini ♊ 5°30' · H7", desc: locale === "en" ? "Drive: versatile, communicative, mentally active" : "Enerji: çok yönlü, iletişimci, aktif" },
                            { icon: "♃", label: "Jupiter", value: "Aquarius ♒ 18°12' · H3", desc: locale === "en" ? "Growth: innovative ideas, community, tech" : "Büyüme: yenilik, topluluk, teknoloji" },
                          ].map((p) => (
                            <div key={p.label} className="px-3 py-2 rounded-lg" style={{ background: "var(--bg-surface)" }}>
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{p.icon}</span>
                                <span className="text-[11px] font-bold text-[var(--text-primary)]">{p.label}</span>
                                <span className="text-[10px] text-[var(--color-primary)] ml-auto">{p.value}</span>
                              </div>
                              <p className="text-[10px] text-[var(--text-secondary)] pl-5 mt-0.5">{p.desc}</p>
                            </div>
                          ))}
                        </div>
                        <div className="px-3 py-2.5 rounded-xl border border-[var(--bg-border)]" style={{ background: "var(--card-glow)" }}>
                          <p className="text-[10px] font-semibold text-[var(--color-primary)] mb-1">{locale === "en" ? "Personality" : "Kişilik"}</p>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                            {locale === "en" ? "Virgo precision meets Sagittarian openness. Career built on analytical service; emotionally you crave adventure. In love, generous and dramatic." : "Başak titizliği Yay açıklığıyla buluşur. Kariyer analitik hizmete dayalı; duygusal olarak macera ararsınız."}
                          </p>
                        </div>
                        <button onClick={() => { const btn = document.querySelector('[aria-label="Open PIRI"]') as HTMLButtonElement; if (btn) btn.click(); }} className="w-full py-2 rounded-xl text-[11px] font-semibold text-white hover:scale-[1.02] transition-all" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                          {locale === "en" ? "💬 Ask PIRI About My Western Chart" : "💬 PIRI'ye Batı Haritamı Sor"}
                        </button>
                      </motion.div>
                    )}

                    {expandedChart === "bc-vedic" && (
                      <motion.div key="bc-vedic" className="glass-card p-5 space-y-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🕉</span>
                            <h3 className="font-bold text-[var(--text-primary)] text-sm">{locale === "en" ? "Vedic Birth Chart" : "Vedik Doğum Haritası"}</h3>
                          </div>
                          <button onClick={() => setExpandedChart(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg transition-colors">✕</button>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            { label: locale === "en" ? "Lagna (Ascendant)" : "Lagna", value: "Dhanu (Sagittarius)", desc: locale === "en" ? "Outward personality: optimistic teacher, truth-seeker" : "Dış kişilik: iyimser öğretmen, hakikat arayıcısı" },
                            { label: "Nakshatra", value: "Purva Ashadha ⭐", desc: locale === "en" ? "Venus-ruled: invincible spirit, artistic talent, natural persuasion" : "Venüs yönetimli: yenilmez ruh, sanatsal yetenek" },
                            { label: locale === "en" ? "Current Dasha" : "Dasha", value: "Venus Mahadasha (2022–2042)", desc: locale === "en" ? "20-year Venus period: romance, beauty, creativity peak" : "20 yıllık Venüs: romantizm, güzellik, yaratıcılık" },
                            { label: "Yoga", value: "Budhaditya Yoga", desc: locale === "en" ? "Sun-Mercury: sharp intellect, eloquence, leadership" : "Güneş-Merkür: keskin zekâ, belagat, liderlik" },
                            { label: "Manglik", value: locale === "en" ? "Partial Manglik" : "Kısmi Manglik", desc: locale === "en" ? "Mars in 7th: passionate but sometimes challenging partnerships" : "7. evde Mars: tutkulu ama zorlu ortaklıklar" },
                          ].map((p) => (
                            <div key={p.label} className="px-3 py-2 rounded-lg" style={{ background: "var(--bg-surface)" }}>
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-[var(--text-primary)]">{p.label}</span>
                                <span className="text-[10px] text-[var(--color-primary)] font-medium">{p.value}</span>
                              </div>
                              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{p.desc}</p>
                            </div>
                          ))}
                        </div>
                        <div className="px-3 py-2.5 rounded-xl border border-[var(--bg-border)]" style={{ background: "var(--card-glow)" }}>
                          <p className="text-[10px] font-semibold text-[var(--color-primary)] mb-1">{locale === "en" ? "Vedic Personality" : "Vedik Kişilik"}</p>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                            {locale === "en" ? "Purva Ashadha makes you unstoppable once committed. Venus Mahadasha is your golden era — breakthroughs in love, art, and success through 2042." : "Purva Ashadha sizi durdurulamaz kılar. Venüs Mahadasha altın çağınız — 2042'ye kadar atılımlar."}
                          </p>
                        </div>
                        <button onClick={() => { const btn = document.querySelector('[aria-label="Open PIRI"]') as HTMLButtonElement; if (btn) btn.click(); }} className="w-full py-2 rounded-xl text-[11px] font-semibold text-white hover:scale-[1.02] transition-all" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                          {locale === "en" ? "💬 Ask PIRI About My Vedic Chart" : "💬 PIRI'ye Vedik Haritamı Sor"}
                        </button>
                      </motion.div>
                    )}

                    {expandedChart === "bc-chinese" && (
                      <motion.div key="bc-chinese" className="glass-card p-5 space-y-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🐉</span>
                            <h3 className="font-bold text-[var(--text-primary)] text-sm">{locale === "en" ? "Chinese Birth Chart" : "Çin Doğum Haritası"}</h3>
                          </div>
                          <button onClick={() => setExpandedChart(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg transition-colors">✕</button>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            { animal: "🐒", label: locale === "en" ? "Day Master" : "Gün Efendisi", value: locale === "en" ? "Water Monkey (壬申)" : "Su Maymunu (壬申)", desc: locale === "en" ? "Clever, resourceful, infinitely adaptable" : "Zeki, becerikli, sonsuz uyumlu" },
                            { animal: "🐂", label: locale === "en" ? "Year Animal" : "Yıl Hayvanı", value: locale === "en" ? "Wood Ox (乙丑)" : "Ahşap Öküz (乙丑)", desc: locale === "en" ? "Reliable, patient, builds things that last" : "Güvenilir, sabırlı, kalıcı eserler" },
                            { animal: "🪵", label: locale === "en" ? "Dominant" : "Baskın", value: locale === "en" ? "Wood (35%)" : "Ahşap (35%)", desc: locale === "en" ? "Growth phase — plant seeds now" : "Büyüme aşaması — şimdi tohum ekin" },
                            { animal: "🪙", label: locale === "en" ? "Weakest" : "Zayıf", value: locale === "en" ? "Metal (10%)" : "Metal (10%)", desc: locale === "en" ? "Structure needs attention — create routines" : "Yapı ilgi gerektirir — rutinler oluşturun" },
                          ].map((p) => (
                            <div key={p.label} className="px-3 py-2 rounded-lg" style={{ background: "var(--bg-surface)" }}>
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{p.animal}</span>
                                <span className="text-[11px] font-bold text-[var(--text-primary)]">{p.label}</span>
                                <span className="text-[10px] text-[var(--color-primary)] ml-auto font-medium">{p.value}</span>
                              </div>
                              <p className="text-[10px] text-[var(--text-secondary)] pl-5 mt-0.5">{p.desc}</p>
                            </div>
                          ))}
                        </div>
                        {/* Five Elements mini chart */}
                        <div className="flex gap-2">
                          {[
                            { el: "🪵", pct: 35, color: "#22C55E" },
                            { el: "🔥", pct: 15, color: "#EF4444" },
                            { el: "🌍", pct: 20, color: "#A16207" },
                            { el: "🪙", pct: 10, color: "#94A3B8" },
                            { el: "💧", pct: 20, color: "#3B82F6" },
                          ].map((e) => (
                            <div key={e.el} className="flex-1 text-center">
                              <div className="text-sm mb-0.5">{e.el}</div>
                              <div className="h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${e.pct}%`, background: e.color }} />
                              </div>
                              <p className="text-[8px] text-[var(--text-muted)] mt-0.5">{e.pct}%</p>
                            </div>
                          ))}
                        </div>
                        <div className="px-3 py-2.5 rounded-xl border border-[var(--bg-border)]" style={{ background: "var(--card-glow)" }}>
                          <p className="text-[10px] font-semibold text-[var(--color-primary)] mb-1">{locale === "en" ? "Chinese Personality" : "Çin Kişiliği"}</p>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                            {locale === "en" ? "Water Monkey: BaZi's cleverest archetype — quick-witted, socially brilliant. Strong Wood energy makes this your growth decade." : "Su Maymunu: BaZi'nin en zeki arketipi. Güçlü Ahşap enerjisi büyüme on yılınızı işaret eder."}
                          </p>
                        </div>
                        <button onClick={() => { const btn = document.querySelector('[aria-label="Open PIRI"]') as HTMLButtonElement; if (btn) btn.click(); }} className="w-full py-2 rounded-xl text-[11px] font-semibold text-white hover:scale-[1.02] transition-all" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                          {locale === "en" ? "💬 Ask PIRI About My Chinese Chart" : "💬 PIRI'ye Çin Haritamı Sor"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Daily Resonance Card ── */}
                  <motion.div
                    className="overflow-hidden relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ minHeight: 420, borderRadius: 16, border: "none", boxShadow: "none", background: "transparent" }}
                  >
                    {/* Photo background — NASA APOD or fallback to time-of-day */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                      style={{ backgroundImage: nasaPhoto ? `url('${nasaPhoto.url}')` : `url('/images/hero-${timeTheme}.png')` }}
                    />
                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 100%)" }} />

                    {/* Content on top of photo */}
                    <div className="relative z-10 p-6">
                      {/* Header: date + title + moon */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <p className="text-[10px] font-medium tracking-widest text-white/60 mb-1">
                            {today}
                          </p>
                          <h2 className="text-xl font-bold text-white italic" style={{ fontFamily: "var(--font-heading), serif" }}>
                            {locale === "en" ? "Daily Resonance" : "Günlük Rezonans"}
                          </h2>
                        </div>
                        <span className="text-3xl opacity-70">{getMoonPhase()}</span>
                      </div>

                      {/* Card image */}
                      <div className="mb-5">
                        <div className="relative w-full max-w-[200px] mx-auto aspect-square rounded-2xl overflow-hidden"
                          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)", border: "2px solid rgba(255,215,0,0.3)", padding: 4, background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(138,43,226,0.15))" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/images/oracle-card-sample.png?v=2"
                            alt="Daily Insight Card"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Current theme */}
                      <div className="text-center">
                        <p className="text-[11px] font-semibold tracking-widest text-white/80">
                          {locale === "en" ? "CURRENT THEME" : "GÜNCEL TEMA"}: {insight.theme.toUpperCase()}
                        </p>
                      </div>

                      {/* NASA credit */}
                      {nasaPhoto && (
                        <div className="mt-4 text-right">
                          <p className="text-[9px] text-white/40 italic">
                            📸 {nasaPhoto.title} — {nasaPhoto.copyright}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* ── Suggested Window ── */}
                  <motion.div
                    className="glass-card px-5 py-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-[10px] font-medium tracking-widest text-[var(--text-muted)] mb-2">
                      {locale === "en" ? "SUGGESTED WINDOW" : "ÖNERİLEN ZAMAN"}
                    </p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-heading), serif" }}>
                        {insight.suggestedWindow.start} – {insight.suggestedWindow.end}
                      </span>
                      <span className="text-sm text-[var(--color-primary)] font-medium">
                        ({insight.suggestedWindow.label})
                      </span>
                    </div>
                  </motion.div>

                  {/* ── Daily Micro-Ritual ── */}
                  <motion.div
                    className="glass-card px-5 py-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-[10px] font-medium tracking-widest text-[var(--text-muted)] mb-2">
                      {locale === "en" ? "DAILY MICRO-RITUAL" : "GÜNLÜK MİKRO-RİTÜEL"}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {insight.microRitual}
                    </p>
                  </motion.div>

                  {/* ── Energy Navigator (expandable) ── */}
                  <motion.div
                    className="glass-card overflow-hidden"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <button
                      className="w-full px-5 py-4 flex items-center justify-between text-left"
                      onClick={() => setEnergyExpanded(!energyExpanded)}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span>🔮</span>
                          <h3 className="font-bold text-[var(--text-primary)] text-sm">
                            {d.energy?.title || "Energy Navigator"}
                          </h3>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          {d.energy?.subtitle || "See your energy flows today"}
                        </p>
                      </div>
                      <motion.span
                        className="text-[var(--text-muted)] text-lg"
                        animate={{ rotate: energyExpanded ? 180 : 0 }}
                      >
                        ▾
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {energyExpanded && (
                        <motion.div
                          className="px-5 pb-5 space-y-3"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {energyZones.map((zone) => (
                            <div key={zone.key} className="flex items-center gap-3">
                              <span className="text-xs font-medium text-[var(--text-secondary)] w-20">{zoneLabels[zone.key]}</span>
                              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-surface)" }}>
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ background: zone.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${zone.intensity}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                />
                              </div>
                              <span className="text-xs font-bold text-[var(--text-secondary)] w-8 text-right">{zone.intensity}%</span>
                            </div>
                          ))}
                          <p className="text-[10px] text-[var(--text-muted)] pt-2">
                            {d.energy?.source || "Synthesized from Western, Vedic & Chinese analysis"}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ) : (
                /* ── EMPTY STATE ── */
                <motion.div
                  key="empty-state"
                  className="glass-card p-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-5xl mb-4 animate-float">✦</div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    {locale === "en" ? "Your Insight Awaits" : "İçgörünüz Sizi Bekliyor"}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
                    {locale === "en"
                      ? "Enter your birth data on the left to receive your first synthesized daily insight — powered by Western, Vedic & Chinese astrology."
                      : "İlk sentezlenmiş günlük içgörünüzü almak için soldan doğum bilgilerinizi girin — Batı, Vedik ve Çin astrolojisi ile desteklenmektedir."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
