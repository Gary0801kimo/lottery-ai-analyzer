
import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [birthday, setBirthday] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    const res = await axios.post('/api/gpt-lotto', { birthday });
    setData(res.data);
    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#ecfdf5' }}>
      <h1 style={{ textAlign: 'center' }}>🎯 彩券 AI 預測（個人命盤版）</h1>
      <div style={{ maxWidth: 600, margin: 'auto' }}>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        />
        <button
          onClick={handlePredict}
          disabled={loading}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '0.75rem 1.5rem',
            fontSize: '1.2rem',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {loading ? '預測中...' : '送出預測 🎲'}
        </button>
        {data && (
          <div style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
            <h2>🎴 預測結果</h2>
            <p>大樂透：{data.lotto.join(', ')}</p>
            <p>威力彩本號：{data.power.main.join(', ')}；特別號：{data.power.special}</p>
            <h3>🌟 今日金句</h3>
            <p>{data.quote}</p>
            <h3>🧠 分析說明</h3>
            <p>{data.summary}</p>
          </div>
        )}
      </div>
    </main>
  );
}
