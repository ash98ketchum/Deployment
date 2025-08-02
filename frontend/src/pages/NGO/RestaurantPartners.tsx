// src/pages/NGO/RestaurantPartners.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/NgoBadge';
import {
  Search,
  Plus,
  MapPin,
  Phone,
  Calendar,
  Edit,
  UserMinus,
  Star,
  TrendingUp,
  Users,
  Package,
  Filter,
  X,
  ChevronDown
} from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  cuisine: string;
  status: 'Active' | 'Inactive';
  lastPickup: string;
  totalDonations: number;
  totalPickups: number;
  rating: number;
  reliability: number;
}

interface PartnershipRequest {
  id: number;
  restaurantId: number;
  status: 'pending' | 'accepted' | 'rejected';
}

const RestaurantPartners: React.FC = () => {
  const [partners, setPartners]                 = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm]             = useState<string>('');
  const [statusFilter, setStatusFilter]         = useState<'all'|'active'|'inactive'>('all');
  const [outgoingRequests, setOutgoingRequests] = useState<PartnershipRequest[]>([]);
  const [showFilters, setShowFilters]           = useState<boolean>(false);

  // Load restaurants from backend
  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    axios.get<Partner[]>('/api/restaurants', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPartners(res.data))
    .catch(err => console.error('Failed to load restaurants', err));
  }, []);

  // Load outgoing partnership requests
  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    axios.get<PartnershipRequest[]>('/api/partnership-requests/outgoing', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setOutgoingRequests(res.data))
    .catch(err => console.error('Failed to load outgoing requests', err));
  }, []);

  // Send a new partnership request
  const sendRequest = async (restaurantId: number) => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await axios.post<PartnershipRequest>(
        '/api/partnership-requests',
        { restaurantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutgoingRequests(prev => [...prev, res.data]);
    } catch (err: any) {
      console.error('Error sending partnership request', err);
      alert(err.response?.data?.error || 'Failed to send request');
    }
  };

  // Safe filter: guard against null
  const filteredPartners = partners.filter(p => {
    const name    = p.name    ?? '';
    const cuisine = p.cuisine ?? '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      p.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Compute stats
  const activeCount    = partners.filter(p => p.status === 'Active').length;
  const totalDonations = partners.reduce((sum,p)=> sum + p.totalDonations, 0);
  const avgRating      = partners.length
    ? partners.reduce((sum,p)=> sum + p.rating, 0) / partners.length
    : 0;
  const totalPickups   = partners.reduce((sum,p)=> sum + p.totalPickups, 0);

  const stats = [
    { title:'Active Partners',  value:activeCount.toString(),        unit:'restaurants', icon:Users,       change:'+3 this month',      gradient:'from-green-500 to-green-600' },
    { title:'Total Donations',  value:totalDonations.toString(),     unit:'lbs saved',    icon:Package,     change:'+15% vs last month', gradient:'from-orange-500 to-orange-600' },
    { title:'Average Rating',   value:avgRating.toFixed(1),         unit:'out of 5.0',  icon:Star,        change:'Excellent service',   gradient:'from-yellow-500 to-yellow-600' },
    { title:'Total Pickups',    value:totalPickups.toString(),       unit:'completed',   icon:TrendingUp,  change:'+12% efficiency',   gradient:'from-blue-500 to-blue-600' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Header & Add Partner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Restaurant{' '}
            <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              Partners
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Manage your food donation network and build lasting partnerships
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center space-x-3 font-semibold"
        >
          <Plus className="w-5 h-5"/> <span>Add New Partner</span>
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="p-6 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white"/>
                  </div>
                  <Badge variant="success" size="sm">{stat.change}</Badge>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.unit}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input
              type="text"
              placeholder="Search partners by name or cuisine..."
              value={searchTerm}
              onChange={e=>setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-gray-50 transition-all duration-200 hover:bg-white"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e=>setStatusFilter(e.target.value as any)}
                className="appearance-none px-6 py-3 border border-gray-200 rounded-xl bg-gray-50 transition-all duration-200 hover:bg-white pr-10 focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(f=>!f)}
              className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4"/> <span>Filters</span>
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="text-sm text-gray-600 mb-2">Quick Filters:</div>
              <div className="flex flex-wrap gap-2">
                {['High Rating (4.5+)', 'Recent Pickups', 'High Volume', 'New Partners'].map(f => (
                  <button
                    key={f}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-100 hover:text-green-700 transition-colors duration-200"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner, idx) => {
          const already = outgoingRequests.find(r => r.restaurantId === partner.id);
          return (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden group cursor-pointer">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="w-14 h-14 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform duration-200"
                      >
                        <Users className="w-8 h-8 text-white"/>
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors duration-200">
                          {partner.name}
                        </h3>
                        <p className="text-sm text-gray-600">{partner.cuisine} Cuisine</p>
                      </div>
                    </div>
                    <Badge variant={partner.status === 'Active' ? 'success' : 'warning'} size="sm">
                      {partner.status}
                    </Badge>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2"/> {partner.address}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2"/> {partner.phone}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2"/> Last pickup: {partner.lastPickup}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="font-bold text-gray-900 text-lg">{partner.totalDonations}</div>
                      <div className="text-xs text-gray-600">Total Donated</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="font-bold text-gray-900 text-lg">{partner.totalPickups}</div>
                      <div className="text-xs text-gray-600">Pickups</div>
                    </div>
                  </div>

                  {/* Request Partnership Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!!already}
                    onClick={() => sendRequest(partner.id)}
                    className={`
                      w-full py-3 rounded-xl text-white font-medium
                      bg-gradient-to-r from-green-500 to-orange-500
                      ${already ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                    `}
                  >
                    {already ? already.status.toUpperCase() : 'Request Partnership'}
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantPartners;
