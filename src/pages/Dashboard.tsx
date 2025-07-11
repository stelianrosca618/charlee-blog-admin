import React, { useEffect } from 'react';
import { 
  FileText, 
  Newspaper, 
  Headphones, 
  Calendar, 
  Users, 
  Eye,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDashboardActivities, getDashboardStats } from '../hooks/useApi';
import { formatDistanceToNow } from 'date-fns';

type StatItem = {
  name: string;
  value: any;
  icon: React.ElementType;
  color: string;
};

export const Dashboard: React.FC = () => {
  const [stats, setStats] = React.useState<StatItem[]>([]);
  const [recentActivity, setRecentActivity] = React.useState<any[]>([])
  useEffect(() => {
    fetchData();
    fetchActivity();
  }, []);
  const fetchData = async () => {
    try {
      const dashboardStats = await getDashboardStats();
      console.log('Dashboard Stats:', dashboardStats);
      // setStats(dashboardStats);
      const tmpStats = [
        {
          name: 'Total Posts',
          value: dashboardStats.blogs,
          icon: FileText,
          color: 'bg-blue-500'
        },
        {
          name: 'News Articles',
          value: dashboardStats.news,
          icon: Newspaper,
          color: 'bg-green-500'
        },
        {
          name: 'Podcast Episodes',
          value: dashboardStats.podcasts,
          icon: Headphones,
          color: 'bg-purple-500'
        },
        {
          name: 'Upcoming Events',
          value: dashboardStats.events,
          icon: Calendar,
          color: 'bg-orange-500'
        }
      ];
      setStats(tmpStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchActivity = async () => {
    try {
      const activities = await getDashboardActivities();
      console.log('Dashboard Activities:', activities);
      const tmpActivities = [
        {
          id: 1,
          type: 'blog',
          title: activities.recentBlogs.Title,
          description: activities.recentBlogs.Description,
          time: formatDistanceToNow(new Date(activities.recentBlogs.DateWritten), { addSuffix: true }),
          icon: FileText
        },
        {
          id: 2,
          type: 'news',
          title: activities.recentNews.Title,
          description: '',
          time: formatDistanceToNow(new Date(activities.recentNews.LastUpdated), { addSuffix: true }),
          icon: Newspaper
        },
        {
          id: 3,
          type: 'podcast',
          title: activities.recentPodcasts.Title,
          description: activities.recentPodcasts.Description,
          time: formatDistanceToNow(new Date(activities.recentPodcasts.DatePublished), { addSuffix: true }),
          icon: Headphones
        },
        {
          id: 4,
          type: 'event',
          title: activities.recentEvents.Title,
          description: `${activities.recentEvents.Address} ${activities.recentEvents.City} ${activities.recentEvents.Country}`,
          time: formatDistanceToNow(new Date(activities.recentEvents.LastUpdated), { addSuffix: true }),
          icon: Calendar
        }
      ];
      setRecentActivity(tmpActivities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);

    }
  }
  // const recentActivity = [
  //   {
  //     id: 1,
  //     type: 'blog',
  //     title: 'New Blog Post Published',
  //     description: '"Getting Started with React Hooks" has been published',
  //     time: '2 hours ago',
  //     icon: FileText
  //   },
  //   {
  //     id: 2,
  //     type: 'news',
  //     title: 'Breaking News Updated',
  //     description: 'Updated breaking news article about tech industry',
  //     time: '4 hours ago',
  //     icon: Newspaper
  //   },
  //   {
  //     id: 3,
  //     type: 'podcast',
  //     title: 'New Podcast Episode',
  //     description: 'Episode 15: "The Future of Web Development" uploaded',
  //     time: '1 day ago',
  //     icon: Headphones
  //   },
  //   {
  //     id: 4,
  //     type: 'event',
  //     title: 'Event Scheduled',
  //     description: 'Web Development Workshop scheduled for next week',
  //     time: '2 days ago',
  //     icon: Calendar
  //   }
  // ];

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
                    <p className="text-sm text-gray-500 line-clamp-1">{activity.description}</p>
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

            <Link to="/dashboard/blog/new">
              <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group">
                <FileText className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">New Blog Post</span>
              </button>
            </Link>
            <Link to="/dashboard/news/new">
              <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
                <Newspaper className="w-6 h-6 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">New News Article</span>
              </button>
            </Link>
            <Link to="/dashboard/podcasts/new">
              <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group">
                <Headphones className="w-6 h-6 text-gray-400 group-hover:text-purple-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">New Episode</span>
              </button>
            </Link>
            <Link to="/dashboard/events/new">
              <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group">
                <Calendar className="w-6 h-6 text-gray-400 group-hover:text-orange-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600">New Event</span>
              </button>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};