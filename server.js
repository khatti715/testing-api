const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Backend API — never exposed to frontend
const API_BASE = "https://multibombapi-taupe.vercel.app/bomb";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/bomb", async (req, res) => {
  try {
    const { number, rounds = 15, method = "ivr" } = req.body;

    if (!number || typeof number !== "string") {
      return res.status(400).json({ success: false, message: "Number required" });
    }

    const cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.length < 10) {
      return res.status(400).json({ success: false, message: "Invalid number" });
    }

    const count = Math.min(Math.max(Number(rounds) || 15, 1), 50);
    const url = `${API_BASE}?number=${cleanNumber}&count=${count}&method=${method}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });

    const data = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch {
      parsed = { raw: data };
    }

    return res.json({
      success: true,
      target: cleanNumber,
      rounds: count,
      method,
      response: parsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Server error",
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`RAJA X DEVELOPER Call Bomber running on http://localhost:${PORT}`);
});
