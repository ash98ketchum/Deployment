import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/NgoBadge';
import { 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  User,
  Package,
  Activity,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryNGO: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pickupHistory, setPickupHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/requests');
        const formatted = data.map((item: any) => ({
          id: item.id,
          date: '2025-06-14', // Static or replace with real date if available
          time: item.pickupStartTime || '00:00',
          partner: 'Local Partner',
          foodItem: item.name,
          quantity: item.quantity,
          volunteer: 'Auto-generated',
          status: item.status,
          notes: `Estimated value ₹${item.estimatedValue}`,
          photos: 0,
          impactScore: 80 + Math.floor(Math.random() * 10),
          beneficiaries: 5 + Math.floor(Math.random() * 10)
        }));
        setPickupHistory(formatted);
      } catch (error) {
        console.error('Failed to fetch pickup history:', error);
      }
    };

    fetchData();
  }, []);

  const filteredHistory = pickupHistory.filter(record =>
    record.foodItem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      'accepted': 'success',
      'pending': 'warning',
      'rejected': 'error',
    } as const;
    return variants[status as keyof typeof variants] || 'neutral';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pickup{' '}
            <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              History
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Record of your food rescue activities
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search food item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-gray-50 pr-10"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
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
              <p className="text-sm text-gray-600">No advanced filters added yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Timeline */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-900">Pickup Timeline</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredHistory.length === 0 ? (
            <div className="p-6 text-gray-500 text-center">No pickup history found.</div>
          ) : (
            filteredHistory.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex gap-4 items-center">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{record.date} at {record.time}</span>
                      <Badge variant={getStatusBadge(record.status)} size="sm">{record.status}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <MapPin className="w-4 h-4" />
                          Partner
                        </div>
                        <div className="font-medium text-gray-900">{record.partner}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <Package className="w-4 h-4" />
                          Food Item
                        </div>
                        <div className="font-medium text-gray-900">{record.foodItem}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Quantity</div>
                        <div className="font-medium text-gray-900">{record.quantity}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <User className="w-4 h-4" />
                          Volunteer
                        </div>
                        <div className="font-medium text-gray-900">{record.volunteer}</div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Notes:</div>
                      <div className="text-sm text-gray-900">{record.notes}</div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setSelectedRecord(selectedRecord === record.id ? null : record.id)
                    }
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600"
                  >
                    <FileText className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default HistoryNGO;
