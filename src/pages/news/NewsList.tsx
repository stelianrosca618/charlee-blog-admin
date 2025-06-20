import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  AlertTriangle,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { NewsArticle } from '../../types';
import { format } from 'date-fns';

export const NewsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; articleId?: string }>({
    isOpen: false
  });

  // Mock data - replace with actual API call
  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Breaking: Major Tech Company Announces Revolutionary AI Platform',
      content: 'Lorem ipsum dolor sit amet...',
      excerpt: 'A groundbreaking announcement that could reshape the AI industry landscape.',
      status: 'published',
      priority: 'breaking',
      source: 'TechCrunch',
      author: { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
      categories: [{ id: '1', name: 'Technology', slug: 'technology', color: '#3B82F6', createdAt: new Date() }],
      tags: [
        { id: '1', name: 'AI', slug: 'ai', color: '#8B5CF6', usageCount: 15, createdAt: new Date() },
        { id: '2', name: 'Breaking News', slug: 'breaking-news', color: '#EF4444', usageCount: 8, createdAt: new Date() }
      ],
      featuredImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300',
      publishedAt: new Date('2024-01-15T10:30:00'),
      createdAt: new Date('2024-01-15T09:00:00'),
      updatedAt: new Date('2024-01-15T10:30:00'),
      slug: 'major-tech-company-announces-revolutionary-ai-platform'
    },
    {
      id: '2',
      title: 'Market Analysis: Cryptocurrency Trends for 2024',
      content: 'Lorem ipsum dolor sit amet...',
      excerpt: 'Comprehensive analysis of cryptocurrency market trends and predictions.',
      status: 'draft',
      priority: 'high',
      source: 'Financial Times',
      author: { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
      categories: [{ id: '2', name: 'Finance', slug: 'finance', color: '#10B981', createdAt: new Date() }],
      tags: [
        { id: '3', name: 'Cryptocurrency', slug: 'cryptocurrency', color: '#F59E0B', usageCount: 12, createdAt: new Date() },
        { id: '4', name: 'Market Analysis', slug: 'market-analysis', color: '#6366F1', usageCount: 6, createdAt: new Date() }
      ],
      publishedAt: undefined,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-22'),
      slug: 'cryptocurrency-trends-2024-market-analysis'
    },
    {
      id: '3',
      title: 'Climate Change Summit: World Leaders Reach Historic Agreement',
      content: 'Lorem ipsum dolor sit amet...',
      excerpt: 'Historic climate agreement reached at international summit with binding commitments.',
      status: 'published',
      priority: 'high',
      source: 'Reuters',
      author: { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
      categories: [{ id: '3', name: 'Environment', slug: 'environment', color: '#059669', createdAt: new Date() }],
      tags: [
        { id: '5', name: 'Climate Change', slug: 'climate-change', color: '#059669', usageCount: 20, createdAt: new Date() },
        { id: '6', name: 'Politics', slug: 'politics', color: '#DC2626', usageCount: 18, createdAt: new Date() }
      ],
      featuredImage: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=300',
      publishedAt: new Date('2024-01-18T14:15:00'),
      createdAt: new Date('2024-01-18T12:00:00'),
      updatedAt: new Date('2024-01-18T14:15:00'),
      slug: 'climate-change-summit-historic-agreement'
    }
  ];

  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || article.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSelectArticle = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleSelectAll = () => {
    setSelectedArticles(
      selectedArticles.length === filteredArticles.length 
        ? [] 
        : filteredArticles.map(article => article.id)
    );
  };

  const handleDeleteArticle = async (articleId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Deleting article:', articleId);
      setDeleteDialog({ isOpen: false });
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      breaking: 'bg-red-100 text-red-800 border border-red-200',
      high: 'bg-orange-100 text-orange-800 border border-orange-200',
      medium: 'bg-blue-100 text-blue-800 border border-blue-200',
      low: 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    return priorityConfig[priority as keyof typeof priorityConfig] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'breaking':
        return <AlertTriangle className="w-3 h-3 mr-1" />;
      case 'high':
        return <TrendingUp className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Articles</h1>
          <p className="text-gray-600">Manage breaking news and articles</p>
        </div>
        <Link to="/dashboard/news/new">
          <Button icon={<Plus className="w-4 h-4" />}>
            New Article
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
                placeholder="Search articles, sources..."
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
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Priority</option>
              <option value="breaking">Breaking</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
              More Filters
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedArticles.length > 0 && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-indigo-700">
              {selectedArticles.length} article(s) selected
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

      {/* Articles List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
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
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onChange={() => handleSelectArticle(article.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {article.featuredImage && (
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{article.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{article.excerpt}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          {article.categories.map(category => (
                            <span
                              key={category.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                              style={{ backgroundColor: category.color + '20', color: category.color }}
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(article.priority)}`}>
                      {getPriorityIcon(article.priority)}
                      {article.priority.charAt(0).toUpperCase() + article.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(article.status)}`}>
                      {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2 text-gray-400" />
                      {article.source}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {article.publishedAt ? (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div>{format(article.publishedAt, 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-gray-400">{format(article.publishedAt, 'HH:mm')}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not published</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/dashboard/news/edit/${article.id}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, articleId: article.id })}
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

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedStatus !== 'all' || selectedPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first news article'
              }
            </p>
            <Link to="/dashboard/news/new">
              <Button>Create New Article</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={() => deleteDialog.articleId && handleDeleteArticle(deleteDialog.articleId)}
        title="Delete News Article"
        message="Are you sure you want to delete this news article? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};