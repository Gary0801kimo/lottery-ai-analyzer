import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const today = new Date().toLocaleDateString("zh-TW", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `
今天是 2025年04月30日（星期二），請你參考紫微斗數、天干地支、五行旺衰，分析今日運勢並預測一組大樂透號碼（6 個 1～49 間不重複的幸運數字），並提供一句對應今日運勢的專屬幸運金句。
格式如下：
號碼：xx, xx, xx, xx, xx, xx
金句：「......」`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
    });

    const reply = response.choices?.[0]?.message?.content || "";
    const numberMatch = reply.match(/[0-9]{1,2}/g) || [];
    const uniqueNumbers = [...new Set(numberMatch)].slice(0, 6);
    const quoteMatch = reply.match(/["「](.+?)["」]/);
    const quote = quoteMatch ? quoteMatch[1] : "今日財氣流動，貴人隱現。";

    res.status(200).json({
      lotto: uniqueNumbers,
      winLotto: [],
      quote,
    });
  } catch (err) {
    console.error("GPT 分析失敗：", err);
    res.status(500).json({ error: "GPT 分析失敗", details: err.message });
  }
}
