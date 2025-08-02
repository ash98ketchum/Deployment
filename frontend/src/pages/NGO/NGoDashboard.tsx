import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/NgoBadge'
import Chart from '@/components/ui/Chart'
import {
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Plus,
  Package,
  UserPlus,
  Activity
} from 'lucide-react'

type DashboardStats = {
  activePartners: number
  upcomingPickups: number
  requestsFulfilled: number
  totalFoodSaved: number
}

const NgoDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activePartners: 0,
    upcomingPickups: 0,
    requestsFulfilled: 0,
    totalFoodSaved: 0
  })
  const [barData, setBarData] = useState<{ label: string, value: number }[]>([])
  const [pieData, setPieData] = useState<{ label: string, value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/stats/dashboard').then(r => r.json()),
      fetch('/data/reserved.json').then(r => r.json())
    ]).then(([statsRes, reserved]: [DashboardStats, any[]]) => {
      setStats(statsRes)
      const tagCounts: Record<string, number> = {}
      const dateCounts: Record<string, number> = {}
      reserved.forEach(item => {
        const tags = Array.isArray(item.dietaryTags) ? item.dietaryTags : []
        tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
        const date = item.reservedAt?.split('T')[0] || 'Unknown'
        dateCounts[date] = (dateCounts[date] || 0) + 1
      })
      setPieData(Object.entries(tagCounts).map(([label, value]) => ({ label, value })))
      const sortedDates = Object.keys(dateCounts).sort()
      setBarData(sortedDates.map(label => ({ label, value: dateCounts[label] })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-center py-10">Loading dashboard…</p>
  }

  const cards = [
    {
      title: 'Total Food Saved',
      value: stats.totalFoodSaved.toLocaleString(),
      unit: 'lbs',
      icon: TrendingUp,
      change: '+15%'
    },
    {
      title: 'Active Partners',
      value: stats.activePartners.toString(),
      unit: 'restaurants',
      icon: Users,
      change: '+3'
    },
    {
      title: 'Upcoming Pickups',
      value: stats.upcomingPickups.toString(),
      unit: 'scheduled',
      icon: Calendar,
      change: 'today'
    },
    {
      title: 'Requests Fulfilled',
      value: stats.requestsFulfilled.toString(),
      unit: 'this week',
      icon: CheckCircle,
      change: '+12%'
    }
  ]

  const quickActions = [
    {
      title: 'New Request',
      description: 'Submit a food pickup request',
      icon: Plus,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Reserve Food',
      description: 'Browse available donations',
      icon: Package,
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Add Partner',
      description: 'Register new restaurant',
      icon: UserPlus,
      gradient: 'from-blue-500 to-blue-600'
    }
  ]

  const recentActivities = [
    { text: "New pickup scheduled with Mario's Bistro", time: '5 minutes ago' },
    { text: 'Food request fulfilled - 45 lbs donated', time: '1 hour ago' },
    { text: 'New partner registered: Green Garden Cafe', time: '2 hours ago' },
    { text: 'Volunteer check-in completed', time: '3 hours ago' }
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your efforts are{' '}
          <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
            feeding change.
          </span>
        </h2>
        <p className="text-gray-600 text-lg">
          Here's what's happening with your food rescue efforts today.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-6 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="success" size="sm">{stat.change}</Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.unit}</p>
              </div>
            </Card>
          )
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          type="bar"
          data={barData}
          title="Reservations Over Time"
          className="hover:shadow-lg transition-shadow duration-300"
        />
        <Chart
          type="pie"
          data={pieData}
          title="Dietary Tags Breakdown"
          className="hover:shadow-lg transition-shadow duration-300"
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, i) => {
            const Icon = action.icon
            return (
              <Card key={i} className="p-6 cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="space-y-4">
          {recentActivities.map((a, i) => (
            <div key={i} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-orange-500 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium">{a.text}</p>
                <p className="text-xs text-gray-500 mt-1">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default NgoDashboard
