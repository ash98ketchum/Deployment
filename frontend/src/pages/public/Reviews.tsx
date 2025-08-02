// frontend/src/pages/Reviews.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Users,
  ChefHat,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Filter,
} from "lucide-react";

// ← Add this at the top:
const API_BASE =
  import.meta.env.VITE_API_URL /* e.g. "https://deployment-v0fc.onrender.com" */ ??
  "https://deployment-v0fc.onrender.com";

/* ------------------------------------------------------------------ */
/*                                Types                               */
/* ------------------------------------------------------------------ */
interface Review {
  id: string;
  reviewerName: string;
  reviewerType: "ngo" | "restaurant";
  targetName: string;
  targetType: "ngo" | "restaurant";
  rating: number;
  comment: string;
  date: string;
  foodItem?: string;
  helpful: number;
  verified: boolean;
}

/* ------------------------------------------------------------------ */
/*                                Page                                */
/* ------------------------------------------------------------------ */
const Reviews: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "ngo" | "restaurant">("all");
  const [rating, setRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reviews`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const visible = reviews.filter(
    (r) =>
      (filter === "all" || r.reviewerType === filter) &&
      (rating === null || r.rating === rating)
  );

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const renderStars = (
    count: number,
    interactive = false,
    onSelect?: (n: number) => void
  ) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          whileHover={interactive ? { scale: 1.1 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          onClick={() => interactive && onSelect && onSelect(n)}
          disabled={!interactive}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`h-5 w-5 ${
              n <= count ? "fill-current text-yellow-400" : "text-gray-300"
            }`}
          />
        </motion.button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Reviews &amp; Feedback
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Real experiences from NGOs and restaurants working together.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 rounded-xl border border-gray-100 bg-white p-8 shadow-lg"
        >
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-gray-900">
                {reviews.length}
              </div>
              <div className="text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  {avg.toFixed(1)}
                </span>
                <Star className="h-8 w-8 fill-current text-yellow-400" />
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-gray-900">
                {reviews.filter((r) => r.verified).length}
              </div>
              <div className="text-gray-600">Verified Reviews</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            {/* Reviewer Type */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                {[
                  { value: "all", label: "All Reviews" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setFilter(value as "all" | "ngo" | "restaurant");
                      setRating(null);
                    }}
                    className={`rounded-lg px-4 py-2 font-medium transition-colors duration-200 ${
                      filter === value
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Filter by rating:
              </span>
              <div className="flex space-x-2">
                {[5, 4, 3, 2, 1].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(rating === n ? null : n)}
                    className={`flex items-center space-x-1 rounded-lg border px-3 py-1 text-sm transition-colors duration-200 ${
                      rating === n
                        ? "border-yellow-300 bg-yellow-100 text-yellow-800"
                        : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{n}</span>
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                  </button>
                ))}
                {rating && (
                  <button
                    onClick={() => setRating(null)}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Review List */}
        <AnimatePresence>
          <div className="space-y-6">
            {visible.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}              
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      r.reviewerType === "ngo"
                        ? "bg-green-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {r.reviewerType === "ngo" ? (
                      <Users className="h-6 w-6 text-green-600" />
                    ) : (
                      <ChefHat className="h-6 w-6 text-orange-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="mb-1 flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            {r.reviewerName}
                          </h3>
                          {r.verified && (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Review for{" "}
                          <span className="font-medium">{r.targetName}</span>
                          {r.foodItem && (
                            <span className="text-gray-500"> • {r.foodItem}</span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        {renderStars(r.rating)}
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(r.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <p className="mb-4 leading-relaxed text-gray-700">
                      {r.comment}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 text-gray-500 transition-colors duration-200 hover:text-green-600"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm">Helpful ({r.helpful})</span>
                        </motion.button>
                        <button className="flex items-center space-x-2 text-gray-500 transition-colors duration-200 hover:text-blue-600">
                          <MessageSquare className="h-4 w-4" />
                          <span className="text-sm">Reply</span>
                        </button>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          r.reviewerType === "ngo"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {r.reviewerType === "ngo"
                          ? "NGO Review"
                          : "Restaurant Review"}
                      </span>
                    </div>
                  </div>
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
              <MessageSquare className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No reviews found
            </h3>
            <p className="mb-6 text-gray-600">
              Try adjusting your filters to see more reviews.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFilter("all");
                setRating(null);
              }}
              className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-green-700"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 rounded-xl bg-gradient-to-r from-green-50 to-orange-50 p-8 text-center"
        >
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Share your experience
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600">
            Help build trust by sharing your food donation or pickup story.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-green-700 hover:to-green-800"
          >
            Write a Review
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Reviews;
