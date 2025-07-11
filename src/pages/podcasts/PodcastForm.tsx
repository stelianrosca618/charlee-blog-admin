import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Container, Divider } from "@mui/material"
import JoditEditor, { Jodit } from "jodit-react";
import { 
  Save, 
  Eye, 
  Upload, 
  Plus,
  Hash,
  Headphones,
  Calendar,
  Globe,
  Play,
  Pause,
  Volume2,
  FileAudio,
  Clock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { apiPath, createPodcast, getPodcastById, imageUpload, updatePodcast } from '../../hooks/useApi';

interface PodcastFormData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  status: string;
  slug: string;
  createdDate: string;
}

export const PodcastForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PodcastFormData>({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      author: '',
      status: 'draft',
      featuredImage: '',
      slug: '',
      createdDate: new Date().toISOString() // Default to today's date
    }
  });

  useEffect(() => {
    if (isEditing) {
      // Fetch blog post data and populate form
      const fetchBlogPost = async () => {
        try {
          const data = await getPodcastById(id as string);
          console.log('Fetched blog post data:', data);
          setValue('title', data.Title);
          setValue('content', data.Body);
          setValue('excerpt', data.Description);
          setValue('author', data.Author);
          setValue('status', data.Status);
          setValue('featuredImage', data.Graphic1);
          setValue('slug', data.Relevance);
          setValue('createdDate', data.createdDate);
          setEditorContent(data.Body);
          setFeaturedImagePreview(data.Graphic1);
        } catch (error) {
          console.error('Error fetching blog post:', error);
        }
      };

      fetchBlogPost();
    }
  }, [id]); // Placeholder for any side effects
  // Ref for JoditEditor
  const editorRef = React.useRef<any>(null);
  const editorCofig = {
    toolbarSticky: false,
    toolbarButtonSize: "middle" as "middle",
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    uploader: {
      insertImageAsBase64URI: false,
      url: `${apiPath}/api/files/uploadEditImages`,
      format: 'json',
      filesVariableName: () => 'files[]',
      isSuccess: (res: any) => {
        console.log('Jodit upload response:', res);
        return res && (res.status === 'success' || res.success === true);
      },
      getMessage: (res: any) => res && res.message ? res.message : 'Image uploaded successfully',
      process: (resp: any) => {
        if (resp.files && resp.files[0]) {
          const imageUrl = resp.files[0];
          return {
            files: [imageUrl],
            isImages: [true],
            baseurl: apiPath,
          }
        }

        return {};
        // return { images: [] };
      }
    },

    events: {
      afterInsertImage: function (image: HTMLImageElement) {
        image.setAttribute('crossorigin', 'anonymous');
      }
    }
  }
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
  const renderBlogDate = (date_str: string) => {

    const dateStr = new Date(date_str);
    console.log('renderBlogDate', date_str);
    return dateStr.toDateString();
  }
  const onSubmit = async (data: PodcastFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate image upload
      let uploadedImageUrl = featuredImagePreview;
      if (featuredImageFile && !uploadedImageUrl) {
        toast.error('Please upload a valid image file.');
        return;
      }

      // Save post with uploaded image URL
      // const postData = { ...data, featuredImage: uploadedImageUrl };

      const postData = {
        Content_Type: 'blog',
        Description: data.excerpt,
        Title: data.title,
        Graphic1: uploadedImageUrl,
        Graphic2: '',
        Body: data.content,
        Author: 'Charlee AI',
        AuthorTitle: 'Charlee AI',
        AuthorCompany: 'Charlee AI',
        DateWritten: new Date(),
        Relevance: data.slug,
        Status: 'Active',
        LastUpdated: new Date().toISOString().slice(0, 19).replace('T', ' '),
        LastUpdatedBy: 'Charlee AI',
        PDFVersion: ''
      }
      if (isEditing) {
        await updatePodcast(id!, postData);
      } else {

        await createPodcast(postData);
        console.log('Saving podcast episode:', postData);
      }

      toast.success(isEditing ? 'Podcast updated successfully!' : 'Podcast created successfully!');
      navigate('/dashboard/podcasts'); // Redirect to podcast list after saving
    } catch (error) {
      toast.error('Failed to save podcast. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    setIsPreview(isPreview => !isPreview);
  };

  return (
    <div className="w-full px-8 mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Podcast Episode' : 'Create New Podcast Episode'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update your podcast episode content' : 'Write and publish your podcast episode'}
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
            {isEditing ? 'Update Podcast' : 'Save Podcast'}
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
          </div>

          <div className='lg:col-span-3 space-y-6'>
            {/* Content Editor */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <JoditEditor
                ref={editorRef}
                value={editorContent}
                onChange={newContent => {
                  // setEditorContent(newContent);
                  setValue('content', newContent)
                }}
                config={editorCofig}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}

              <p className="mt-2 text-sm text-gray-500">
                Rich text editor would be integrated here (e.g., TinyMCE, Quill, or Editor.js)
              </p>
            </div>
          </div>
        </div>
      </form>
      {isPreview &&
        <div className='w-full p-2 rounded-lg border border-gray-200'>
          <Box className="w-full">
            <Container maxWidth="md">
              <h1 className='text-center text-[65px] leading-[71.5px] font-medium'>{watch('title')}</h1>
              <Box className="w-full text-[#0099B0] " paddingY={1} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <span className="px-3">
                  3 minute read
                </span>
                <span className="px-3 border-l border-l-[#0099B0]">
                  {renderBlogDate(watch('createdDate'))}
                </span>
                <span className="px-3 border-l border-l-[#0099B0]">
                  By Charlee AI
                </span>
              </Box>
              <div className="w-full py-10 text-left">
                {featuredImagePreview &&
                  <img src={`${apiPath}${featuredImagePreview}`} alt="Featured" className="w-full h-auto rounded-lg mb-4" crossOrigin="anonymous" />
                }
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: watch('content') }} />
              </div>

            </Container>
          </Box>
        </div>
      }

    </div>
  );
};