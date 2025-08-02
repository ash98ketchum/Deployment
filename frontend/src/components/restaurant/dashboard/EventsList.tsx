// frontend/src/components/restaurant/dashboard/EventsList.tsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import axios from "axios";

import Card from "@/components/ui/Card";

// Same interface for each event
export interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
}

interface EventsListProps {
  className?: string;
}

// ← Add this at the top:
const API_BASE =
  import.meta.env.VITE_API_URL /* e.g. "https://deployment-v0fc.onrender.com" */ ||
  "https://deployment-v0fc.onrender.com";

const EventsList: React.FC<EventsListProps> = ({ className = "" }) => {
  // 1) Local state for events, loading, and error
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2) Fetch events when component mounts
  useEffect(() => {
    axios
      .get<EventItem[]>(`${API_BASE}/api/events`)
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.error("Failed to load events:", err);
        setError("Could not load events");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 3) Helper to render time until/since event
  const renderStatus = (evtDate: string) => {
    const now = Date.now();
    const diff = new Date(evtDate).getTime() - now;
    if (diff < 0) return "Past";
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  };

  // 4) Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <Card className="p-6" glow>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Upcoming Events
          </h2>
          <p className="text-gray-500">Loading events…</p>
        </Card>
      </motion.div>
    );
  }

  // 5) Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <Card className="p-6" glow>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Upcoming Events
          </h2>
          <p className="text-red-500">{error}</p>
        </Card>
      </motion.div>
    );
  }

  // 6) No events fallback
  if (!events.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <Card className="p-6" glow>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Upcoming Events
          </h2>
          <p className="text-gray-500">No upcoming events</p>
        </Card>
      </motion.div>
    );
  }

  // 7) Render the list of events
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={className}
    >
      <Card className="p-6" glow>
        <h2 className="mb-6 flex items-center text-xl font-semibold text-gray-800">
          <Clock size={18} className="mr-2 text-green-600" />
          Upcoming Events
        </h2>

        <div className="space-y-4">
          {events.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="group flex flex-col space-y-1 rounded-2xl border border-green-200 bg-white p-4 shadow-sm transition-transform hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-gray-800 font-medium">{evt.title}</h3>
                <div className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {renderStatus(evt.date)}
                </div>
              </div>

              {evt.description && (
                <p className="text-gray-600 text-sm">{evt.description}</p>
              )}

              <div className="text-xs text-gray-500">
                {new Date(evt.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default EventsList;
