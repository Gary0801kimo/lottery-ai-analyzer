import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const w = "日一二三四五六"[today.getDay()];
    const h = today.getHours();

    const prompt = `
今天是 大樂透運勢預測：
日期：${y}年${m}月${d}日（星期${w}），時辰：${h}點整。
紫微分析顯示：今日屬「水旺金生」，忌火土，適合分散投注，宜選跳躍式號碼。
請根據紫微斗數與命理概念，推算 大樂透（從 1~49 中選出 6 個不重複號碼），並附上繁體中文金句。
格式：
號碼：xx, xx, xx, xx, xx, xx
金句：「...」`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
    });

    const reply = response.choices?.[0]?.message?.content || "";
    const nums = reply.match(/[0-9]{1,2}/g) || [];
    const list = [...new Set(nums)].slice(0, 6);
    const quoteMatch = reply.match(/["「](.+?)["」]/);
    const quote = quoteMatch ? quoteMatch[1] : "順勢而為，招財進寶。";

    res.status(200).json({
      lotto: list,
      quote,
    });
  } catch (e) {
    console.error("大樂透 解析錯誤", e);
    res.status(500).json({ error: "GPT 分析失敗", detail: e.message });
  }
}
