
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [birthday, setBirthday] = useState('');
  const [data, setData] = useState(null);
  const [sports, setSports] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const [lottoRes, sportsRes] = await Promise.all([
        axios.post('/api/gpt-lotto', { birthday }),
        axios.get('/api/gpt-sports')
      ]);
      setData(lottoRes.data);
      setSports(sportsRes.data);
    } catch (e) {
      setData({ error: '分析失敗，請稍後再試。' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem', background: '#ecfdf5' }}>
      <h1 style={{ textAlign: 'center' }}>🎯 彩券 AI 預測（GPT 命盤＋運彩分析）</h1>
      <div style={{ maxWidth: 700, margin: 'auto' }}>
        <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', borderRadius: '8px', marginBottom: '1rem' }} />
        <button onClick={handleSubmit} disabled={loading}
          style={{ background: '#10b981', color: '#fff', padding: '0.75rem 1.5rem', fontSize: '1.2rem', border: 'none', borderRadius: '10px' }}>
          {loading ? '分析中...' : '開始預測'}
        </button>

        {data && (
          <div style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
            {data.error ? <p>{data.error}</p> : <>
              <h2>🎫 大樂透號碼</h2><p>{data.lotto.join(', ')}</p>
              <h2>💰 威力彩號碼</h2><p>本號：{data.power.main.join(', ')}；特別號：{data.power.special}</p>
              <h3>🌟 金句</h3><p>{data.quote}</p>
              <h3>🧠 命盤分析</h3><p>{data.summary}</p>
            </>}
          </div>
        )}

        {sports && (
          <div style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
            <h2>🏀 今日運彩推薦（NBA）</h2>
            {sports.matches.map((m, i) => (
              <p key={i}>對戰：{m.home} vs {m.away}</p>
            ))}
            <h3>AI 預測分析</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{sports.prediction}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
