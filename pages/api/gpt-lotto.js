export const config = { runtime: 'nodejs' };

import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey || !apiKey.startsWith("sk-")) {
      return res.status(500).json({ error: "OpenAI 金鑰未設置或格式錯誤" });
    }

    const openai = new OpenAIApi(new Configuration({ apiKey }));
    const result = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        { role: "user", content: "請給我一句今日財運金句。" }
      ]
    });

    res.status(200).json({
      lotto: Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1),
      winLotto: Array.from({ length: 7 }, () => Math.floor(Math.random() * 38) + 1),
      quote: result.data?.choices?.[0]?.message?.content || "祝你好運"
    });
  } catch (err) {
    console.error("❌ GPT API 錯誤：", err);
    res.status(500).json({ error: "伺服器錯誤", message: err.message, stack: err.stack });
  }
}
