// frontend/src/components/restaurant/dashboard/PredictionSection.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import PredictionCard, { Prediction } from "./PredictionCard";

interface RawPredictions {
  trainedAt: string;
  epsilon: number;
  dishes: string[];
  q_values: number[];
  counts: number[];
  averageRewards: Record<string, number>;
  bestAction: { dish: string; value: number };
}

// ← Add this constant at the top:
const API_BASE =
  import.meta.env.VITE_API_URL /* e.g. "https://deployment-v0fc.onrender.com" */ ??
  "https://deployment-v0fc.onrender.com";

const PredictionSection: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1) Load your static bandit summary (no auth needed)
        const { data: summary } = await axios.get<RawPredictions>(
          `${API_BASE}/data/predicted.json`
        );

        // 2) Load today's actual servings (requires auth header if set globally)
        const { data: servings } = await axios.get<
          { name: string; totalEarning: number }[]
        >(`${API_BASE}/api/servings`);

        // Build an actual‐earnings map
        const actualMap: Record<string, number> = {};
        servings.forEach((s) => {
          actualMap[s.name] = (actualMap[s.name] || 0) + s.totalEarning;
        });

        // Total selection count → for confidence
        const totalCount =
          summary.counts.reduce((sum, c) => sum + c, 0) || 1;

        // 3) Map into your Prediction interface
        const list: Prediction[] = summary.dishes.map((dish, i) => {
          const predictedValue = summary.averageRewards[dish] || 0;
          const actualValue = actualMap[dish] || 0;
          const saved = actualValue - predictedValue;
          const confidence = Math.round(
            (summary.counts[i] / totalCount) * 100
          );

          return {
            dishName: dish,
            imageUrl: `/images/${encodeURIComponent(dish)}.jpg`, // placeholder
            ingredients: [], // fill if you have this data
            predictedValue,
            actualValue,
            saved,
            confidence,
          };
        });

        // 4) Show top 5 by predictedValue
        list.sort((a, b) => b.predictedValue - a.predictedValue);
        setPredictions(list.slice(0, 5));
      } catch (err) {
        console.error("Failed to load predictions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>;
  }
  if (!predictions.length) {
    return (
      <div className="py-8 text-center text-gray-500">
        No predictions available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Top Dish Predictions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.map((p, idx) => (
          <PredictionCard key={p.dishName} prediction={p} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default PredictionSection;
