import React from "react";
import { motion } from "framer-motion";
import { Utensils } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

// ⇢ Export the interface so PredictionsSection can import it:
export interface Prediction {
  dishName: string;
  imageUrl: string;
  ingredients: string[];
  predictedValue: number;
  actualValue: number;
  saved: number;
  confidence: number; // 0–100
}

interface PredictionCardProps {
  prediction: Prediction;
  index: number;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, index }) => {
  const accuracy =
    prediction.actualValue > 0
      ? 100 -
        Math.abs(
          ((prediction.actualValue - prediction.predictedValue) /
            prediction.actualValue) *
            100
        )
      : 0;

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
      className="w-full"
    >
      <Card className="overflow-visible bg-white hover:shadow-lg" glow={false}>
        <div className="flex flex-col md:flex-row items-center md:items-start p-4">
          {/* icon */}
          <div className="flex-shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <Utensils className="h-10 w-10 text-green-600" />
            </div>
          </div>

          {/* details */}
          <div className="mt-4 md:mt-0 md:ml-4 flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {prediction.dishName}
              </h3>
              <Badge
                confidence={prediction.confidence}
                showLabel={false}
                className="!absolute !top-2 !right-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
              <div>
                <p className="font-medium text-green-600">
                  ${prediction.predictedValue.toFixed(2)}
                </p>
                <p className="mt-1">Predicted Value</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  ${prediction.actualValue.toFixed(2)}
                </p>
                <p className="mt-1">Actual Value</p>
              </div>
              <div>
                <p className="font-medium text-green-500">
                  {accuracy.toFixed(1)}%
                </p>
                <p className="mt-1">Accuracy</p>
              </div>
              <div>
                <p className="font-medium text-green-600">
                  ${prediction.saved.toFixed(2)}
                </p>
                <p className="mt-1">Savings</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PredictionCard;
