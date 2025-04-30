import { useEffect, useState } from "react";
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
      const res1 = await axios.get("/api/gpt-lotto");
      const res2 = await axios.get("/api/winlotto");
      const res3 = await axios.get("/api/sports-predict");
      setLotto(res1.data.lotto || []);
      setWinLotto(res2.data.winLotto || []);
      setQuote(res1.data.quote || "祝你中大獎！");
      setSports(res3.data || []);
    } catch (e) {
      console.error("資料取得失敗", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderNumbers = (nums) =>
    Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="w-12 h-12 flex items-center justify-center bg-yellow-200 text-black font-bold rounded-full shadow text-lg">
        {nums[i] || "🎲"}
      </div>
    ));

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-sky-200 to-green-200">
      <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-2">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-2">🎯 大樂透預測</h2>
          <div className="flex gap-2 flex-wrap">{renderNumbers(lotto)}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-2">💥 威力彩預測</h2>
          <div className="flex gap-2 flex-wrap">{renderNumbers(winLotto)}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md col-span-2">
          <h2 className="text-xl font-bold mb-2">📣 運彩推薦</h2>
          {loading ? <p>查詢中...</p> : (
            <ul className="list-disc list-inside text-gray-700">
              {sports.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md col-span-2">
          <h2 className="text-xl font-bold mb-2">🌟 今日金句</h2>
          <p className="text-lg text-gray-700 italic">「{quote || "請稍候..."}」</p>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full text-xl shadow-lg transition disabled:opacity-50"
        >
          {loading ? "查詢中..." : "再預測一次 🎲"}
        </button>
      </div>
    </div>
  );
}
