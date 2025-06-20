import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { BlogList } from './pages/blog/BlogList';
import { BlogForm } from './pages/blog/BlogForm';
import { NewsList } from './pages/news/NewsList';
import { NewsForm } from './pages/news/NewsForm';
import { PodcastList } from './pages/podcasts/PodcastList';
import { PodcastForm } from './pages/podcasts/PodcastForm';
import { EventsList } from './pages/events/EventsList';
import { EventsForm } from './pages/events/EventsForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginForm />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                
                {/* Blog Routes */}
                <Route path="blog" element={<BlogList />} />
                <Route path="blog/new" element={<BlogForm />} />
                <Route path="blog/edit/:id" element={<BlogForm />} />
                
                {/* News Routes */}
                <Route path="news" element={<NewsList />} />
                <Route path="news/new" element={<NewsForm />} />
                <Route path="news/edit/:id" element={<NewsForm />} />
                
                {/* Podcast Routes */}
                <Route path="podcasts" element={<PodcastList />} />
                <Route path="podcasts/new" element={<PodcastForm />} />
                <Route path="podcasts/edit/:id" element={<PodcastForm />} />
                
                {/* Events Routes */}
                <Route path="events" element={<EventsList />} />
                <Route path="events/new" element={<EventsForm />} />
                <Route path="events/edit/:id" element={<EventsForm />} />
                
                {/* Other Routes */}
                <Route path="categories" element={<div className="p-6 text-center text-gray-500">Categories Management - Coming Soon</div>} />
                <Route path="tags" element={<div className="p-6 text-center text-gray-500">Tags Management - Coming Soon</div>} />
                <Route path="settings" element={<div className="p-6 text-center text-gray-500">Settings - Coming Soon</div>} />
              </Route>
              
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600">Page not found</p>
                  </div>
                </div>
              } />
            </Routes>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;