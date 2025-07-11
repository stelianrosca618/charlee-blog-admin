import axios from 'axios';
import { useState, useCallback } from 'react';

// export const apiPath = 'http://localhost:4000';
export const apiPath = 'https://charleenode.duckdns.org'
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const userRegister = async (data: any) => {
  try {
    const response = await axios.post(`${apiPath}/api/users`, data);
    return response.data;
  } catch (error) {
    console.log('Registration error:', error);
    throw new Error('Registration failed');
  }
};

export const userLogin = async (data: any) => {
  try {
    const response = await axios.post(`${apiPath}/api/users/login`, data);
    return response.data;
  } catch (error) {
    console.log('Login error:', error);
    throw new Error('Login failed');
  }
}

export const pdfUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await axios.post(`${apiPath}/api/files/pdfupload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.log('PDF upload error:', error);
    throw new Error('PDF upload failed');
  }
};

export const imageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${apiPath}/api/files/imageupload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.log('Image upload error:', error);
    throw new Error('Image upload failed');
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${apiPath}/api/dashboard`);
    return response.data;
  } catch (error) {
    console.log('Get dashboard stats error:', error);
    throw new Error('Failed to fetch dashboard stats');

  }
}

export const getDashboardActivities = async () => {
  try {
    const response = await axios.get(`${apiPath}/api/dashboard/getActivites`);
    return response.data;
  } catch (error) {
    console.log('Get dashboard activities error:', error);
    throw new Error('Failed to fetch dashboard activities');

  }
}

export const createBlog = async (data: any) => {
  try {
    const response = await axios.post(`${apiPath}/api/blogs`, data);
    return response.data;
  } catch (error) {
    console.log('Create blog error:', error);
    throw new Error('Create blog failed');
  }
}

export const updateBlog = async (id: string, data: any) => {
  try {
    const response = await axios.put(`${apiPath}/api/blogs/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Update blog error:', error);
    throw new Error('Update blog failed');
  }
}

export const deleteBlog = async (id: string) => {
  try {
    const response = await axios.delete(`${apiPath}/api/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.log('Delete blog error:', error);
    throw new Error('Delete blog failed');
  }
}

export const getAllBlogs = async () => {
  try {
    const response = await axios.get(`${apiPath}/api/blogs`);
    return response.data;
  } catch (error) {
    console.log('Get all blogs error:', error);
    throw new Error('Failed to fetch blogs');

  }
}

export const getBlogById = async (id: string) => {
  try {
    const response = await axios.get(`${apiPath}/api/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.log('Get blog by ID error:', error);
    throw new Error('Failed to fetch blog');

  }
}

export const createNews = async (data: any) => {
  try {
    const response = await axios.post(`${apiPath}/api/news`, data);
    return response.data;
  } catch (error) {
    console.log('Create New Error', error);
    throw new Error('Create News failed');
  }
}

export const updateNews = async (id: string, data: any) => {
  try {
    const response = await axios.put(`${apiPath}/api/news/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Update News Error', error);
    throw new Error('Update News failed');
  }
}

export const deleteNews = async (id: string) => {
  try {
    const response = await axios.delete(`${apiPath}/api/news/${id}`);
    return response.data;
  } catch (error) {
    console.log('Delete News Error', error);
    throw new Error('Delete News failed');
  }
}

export const getNewsById = async (id: string) => {
  try {
    const response = await axios.get(`${apiPath}/api/news/${id}`);
    return response.data;
  } catch (error) {
    console.log('Get News by ID Error', error);
    throw new Error('Get News by ID failed');
  }
}

export const getAllNews = async () => {
  try {
    const response = await axios.get(`${apiPath}/api/news`);
    return response.data;
  } catch (error) {
    console.log('Get all News Error', error);
    throw new Error('Get all News failed');
  }
}

export const createPodcast = async (data: any) => {
  try {
    const response = await axios.post(`${apiPath}/api/podcasts`, data);
    return response.data;
  } catch (error) {
    console.log('Create podcast error:', error);
    throw new Error('Create podcast failed');
  }
}
export const updatePodcast = async (id: string, data: any) => {
  try {
    const response = await axios.put(`${apiPath}/api/podcasts/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Update podcast error:', error);
    throw new Error('Update podcast failed');
  }
}
export const deletePodcast = async (id: string) => {
  try {
    const response = await axios.delete(`${apiPath}/api/podcasts/${id}`);
    return response.data;
  } catch (error) {
    console.log('Delete podcast error:', error);
    throw new Error('Delete podcast failed');
  }
}
export const getAllPodcasts = async () => {
  try {
    const response = await axios.get(`${apiPath}/api/podcasts`);
    return response.data;
  } catch (error) {
    console.log('Get all podcasts error:', error);
    throw new Error('Get all podcasts failed');
  }
}
export const getPodcastById = async (id: string) => {
  try {
    const response = await axios.get(`${apiPath}/api/podcasts/${id}`);
    return response.data;
  } catch (error) {
    console.log('Get podcast by ID error:', error);
    throw new Error('Get podcast by ID failed');
  }
}

export const createEvent = async (data: any) => {
  try {
    const response = await axios.post(`${apiPath}/api/events`, data);
    return response.data;
  } catch (error) {
    console.log('Create event error:', error);
    throw new Error('Create event failed');
  }
}

export const updateEvent = async (id: string, data: any) => {
  try {
    const response = await axios.put(`${apiPath}/api/events/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Update event error:', error);
    throw new Error('Update event failed');
  }
}

export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${apiPath}/api/events`);
    return response.data;
  } catch (error) {
    console.log('Get all events error:', error);
    throw new Error('Get all events failed');
  }
}

export const getEventById = async (id: string) => {
  try {
    const response = await axios.get(`${apiPath}/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.log('Get event by ID error:', error);
    throw new Error('Get event by ID failed');
  }
}

export const deleteEvent = async (id: string) => {
  try {
    const response = await axios.delete(`${apiPath}/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.log('Delete event error:', error);
    throw new Error('Delete event failed');

  }
}

export const useApi = <T>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (apiFunction: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
};