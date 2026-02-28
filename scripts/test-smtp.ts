// SMTP Connection Test Script
// Run with: npx tsx scripts/test-smtp.ts

import "dotenv/config";
import nodemailer from "nodemailer";

async function testSMTP() {
  console.log("Testing SMTP connection...");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP connection successful!");
  } catch (error) {
    console.error("❌ SMTP connection failed:", error);
  }
}

testSMTP();
