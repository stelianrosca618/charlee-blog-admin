import axios from 'axios';
import { useState, useCallback } from 'react';

export const apiPath = 'http://localhost:4000';
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