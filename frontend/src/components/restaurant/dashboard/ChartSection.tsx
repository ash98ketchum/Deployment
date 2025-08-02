// frontend/src/components/restaurant/dashboard/ChartSection.tsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

import Card from "@/components/ui/Card";

interface SeriesPoint {
  date: string;
  actual: number;
  predicted: number;
  actualEarning: number;
  predictedEarning: number;
}

// ← Add this at the top:
const API_BASE =
  import.meta.env.VITE_API_URL /* e.g. "https://deployment-v0fc.onrender.com" */
  || "https://deployment-v0fc.onrender.com";

const ChartSection: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const [data, setData] = useState<SeriesPoint[]>([]);
  const [epsilon, setEpsilon] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to attach JWT
  const authHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) actual series
        const actualRes = await axios.get<
          Pick<SeriesPoint, "date" | "actual" | "actualEarning">[]
        >(
          `${API_BASE}/api/dataformodel/${viewMode}`,
          authHeader()
        );

        // 2) predicted series + ε
        const predRes = await axios.get<{
          epsilon: number;
          series: Pick<
            SeriesPoint,
            "date" | "predicted" | "predictedEarning"
          >[];
        }>(
          `${API_BASE}/api/predicted/${viewMode}`,
          authHeader()
        );

        setEpsilon(predRes.data.epsilon);

        // build lookup maps
        const actualMap = Object.fromEntries(
          actualRes.data.map((d) => [
            d.date,
            { actual: d.actual, actualEarning: d.actualEarning },
          ])
        );
        const predMap = Object.fromEntries(
          predRes.data.series.map((d) => [
            d.date,
            { predicted: d.predicted, predictedEarning: d.predictedEarning },
          ])
        );

        // merge dates
        const allDates = Array.from(
          new Set([
            ...actualRes.data.map((d) => d.date),
            ...predRes.data.series.map((d) => d.date),
          ])
        ).sort();

        const merged: SeriesPoint[] = allDates.map((date) => ({
          date,
          actual: actualMap[date]?.actual ?? 0,
          actualEarning: actualMap[date]?.actualEarning ?? 0,
          predicted: predMap[date]?.predicted ?? 0,
          predictedEarning: predMap[date]?.predictedEarning ?? 0,
        }));

        // 3) overlay today's live servings
        const todayRes = await axios.get<
          { totalPlates: number; totalEarning: number }[]
        >(
          `${API_BASE}/api/servings`,
          authHeader()
        );
        const today = new Date().toISOString().split("T")[0];
        const sumServings = todayRes.data.reduce(
          (sum, s) => sum + (s.totalPlates || 0),
          0
        );
        const sumEarning = parseFloat(
          todayRes.data
            .reduce((sum, s) => sum + (s.totalEarning || 0), 0)
            .toFixed(2)
        );

        const todayPoint: SeriesPoint = {
          date: today,
          actual: sumServings,
          actualEarning: sumEarning,
          predicted: predMap[today]?.predicted ?? 0,
          predictedEarning: predMap[today]?.predictedEarning ?? 0,
        };

        const idx = merged.findIndex((pt) => pt.date === today);
        if (idx > -1) merged[idx] = todayPoint;
        else merged.push(todayPoint);

        setData(merged);
      } catch (err) {
        console.error("ChartSection fetch error:", err);
        setError("Unable to load chart data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [viewMode]);

  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const getVal = (key: string) =>
      payload.find((p: any) => p.dataKey === key)?.value ?? 0;

    return (
      <div className="rounded-md bg-white/90 p-3 shadow-md">
        <p className="mb-2 font-medium text-gray-700">{label}</p>
        {[
          ["predicted", "Predicted Servings", "bg-green-400"],
          ["actual", "Actual Servings", "bg-green-600"],
          ["predictedEarning", "Predicted Earning", "bg-blue-300"],
          ["actualEarning", "Actual Earning", "bg-blue-500"],
        ].map(([k, lbl, c]) => (
          <p key={k} className="mb-1 flex items-center text-xs text-gray-600">
            <span className={`mr-2 h-2 w-2 rounded-full ${c}`} />
            {lbl}: {getVal(k)}
          </p>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading chart…</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={className}
    >
      <Card className="p-6" glow>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Servings & Earnings: Actual vs Predicted
            </h2>
            {epsilon !== null && (
              <p className="text-sm text-gray-500">
                ε = {epsilon.toFixed(2)}
              </p>
            )}
          </div>
          <div className="space-x-2">
            {(["weekly", "monthly"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  viewMode === m
                    ? "bg-green-100 text-green-600"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-green-50"
                }`}
              >
                {m[0].toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#D1D5DB"
                tick={{ fill: "#6B7280" }}
              />
              <YAxis stroke="#D1D5DB" tick={{ fill: "#6B7280" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(v) => (
                  <span className="text-gray-600">{v}</span>
                )}
              />

              <Line
                dataKey="predicted"
                name="Predicted Servings"
                stroke="#4ADE80"
              />
              <Line
                dataKey="actual"
                name="Actual Servings"
                stroke="#16A34A"
              />
              <Line
                dataKey="predictedEarning"
                name="Predicted Earning"
                stroke="#93C5FD"
                strokeDasharray="5 5"
              />
              <Line
                dataKey="actualEarning"
                name="Actual Earning"
                stroke="#3B82F6"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default ChartSection;
