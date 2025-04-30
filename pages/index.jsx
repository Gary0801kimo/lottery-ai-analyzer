import { useState } from "react";
import axios from "axios";


export default function Home() {
  const [lotto, setLotto] = useState([]);
  const [winLotto, setWinLotto] = useState([]);
  const [sports, setSports] = useState([]);
  const [quote, setQuote] = useState("");
  const [weekly, setWeekly] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lottoRes, winRes, sportRes, weekRes] = await Promise.all([
        axios.get("/api/gpt-lotto"),
        axios.get("/api/winlotto"),
        axios.get("/api/sports-predict"),
        axios.get("/api/weekly"),
      ]);
      setLotto(lottoRes.data.lotto || []);
      setWinLotto(winRes.data.winLotto || []);
      setQuote(lottoRes.data.quote || "祝你中獎！");
      setSports(sportRes.data || []);
      setWeekly(weekRes.data.content || "");
    } catch (e) {
      console.error("查詢失敗", e);
    }
    setLoading(false);
  };

  const Ball = ({ num }) => (
    <div className="w-16 h-16 rounded-full bg-white text-2xl font-bold shadow flex items-center justify-center border-2 border-yellow-500">
      {num || "🎲"}
    </div>
  );

  const Card = ({ title, items }) => (
    <div className="bg-white p-6 rounded-3xl shadow-md text-center space-y-4">
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="flex justify-center flex-wrap gap-4">
        {items.length > 0 ? items.map((n, i) => <Ball key={i} num={n} />) : Array.from({ length: 6 }).map((_, i) => <Ball key={i} num={""} />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200 p-6 [column-fill:_balance] sm:columns-1 md:columns-2 xl:columns-3 space-y-6">
      <div className="space-y-6 [break-inside:avoid]">
        <Card title="🎯 大樂透預測" items={lotto} />
        <Card title="💥 威力彩預測" items={winLotto} />

        <div className="bg-white p-6 rounded-3xl shadow-md col-span-full">
          <h3 className="text-2xl font-bold mb-2">🏀 NBA 運彩推薦</h3>
          <ul className="list-disc list-inside text-gray-800 space-y-1 text-lg">
            {sports.length > 0 ? sports.map((s, i) => <li key={i}>{s}</li>) : <li>請點擊下方按鈕取得推薦</li>}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-md col-span-full">
          <h3 className="text-2xl font-bold mb-2">🌟 今日金句</h3>
          <p className="text-xl text-gray-700 italic">「{quote || "請先預測一次"}」</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-md col-span-full">
          <h3 className="text-2xl font-bold mb-2">📅 每週運勢</h3>
          <pre className="whitespace-pre-wrap text-gray-800 text-lg">{weekly || "請先預測一次以取得本週建議"}</pre>
        </div>
            </div>

      <div className="text-center mt-10">
        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-10 rounded-full text-xl shadow transition disabled:opacity-50"
        >
          {loading ? "查詢中..." : "再預測一次 🎲"}
        </button>
      </div>
    </div>
  );
}
