import React from 'react';
import { 
  FileText, 
  Newspaper, 
  Headphones, 
  Calendar, 
  TrendingUp,
  Clock
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Posts',
      value: '248',
      change: '+12%',
      changeType: 'increase',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'News Articles',
      value: '89',
      change: '+8%',
      changeType: 'increase',
      icon: Newspaper,
      color: 'bg-green-500'
    },
    {
      name: 'Podcast Episodes',
      value: '34',
      change: '+3%',
      changeType: 'increase',
      icon: Headphones,
      color: 'bg-purple-500'
    },
    {
      name: 'Upcoming Events',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'blog',
      title: 'New Blog Post Published',
      description: '"Getting Started with React Hooks" has been published',
      time: '2 hours ago',
      icon: FileText
    },
    {
      id: 2,
      type: 'news',
      title: 'Breaking News Updated',
      description: 'Updated breaking news article about tech industry',
      time: '4 hours ago',
      icon: Newspaper
    },
    {
      id: 3,
      type: 'podcast',
      title: 'New Podcast Episode',
      description: 'Episode 15: "The Future of Web Development" uploaded',
      time: '1 day ago',
      icon: Headphones
    },
    {
      id: 4,
      type: 'event',
      title: 'Event Scheduled',
      description: 'Web Development Workshop scheduled for next week',
      time: '2 days ago',
      icon: Calendar
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-indigo-100">Here's what's happening with your content today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
                </div>
                <div className={`${item.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{item.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group">
              <FileText className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">New Blog Post</span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
              <Newspaper className="w-6 h-6 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">New Article</span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group">
              <Headphones className="w-6 h-6 text-gray-400 group-hover:text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">New Episode</span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group">
              <Calendar className="w-6 h-6 text-gray-400 group-hover:text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600">New Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Performance charts would be implemented here</p>
            <p className="text-sm text-gray-400">Integration with analytics service</p>
          </div>
        </div>
      </div>
    </div>
  );
};