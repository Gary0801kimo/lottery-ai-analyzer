
export default async function handler(req, res) {
  const { birthday } = req.body;
  const openaiKey = process.env.OPENAI_API_KEY;

  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: `根據生日 ${birthday} 推算今日紫微命盤，並預測今日大樂透（6碼, 1-49）與威力彩（本號6碼1-38，特別號1-8）。請輸出：
          1. 大樂透號碼
          2. 威力彩號碼
          3. 一句個人化金句
          4. 分析說明。`
        }],
        temperature: 0.9
      })
    });

    const result = await completion.json();
    const text = result.choices?.[0]?.message?.content || '';

    // 簡單提取資訊（正式版建議用正則或結構化格式）
    const parse = (label) => {
      const match = text.match(new RegExp(`${label}[:：]?\s*(.+)`));
      return match ? match[1].split(/[、,，\s]+/).filter(s => s) : [];
    };

    res.status(200).json({
      lotto: parse('大樂透號碼'),
      power: { main: parse('威力彩號碼').slice(0, 6), special: parse('威力彩號碼').slice(6)[0] || '?' },
      quote: (text.match(/金句[:：]?\s*(.+)/) || [])[1] || '金句取得失敗',
      summary: (text.match(/分析說明[:：]?\s*([\s\S]+)/) || [])[1] || '無分析內容',
    });

  } catch (e) {
    res.status(500).json({ error: 'OpenAI 呼叫失敗' });
  }
}
