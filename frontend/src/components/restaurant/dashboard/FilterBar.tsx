// frontend/src/components/restaurant/dashboard/FilterBar.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, X } from "lucide-react";
import Button from "@/components/ui/Button"; // shared UI button
// Replace with your actual type or `any` if types folder is unused
import { FilterOptions, ConfidenceLevel } from "@/types";

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

const DEFAULT_FILTERS: FilterOptions = {
  dateRange: "week",
  confidenceLevel: ["medium", "high"],
  ingredientCount: [3, 7],
  savedAmount: [5, 20],
};

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [active, setActive] = useState<(keyof FilterOptions)[]>([
    "dateRange",
    "confidenceLevel",
  ]);

  const handleChange = <K extends keyof FilterOptions>(key: K, val: FilterOptions[K]) => {
    const next = { ...filters, [key]: val };
    setFilters(next);
    onFilterChange(next);
    if (!active.includes(key)) setActive([...active, key]);
  };

  const remove = (key: keyof FilterOptions) => {
    setActive(active.filter((k) => k !== key));
    handleChange(key, DEFAULT_FILTERS[key]);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Chips & Toggle */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-1 border-green-300 text-green-600"
          onClick={() => setIsOpen((o) => !o)}
        >
          <Filter size={16} />
          <span>Filters</span>
          <ChevronDown
            size={14}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>

        <AnimatePresence>
          {active.map((key) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex items-center space-x-1 rounded-full bg-green-50 px-2 py-1 text-xs text-gray-700"
            >
              {key === "dateRange" && <span>Time: {filters.dateRange}</span>}
              {key === "confidenceLevel" && (
                <span>Confidence: {filters.confidenceLevel.join(", ")}</span>
              )}
              {key === "ingredientCount" && (
                <span>
                  Ingredients: {filters.ingredientCount[0]}–
                  {filters.ingredientCount[1]}
                </span>
              )}
              {key === "savedAmount" && (
                <span>
                  Savings: ${filters.savedAmount[0]}–
                  {filters.savedAmount[1]}
                </span>
              )}
              <button
                onClick={() => remove(key)}
                className="p-0.5 text-gray-500 hover:text-green-600"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-80 rounded-lg bg-white/60 backdrop-blur-md p-4 shadow-lg z-50"
          >
            {/* Date Range */}
            <div className="pb-3">
              <h3 className="mb-2 text-sm font-semibold text-gray-800">
                Time Range
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {["today", "week", "month", "year"].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleChange("dateRange", val)}
                    className={`rounded-md px-2 py-1 text-xs transition ${
                      filters.dateRange === val
                        ? "bg-green-100 text-green-700"
                        : "bg-white hover:bg-green-50 text-gray-600"
                    }`}
                  >
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-200" />

            {/* Confidence Level */}
            <div className="py-3">
              <h3 className="mb-2 text-sm font-semibold text-gray-800">
                Confidence Level
              </h3>
              <div className="flex flex-wrap gap-2">
                {(["low", "medium", "high"] as ConfidenceLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      const arr = filters.confidenceLevel.includes(lvl)
                        ? filters.confidenceLevel.filter((x) => x !== lvl)
                        : [...filters.confidenceLevel, lvl];
                      handleChange("confidenceLevel", arr);
                    }}
                    className={`rounded-md px-2 py-1 text-xs transition ${
                      filters.confidenceLevel.includes(lvl)
                        ? "bg-green-100 text-green-700"
                        : "bg-white hover:bg-green-50 text-gray-600"
                    }`}
                  >
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 text-right">
              <Button size="sm" onClick={() => setIsOpen(false)}>
                Apply
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
