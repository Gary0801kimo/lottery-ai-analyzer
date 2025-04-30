import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import html2pdf from "html2pdf.js";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Home() {
  const [lotto, setLotto] = useState([]);
  const [winLotto, setWinLotto] = useState([]);
  const [sports, setSports] = useState([]);
  const [quote, setQuote] = useState("");
  const [history, setHistory] = useState([]);
  const chartRef = useRef();

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/gpt-lotto");
      setLotto(res.data.lotto || []);
      setWinLotto(res.data.winLotto || []);
      setQuote(res.data.quote || "祝你好運");
      const sportsRes = await axios.get("/api/sports-predict");
      setSports(sportsRes.data || []);
      const historyRes = await axios.get("/api/lotto-history");
      setHistory(historyRes.data || []);
    } catch (err) {
      console.error("資料取得失敗", err);
    }
  };

  const exportPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf().from(chartRef.current).save("lotto-report.pdf");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = {
    labels: Array.from({ length: 49 }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        label: "號碼出現次數",
        data: history,
        backgroundColor: "#facc15"
      }
    ]
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#e8f5ff" }}>
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">大樂透推測</h2>
          <p className="text-lg mb-2">{lotto.join(" ")}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">威力彩推測</h2>
          <p className="text-lg mb-2">{winLotto.join(" ")}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">運彩推薦</h2>
          {sports.map((s, i) => (
            <p className="text-base" key={i}>- {s}</p>
          ))}
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">每日金句</h2>
          <p className="text-lg italic">{quote}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white p-6 mt-10 rounded-2xl shadow-lg" ref={chartRef}>
        <h2 className="text-2xl font-bold mb-4">大樂透號碼統計圖</h2>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>

      <div className="flex justify-center mt-10 gap-4">
        <button
          onClick={fetchData}
          className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full text-xl shadow-md transition-all"
        >
          再算一次（好運來）
        </button>
        <button
          onClick={exportPDF}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-xl shadow-md transition-all"
        >
          匯出 PDF
        </button>
      </div>
    </div>
  );
}
