"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Info } from "lucide-react";

const dishImages: Record<string, string> = {
  "Rajma Chawal": "/images/rajma-chawal.jpg",
  "Biryani": "/images/biryani.jpg",
  "Idli Sambhar": "/images/idli-sambhar.jpg",
  "Aloo Paratha": "/images/aloo-paratha.jpg",
  "Chole Bhature": "/images/chole-bhature.jpg",
  "Vegetable Pulao": "/images/pulao.jpg",
};

interface DishPrediction {
  dishName: string;
  qValue: number;
  count: number;
  isBest: boolean;
}

const History = () => {
  const [predictions, setPredictions] = useState<DishPrediction[]>([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/predictions");
        const data: DishPrediction[] = await res.json();
        setPredictions(data);
      } catch (err) {
        console.error("Failed to fetch predictions", err);
      }
    };
    fetchPredictions();
  }, []);

  if (predictions.length === 0) {
    return <div className="text-center py-10 text-gray-500">Loading predictions...</div>;
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Prediction History</h1>

      {/* Hardcoded Date Group (you can fetch it dynamically too) */}
      {/* <div className="text-sm text-gray-500 flex items-center gap-2 mb-4">
        <CalendarDays size={16} />
        Thursday, May 29, 2025
      </div> */}

      <div className="space-y-4">
        {predictions.map((pred) => (
          <motion.div
            key={pred.dishName}
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between bg-white rounded-xl shadow-sm px-4 py-3 border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <img
                src={dishImages[pred.dishName] || "/images/default.jpg"}
                alt={pred.dishName}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-base font-semibold text-gray-800">{pred.dishName}</h3>
                <p className="text-xs text-gray-500">
                  {pred.count} selections · ${pred.qValue.toFixed(2)} saved
                </p>
              </div>
            </div>

            <div className="text-right text-sm">
              <p className="text-green-700 font-medium">
                Predicted: ${pred.qValue.toFixed(2)}
              </p>
              <p className="text-gray-500 text-xs">Actual: ${Math.random().toFixed(2)}</p>
              {pred.isBest && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                  Best Action
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default History;
