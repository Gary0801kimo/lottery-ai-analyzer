import { OpenAI } from "openai";
import cheerio from "cheerio";
import fetch from "node-fetch";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

async function fetchTaiwanLottoData() {
  const res = await fetch("https://www.taiwanlottery.com.tw/lotto/lotto649/history.aspx", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept-Encoding": "gzip",
    },
  });

  const html = await res.text();
  const $ = cheerio.load(html);
  const results = [];

  $("table.table_org tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length >= 8) {
      const numbers = [];
      for (let i = 1; i <= 6; i++) {
        const num = $(cells[i]).text().trim();
        if (num) numbers.push(num);
      }
      if (numbers.length === 6) results.push(numbers);
    }
  });

  return results.slice(0, 500);
}

export default async function handler(req, res) {
  try {
    const realData = await fetchTaiwanLottoData();
    const inputText = realData.map(r => r.join(", ")).join("\n");

    const prompt = `
以下是台灣大樂透最近 500 期的開獎號碼紀錄，請你基於數據趨勢預測下一期號碼（6 個不重複號碼，範圍 1～49），並附上一句金句鼓勵玩家。

號碼紀錄：
${inputText}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
    });

    const reply = response.choices?.[0]?.message?.content || "";

    const numberMatch = reply.match(/[0-9]{1,2}/g) || [];
    const uniqueNumbers = [...new Set(numberMatch)].slice(0, 6);

    const quoteMatch = reply.match(/["「](.+?)["」]/);
    const quote = quoteMatch ? quoteMatch[1] : "祝你好運，中大獎！";

    res.status(200).json({
      lotto: uniqueNumbers,
      winLotto: [],
      quote,
    });
  } catch (error) {
    console.error("GPT 分析失敗：", error);
    res.status(500).json({ error: "GPT 分析失敗", details: error.message });
  }
}
