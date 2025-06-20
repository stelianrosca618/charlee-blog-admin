import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export interface Breadcrumb {
  label: string;
  path: string;
  isActive: boolean;
}

export const useBreadcrumbs = (): Breadcrumb[] => {
  const location = useLocation();

  return useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [];

    // Always add dashboard home
    breadcrumbs.push({
      label: 'Dashboard',
      path: '/dashboard',
      isActive: pathSegments.length === 1
    });

    // Map path segments to breadcrumb labels
    const segmentLabels: Record<string, string> = {
      'blog': 'Blog Management',
      'news': 'News Management',
      'podcasts': 'Podcast Management',
      'events': 'Events Management',
      'categories': 'Categories',
      'tags': 'Tags',
      'settings': 'Settings',
      'profile': 'Profile',
      'new': 'Create New',
      'edit': 'Edit'
    };

    let currentPath = '/dashboard';

    pathSegments.slice(1).forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 2;
      
      breadcrumbs.push({
        label: segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  }, [location.pathname]);
};