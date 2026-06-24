import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const timeData = [
  { time: "۱ق.ظ", value: 8 },
  { time: "۴ق.ظ", value: 5 },
  { time: "۷ق.ظ", value: 22 },
  { time: "۱۰ق.ظ", value: 58 },
  { time: "۱ب.ظ", value: 80 },
  { time: "۴ب.ظ", value: 52 },
  { time: "۷ب.ظ", value: 70 },
  { time: "۱۰ب.ظ", value: 28 },
];
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(10,10,25,0.95)",
          border: "1px solid rgba(123,111,253,0.3)",
          borderRadius: 10,
          padding: "8px 14px",
          fontFamily: "Vazirmatn, sans-serif",
          direction: "rtl",
        }}
      >
        <p style={{ color: "#9090c0", fontSize: 11, marginBottom: 2 }}>
          {label}
        </p>
        <p style={{ color: "#7b6ffd", fontSize: 14, fontWeight: 700 }}>
          {payload[0].value} تعامل
        </p>
      </div>
    );
  }
  return null;
};
const AnalyticsChart = () => {
  const maxVal = Math.max(...timeData.map((d) => d.value));
  return (
    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#7b6ffd] rounded-full" />
          <span className="text-sm text-[#9090c0]">تعامل در طول زمان</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#7070a0]">
          <div className="w-2 h-2 rounded-sm bg-[#7b6ffd]" />
          تعاملات
        </div>
      </div>

      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={timeData} barCategoryGap="22%">
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#50507a", fontSize: 10, fontFamily: "Vazirmatn" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#50507a", fontSize: 10, fontFamily: "Space Mono" }}
            width={28}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(123,111,253,0.06)" }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {timeData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.value === maxVal
                    ? "rgba(123,111,253,0.95)"
                    : "rgba(123,111,253,0.22)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
