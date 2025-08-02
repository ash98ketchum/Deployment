import React, { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import axios from "axios";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function RestaurantChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi! I'm SmartMeal AI. Type 'upload today' to auto-upload today's servings." },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showHi, setShowHi] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowHi(true);
      setTimeout(() => setShowHi(false), 1500);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const getTimeWindows = () => {
    const now = new Date();
    const startTime = now.toTimeString().slice(0, 5); // HH:MM format
    const maxEnd = new Date(Date.now() + 4 * 60 * 60 * 1000); // +4 hours
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 0, 0);
    const endTime = maxEnd > todayEnd ? "23:59" : maxEnd.toTimeString().slice(0, 5);
    const expiryTime = new Date().toISOString().split("T")[0] + "T" + endTime + ":00";
    return { startTime, endTime, expiryTime };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    if (input.toLowerCase().includes("upload today")) {
      try {
        const res = await axios.get("/data/todaysserving.json");
        const todayData = res.data;

        if (todayData && Array.isArray(todayData) && todayData.length > 0) {
          console.log("Today's data received from JSON:", todayData);
          const uploaded: string[] = [];

          for (const item of todayData) {
            if (!item || !item.name) {
              console.warn("Skipped invalid item:", item);
              continue;
            }

            const { startTime, endTime, expiryTime } = getTimeWindows();

            const payload = {
              name: item.name,
              description: `Made ${item.totalPlates || 0} servings, Wasted ${item.platesWasted || 0}, Cost per plate ${item.costPerPlate || 0}`,
              quantity: `${item.totalPlates || 0} servings`,
              pickupStartTime: startTime,
              pickupEndTime: endTime,
              estimatedValue: String(
                item.totalEarning ??
                  (item.costPerPlate && item.totalPlates
                    ? item.costPerPlate * item.totalPlates
                    : 0)
              ),
              dietaryTags: ["Fresh"],
              image: "",
              expiryTime,
            };

            await axios.post("/api/food", payload);
            uploaded.push(payload.name);

            setMessages((prev) => [
              ...prev,
              { sender: "bot", text: `Uploaded: ${payload.name}` },
            ]);
          }

          if (uploaded.length > 0) {
            setMessages((prev) => [
              ...prev,
              { sender: "bot", text: `All items uploaded: ${uploaded.join(", ")}` },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              { sender: "bot", text: "No valid items found to upload." },
            ]);
          }
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "No data available for today." },
          ]);
        }
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Error uploading today's data." },
        ]);
      }
    } else {
      try {
        const res = await axios.post("/api/chat", {
          messages: messages
            .map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            }))
            .concat({ role: "user", content: input }),
        });

        const botText = res.data.reply || "Sorry, I didn't understand.";
        setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
      } catch (error) {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "AI response failed. Please try again." },
        ]);
      }
    }
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Icon */}
      {!isOpen && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-green-500 rounded-full shadow-lg flex items-center justify-center relative hover:scale-110 transition"
          >
            <MessageCircle size={28} color="white" />
            {showHi && (
              <div className="absolute -top-6 bg-white text-green-600 px-2 py-1 rounded-full shadow text-sm animate-bounce">
                Hi!
              </div>
            )}
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 bg-white shadow-lg rounded-lg border border-gray-300 flex flex-col">
          <div className="bg-green-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span>SmartMeal AI</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              ×
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto" style={{ maxHeight: "300px" }}>
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === "user" ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex p-2 border-t border-gray-300">
            <input
              className="flex-1 border rounded-l px-2 py-1 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask SmartMeal AI..."
            />
            <button
              onClick={handleSend}
              className="bg-green-500 hover:bg-green-600 text-white px-3 rounded-r flex items-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
