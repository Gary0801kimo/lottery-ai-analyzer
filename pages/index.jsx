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
      setQuote(lottoRes.data.quote || "");
      setSports(sportRes.data || []);
    } catch (e) {
      console.error("取得失敗", e);
    }
    setLoading(false);
  };

  const Ball = ({ num }) => (
    <div className="w-16 h-16 rounded-full bg-yellow-200 text-3xl font-bold shadow-md flex items-center justify-center border-4 border-yellow-500">
      {num || "🎲"}
    </div>
  );

  const Card = ({ title, icon, content }) => (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition break-inside-avoid">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">{icon} {title}</h3>
      {content}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-100 p-6">
      <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <Card
          title="大樂透預測"
          icon="🎯"
          content={
            lotto.length === 0 ? (
              <p className="text-gray-400">請點擊下方按鈕預測</p>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center">
                {lotto.map((n, i) => <Ball key={i} num={n} />)}
              </div>
            )
          }
        />
        <Card
          title="威力彩預測"
          icon="💥"
          content={
            winLotto.length === 0 ? (
              <p className="text-gray-400">請點擊下方按鈕預測</p>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center">
                {winLotto.map((n, i) => <Ball key={i} num={n} />)}
              </div>
            )
          }
        />
        <Card
          title="NBA 運彩推薦"
          icon="🏀"
          content={sports.length > 0 ? (
            <ul className="list-disc list-inside text-gray-800 text-lg space-y-1">
              {sports.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          ) : <p className="text-gray-400">請點擊下方按鈕查詢今日賽事</p>}
        />
        <Card
          title="今日金句"
          icon="🌟"
          content={<p className="text-xl italic text-gray-800">「{quote || "請先點擊預測一次"}」</p>}
        />
      </div>

      <div className="text-center mt-10">
        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-10 rounded-full text-xl shadow-lg transition disabled:opacity-50"
        >
          {loading ? "查詢中..." : "再預測一次 🎲"}
        </button>
      </div>
    </div>
  );
}
