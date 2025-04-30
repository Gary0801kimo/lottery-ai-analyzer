import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [lotto, setLotto] = useState([]);
  const [winLotto, setWinLotto] = useState([]);
  const [sports, setSports] = useState([]);
  const [quote, setQuote] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/gpt-lotto");
      setLotto(res.data.lotto || []);
      setWinLotto(res.data.winLotto || []);
      setQuote(res.data.quote || "祝你好運");
      const sportsRes = await axios.get("/api/sports-predict");
      setSports(sportsRes.data || []);
    } catch (err) {
      console.error("資料取得失敗", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-sky-200 to-green-300">
      <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-2">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-2">🎯 大樂透預測</h2>
          <div className="flex flex-wrap gap-2">
            {lotto.map((num, i) => (
              <span key={i} className="bg-yellow-300 px-4 py-2 rounded-full text-lg font-bold shadow">
                {num}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-2">💥 威力彩預測</h2>
          <div className="flex flex-wrap gap-2">
            {winLotto.map((num, i) => (
              <span key={i} className="bg-pink-300 px-4 py-2 rounded-full text-lg font-bold shadow">
                {num}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md col-span-2">
          <h2 className="text-xl font-bold mb-2">📣 運彩推薦</h2>
          <ul className="list-disc list-inside">
            {sports.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md col-span-2">
          <h2 className="text-xl font-bold mb-2">🌟 今日金句</h2>
          <p className="italic text-lg text-gray-700">「{quote}」</p>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={fetchData}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full text-xl shadow-lg transition"
        >
          再預測一次 🎲
        </button>
      </div>
    </div>
  );
}
