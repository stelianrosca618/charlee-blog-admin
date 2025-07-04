import React, { useEffect, useState } from 'react';
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
  Clock,
  Paperclip
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { apiPath, createNews, getNewsById, imageUpload, pdfUpload, updateNews } from '../../hooks/useApi';

interface NewsFormData {
  title: string;
  content: string;
  excerpt: string;
  status: string;
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
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

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

  useEffect(() => {
    if (isEditing) {
      // Fetch existing news data and set form values
      const fetchNewsData = async () => {
        try {
          // Replace with your actual API call to fetch news by ID
          const newsData = await getNewsById(id as string); // Mocked function, replace with actual API call
          setValue('title', newsData.Title);
          setValue('content', newsData.Description);
          setValue('excerpt', newsData.Description);
          setValue('status', newsData.Status);
          setValue('source', newsData.Source);
          setValue('slug', newsData.Relevance || '');
          if (newsData.Graphic1) {
            setFeaturedImagePreview(newsData.Graphic1);
          }
        } catch (error) {
          console.error('Error fetching news data:', error);
        }
      };
      fetchNewsData();
    }
  }, [id]);

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

  const handleFeaturedImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
      // Preview
      const uploadResult = await imageUpload(file);
      if (uploadResult.filename) {
        const fileUrl = `/uploads/images/${uploadResult.filename}`;
        setFeaturedImagePreview(fileUrl);
      }
      setValue('featuredImage', file.name);
      // Upload logic (replace with your actual upload API)
      // Example:
      // const uploadResult = await imageUpload(file);
      // if (uploadResult.url) setFeaturedImagePreview(uploadResult.url);
    }
  };

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfFileName(file.name);
      // If you want to upload immediately, call your upload API here
      const uploadResult = await pdfUpload(file);
      if (uploadResult.filename) {
        const fileUrl = `${apiPath}/uploads/pdfs/${uploadResult.filename}`;
        setValue('source', fileUrl);
      }

    } else {
      toast.error("Please select a valid PDF file.");
    }
  };

  const onSubmit = async (data: NewsFormData) => {
    setIsSubmitting(true);
    try {

      const newsData = {
        ContentType: 'News',
        Description: data.content,
        Title: data.title,
        Graphic1: featuredImagePreview,
        Graphic2: null,
        Body: null,
        Source: data.source,
        DatePublished: new Date().toISOString().slice(0, 19).replace('T', ' '),
        Relevance: data.slug,
        Status: 'Active',
        LastUpdated: new Date().toISOString().slice(0, 19).replace('T', ' '),
        LastUpdatedBy: 'Charlee Ai',
        PDFVersion: 0
      }
      if (isEditing) {
        await updateNews(id as string, newsData);
      } else {
        await createNews(newsData);
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving news article:', data);
      toast.success(isEditing ? 'News updated successfully!' : 'News created successfully!');
      navigate('/dashboard/news');
    } catch (error) {
      toast.error('Failed to save article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
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
              <p>
                <span className="text-sm text-gray-500">Slug: </span>
                <span className="font-mono text-gray-700">{watch('slug')}</span>
              </p>
            </div>

            {/* Content Editor */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Article Content *
              </label>
              <textarea
                {...register('content', { required: 'Content is required' })}
                rows={5}
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
              <div className='w-full flex justify-between items-center'>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                  News Path *
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  id="pdfInput"
                  onChange={handlePdfChange}
                />
                <Button variant="secondary" type="button" className='p-1'
                  onClick={() => document.getElementById('pdfInput')?.click()}
                >
                  <Paperclip className="w-4 h-4 text-gray-500" />
                </Button>
              </div>

              <textarea
                {...register('source', { required: 'Content is required' })}
                rows={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Brief summary or lead paragraph..."
              />
              {errors.source && (
                <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
              )}
              {/* <p className="mt-1 text-sm text-gray-500">
                Summary that appears in article previews and social media
              </p> */}
            </div>


          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Featured Image</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {featuredImagePreview ? (
                  <img
                    src={`${apiPath}${featuredImagePreview}`}
                    alt="Preview"
                    className="mx-auto mb-2 rounded-lg max-h-40 object-contain"
                    crossOrigin="anonymous"
                  />
                ) : (
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                )}
                <p className="text-sm text-gray-500 mb-2">Upload news image</p>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="featuredImageInput"
                  onChange={handleFeaturedImageChange}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => document.getElementById('featuredImageInput')?.click()}
                >
                  Choose File
                </Button>
                {featuredImageFile && (
                  <div className="mt-2 text-xs text-gray-600">{featuredImageFile.name}</div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Recommended: 1200x630px for optimal social media sharing
              </p>
            </div>



          </div>
        </div>
      </form>
    </div>
  );
};