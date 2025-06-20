import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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

interface PodcastFormData {
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  status: 'draft' | 'published' | 'archived';
  seriesId: string;
  episodeNumber: number;
  seasonNumber?: number;
  showNotes: string;
  transcript?: string;
  tags: string[];
  featuredImage?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const PodcastForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [showSeoOptions, setShowSeoOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PodcastFormData>({
    defaultValues: {
      title: '',
      description: '',
      audioUrl: '',
      duration: 0,
      status: 'draft',
      seriesId: '',
      episodeNumber: 1,
      seasonNumber: 1,
      showNotes: '',
      transcript: '',
      tags: []
    }
  });

  const watchStatus = watch('status');
  const watchAudioUrl = watch('audioUrl');

  const onSubmit = async (data: PodcastFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving podcast episode:', data);
      toast.success(isEditing ? 'Episode updated successfully!' : 'Episode created successfully!');
      navigate('/dashboard/podcasts');
    } catch (error) {
      toast.error('Failed to save episode. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    window.open(`/preview/podcast/${id || 'new'}`, '_blank');
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      // In a real app, you would upload the file and get a URL
      const mockUrl = URL.createObjectURL(file);
      setValue('audioUrl', mockUrl);
      
      // Mock duration calculation (in a real app, you'd get this from the audio file)
      setValue('duration', Math.floor(Math.random() * 3600) + 1800); // Random duration between 30-90 minutes
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, you would control actual audio playback
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

  // Mock data for series and tags
  const availableSeries = [
    { id: '1', name: 'Tech Talk Weekly' },
    { id: '2', name: 'Developer Insights' },
    { id: '3', name: 'Startup Stories' },
    { id: '4', name: 'Design Matters' }
  ];

  const availableTags = [
    { id: '1', name: 'Technology', slug: 'technology' },
    { id: '2', name: 'Interview', slug: 'interview' },
    { id: '3', name: 'Tutorial', slug: 'tutorial' },
    { id: '4', name: 'Discussion', slug: 'discussion' },
    { id: '5', name: 'News', slug: 'news' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Podcast Episode' : 'Create New Podcast Episode'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update your podcast episode' : 'Record and publish your podcast episode'}
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
            {isEditing ? 'Update Episode' : 'Save Episode'}
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
                Episode Title *
              </label>
              <input
                {...register('title', { required: 'Episode title is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter episode title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Audio Upload */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Audio File *
              </label>
              
              {!watchAudioUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileAudio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Upload your podcast audio file</p>
                  <p className="text-xs text-gray-500 mb-4">Supported formats: MP3, WAV, M4A (Max 500MB)</p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload">
                    <Button variant="secondary" size="sm" as="span">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Audio File
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Volume2 className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {audioFile?.name || 'Audio file uploaded'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {formatDuration(watch('duration'))}
                      </span>
                      <button
                        type="button"
                        onClick={handlePlayPause}
                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>0:00</span>
                    <span>{formatDuration(watch('duration'))}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Episode Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe what this episode is about..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Show Notes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label htmlFor="showNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Show Notes
              </label>
              <textarea
                {...register('showNotes')}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Episode show notes, links, timestamps, etc..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Include timestamps, links, and additional resources mentioned in the episode
              </p>
            </div>

            {/* Transcript */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 mb-2">
                Transcript (Optional)
              </label>
              <textarea
                {...register('transcript')}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Full episode transcript..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Improves accessibility and SEO. Can be auto-generated or manually entered.
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

            {/* Series & Episode Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <Headphones className="w-4 h-4 mr-2 text-gray-600" />
                Series & Episode
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="seriesId" className="block text-sm font-medium text-gray-700 mb-1">
                    Podcast Series *
                  </label>
                  <select
                    {...register('seriesId', { required: 'Series is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a series</option>
                    {availableSeries.map(series => (
                      <option key={series.id} value={series.id}>{series.name}</option>
                    ))}
                  </select>
                  {errors.seriesId && (
                    <p className="mt-1 text-sm text-red-600">{errors.seriesId.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="seasonNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Season
                    </label>
                    <input
                      {...register('seasonNumber', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="episodeNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Episode *
                    </label>
                    <input
                      {...register('episodeNumber', { 
                        required: 'Episode number is required',
                        valueAsNumber: true,
                        min: 1
                      })}
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="1"
                    />
                    {errors.episodeNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.episodeNumber.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Episode Artwork</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Upload episode artwork</p>
                <Button variant="secondary" size="sm">
                  Choose File
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Recommended: 1400x1400px square image
              </p>
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

            {/* Duration Display */}
            {watch('duration') > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-600" />
                  Episode Duration
                </h3>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatDuration(watch('duration'))}
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};