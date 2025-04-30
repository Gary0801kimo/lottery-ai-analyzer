import { useState } from "react";
import axios from "axios";

const zodiacs = ["鼠", "牛", "虎", "兔", "龍", "蛇", "馬", "羊", "猴", "雞", "狗", "豬"];

export default function WeeklyZodiac() {
  const [selected, setSelected] = useState("");
  const [weekly, setWeekly] = useState("");
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/weekly?zodiac=${selected}`);
      setWeekly(res.data.content || "");
    } catch (e) {
      setWeekly("取得失敗，請稍後再試。");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md col-span-full">
      <h3 className="text-2xl font-bold mb-4">📅 每週生肖運勢</h3>
      <div className="flex items-center gap-4 flex-wrap">
        <select
          className="text-lg border rounded px-4 py-2 shadow"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">請選擇生肖</option>
          {zodiacs.map((z) => (
            <option key={z}>{z}</option>
          ))}
        </select>
        <button
          onClick={fetch}
          disabled={!selected || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow disabled:opacity-50"
        >
          {loading ? "查詢中..." : "查詢運勢"}
        </button>
      </div>
      <div className="mt-4 whitespace-pre-wrap text-gray-800 text-lg">{weekly}</div>
    </div>
  );
}
