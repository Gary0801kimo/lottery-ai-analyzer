import { OpenAI } from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const resp = await axios.get(
      `https://www.thesportsdb.com/api/v1/json/${process.env.NEXT_PUBLIC_SPORTSDB_API_KEY}/eventsday.php?d=2024-05-01&s=Basketball`
    );
    const games = (resp.data.events || []).filter(
      (e) => e.strLeague.includes("NBA")
    ).slice(0, 3);

    const prompts = games.map((g) => `對戰組合：${g.strHomeTeam} vs ${g.strAwayTeam}，請預測勝隊並附一句理由。`);
    const finalPrompt = prompts.join("\n");

    const reply = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: finalPrompt }],
      temperature: 1,
    });

    const result = reply.choices?.[0]?.message?.content || "今日無 NBA 對戰分析。";
    res.status(200).json(result.split(/\n|\r/).filter(Boolean));
  } catch (err) {
    console.error("NBA 運彩分析失敗", err);
    res.status(500).json({ error: "運彩分析失敗", detail: err.message });
  }
}
