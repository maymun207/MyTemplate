-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'tr',
    "tier" TEXT NOT NULL DEFAULT 'free',
    "birth_time_known" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" DATETIME
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT false,
    "pwa_installed" BOOLEAN NOT NULL DEFAULT false,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Istanbul',
    "display_settings" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "natal_charts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "birth_datetime" DATETIME NOT NULL,
    "birth_city" TEXT NOT NULL,
    "birth_lat" REAL NOT NULL,
    "birth_lng" REAL NOT NULL,
    "western_data" TEXT NOT NULL DEFAULT '{}',
    "vedic_data" TEXT NOT NULL DEFAULT '{}',
    "chinese_data" TEXT NOT NULL DEFAULT '{}',
    "time_approximate" BOOLEAN NOT NULL DEFAULT false,
    "calculated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "natal_charts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "daily_oracles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "natal_chart_id" TEXT NOT NULL,
    "oracle_date" DATETIME NOT NULL,
    "daily_theme" TEXT NOT NULL,
    "scenarios" TEXT NOT NULL DEFAULT '[]',
    "guidance_message" TEXT NOT NULL,
    "challenge_reading" TEXT,
    "astro_card_url" TEXT,
    "synthesis_summary" TEXT,
    "generated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "daily_oracles_natal_chart_id_fkey" FOREIGN KEY ("natal_chart_id") REFERENCES "natal_charts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "agent_signals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "daily_oracle_id" TEXT NOT NULL,
    "agent_type" TEXT NOT NULL,
    "raw_signal" TEXT NOT NULL DEFAULT '{}',
    "confidence_score" REAL NOT NULL DEFAULT 0.0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "agent_signals_daily_oracle_id_fkey" FOREIGN KEY ("daily_oracle_id") REFERENCES "daily_oracles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "energy_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "daily_oracle_id" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "intensity" REAL NOT NULL DEFAULT 0.5,
    "explanation" TEXT NOT NULL,
    CONSTRAINT "energy_entries_daily_oracle_id_fkey" FOREIGN KEY ("daily_oracle_id") REFERENCES "daily_oracles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "timing_windows" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "daily_oracle_id" TEXT NOT NULL,
    "window_start" DATETIME NOT NULL,
    "window_end" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "alarm_sent" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "timing_windows_daily_oracle_id_fkey" FOREIGN KEY ("daily_oracle_id") REFERENCES "daily_oracles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rituals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "daily_oracle_id" TEXT NOT NULL,
    "ritual_type" TEXT NOT NULL,
    "source_system" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 2,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "rituals_daily_oracle_id_fkey" FOREIGN KEY ("daily_oracle_id") REFERENCES "daily_oracles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "outcome_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "daily_oracle_id" TEXT,
    "log_date" DATETIME NOT NULL,
    "energy_score" INTEGER,
    "mood_score" INTEGER,
    "event_category" TEXT,
    "free_text" TEXT,
    "logged_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "outcome_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "outcome_logs_daily_oracle_id_fkey" FOREIGN KEY ("daily_oracle_id") REFERENCES "daily_oracles" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "starts_at" DATETIME,
    "ends_at" DATETIME,
    "payment_provider" TEXT,
    "payment_id" TEXT,
    CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_oracles_user_id_oracle_date_key" ON "daily_oracles"("user_id", "oracle_date");
