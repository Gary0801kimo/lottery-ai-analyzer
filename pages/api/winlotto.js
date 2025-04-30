import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

function getZiWeiInfo() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = "日一二三四五六".charAt(date.getDay());
  const hour = date.getHours();

  return `
【紫微斗數運勢分析】
日期：${year}年${month}月${day}日（星期${weekday}）
時辰：${hour}點整
生肖流年：${year % 12 === 4 ? "龍年" : "其他年"}
五行旺相：今日屬「水旺金生」，忌火土
天干地支：甲辰日，土中藏木水，適合靜心謀劃
建議：避開重複數字、尾數同質，宜分散能量，選擇跳躍性號碼
  `;
}

export default async function handler(req, res) {
  try {
    const ziwei = getZiWeiInfo();
    const prompt = `
請根據以下紫微斗數分析內容，推算出今日適合投注的威力彩號碼（從 1~49 中選出 6 個不重複的數字），並提供一句正向能量的繁體中文金句。請以簡潔格式回覆：

${ziwei}

格式：
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
    const quote = quoteMatch ? quoteMatch[1] : "順勢而為，心靜自然中大獎。";

    res.status(200).json({
      winLotto: uniqueNumbers,
      quote,
    });
  } catch (err) {
    console.error("GPT 處理失敗", err);
    res.status(500).json({ error: "分析錯誤", detail: err.message });
  }
}
