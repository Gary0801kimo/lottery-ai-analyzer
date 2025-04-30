import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { zodiac } = req.query;
  if (!zodiac) return res.status(400).json({ error: "缺少生肖參數" });

  const prompt = `我是生肖「${zodiac}」，請根據紫微斗數邏輯，以繁體中文撰寫我的本週運勢，包含以下四項：\n\n財運：\n健康：\n感情：\n事業：\n\n每項請 1～2 句話，風格溫和鼓勵，適合一般人閱讀。`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
    });

    const text = response.choices?.[0]?.message?.content || "";
    res.status(200).json({ content: text });
  } catch (err) {
    res.status(500).json({ error: "無法取得生肖運勢", detail: err.message });
  }
}
