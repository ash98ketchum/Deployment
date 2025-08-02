import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Footer from "@/components/common/Footer"
import {
  ArrowRight,
  Users,
  Utensils,
  Heart,
  TrendingUp
} from "lucide-react"

const Landing: React.FC = () => {
  const navigate = useNavigate()
  const [statsData, setStatsData] = useState<{
    ngos: number
    restaurants: number
    mealsDonated: number
    foodSaved: number
  }>({
    ngos: 0,
    restaurants: 0,
    mealsDonated: 0,
    foodSaved: 0
  })

  useEffect(() => {
    fetch("/api/stats/users")
      .then((res) => res.json())
      .then((data) => setStatsData(data))
      .catch(() => {})
  }, [])

  const stats = [
    {
      label: "Meals Donated",
      value: statsData.mealsDonated.toLocaleString(),
      Icon: Utensils,
      color: "text-green-600"
    },
    {
      label: "Food Saved (lbs)",
      value: statsData.foodSaved.toLocaleString(),
      Icon: Heart,
      color: "text-orange-600"
    },
    {
      label: "Active NGOs",
      value: statsData.ngos.toLocaleString(),
      Icon: Users,
      color: "text-blue-600"
    },
    {
      label: "Active Restaurants",
      value: statsData.restaurants.toLocaleString(),
      Icon: TrendingUp,
      color: "text-purple-600"
    }
  ] as const

  const steps = [
    {
      title: "Restaurants Offer Food",
      description:
        "Local restaurants post available surplus food with pickup details",
      Icon: Utensils,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "NGOs Request Pickup",
      description:
        "Verified NGOs browse and request food items for their communities",
      Icon: Users,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Food Reaches Communities",
      description:
        "Coordinated pickup and distribution ensures food reaches those in need",
      Icon: Heart,
      color: "bg-red-100 text-red-600"
    }
  ] as const

  return (
    <div className="min-h-screen">
      <section className="pb-20 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl"
            >
              Feed People,{" "}
              <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                Not Landfills
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600"
            >
              SmartMeal AI connects restaurants with surplus food to NGOs
              serving communities, reducing waste while fighting hunger through
              intelligent coordination.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mb-12 flex items-center justify-center space-x-8"
            >
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center"
              >
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <Utensils className="h-8 w-8 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Restaurant
                </span>
              </motion.div>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-8 w-8 text-green-600" />
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  NGO
                </span>
              </motion.div>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <ArrowRight className="h-8 w-8 text-green-600" />
              </motion.div>
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="flex flex-col items-center"
              >
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Community
                </span>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signin/ngo")}
                className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-green-700 hover:to-green-800"
              >
                Sign in as NGO
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signin/restaurant")}
                className="rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-orange-700 hover:to-orange-800"
              >
                Sign in as Restaurant Owner
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white/50 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Our Impact
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Together, we're making a real difference in fighting food waste and
              hunger
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center justify-center">
                  <Icon className={`h-12 w-12 ${color}`} />
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 + 0.5 }}
                    viewport={{ once: true }}
                    className="mb-2 text-3xl font-bold text-gray-900"
                  >
                    {value}
                  </motion.div>
                  <div className="font-medium text-gray-600">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Our simple three-step process connects surplus food with communities
              in need
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map(({ title, description, Icon, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="h-full rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
                  <div
                    className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${color}`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      {title}
                    </h3>
                    <p className="leading-relaxed text-gray-600">
                      {description}
                    </p>
                  </div>
                  <div className="absolute -right-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-orange-600 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 transform md:block">
                    <ArrowRight className="h-8 w-8 text-green-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  )
}

export default Landing
