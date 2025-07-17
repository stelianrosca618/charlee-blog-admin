import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import { 
  Save, 
  Eye, 
  Upload, 

  Plus,
  Hash,
  Folder,
  Calendar,
  Globe,
  MapPin,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { apiPath, createEvent, getEventById, imageUpload, updateEvent } from '../../hooks/useApi';
import RoomIcon from '@mui/icons-material/Room';
import PhoneSharpIcon from '@mui/icons-material/PhoneSharp';
import { Container } from '@mui/material';
// import { Map, Marker, ApiProvider } from "@vis.gl/react-google-maps";
import GoogleMapReact from 'google-map-react';
import {
  geocode,
  GeocodeOptions,
  RequestType,
} from "react-geocode";
import { CalendarDownMenu } from '../../components/func/CalendarDownMenu';
import { CalendarEventObj } from '../../hooks/commonFunc';



interface EventFormData {
  title: string;                // Title (mediumtext, NOT NULL)
  graphic1?: string;            // Graphic1 (longtext, image URL or base64)
  event_path?: string;
  address?: string;             // Address (varchar(100), nullable)
  country?: string;             // Country (varchar(50), nullable)
  city?: string;                // City (varchar(50), nullable)
  state?: string;               // State (varchar(50), nullable)
  zip?: string;                 // Zip (varchar(10), nullable)
  phone: string;               // Phone (varchar(20), nullable)
  startDate: string;            // StartDate (date, NOT NULL, use yyyy-MM-dd)
  endDate?: string;             // EndDate (date, nullable, use yyyy-MM-dd)
  slug?: string;                // Slug (mediumtext)
  status: string;               // Status (varchar(25), NOT NULL)
  lastUpdated: string;          // LastUpdated (date, NOT NULL, use yyyy-MM-dd)
  lastUpdatedBy: string;        // LastUpdatedBy (varchar(50), NOT NULL)
}

export const EventsForm: React.FC = () => {
  const { id } = useParams();
  const [isPreview, setIsPreview] = useState(false);
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [showSeoOptions, setShowSeoOptions] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<EventFormData>({
    defaultValues: {
      title: '',
      graphic1: '',
      event_path: '',
      address: '',
      country: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      startDate: '',
      endDate: '',
      slug: '',
      status: 'upcoming',
      lastUpdated: '',
      lastUpdatedBy: ''
    }
  });
  const [markerLocation, setMarkerLocation] = useState({
    center: {
      lat: 51.509865,
      lng: -0.118092,
    },
    zoom: 11
  });

  const loadLocation = (address: string) => {
    geocode(RequestType.ADDRESS, address, {
      key: "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao",
      language: "en",
      region: "us",
    } as GeocodeOptions)
      .then((response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setMarkerLocation({ center: {
            lat: lat,
            lng: lng
          },
          zoom: 11 });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const printEventDates = (eventStartDate: any, eventEndDate: any) => {
    const startDate = new Date(eventStartDate);
    const startDateStr = startDate.toLocaleDateString(undefined,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
    const endDate = new Date(eventEndDate)
    const endDateStr = endDate.toLocaleDateString(undefined,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
    return `${startDateStr} - ${endDateStr}`;
  }

  useEffect(() => {
    if (isEditing) {
      const fetchEvent = async () => {
        try {
          const eventData = await getEventById(id!); // Simulate API call
          if (eventData) {
            setValue('title', eventData.Title);
            setValue('graphic1', eventData.Graphic1);
            setValue('event_path', eventData.EventPath);
            setValue('address', eventData.Address || '');
            setValue('country', eventData.Country || '');
            setValue('city', eventData.City || '');
            setValue('state', eventData.State || '');
            setValue('zip', eventData.Zip || '');
            setValue('phone', eventData.Phone);
            setValue('startDate', eventData.StartDate ? new Date(eventData.StartDate).toISOString().split('T')[0] : '');
            setValue('endDate', eventData.EndDate ? new Date(eventData.EndDate).toISOString().split('T')[0] : '');
            setValue('slug', eventData.Relevance);
            setValue('status', eventData.Status);
            setValue('lastUpdated', new Date(eventData.LastUpdated).toISOString().split('T')[0]);
            setValue('lastUpdatedBy', eventData.LastUpdatedBy);

            if (eventData.Graphic1) {
              setFeaturedImagePreview(eventData.Graphic1);
            }
          }
        } catch (error) {
          console.error('Error fetching event:', error);
          toast.error('Failed to load event data.');
        }
      }
      fetchEvent();
    }
  }, [id])

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');
  const watchTitle = watch('title');
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
      const uploadFile = await imageUpload(file); // Simulate image upload
      if (uploadFile.filename) {
        const fileUrl = `/uploads/images/${uploadFile.filename}`;
        setFeaturedImagePreview(fileUrl);
      }
      setValue('graphic1', file.name); // You might want to upload and set the URL in real app
    }
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      let uploadedImageUrl = featuredImagePreview;
      if (featuredImageFile && !uploadedImageUrl) {
        toast.error('Please upload a valid image file.');
        return;
      }

      const eventData = {
        ContentType: 'event',
        Description: '',
        Title: data.title,
        Graphic1: uploadedImageUrl,
        Graphic2: null,
        Body: null,
        EventPath: data.event_path,
        Phone: data.phone,
        Address: data.address,
        Country: data.country,
        City: data.city,
        State: data.state,
        Zip: data.zip,
        StartDate: data.startDate,
        EndDate: data.endDate,
        Relevance: data.slug,
        Status: data.status,
        LastUpdated: data.lastUpdated,
        LastUpdatedBy: 'Charlee AI'
      }
      if (isEditing) {
        if (!id) {
          throw new Error('Event ID is required for updating an event.');
        }
        await updateEvent(id, eventData); // Simulate API call
      } else {
        await createEvent(eventData); // Simulate API call
      }

      // await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Saving event:', data);
      toast.success(isEditing ? 'Event updated successfully!' : 'Event created successfully!');
      navigate('/dashboard/events');
    } catch (error) {
      toast.error('Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {

    if (!isPreview) {
      const addressStr = `${watch('address')}, ${watch('city')}, ${watch('state')}, ${watch('zip')}, ${watch('country')}`;
      loadLocation(addressStr);

    }
    setIsPreview(isPreview => !isPreview);

    // window.open(`/preview/event/${id || 'new'}`, '_blank');
  };


  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update your event details' : 'Plan and organize your event'}
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
            {isEditing ? 'Update Event' : 'Save Event'}
          </Button>
        </div>
      </div>
      {isPreview ?
        <div className='w-full'>
          <Container maxWidth="md">
            <div className='w-full'>
              <div className='relative w-full'>
                {featuredImagePreview && (
                  <img
                    src={`${apiPath}${featuredImagePreview}`}
                    alt="Event Preview"
                    className="w-full aspect-[300/200] rounded-2xl shadow-md mb-4"
                    crossOrigin="anonymous"
                  />
                )}
                <div className='absolute bottom-0 w-full bg-gradient-to-t from-[#22c0b1] via-[#22c0b1] to-[#ffffff00] py-9 px-4 rounded-b-2xl'>
                  <h4 className="cursor-pointer text-[42px] leading-[54.6px] text-white text-center">
                    <span className="font-bold">{watch('title')}</span>
                  </h4>
                  <h4 className="cursor-pointer text-[42px] leading-[54.6px] text-white text-center">
                    <span className="font-medium">{printEventDates(watch('startDate'), watch('endDate'))}</span>
                  </h4>
                </div>
              </div>
              <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                <div className='col-span-1'>
                  <div className="w-full h-[300px] mb-7">
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao" }}
                      defaultCenter={markerLocation.center}
                      defaultZoom={markerLocation.zoom}
                    >
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          backgroundColor: '#22c0b1',
                          borderRadius: '50%',
                          textAlign: 'center',
                          lineHeight: '30px',
                          color: '#fff'
                        }}
                      >
                        <RoomIcon />
                      </div>
                    </GoogleMapReact>
                    
                  </div>
                  {/* Define eventData for preview */}
                  <CalendarDownMenu eventObj={{
                    title: watch('title'),
                    address: watch('address'),
                    country: watch('country'),
                    city: watch('city'),
                    state: watch('state'),
                    zip: watch('zip'),
                    eventStartDate: watch('startDate') ? new Date(watch('startDate')) : undefined,
                    eventEndDate: watch('endDate') ? new Date(watch('endDate') as string) : undefined,
                    slug: watch('slug'),
                    status: watch('status'),
                    lastUpdated: watch('lastUpdated'),
                    lastUpdatedBy: watch('lastUpdatedBy')
                  } as CalendarEventObj} />
                </div>
                <div className='col-span-2'>
                  <h3 className="text-[22px] font-semibold py-2">
                    <HouseOutlinedIcon className="mx-2" />
                    WebSite
                  </h3>
                  <p className="pl-2">
                    <a className="break-words underline text-[#22c0b1]" href={watch('event_path')} target="_blank" rel="noopener noreferrer">
                      {watch('event_path')}
                    </a>
                  </p>
                  <h3 className="text-[22px] font-semibold py-2">
                    <RoomIcon className="mx-2" />
                    Address
                  </h3>
                  <p className="pl-2 underline">
                    {watch('address')}
                  </p>
                  <p className="pl-2 underline">
                    {watch('city')} {watch('state')} {watch('zip')} {watch('country')}
                  </p>
                  <h3 className="text-[22px] font-semibold py-2">
                    <PhoneSharpIcon className="mx-2" />
                    Phone
                  </h3>
                  <p className="pl-2 underline">
                    {watch('phone') ? watch('phone') : 'No phone number provided'}
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>
        : 
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    {...register('title', { required: 'Event title is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter event title..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                  <p>
                    <span className="text-sm text-gray-500">Slug: </span>
                    <span className="font-mono text-gray-700">{watch('slug')}</span>
                  </p>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website *
                  </label>
                  <div className="relative flex rounded-lg shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      <Globe className="w-4 h-4" />
                    </span>
                    <input
                      {...register('event_path', { required: 'Website is required' })}
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://your-event-website.com"
                    />
                  </div>
                  {errors.event_path && (
                    <p className="mt-1 text-sm text-red-600">{errors.event_path.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                Date & Time
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    {...register('startDate', { required: 'Start date is required' })}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time *
                  </label>
                  <input
                    {...register('endDate', { required: 'End date is required' })}
                    type="date"
                    min={watchStartDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                Location
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    {...register('address')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      {...register('country')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Country"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="City"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      {...register('state')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                      Zip
                    </label>
                    <input
                      {...register('zip')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Zip code"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Event Image</h3>
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
                <p className="text-sm text-gray-500 mb-2">Upload event image</p>
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
            {/* Phone number */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Phone Number</h3>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter phone number..."
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      }
    </div>
  );
};