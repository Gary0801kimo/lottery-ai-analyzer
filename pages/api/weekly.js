import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const today = new Date();
    const prompt = `請根據紫微斗數邏輯，用繁體中文撰寫本週運勢摘要，包含財運、健康、感情三面向，各約 1 句話：\n\n格式如下：\n\n財運：\n健康：\n感情：`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
    });

    const text = response.choices?.[0]?.message?.content || "財運：穩中求進\n健康：注意飲食與睡眠\n感情：心平氣和可促進感情發展";
    res.status(200).json({ content: text });
  } catch (err) {
    res.status(500).json({ error: "無法取得每週運勢", detail: err.message });
  }
}
