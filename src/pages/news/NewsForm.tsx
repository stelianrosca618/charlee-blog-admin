import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  Eye, 
  Upload, 
  Plus,
  Hash,
  Folder,
  Calendar,
  Globe,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

interface NewsFormData {
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'breaking';
  source: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
}

export const NewsForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [showSeoOptions, setShowSeoOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<NewsFormData>({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      status: 'draft',
      priority: 'medium',
      source: '',
      categories: [],
      tags: [],
      slug: ''
    }
  });

  const watchTitle = watch('title');
  const watchStatus = watch('status');
  const watchPriority = watch('priority');

  // Auto-generate slug from title
  React.useEffect(() => {
    if (watchTitle && !isEditing) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchTitle, setValue, isEditing]);

  const onSubmit = async (data: NewsFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving news article:', data);
      toast.success(isEditing ? 'Article updated successfully!' : 'Article created successfully!');
      navigate('/dashboard/news');
    } catch (error) {
      toast.error('Failed to save article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    window.open(`/preview/news/${watch('slug') || 'untitled'}`, '_blank');
  };

  // Mock data for categories and tags
  const availableCategories = [
    { id: '1', name: 'Technology', slug: 'technology' },
    { id: '2', name: 'Finance', slug: 'finance' },
    { id: '3', name: 'Politics', slug: 'politics' },
    { id: '4', name: 'Environment', slug: 'environment' },
    { id: '5', name: 'Health', slug: 'health' },
    { id: '6', name: 'Sports', slug: 'sports' }
  ];

  const availableTags = [
    { id: '1', name: 'Breaking News', slug: 'breaking-news' },
    { id: '2', name: 'Analysis', slug: 'analysis' },
    { id: '3', name: 'Investigation', slug: 'investigation' },
    { id: '4', name: 'Opinion', slug: 'opinion' },
    { id: '5', name: 'Interview', slug: 'interview' }
  ];

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'breaking':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit News Article' : 'Create New News Article'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update your news article content' : 'Write and publish breaking news'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={handlePreview}
            icon={<Eye className="w-4 h-4" />}
          >
            Preview
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
            icon={<Save className="w-4 h-4" />}
          >
            {isEditing ? 'Update Article' : 'Save Article'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Headline *
              </label>
              <input
                {...register('title', { required: 'Headline is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter news headline..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Content Editor */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Article Content *
              </label>
              <textarea
                {...register('content', { required: 'Content is required' })}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Write your news article content here..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Rich text editor would be integrated here for news formatting
              </p>
            </div>

            {/* Excerpt */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Summary/Lead
              </label>
              <textarea
                {...register('excerpt')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Brief summary or lead paragraph..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Summary that appears in article previews and social media
              </p>
            </div>

            {/* SEO Options */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <button
                type="button"
                onClick={() => setShowSeoOptions(!showSeoOptions)}
                className="flex items-center text-sm font-medium text-gray-700 mb-4"
              >
                <Globe className="w-4 h-4 mr-2" />
                SEO Options
                <Plus className={`w-4 h-4 ml-2 transform transition-transform ${showSeoOptions ? 'rotate-45' : ''}`} />
              </button>
              
              {showSeoOptions && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      SEO Title
                    </label>
                    <input
                      {...register('seoTitle')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Custom title for search engines..."
                    />
                  </div>
                  <div>
                    <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      SEO Description
                    </label>
                    <textarea
                      {...register('seoDescription')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Meta description for search engines..."
                    />
                  </div>
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                      URL Slug
                    </label>
                    <input
                      {...register('slug', { required: 'Slug is required' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="url-friendly-slug"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Publish */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <div className="relative">
                    <select
                      {...register('priority')}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="breaking">Breaking News</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {getPriorityIcon(watchPriority)}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                    News Source *
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register('source', { required: 'Source is required' })}
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Reuters, AP News"
                    />
                  </div>
                  {errors.source && (
                    <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
                  )}
                </div>

                {watchStatus === 'published' && (
                  <div>
                    <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-1">
                      Publish Date & Time
                    </label>
                    <input
                      {...register('publishedAt')}
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Featured Image</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Upload news image</p>
                <Button variant="secondary" size="sm">
                  Choose File
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Recommended: 1200x630px for optimal social media sharing
              </p>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <Folder className="w-4 h-4 mr-2 text-gray-600" />
                Categories
              </h3>
              <div className="space-y-2">
                {availableCategories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      value={category.id}
                      {...register('categories')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <Hash className="w-4 h-4 mr-2 text-gray-600" />
                Tags
              </h3>
              <div className="space-y-2">
                {availableTags.map(tag => (
                  <label key={tag.id} className="flex items-center">
                    <input
                      type="checkbox"
                      value={tag.id}
                      {...register('tags')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Add new tag..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};