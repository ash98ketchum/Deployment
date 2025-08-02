// frontend/src/pages/public/FAQ.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Shield,
  Clock,
  Users,
  ChefHat,
  Heart,
  MapPin,
  Star,
  Award,
  CheckCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*                               Types                                 */
/* ------------------------------------------------------------------ */

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
interface SuccessStory {
  id: string;
  title: string;
  organization: string;
  type: "ngo" | "restaurant";
  story: string;
  impact: string;
}

/* ------------------------------------------------------------------ */
/*                     Static FAQ + Story content                      */
/* ------------------------------------------------------------------ */

const faqs: FAQItem[] = [
  {
    id: "1",
    question: "What kind of food can be donated?",
    answer:
      "We accept freshly prepared meals, packaged foods, fruits, vegetables, and baked goods that are safe for consumption. All food must be prepared in licensed commercial kitchens and meet local health department standards.",
    category: "food-safety",
  },
  {
    id: "2",
    question: "How does the pickup process work?",
    answer:
      "Once you post available food, verified NGOs can request pickup. You'll receive notifications and can coordinate timing directly through our platform.",
    category: "process",
  },
  {
    id: "3",
    question: "How do NGOs get verified?",
    answer:
      "NGOs provide tax-exempt documentation, proof of food service permits, and references. Our verification takes 3-5 business days.",
    category: "verification",
  },
  {
    id: "4",
    question: "What are the hygiene and safety requirements?",
    answer:
      "All food must be prepared in commercial kitchens, properly packaged, and labeled with preparation times. Hot foods above 140 °F, cold foods below 40 °F.",
    category: "food-safety",
  },
  {
    id: "5",
    question: "Is there a cost to use SmartMeal AI?",
    answer:
      "The platform is free for both restaurants and NGOs. We may add premium analytics later, but basic donation coordination will always be free.",
    category: "general",
  },
  {
    id: "6",
    question: "How quickly must food be picked up?",
    answer:
      "Food should generally be picked up within 2–4 hours of posting, depending on type and storage conditions.",
    category: "process",
  },
  {
    id: "7",
    question: "What happens if no one picks up?",
    answer:
      "Listings expire automatically after the safe window. We’re building backup partnerships with recovery orgs to capture any remaining surplus.",
    category: "process",
  },
  {
    id: "8",
    question: "How do restaurants get verified?",
    answer:
      "Restaurants submit business licences, food-service permits, and proof of commercial kitchen certification. Verification takes 2-3 business days.",
    category: "verification",
  },
  {
    id: "9",
    question: "Can individuals donate food?",
    answer:
      "At the moment we only accept donations from licensed establishments for safety reasons, but we’re exploring ways to add community gardens soon.",
    category: "general",
  },
  {
    id: "10",
    question: "How do you track environmental impact?",
    answer:
      "We calculate waste-reduction by weight and estimate CO₂, water, and landfill savings. Partners get monthly impact reports.",
    category: "general",
  },
];

const successStories: SuccessStory[] = [
  {
    id: "1",
    title: "Feeding 500 Families During Holidays",
    organization: "Hope Kitchen Network",
    type: "ngo",
    story:
      "Hope Kitchen teamed up with 12 restaurants to serve 2 000 warm holiday meals to 500 families using SmartMeal AI’s daily pickup scheduler.",
    impact: "500 families fed • 2 000 meals saved",
  },
  {
    id: "2",
    title: "Zero-Waste Milestone",
    organization: "Green Garden Cafe",
    type: "restaurant",
    story:
      "Green Garden Cafe reached *zero food waste* for three months straight by matching every surplus dish to a local NGO.",
    impact: "1 200 lb rescued • 850 meals donated",
  },
  {
    id: "3",
    title: "Supporting Youth Programs",
    organization: "Future Leaders Foundation",
    type: "ngo",
    story:
      "Healthy after-school meals now reach 300 teenagers monthly thanks to recurring donations from health-conscious eateries.",
    impact: "300 youth served • improved nutrition scores",
  },
];

/* ------------------------------------------------------------------ */
/*                                Page                                */
/* ------------------------------------------------------------------ */

const FAQ: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");

  const categories = [
    { value: "all", label: "All Questions", Icon: Heart },
    { value: "food-safety", label: "Food Safety", Icon: Shield },
    { value: "process", label: "Process", Icon: Clock },
    { value: "verification", label: "Verification", Icon: CheckCircle },
    { value: "general", label: "General", Icon: Users },
  ] as const;

  const currentFaqs =
    category === "all"
      ? faqs
      : faqs.filter((f) => f.category === category);

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* ───────────────  Header  ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Everything you need to know about reducing food waste and supporting
            communities
          </p>
        </motion.div>

        {/* ───────────────  Category filter  ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap gap-3">
            {categories.map(({ value, label, Icon }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCategory(value)}
                className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                  category === value
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ───────────────  FAQ list  ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16 space-y-4"
        >
          {currentFaqs.map(({ id, question, answer }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <motion.button
                onClick={() => setOpen(open === id ? null : id)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-gray-50"
              >
                <span className="pr-4 font-semibold text-gray-900">
                  {question}
                </span>
                <motion.div
                  animate={{ rotate: open === id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {open === id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="leading-relaxed text-gray-700 px-6 py-4">
                      {answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* ───────────────  Success stories  ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Success Stories
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Real impact from partners making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {successStories.map(({ id, title, organization, type, story, impact }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center space-x-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      type === "ngo" ? "bg-green-100" : "bg-orange-100"
                    }`}
                  >
                    {type === "ngo" ? (
                      <Users className="h-5 w-5 text-green-600" />
                    ) : (
                      <ChefHat className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {organization}
                    </h3>
                    <div
                      className={`rounded-full px-2 py-1 text-xs ${
                        type === "ngo"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {type === "ngo" ? "NGO Partner" : "Restaurant Partner"}
                    </div>
                  </div>
                </div>

                <h4 className="mb-3 text-lg font-bold text-gray-900">{title}</h4>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {story}
                </p>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-sm text-gray-900">
                      Impact:
                    </span>
                  </div>
                  <p className="mt-1 font-medium text-sm text-green-600">
                    {impact}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ───────────────  CTA  ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="rounded-xl bg-gradient-to-r from-green-50 to-orange-50 p-8 text-center"
        >
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Still have questions?
          </h3>
          <p className="mx-auto mb-6 max-w-xl text-gray-600">
            Can't find the answer you're looking for? Our team is here to help
            you get started with reducing food waste.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-green-700 hover:to-green-800"
            >
              Contact Support
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg border border-green-600 bg-white px-6 py-3 font-semibold text-green-600 transition-all duration-200 hover:bg-green-50"
            >
              Schedule Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
