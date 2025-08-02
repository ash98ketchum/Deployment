// src/pages/restaurant/Events.tsx

import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

// ← Add this at the top:
const API_BASE =
  import.meta.env.VITE_API_URL /* e.g. "https://deployment-v0fc.onrender.com" */ ||
  "https://deployment-v0fc.onrender.com";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState<Partial<EventItem>>({
    title: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get<EventItem[]>(`${API_BASE}/api/events`);
      if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        console.warn("Expected events array, got:", res.data);
        setEvents([]);
      }
    } catch (err) {
      console.error("Failed to load events", err);
      setEvents([]);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addEvent = async () => {
    if (!form.title || !form.date) {
      alert("Title & Date are required");
      return;
    }

    const newEvt: EventItem = {
      id: Date.now().toString(),
      title: form.title!,
      description: form.description || "",
      date: form.date!,
    };

    try {
      await axios.post(`${API_BASE}/api/events`, newEvt);
      setForm({ title: "", description: "", date: "" });
      fetchEvents();
    } catch (err) {
      console.error("Failed to add event", err);
      alert("Could not add event.");
    }
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(
        `${API_BASE}/api/events/${encodeURIComponent(id)}`
      );
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event", err);
      alert("Could not delete event.");
    }
  };

  const list = Array.isArray(events) ? events : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Add Event Form */}
      <Card className="p-6 bg-gray-100" glow={false}>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Add New Event
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-700">Title *</label>
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              placeholder="Event Title"
              className="w-full rounded-md border border-gray-200 p-2 text-black focus:ring-2 focus:ring-green-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Date *</label>
            <input
              type="date"
              name="date"
              value={form.date || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-200 p-2 text-black focus:ring-2 focus:ring-green-200"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-gray-700">Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description || ""}
              onChange={handleChange}
              placeholder="Event Description"
              className="w-full rounded-md border border-gray-200 p-2 text-black focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>
        <div className="mt-4 text-right">
          <Button variant="solid" size="md" onClick={addEvent}>
            Add Event
          </Button>
        </div>
      </Card>

      {/* Event List */}
      {list.length === 0 ? (
        <p className="text-gray-500">No events to show.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((evt) => (
            <Card
              key={evt.id}
              className="relative p-6 bg-gray-100"
              glow={false}
            >
              <button
                onClick={() => deleteEvent(evt.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
              <h3 className="mb-2 text-xl font-semibold text-green-600">
                {evt.title}
              </h3>
              {evt.description && (
                <p className="mb-2 text-gray-700">{evt.description}</p>
              )}
              <p className="text-sm text-gray-600">
                Date:{" "}
                {new Date(evt.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
