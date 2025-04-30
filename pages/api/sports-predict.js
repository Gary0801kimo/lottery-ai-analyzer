export const config = { runtime: 'nodejs' };

import axios from "axios";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_SPORTSDB_API_KEY || "1";
    const today = new Date().toISOString().split("T")[0];
    const url = `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventsday.php?d=${today}&s=Basketball`;
    const response = await axios.get(url);
    const events = response.data?.events || [];

    const recommendations = events.slice(0, 3).map(e => `推薦比賽：${e.strEvent}，預測：${e.strHomeTeam} 勝`);
    res.status(200).json(recommendations);
  } catch (err) {
    console.error("❌ 運彩錯誤：", err);
    res.status(500).json({ error: "運彩資料錯誤", message: err.message });
  }
}
