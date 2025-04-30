
export default async function handler(req, res) {
  const openaiKey = process.env.OPENAI_API_KEY;
  const sportsKey = process.env.NEXT_PUBLIC_SPORTSDB_API_KEY;
  const today = new Date().toISOString().slice(0, 10); // e.g., 2025-04-30

  try {
    // Get today's NBA games from TheSportsDB
    const eventsRes = await fetch(`https://www.thesportsdb.com/api/v1/json/${sportsKey}/eventsday.php?d=${today}&l=NBA`);
    const eventsData = await eventsRes.json();
    const games = eventsData?.events?.map(e => ({ home: e.strHomeTeam, away: e.strAwayTeam })) || [];

    if (games.length === 0) {
      return res.status(200).json({ matches: [], prediction: '今日無 NBA 賽事。' });
    }

    // Format prompt for GPT
    const prompt = `請根據以下 NBA 今日對戰，預測可能勝方並說明理由（請中立分析）：
${games.map(m => `${m.home} vs ${m.away}`).join('\n')}
請用條列格式顯示：1. 推薦隊伍 2. 分析理由`;

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9
      })
    });

    const result = await completion.json();
    const text = result.choices?.[0]?.message?.content || '無法取得分析';

    res.status(200).json({ matches: games, prediction: text });

  } catch (err) {
    console.error('運彩錯誤:', err);
    res.status(500).json({ error: 'GPT 運彩分析失敗' });
  }
}
