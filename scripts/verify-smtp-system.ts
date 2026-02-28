// SMTP System Verification Script
// Run with: npx tsx scripts/verify-smtp-system.ts

import "dotenv/config";
import nodemailer from "nodemailer";

async function verifySMTPSystem() {
  console.log("Verifying SMTP system...\n");

  const requiredVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "CONTACT_EMAIL"];

  console.log("1. Checking environment variables:");
  let allPresent = true;
  for (const varName of requiredVars) {
    const present = !!process.env[varName];
    console.log(`   ${present ? "✅" : "❌"} ${varName}: ${present ? "set" : "MISSING"}`);
    if (!present) allPresent = false;
  }

  if (!allPresent) {
    console.log("\n⚠️  Some environment variables are missing. Please check your .env file.");
    return;
  }

  console.log("\n2. Testing SMTP connection:");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("   ✅ SMTP connection verified!\n");
    console.log("✅ All checks passed. SMTP system is ready.");
  } catch (error) {
    console.error("   ❌ SMTP verification failed:", error);
  }
}

verifySMTPSystem();
