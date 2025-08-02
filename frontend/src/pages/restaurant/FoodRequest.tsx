// src/pages/restaurant/FoodRequest.tsx

import React, { useState, useEffect } from 'react';
import {
  Check,
  X,
  Clock,
  MapPin,
  Phone,
  User,
  MessageCircle
} from 'lucide-react';

export interface FoodRequest {
  id: string;
  ngoName: string;
  ngoContact: string;
  items: Array<{
    id: string;
    name: string;
    quantity: string;
    requestedQuantity: number;
  }>;
  totalValue: number;
  requestedAt: Date;
  status: 'booked' | 'accepted' | 'rejected';
  notes?: string;
  pickupTime?: string;
}

export default function FoodRequest() {
  const [requests, setRequests] = useState<FoodRequest[]>([]);

  // Load all requests from requests.json
  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    fetch('/api/requests', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: any[]) => {
        const mapped: FoodRequest[] = data.map(f => ({
          id:            f.id,
          ngoName:       f.restaurant,
          ngoContact:    '—',
          items:         [{ id: f.id, name: f.name, quantity: f.quantity, requestedQuantity: 1 }],
          totalValue:    parseFloat(f.estimatedValue),
          requestedAt:   new Date(f.reservedAt),
          status:        f.status,
          notes:         '',
          pickupTime:    `${f.pickupStartTime} - ${f.pickupEndTime}`
        }));
        setRequests(mapped);
      })
      .catch(console.error);
  }, []);

  // Accept / Reject handler
  const handleRequestAction = (id: string, action: 'accept' | 'reject') => {
    const token = localStorage.getItem('token') || '';
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';

    // Update UI immediately
    setRequests(rs =>
      rs.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );

    // Persist change
    fetch(`/api/requests/${id}/status`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    }).catch(console.error);

    alert(`Request ${newStatus}. NGO has been notified.`);
  };

  // Helpers for styling
  const getStatusColor = (s: string) => ({
    booked:   'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  } as Record<string,string>)[s] || 'bg-gray-100 text-gray-800';

  const getStatusIcon = (s: string) => ({
    booked:   <Clock className="w-4 h-4" />,
    accepted: <Check className="w-4 h-4" />,
    rejected: <X className="w-4 h-4" />
  } as Record<string,JSX.Element>)[s] || <Clock className="w-4 h-4" />;

  // Split into pending (booked) and completed (accepted/rejected)
  const pendingRequests   = requests.filter(r => r.status === 'booked');
  const completedRequests = requests.filter(r => r.status !== 'booked');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Food Requests</h1>
        <p className="text-gray-600">Manage requests from NGO partners</p>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pending Requests</h2>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {pendingRequests.length} pending
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No pending requests at the moment</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingRequests.map(request => (
              <div key={request.id} className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.ngoName}</h3>
                      <p className="text-sm text-gray-600">
                        Requested {request.requestedAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">{request.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{request.ngoContact}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pickup Time</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{request.pickupTime}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Requested Items</h4>
                  <div className="space-y-2">
                    {request.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-white rounded border">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-gray-600 ml-2">({item.quantity})</span>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          {item.requestedQuantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {request.notes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                    <div className="bg-white p-3 rounded border flex items-start space-x-2">
                      <MessageCircle className="w-4 h-4 text-gray-500 mt-0.5" />
                      <p className="text-sm text-gray-600">{request.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-bold text-green-600">
                    ₹{request.totalValue}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleRequestAction(request.id, 'reject')}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleRequestAction(request.id, 'accept')}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Requests */}
      {completedRequests.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {completedRequests.map(request => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{request.ngoName}</h3>
                    <p className="text-sm text-gray-600">
                      {request.items.length} item(s) • ₹{request.totalValue}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {request.requestedAt.toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">{request.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
