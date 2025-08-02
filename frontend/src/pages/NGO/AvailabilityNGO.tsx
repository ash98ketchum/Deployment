// src/pages/NGO/AvailabilityNGO.tsx

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/NgoBadge';
import {
  Clock,
  Package,
  TrendingUp,
  Users,
  ChefHat,
  MapPin,
  Eye,
  Timer,
  ShoppingCart,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FoodItem {
  id: string;
  name: string;
  description?: string;
  quantity: string;
  pickupStartTime: string;
  pickupEndTime: string;
  estimatedValue: string;
  dietaryTags: string[];
  image: string;
  expiryTime: string;
  restaurant: string;
  status: 'available' | 'reserved' | 'booked' | string;
  createdAt?: string;
  reservedAt?: string;
}

const AvailabilityNGO: React.FC = () => {
  const [foodItems, setFoodItems]       = useState<FoodItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showCart, setShowCart]         = useState(false);
  const [expandedId, setExpandedId]     = useState<string | null>(null);
  const [reservingIds, setReservingIds] = useState<Set<string>>(new Set());
  const [savingCart, setSavingCart]     = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [summary, setSummary] = useState({
    availableCount:     0,
    totalValue:         0,
    nearestExpiryHours: 0,
    activeRestaurants:  0,
  });

  // Load from API and compute summary
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/available-food', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error(res.statusText);
        const items: FoodItem[] = await res.json();
        setFoodItems(items);
        computeSummary(items);
      } catch (err) {
        console.error('Failed to load available-food:', err);
        setFoodItems([]);
        computeSummary([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  const computeSummary = (items: FoodItem[]) => {
    const available = items.filter(i => i.status === 'available');
    const totalVal  = available.reduce((sum, i) => sum + parseFloat(i.estimatedValue || '0'), 0);
    const restSet   = new Set(available.map(i => i.restaurant));
    const now       = Date.now();
    const hoursArr  = available.map(i => {
      const [h, m] = i.pickupEndTime.split(':').map(Number);
      const exp = new Date(); exp.setHours(h, m, 0, 0);
      return (exp.getTime() - now) / 36e5;
    });
    const nearest = hoursArr.length ? Math.max(0, Math.min(...hoursArr)) : 0;

    setSummary({
      availableCount:     available.length,
      totalValue:         Math.floor(totalVal),
      nearestExpiryHours: Math.floor(nearest),
      activeRestaurants:  restSet.size,
    });
  };

  // Reserve / Unreserve handlers
  const toggleReserve = async (item: FoodItem) => {
    const url = item.status === 'available'
      ? '/api/reserve-food'
      : '/api/unreserve-food';

    setReservingIds(s => new Set(s).add(item.id));

    try {
      const token = localStorage.getItem('token');
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: item.id }),
      });
      if (!r.ok) throw new Error(r.statusText);

      setFoodItems(prev =>
        prev.map(f =>
          f.id === item.id
            ? { ...f, status: f.status === 'available' ? 'reserved' : 'available' }
            : f
        )
      );
      computeSummary(
        foodItems.map(f =>
          f.id === item.id
            ? { ...f, status: f.status === 'available' ? 'reserved' : 'available' }
            : f
        )
      );
    } catch (err) {
      console.error('toggleReserve error:', err);
      alert('Action failed');
    } finally {
      setReservingIds(s => {
        const c = new Set(s);
        c.delete(item.id);
        return c;
      });
    }
  };

  // Time-left for pickup
  const calculateTimeLeft = (timeStr = '') => {
    if (!timeStr) return 'N/A';
    const [h, m] = timeStr.split(':').map(Number);
    const now = new Date(), exp = new Date();
    exp.setHours(h, m, 0, 0);
    const diff = exp.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';
    const hrs  = Math.floor(diff / 36e5),
          mins = Math.floor((diff % 36e5) / 6e4);
    return `${hrs > 0 ? `${hrs} hr ` : ''}${mins} min left`;
  };

  // Save cart items and mark them booked
  const saveCart = async () => {
    setSavingCart(true);
    setSavedSuccess(false);
    const toSave = foodItems.filter(i => i.status === 'reserved');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/save-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: toSave }),
      });
      if (!res.ok) throw new Error(res.statusText);
      setFoodItems(prev =>
        prev.map(i => i.status === 'reserved' ? { ...i, status: 'booked' } : i)
      );
      setSavedSuccess(true);
    } catch (err) {
      console.error('Failed to save cart:', err);
      alert('Failed to save cart');
    } finally {
      setSavingCart(false);
    }
  };

  // Stats card data
  const statCards = [
    {
      title: 'Available Items',
      value: summary.availableCount,
      unit: 'ready for pickup',
      icon: Package,
      gradient: 'from-green-500 to-green-600',
      badge: `+${summary.availableCount} new`
    },
    {
      title: 'Total Value',
      value: `₹${summary.totalValue}`,
      unit: 'estimated worth',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-orange-600',
      badge: '+₹0 today'
    },
    {
      title: 'Nearest Expiry',
      value: `${summary.nearestExpiryHours}h`,
      unit: 'time remaining',
      icon: Clock,
      gradient: 'from-red-500 to-red-600',
      badge: 'Act fast!'
    },
    {
      title: 'Partner Restaurants',
      value: summary.activeRestaurants,
      unit: 'active donors',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      badge: 'Growing'
    }
  ];

  // Cart panel items include reserved & booked
  const reservedItems = foodItems.filter(i => i.status === 'reserved' || i.status === 'booked');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Available{' '}
            <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              Food
            </span>
          </h1>
          <p className="text-gray-600">Live updates from restaurants</p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-50"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart ({reservedItems.length})</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card className="p-6 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="success" size="sm">{stat.badge}</Badge>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.unit}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Food Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : foodItems.length === 0 ? (
        <p className="text-center text-gray-500">No available food at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="overflow-hidden group flex flex-col h-full">
                {/* IMAGE + BADGE + TIMER */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      size="sm"
                      variant={
                        item.status === 'available'
                          ? 'success'
                          : item.status === 'reserved'
                            ? 'warning'
                            : 'secondary'
                      }
                    >
                      {item.status === 'booked' ? 'booked' : item.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                    <Timer className="w-3 h-3" />
                    <span>{calculateTimeLeft(item.pickupEndTime)}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                    ₹{item.estimatedValue}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="px-6 pb-6 flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <ChefHat className="w-4 h-4 mr-2" />
                    <span>{item.restaurant}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Nearby</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.dietaryTags?.map((tag, i) => (
                      <Badge key={i} variant="info" size="sm">{tag}</Badge>
                    ))}  
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Quantity</div>
                      <div className="font-semibold text-gray-900">{item.quantity}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Pickup Window</div>
                      <div className="font-semibold text-gray-900">
                        {item.pickupStartTime} - {item.pickupEndTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => toggleReserve(item)}
                    disabled={
                      reservingIds.has(item.id) ||
                      calculateTimeLeft(item.pickupEndTime) === 'Expired' ||
                      item.status === 'booked'
                    }
                    className={`w-full py-2 rounded-xl text-sm font-medium text-white transition
                      ${item.status === 'available'
                        ? 'bg-green-500 hover:bg-green-600'
                        : item.status === 'reserved'
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'bg-gray-400 cursor-not-allowed'}
                      ${reservingIds.has(item.id) ||
                        calculateTimeLeft(item.pickupEndTime) === 'Expired'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''}`}
                  >
                    {reservingIds.has(item.id)
                      ? 'Processing…'
                      : calculateTimeLeft(item.pickupEndTime) === 'Expired'
                        ? 'Expired'
                        : item.status === 'available'
                          ? 'Reserve Now'
                          : item.status === 'reserved'
                            ? 'Unreserve'
                            : 'Booked'}
                  </button>
                </div>

                {/* EXPANDED SECTION */}
                {expandedId === item.id && (
                  <div className="border-t px-6 pb-6 bg-gray-50">
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Description:</strong> {item.description || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Published:</strong> {item.expiryTime}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* CART PANEL */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-800">×</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {reservedItems.length === 0 ? (
                <p className="text-gray-500">No reserved items.</p>
              ) : (
                reservedItems.map(item => (
                  <Card key={item.id} className="p-3 flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <button
              onClick={saveCart}
              disabled={savingCart || reservedItems.length === 0}
              className={`mt-4 w-full py-2 rounded-xl text-white font-semibold transition ${
                savingCart ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {savingCart
                ? 'Saving…'
                : savedSuccess
                  ? <span className="flex items-center justify-center"><CheckCircle className="w-5 h-5 mr-2" />Saved!</span>
                  : 'Save Cart'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvailabilityNGO;
