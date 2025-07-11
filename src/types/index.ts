export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  avatar?: string;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: string;
  author: string;
  categories: Category[];
  tags: Tag[];
  featuredImage?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: string;
  source: string;
  featuredImage?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  slug: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: string;
  author: string;
  categories: Category[];
  tags: Tag[];
  featuredImage?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
}

export interface PodcastSeries {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  usageCount: number;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  query?: string;
  status?: string;
  category?: string;
  tag?: string;
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
}