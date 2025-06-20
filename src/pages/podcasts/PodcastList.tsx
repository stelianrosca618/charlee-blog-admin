import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  Play,
  Pause,
  Calendar,
  User,
  Clock,
  Headphones,
  Volume2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { PodcastEpisode } from '../../types';
import { format } from 'date-fns';

export const PodcastList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [selectedEpisodes, setSelectedEpisodes] = useState<string[]>([]);
  const [playingEpisode, setPlayingEpisode] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; episodeId?: string }>({
    isOpen: false
  });

  // Mock data - replace with actual API call
  const podcastEpisodes: PodcastEpisode[] = [
    {
      id: '1',
      title: 'The Future of Web Development: Trends for 2024',
      description: 'Join us as we explore the latest trends and technologies shaping web development in 2024.',
      audioUrl: 'https://example.com/audio/episode-1.mp3',
      duration: 3420, // 57 minutes in seconds
      status: 'published',
      series: {
        id: '1',
        name: 'Tech Talk Weekly',
        description: 'Weekly discussions about technology trends',
        coverImage: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
        isActive: true,
        createdAt: new Date('2023-01-01')
      },
      episodeNumber: 15,
      seasonNumber: 2,
      showNotes: 'In this episode, we discuss...',
      transcript: 'Welcome to Tech Talk Weekly...',
      featuredImage: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
      publishedAt: new Date('2024-01-15T10:00:00'),
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15'),
      tags: [
        { id: '1', name: 'Web Development', slug: 'web-development', color: '#3B82F6', usageCount: 25, createdAt: new Date() },
        { id: '2', name: 'Technology', slug: 'technology', color: '#8B5CF6', usageCount: 30, createdAt: new Date() }
      ]
    },
    {
      id: '2',
      title: 'Building Scalable React Applications',
      description: 'Deep dive into best practices for building large-scale React applications.',
      audioUrl: 'https://example.com/audio/episode-2.mp3',
      duration: 2880, // 48 minutes in seconds
      status: 'draft',
      series: {
        id: '1',
        name: 'Tech Talk Weekly',
        description: 'Weekly discussions about technology trends',
        coverImage: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
        isActive: true,
        createdAt: new Date('2023-01-01')
      },
      episodeNumber: 16,
      seasonNumber: 2,
      showNotes: 'In this episode, we explore...',
      featuredImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300',
      publishedAt: undefined,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-22'),
      tags: [
        { id: '3', name: 'React', slug: 'react', color: '#06B6D4', usageCount: 20, createdAt: new Date() },
        { id: '4', name: 'JavaScript', slug: 'javascript', color: '#F59E0B', usageCount: 35, createdAt: new Date() }
      ]
    },
    {
      id: '3',
      title: 'Interview: AI in Software Development',
      description: 'Exclusive interview with industry experts about AI tools in software development.',
      audioUrl: 'https://example.com/audio/episode-3.mp3',
      duration: 4200, // 70 minutes in seconds
      status: 'published',
      series: {
        id: '2',
        name: 'Developer Insights',
        description: 'Interviews with industry professionals',
        coverImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300',
        isActive: true,
        createdAt: new Date('2023-06-01')
      },
      episodeNumber: 8,
      seasonNumber: 1,
      showNotes: 'Special interview episode...',
      transcript: 'Today we have a special guest...',
      featuredImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300',
      publishedAt: new Date('2024-01-12T14:00:00'),
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-12'),
      tags: [
        { id: '5', name: 'AI', slug: 'ai', color: '#8B5CF6', usageCount: 15, createdAt: new Date() },
        { id: '6', name: 'Interview', slug: 'interview', color: '#10B981', usageCount: 12, createdAt: new Date() }
      ]
    }
  ];

  const podcastSeries = [
    { id: '1', name: 'Tech Talk Weekly' },
    { id: '2', name: 'Developer Insights' },
    { id: '3', name: 'Startup Stories' }
  ];

  const filteredEpisodes = podcastEpisodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         episode.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         episode.series.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || episode.status === selectedStatus;
    const matchesSeries = selectedSeries === 'all' || episode.series.id === selectedSeries;
    return matchesSearch && matchesStatus && matchesSeries;
  });

  const handleSelectEpisode = (episodeId: string) => {
    setSelectedEpisodes(prev => 
      prev.includes(episodeId) 
        ? prev.filter(id => id !== episodeId)
        : [...prev, episodeId]
    );
  };

  const handleSelectAll = () => {
    setSelectedEpisodes(
      selectedEpisodes.length === filteredEpisodes.length 
        ? [] 
        : filteredEpisodes.map(episode => episode.id)
    );
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Deleting episode:', episodeId);
      setDeleteDialog({ isOpen: false });
    } catch (error) {
      console.error('Error deleting episode:', error);
    }
  };

  const handlePlayPause = (episodeId: string) => {
    if (playingEpisode === episodeId) {
      setPlayingEpisode(null);
    } else {
      setPlayingEpisode(episodeId);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Podcast Episodes</h1>
          <p className="text-gray-600">Manage your podcast content and episodes</p>
        </div>
        <Link to="/dashboard/podcasts/new">
          <Button icon={<Plus className="w-4 h-4" />}>
            New Episode
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search episodes, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Series</option>
              {podcastSeries.map(series => (
                <option key={series.id} value={series.id}>{series.name}</option>
              ))}
            </select>
            <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
              More Filters
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedEpisodes.length > 0 && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-indigo-700">
              {selectedEpisodes.length} episode(s) selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">
                Bulk Edit
              </Button>
              <Button size="sm" variant="danger">
                Delete Selected
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Episodes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEpisodes.length === filteredEpisodes.length && filteredEpisodes.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Episode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Series
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEpisodes.map((episode) => (
                <tr key={episode.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedEpisodes.includes(episode.id)}
                      onChange={() => handleSelectEpisode(episode.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="relative mr-4">
                        {episode.featuredImage && (
                          <img
                            src={episode.featuredImage}
                            alt={episode.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <button
                          onClick={() => handlePlayPause(episode.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                        >
                          {playingEpisode === episode.id ? (
                            <Pause className="w-4 h-4 text-white" />
                          ) : (
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          )}
                        </button>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{episode.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{episode.description}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs text-gray-500">
                            S{episode.seasonNumber}E{episode.episodeNumber}
                          </span>
                          {episode.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                              style={{ backgroundColor: tag.color + '20', color: tag.color }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <Headphones className="w-4 h-4 mr-2 text-gray-400" />
                      {episode.series.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDuration(episode.duration)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(episode.status)}`}>
                      {episode.status.charAt(0).toUpperCase() + episode.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {episode.publishedAt ? (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div>{format(episode.publishedAt, 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-gray-400">{format(episode.publishedAt, 'HH:mm')}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not published</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handlePlayPause(episode.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/dashboard/podcasts/edit/${episode.id}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, episodeId: episode.id })}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEpisodes.length === 0 && (
          <div className="text-center py-12">
            <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No episodes found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedStatus !== 'all' || selectedSeries !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first podcast episode'
              }
            </p>
            <Link to="/dashboard/podcasts/new">
              <Button>Create New Episode</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={() => deleteDialog.episodeId && handleDeleteEpisode(deleteDialog.episodeId)}
        title="Delete Podcast Episode"
        message="Are you sure you want to delete this podcast episode? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};