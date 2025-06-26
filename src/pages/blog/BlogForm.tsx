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
  Globe
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CKEditor } from "ckeditor4-react";
import JoditEditor from "jodit-react";
import toast from 'react-hot-toast';
import { apiPath, imageUpload } from '../../hooks/useApi';

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  slug: string;
}

export const BlogForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BlogFormData>({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      author: '',
      status: 'draft',
      featuredImage: '',
      slug: ''
    }
  });

  // Ref for JoditEditor
  const editorRef = React.useRef(null);

  const watchTitle = watch('title');
  const watchStatus = watch('status');

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

  // Handle file selection and preview
  const handleFeaturedImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
      const uploadFile = await imageUpload(file); // Simulate image upload
      if (uploadFile.filename) {
        const fileUrl = `/uploads/images/${uploadFile.filename}`;
        setFeaturedImagePreview(fileUrl);
      }
      setValue('featuredImage', file.name); // You might want to upload and set the URL in real app
    }
  };

  // Optionally, revoke object URL on unmount or when file changes
  React.useEffect(() => {
    return () => {
      if (featuredImagePreview) {
        URL.revokeObjectURL(featuredImagePreview);
      }
    };
  }, [featuredImagePreview]);

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate image upload
      let uploadedImageUrl = featuredImagePreview;
      // if (featuredImageFile) {
      //   // Simulate upload delay
      //   await new Promise(resolve => setTimeout(resolve, 1000));
      //   // In a real app, upload the file and get the URL
      //   uploadedImageUrl = `/uploads/${featuredImageFile.name}`;
      // }

      // Save post with uploaded image URL
      const postData = { ...data, featuredImage: uploadedImageUrl };
      console.log('Saving blog post:', postData);

      toast.success(isEditing ? 'Post updated successfully!' : 'Post created successfully!');
      navigate('/dashboard/blog');
    } catch (error) {
      toast.error('Failed to save post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    setIsPreview(isPreview => !isPreview);
  };

  // Mock data for categories and tags
  // const availableCategories = [
  //   { id: '1', name: 'React', slug: 'react' },
  //   { id: '2', name: 'JavaScript', slug: 'javascript' },
  //   { id: '3', name: 'TypeScript', slug: 'typescript' },
  //   { id: '4', name: 'Web Development', slug: 'web-development' }
  // ];

  // const availableTags = [
  //   { id: '1', name: 'Tutorial', slug: 'tutorial' },
  //   { id: '2', name: 'Guide', slug: 'guide' },
  //   { id: '3', name: 'Tips', slug: 'tips' },
  //   { id: '4', name: 'Best Practices', slug: 'best-practices' }
  // ];

  return (
    <div className="w-full px-8 mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update your blog post content' : 'Write and publish your blog post'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={handlePreview}
            icon={<Eye className="w-4 h-4" />}
          >
            {isPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
            icon={<Save className="w-4 h-4" />}
          >
            {isEditing ? 'Update Post' : 'Save Post'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={isPreview ? "space-y-6 hidden" : "space-y-6 "}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className='lg:col-span-3 space-y-6'>
            {/* Title */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter post title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
              <p>
                <span className="text-sm text-gray-500">Slug: </span>
                <span className="font-mono text-gray-700">{watch('slug')}</span>
              </p>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Excerpt */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                {...register('excerpt')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Brief description of your post..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional summary that appears in post previews
              </p>
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
                <p className="text-sm text-gray-500 mb-2">Upload featured image</p>
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
            </div>
            {/* Status & Publish */}
            {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
              </div>
            </div> */}

          </div>

          <div className='lg:col-span-3 space-y-6'>
            {/* Content Editor */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <JoditEditor
                ref={editorRef}
                value={watch('content')}
                onChange={newContent => setValue('content', newContent, { shouldValidate: true })}
                config={{
                  toolbarSticky: false,
                  toolbarButtonSize: "middle",
                  showXPathInStatusbar: false,
                  askBeforePasteHTML: false,
                  askBeforePasteFromWord: false
                }}
              />
              {/*
              <CKEditor
                data={watch('content')}
                onChange={(event: any) => {
                  const html = event.editor.getData();
                  setValue('content', html, { shouldValidate: true });
                }}
              /> */}
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
              {/* <textarea
                {...register('content', { required: 'Content is required' })}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Write your blog post content here..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )} */}
              <p className="mt-2 text-sm text-gray-500">
                Rich text editor would be integrated here (e.g., TinyMCE, Quill, or Editor.js)
              </p>
            </div>
          </div>
        </div>
      </form>
      {isPreview &&
        <div className='w-full p-2 rounded-lg border border-gray-200'>
          <div className="prose max-w-none container mx-auto">
            <h1 className='text-center text-[65px] leading-[71.5px] font-medium'>{watch('title')}</h1>
            <div className="w-full text-[#0099B0] py-2 flex items-center justify-center">
              <span className="px-3">3 minute read</span>
              <span className="px-3 border-l border-l-[#0099B0]">Fri May 30 2025</span>
              <span className="px-3 border-l border-l-[#0099B0]">By Charlee AI</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: watch('content') }} />
          </div>
        </div>
      }

    </div>
  );
};