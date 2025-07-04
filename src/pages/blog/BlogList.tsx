import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  User,
  Tag,
  FileText,
  RotateCcw,
  SearchIcon
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { BlogPost } from '../../types';
import { format } from 'date-fns';
import { apiPath, deleteBlog, getAllBlogs } from '../../hooks/useApi';

export const BlogList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; postId?: string }>({
    isOpen: false
  });
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);
  const fetchBlogs = async () => {
    try {
      const blogs = await getAllBlogs();
      let tmpblogs: BlogPost[] = [];
      if (Array.isArray(blogs)) {
        blogs.map((blog: any) => {
          tmpblogs.push({
            id: blog.id,
            title: blog.Title,
            content: blog.Body,
            excerpt: blog.Description,
            status: blog.Status,
            author: blog.Author,
            categories: [],
            tags: [],
            featuredImage: blog.Graphic1,
            // publishedAt: new Date('2024-01-15'),
            createdAt: new Date(blog.DateWritten),
            updatedAt: new Date(blog.LastUpdated),
            slug: blog.Relevance
          });
        });
      }
      setBlogPosts(tmpblogs);
      setFilteredPosts(tmpblogs);
      console.log('Fetched blogs:', blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  }; 
  const handleDeletePost = async (postId: string) => {
    try {
      await deleteBlog(postId);
      console.log('Deleting post:', postId);
      fetchBlogs();
      setDeleteDialog({ isOpen: false });
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status == 'Active') {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const onhandleSearch = () => {
    if (searchQuery.trim() === '') {
      setSearchQuery('');
    } else {
      const tmpbposts = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(tmpbposts);
      // setSearchQuery(searchQuery.trim());
    }
  }
  const reloadBlogs = () => {
    setFilteredPosts(blogPosts);
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Manage your blog content</p>
        </div>
        <Link to="/dashboard/blog/new">
          <Button icon={<Plus className="w-4 h-4" />}>
            New Post
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
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { onhandleSearch() }} variant="secondary" icon={<SearchIcon className="w-4 h-4" />}>
              Search Blogs
            </Button>
            <button className='bg-slate-300 p-3 rounded-lg' onClick={() => { reloadBlogs() }}>
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {post.featuredImage && (
                        <img
                          src={`${apiPath}${post.featuredImage}`}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                          crossOrigin="anonymous"
                        />
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {post.author}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(post.createdAt, 'yyyy-MM-dd HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/dashboard/blog/edit/${post.id}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, postId: post.id })}
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

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first blog post'
              }
            </p>
            <Link to="/dashboard/blog/new">
              <Button>Create New Post</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={() => deleteDialog.postId && handleDeletePost(deleteDialog.postId)}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};