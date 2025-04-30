
export default async function handler(req, res) {
  const { birthday } = req.body;

  // 模擬 GPT 分析
  res.status(200).json({
    lotto: [12, 25, 33, 41, 45, 49],
    power: { main: [7, 9, 18, 21, 27, 32], special: 6 },
    quote: "你今日命宮逢生年化祿，正是出手嘗試的好時機。",
    summary: `根據您輸入的生日（${birthday}），GPT 模型推算今日命盤傾向吉運分散，建議採偶數搭配冷門尾數進行組合。`
  });
}
