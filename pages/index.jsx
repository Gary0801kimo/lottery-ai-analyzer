import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [lotto, setLotto] = useState([]);
  const [winLotto, setWinLotto] = useState([]);
  const [sports, setSports] = useState([]);
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lottoRes, winRes, sportRes] = await Promise.all([
        axios.get("/api/gpt-lotto"),
        axios.get("/api/winlotto"),
        axios.get("/api/sports-predict"),
      ]);
      setLotto(lottoRes.data.lotto || []);
      setWinLotto(winRes.data.winLotto || []);
      setQuote(lottoRes.data.quote || "祝你中獎！");
      setSports(sportRes.data || []);
    } catch (e) {
      console.error("取得失敗", e);
    }
    setLoading(false);
  };

  const Ball = ({ num }) => (
    <div className="w-14 h-14 rounded-full bg-white text-xl font-bold shadow flex items-center justify-center border-2 border-yellow-500">
      {num || "🎲"}
    </div>
  );

  const Card = ({ title, items }) => (
    <div className="bg-white p-5 rounded-2xl shadow-md text-center">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="flex justify-center flex-wrap gap-3">
        {items.length > 0 ? items.map((n, i) => <Ball key={i} num={n} />) : Array.from({ length: 6 }).map((_, i) => <Ball key={i} num={""} />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200 p-6">
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
        <Card title="🎯 大樂透預測" items={lotto} />
        <Card title="💥 威力彩預測" items={winLotto} />

        <div className="bg-white p-5 rounded-2xl shadow-md col-span-2">
          <h3 className="text-xl font-bold mb-2">🏀 NBA 運彩推薦</h3>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            {sports.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md col-span-2">
          <h3 className="text-xl font-bold mb-2">🌟 今日金句</h3>
          <p className="text-lg text-gray-700 italic">「{quote || "請先點擊預測」」</p>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full text-xl shadow transition disabled:opacity-50"
        >
          {loading ? "查詢中..." : "再預測一次 🎲"}
        </button>
      </div>
    </div>
  );
}
