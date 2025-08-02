// src/pages/restaurant/TodaysServing.tsx

import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { Plus, Trash, Database } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface Serving {
  id: string;
  name: string;
  costPerPlate: number;
  totalIngredientsCost: number;
  totalPlates: number;
  platesWasted: number;
  totalEarning: number;
  remark?: string;
}

interface FormState {
  name: string;
  customName: string;
  costPerPlate: string;
  totalIngredientsCost: string;
  totalPlates: string;
  platesWasted: string;
  remark: string;
}

// ← Add this at the top:
const API_BASE =
  import.meta.env.VITE_API_URL /* e.g. "https://deployment-v0fc.onrender.com" */ ||
  "https://deployment-v0fc.onrender.com";

const commonDishes = [
  "Paneer Butter Masala", "Chole Bhature", "Masala Dosa", "Biryani",
  "Rajma Chawal", "Aloo Paratha", "Butter Chicken", "Dal Makhani",
  "Idli Sambhar", "Pav Bhaji", "Pani Puri", "Kadhi Chawal",
  "Vegetable Pulao", "Samosa", "Dhokla", "Chicken Tikka Masala",
  "Fish Curry", "Matar Paneer", "Palak Paneer", "Egg Curry",
  "Naan", "Roti", "Paratha", "Keema Pulao", "Veg Fried Rice",
  "Egg Fried Rice", "Gulab Jamun", "Ras Malai", "Kheer",
  "Lassi", "Masala Chai", "Other"
];

const TodaysServing: React.FC = () => {
  const [servings, setServings] = useState<Serving[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    customName: "",
    costPerPlate: "",
    totalIngredientsCost: "",
    totalPlates: "",
    platesWasted: "",
    remark: "",
  });

  useEffect(() => {
    fetchServings();
  }, []);

  const fetchServings = async () => {
    try {
      const res = await axios.get<Serving[]>(`${API_BASE}/api/servings`);
      setServings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch servings failed:", err);
      setServings([]);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addServing = async () => {
    const c = parseFloat(form.costPerPlate);
    const i = parseFloat(form.totalIngredientsCost);
    const t = parseInt(form.totalPlates, 10);
    const w = parseInt(form.platesWasted, 10);

    if ([c, i, t, w].some(isNaN) || t <= 0) {
      return alert("Please enter valid numbers and ensure total plates > 0.");
    }

    const payload = {
      name: form.name === "Other" ? form.customName : form.name,
      costPerPlate: c,
      totalIngredientsCost: i,
      totalPlates: t,
      platesWasted: w,
      totalEarning: +((c - i / t) * (t - w)).toFixed(2),
      remark: form.remark || undefined,
    };

    // optimistic UI update
    setServings(prev => [
      ...prev,
      { id: `temp-${Date.now()}`, ...payload },
    ]);

    setForm({
      name: "",
      customName: "",
      costPerPlate: "",
      totalIngredientsCost: "",
      totalPlates: "",
      platesWasted: "",
      remark: "",
    });

    try {
      await axios.post(`${API_BASE}/api/servings`, payload);
      fetchServings();
    } catch (err) {
      console.error("Could not save to server:", err);
      alert("Saved locally but failed to persist to server.");
    }
  };

  const removeServing = async (id: string) => {
    try {
      await axios.delete(
        `${API_BASE}/api/servings/${encodeURIComponent(id)}`
      );
      fetchServings();
    } catch (err) {
      console.error("Remove serving failed:", err);
      alert("Could not remove serving.");
    }
  };

  const archiveForModel = async () => {
    if (!window.confirm("Archive today’s data for model training?")) return;
    try {
      await axios.post(`${API_BASE}/api/archive`);
      alert("Archived!");
    } catch {
      alert("Archive failed.");
    }
  };

  const list = servings;

  const totalEarnings = list.reduce((sum, s) => sum + s.totalEarning, 0);
  const totalWasteCost = list.reduce(
    (sum, s) => sum + s.platesWasted * s.costPerPlate,
    0
  );

  const summaryItems = [
    { title: "Total Earnings", value: `$${totalEarnings.toFixed(2)}` },
    { title: "Food Waste",    value: `$${totalWasteCost.toFixed(2)}` },
    {
      title: "Net Savings",
      value: `$${(totalEarnings - totalWasteCost).toFixed(2)}`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-end">
        <Button variant="outline" size="md" onClick={archiveForModel}>
          <Database size={18} className="mr-2" />
          Save Data for Model Training
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryItems.map(({ title, value }) => (
          <Card key={title} className="p-6 text-center bg-gray-100" glow={false}>
            <h4 className="text-lg font-medium text-gray-700">{title}</h4>
            <p className="mt-2 text-2xl font-bold text-green-600">{value}</p>
          </Card>
        ))}
      </div>

      {/* Servings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map(s => (
          <Card key={s.id} className="relative p-6 bg-gray-100" glow={false}>
            <button
              onClick={() => removeServing(s.id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <Trash size={18} />
            </button>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              {s.name}
            </h3>
            <p className="text-gray-600">Made: {s.totalPlates}</p>
            <p className="text-gray-600">Wasted: {s.platesWasted}</p>
            <p className="text-gray-600">
              Cost: ${s.totalIngredientsCost.toFixed(2)}
            </p>
            <p className="text-gray-600">
              Earned: ${s.totalEarning.toFixed(2)}
            </p>
            {s.remark && (
              <p className="mt-2 italic text-sm text-gray-500">“{s.remark}”</p>
            )}
          </Card>
        ))}
      </div>

      {/* Add Serving Form */}
      <Card className="p-8 bg-gray-100" glow={false}>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Add Serving
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-700">Dish Name</label>
            <select
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-200 p-2 text-black focus:ring-2 focus:ring-green-200"
            >
              <option value="" disabled>Select a Dish</option>
              {commonDishes.map(dish => (
                <option key={dish} value={dish}>{dish}</option>
              ))}
            </select>
          </div>

          {form.name === "Other" && (
            <div>
              <label className="block mb-1 text-gray-700">Custom Dish Name</label>
              <input
                type="text"
                name="customName"
                value={form.customName}
                onChange={handleChange}
                placeholder="Enter custom dish name"
                className="w-full rounded-md border border-gray-200 p-2 text-black focus:ring-2 focus:ring-green-200"
              />
            </div>
          )}

          {[
            { label: "Cost Per Serving ($)", name: "costPerPlate",         type: "number", placeholder: "0.00" },
            { label: "Total Ingredients Cost ($)", name: "totalIngredientsCost", type: "number", placeholder: "0.00" },
            { label: "Total Servings",        name: "totalPlates",          type: "number", placeholder: "0" },
            { label: "Plates Wasted",         name: "platesWasted",         type: "number", placeholder: "0" },
            { label: "Remark",                name: "remark",               type: "text",   placeholder: "Optional remark" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block mb-1 text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={(form as any)[name]}
                placeholder={placeholder}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-200 p-2 text-black focus:ring-2 focus:ring-green-200"
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button variant="solid" size="md" onClick={addServing}>
            <Plus size={18} className="mr-2" /> Add Serving
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TodaysServing;
