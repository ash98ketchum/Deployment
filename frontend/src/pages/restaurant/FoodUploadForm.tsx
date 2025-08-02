// src/pages/restaurant/FoodUpload.tsx

import React, { useState } from 'react';
import { Upload, Camera } from 'lucide-react';

interface FoodUploadForm {
  name: string;
  description: string;
  quantity: string;
  pickupStartTime: string;
  pickupEndTime: string;
  estimatedValue: string;
  dietaryTags: string[];
  image: string;
  expiryTime: string;
}

// ← Add this at the top:
const API_BASE =
  import.meta.env.VITE_API_URL /* e.g. "https://deployment-v0fc.onrender.com" */ ||
  "https://deployment-v0fc.onrender.com";

export default function RestaurantUpload() {
  const [form, setForm] = useState<FoodUploadForm>({
    name: '',
    description: '',
    quantity: '',
    pickupStartTime: '',
    pickupEndTime: '',
    estimatedValue: '',
    dietaryTags: [],
    image: '',
    expiryTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free',
    'High Protein', 'Low Carb', 'Organic', 'Fresh', 'Prepared Meal',
    'Bakery', 'Packaged', 'Frozen', 'Spicy', 'Kid-Friendly'
  ];

  const handleInputChange = (field: keyof FoodUploadForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setForm(prev => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter(t => t !== tag)
        : [...prev.dietaryTags, tag]
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/food`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || res.statusText);
      }

      alert('Item uploaded successfully');
      setForm({
        name: '',
        description: '',
        quantity: '',
        pickupStartTime: '',
        pickupEndTime: '',
        estimatedValue: '',
        dietaryTags: [],
        image: '',
        expiryTime: ''
      });
    } catch (err: any) {
      console.error('Error saving item to backend:', err);
      alert(`Error saving item: ${err.message}`);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Available Food</h1>
        <p className="text-gray-600">Share your surplus food with partner NGOs and reduce waste</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                {form.image ? (
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG or WEBP</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          {/* Name & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Grilled Chicken & Vegetables"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
              <input
                type="text"
                required
                value={form.quantity}
                onChange={e => handleInputChange('quantity', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 15 servings, 20 lbs, 25 items"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Brief description of the food item, preparation method, etc."
            />
          </div>

          {/* Times & Value */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Start Time *</label>
              <input
                type="time"
                required
                value={form.pickupStartTime}
                onChange={e => handleInputChange('pickupStartTime', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup End Time *</label>
              <input
                type="time"
                required
                value={form.pickupEndTime}
                onChange={e => handleInputChange('pickupEndTime', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Value ($)</label>
              <input
                type="number"
                value={form.estimatedValue}
                onChange={e => handleInputChange('estimatedValue', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    form.dietaryTags.includes(tag)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Food Item</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
