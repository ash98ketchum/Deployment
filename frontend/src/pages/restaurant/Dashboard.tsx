// src/pages/restaurant/Dashboard.tsx

import React, { useState } from "react";
import FilterBar from "@/components/restaurant/dashboard/FilterBar";
import MetricCard from "@/components/restaurant/dashboard/MetricCard";
import ChartSection from "@/components/restaurant/dashboard/ChartSection";
import EventsList from "@/components/restaurant/dashboard/EventsList";
import PredictionsSection from "@/components/restaurant/dashboard/PredictionSection";

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState({} as any);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Filter Bar */}
      <FilterBar onFilterChange={(f) => setFilters(f)} className="mb-6" />

      {/* Top metrics */}
      <MetricCard />

      {/*
        Use a 3-column grid on md+:
          - Chart spans 2 columns (2/3 width)
          - Events spans 1 column (1/3 width)
        Falls back to single column on smaller screens
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Chart takes up 2/3 of the width */}
        <div className="md:col-span-2">
          <ChartSection />
        </div>

        {/* Events list takes 1/3 of the width */}
        <div className="">
          <EventsList />
        </div>
      </div>

      {/* Dish Predictions */}
      <PredictionsSection />
    </div>
  );
};

export default Dashboard;
