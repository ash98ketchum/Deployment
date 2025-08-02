// frontend/src/pages/public/FoodDetails.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  Users,
  Filter,
  ChefHat,
  Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*                                Types                               */
/* ------------------------------------------------------------------ */
interface FoodItem {
  id: string;
  dishName: string;
  restaurant: string;
  quantity: number;
  location: string;
  timeLeft: number; // minutes till expiry
  category: string;
  rating: number;
  description: string;
  dietaryInfo: string[];
}

/* ------------------------------------------------------------------ */
/*                      Stubbed data (replace later)                   */
/* ------------------------------------------------------------------ */
const demoItems: FoodItem[] = [
  {
    id: "1",
    dishName: "Fresh Garden Salads",
    restaurant: "Green Garden Cafe",
    quantity: 25,
    location: "Downtown SF",
    timeLeft: 120,
    category: "vegetarian",
    rating: 4.8,
    description:
      "Mixed greens with seasonal vegetables and house dressing.",
    dietaryInfo: ["Vegetarian", "Gluten-Free", "Vegan"],
  },
  {
    id: "2",
    dishName: "Grilled Chicken Meals",
    restaurant: "Urban Kitchen",
    quantity: 15,
    location: "Mission District",
    timeLeft: 45,
    category: "meat",
    rating: 4.6,
    description:
      "Herb-marinated chicken with roasted vegetables.",
    dietaryInfo: ["High Protein", "Keto-Friendly"],
  },
  {
    id: "3",
    dishName: "Pasta Primavera",
    restaurant: "Bella Vista",
    quantity: 30,
    location: "Castro Valley",
    timeLeft: 180,
    category: "vegetarian",
    rating: 4.7,
    description:
      "Fresh pasta with seasonal vegetables in a light sauce.",
    dietaryInfo: ["Vegetarian"],
  },
  {
    id: "4",
    dishName: "Asian Stir Fry",
    restaurant: "Wok This Way",
    quantity: 20,
    location: "Chinatown",
    timeLeft: 90,
    category: "mixed",
    rating: 4.5,
    description:
      "Mixed vegetables & protein in savoury sauce with rice.",
    dietaryInfo: ["Dairy-Free"],
  },
  {
    id: "5",
    dishName: "Soup & Sandwich Combo",
    restaurant: "Corner Deli",
    quantity: 40,
    location: "Financial District",
    timeLeft: 60,
    category: "mixed",
    rating: 4.4,
    description:
      "Hearty soup with a variety of fresh sandwiches.",
    dietaryInfo: ["Comfort Food"],
  },
  {
    id: "6",
    dishName: "Fresh Fruit Platters",
    restaurant: "Healthy Bites",
    quantity: 10,
    location: "SOMA",
    timeLeft: 30,
    category: "fruit",
    rating: 4.9,
    description:
      "Seasonal fruit, cut and beautifully arranged.",
    dietaryInfo: ["Vegan", "Raw", "Gluten-Free"],
  },
];

/* ------------------------------------------------------------------ */
/*                                Page                                */
/* ------------------------------------------------------------------ */
const FoodDetails: React.FC = () => {
  const [items] = useState<FoodItem[]>(demoItems);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [loc, setLoc] = useState("all");

  /* ──────  Filter helpers  ────── */
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "meat", label: "Meat Dishes" },
    { value: "mixed", label: "Mixed" },
    { value: "fruit", label: "Fruits & Desserts" },
  ] as const;

  const locations = [
    { value: "all", label: "All Locations" },
    "Downtown SF",
    "Mission District",
    "Castro Valley",
    "Chinatown",
    "Financial District",
    "SOMA",
  ].map((l) => (typeof l === "string" ? { value: l, label: l } : l));

  const visible = items.filter(
    (f) =>
      (cat === "all" || f.category === cat) &&
      (loc === "all" || f.location === loc) &&
      (f.dishName.toLowerCase().includes(search.toLowerCase()) ||
        f.restaurant.toLowerCase().includes(search.toLowerCase()))
  );

  const timeFmt = (m: number) =>
    m < 60 ? `${m} m` : `${Math.floor(m / 60)} h ${m % 60 ? m % 60 + " m" : ""}`;

  const urgencyClass = (m: number) =>
    m <= 30
      ? "bg-red-100 text-red-700 border-red-200"
      : m <= 60
      ? "bg-orange-100 text-orange-700 border-orange-200"
      : "bg-green-100 text-green-700 border-green-200";

  /* ──────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ───────  Header  ─────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Available Food
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Browse and request pickup for fresh food donations from local
            restaurants.
          </p>
        </motion.div>

        {/* ───────  Filters  ─────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food or restaurant…"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-green-500"
              >
                {categories.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <select
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-green-500"
              >
                {locations.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Showing {visible.length} available food
            {visible.length === 1 ? " item" : " items"}
          </p>
        </motion.div>

        {/* ───────  Grid  ─────── */}
        <AnimatePresence>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg"
              >
                <div className="p-6 pb-4">
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <span className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                      <ChefHat className="h-5 w-5 text-orange-600" />
                      {f.restaurant}
                    </span>

                    <span className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {f.rating}
                      </span>
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {f.dishName}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {f.description}
                  </p>

                  {/* Diet tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {f.dietaryInfo.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <p className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Serves {f.quantity} people</span>
                    </p>
                    <p className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{f.location}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Expires in</span>
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${urgencyClass(
                          f.timeLeft
                        )}`}
                      >
                        {timeFmt(f.timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-lg bg-gradient-to-r from-green-600 to-green-700 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-green-700 hover:to-green-800"
                  >
                    Request Pickup
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Empty state */}
        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No food items found
            </h3>
            <p className="mb-6 text-gray-600">
              Try adjusting your search or come back soon for new donations.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearch("");
                setCat("all");
                setLoc("all");
              }}
              className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-green-700"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FoodDetails;
