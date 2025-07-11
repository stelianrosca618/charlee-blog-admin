import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  SearchIcon,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Event } from '../../types';
import { format, isAfter, isBefore } from 'date-fns';
import { apiPath, deleteEvent, getAllEvents } from '../../hooks/useApi';
import { is } from 'date-fns/locale';

export const EventsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; eventId?: string }>({
    isOpen: false
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API call


    fetchEvents();
  }, [])
  const fetchEvents = async () => {
    // Simulate API call
    const resEvents = await getAllEvents();
    console.log('Fetched events:', resEvents);
    const mockEvents: Event[] = resEvents.data || [];
    if (Array.isArray(resEvents)) {
      resEvents.map((event: any) => {
        mockEvents.push({
          id: event.id,
          title: event.Title,
          graphic1: event.Graphic1,
          slug: event.Relevance,
          address: event.Address,
          country: event.Country,
          city: event.City,
          state: event.State,
          zip: event.Zip,
          phone: event.Phone,
          startDate: new Date(event.StartDate).toDateString(),
          endDate: event.EndDate ? new Date(event.EndDate).toDateString() : undefined,
          status: getStatus(event),
          lastUpdated: new Date(event.LastUpdated).toDateString(),
          lastUpdatedBy: event.LastUpdatedBy || 'Charlee AI',
        });
      });
    }
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  };

  const getStatus = (event: Event) => {
    const now = new Date();
    if (isAfter(new Date(event.startDate), now)) {
      return 'upcoming';
    } else {
      return 'completed';
    }
    // if (isBefore(new Date(event.startDate), now)) {
    //   return 'upcoming';
    // } else if (event.endDate && isBefore(new Date(event.endDate), now)) {
    //   return 'completed';
    // } else {
    //   return 'ongoing';
    // }
  }
  // Mock data - replace with actual API call
  // const events: Event[] = [
  //   {
  //     id: '1',
  //     title: 'Web Development Workshop: React & TypeScript',
  //     description: 'Comprehensive workshop covering modern React development with TypeScript.',
  //     startDate: new Date('2024-02-15T09:00:00'),
  //     endDate: new Date('2024-02-15T17:00:00'),
  //     location: 'Tech Hub Conference Center',
  //     address: '123 Innovation Drive, San Francisco, CA 94105',
  //     capacity: 50,
  //     registeredCount: 35,
  //     status: 'upcoming',
  //     categories: [{ id: '1', name: 'Workshop', slug: 'workshop', color: '#3B82F6', createdAt: new Date() }],
  //     tags: [
  //       { id: '1', name: 'React', slug: 'react', color: '#06B6D4', usageCount: 15, createdAt: new Date() },
  //       { id: '2', name: 'TypeScript', slug: 'typescript', color: '#8B5CF6', usageCount: 12, createdAt: new Date() }
  //     ],
  //     featuredImage: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
  //     createdAt: new Date('2024-01-10'),
  //     updatedAt: new Date('2024-01-15')
  //   },
  //   {
  //     id: '2',
  //     title: 'Annual Tech Conference 2024',
  //     description: 'Join industry leaders for a day of innovation, networking, and cutting-edge technology discussions.',
  //     startDate: new Date('2024-03-20T08:00:00'),
  //     endDate: new Date('2024-03-22T18:00:00'),
  //     location: 'Grand Convention Center',
  //     address: '456 Conference Blvd, New York, NY 10001',
  //     capacity: 500,
  //     registeredCount: 287,
  //     status: 'upcoming',
  //     categories: [{ id: '2', name: 'Conference', slug: 'conference', color: '#10B981', createdAt: new Date() }],
  //     tags: [
  //       { id: '3', name: 'Technology', slug: 'technology', color: '#8B5CF6', usageCount: 25, createdAt: new Date() },
  //       { id: '4', name: 'Networking', slug: 'networking', color: '#F59E0B', usageCount: 18, createdAt: new Date() }
  //     ],
  //     featuredImage: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=300',
  //     createdAt: new Date('2023-12-01'),
  //     updatedAt: new Date('2024-01-20')
  //   },
  //   {
  //     id: '3',
  //     title: 'Design Thinking Masterclass',
  //     description: 'Learn the fundamentals of design thinking and how to apply them in your projects.',
  //     startDate: new Date('2024-01-10T10:00:00'),
  //     endDate: new Date('2024-01-10T16:00:00'),
  //     location: 'Creative Space Studio',
  //     address: '789 Design Street, Los Angeles, CA 90210',
  //     capacity: 25,
  //     registeredCount: 25,
  //     status: 'completed',
  //     categories: [{ id: '3', name: 'Masterclass', slug: 'masterclass', color: '#8B5CF6', createdAt: new Date() }],
  //     tags: [
  //       { id: '5', name: 'Design', slug: 'design', color: '#EC4899', usageCount: 20, createdAt: new Date() },
  //       { id: '6', name: 'UX/UI', slug: 'ux-ui', color: '#06B6D4', usageCount: 15, createdAt: new Date() }
  //     ],
  //     featuredImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
  //     createdAt: new Date('2023-12-15'),
  //     updatedAt: new Date('2024-01-11')
  //   },
  //   {
  //     id: '4',
  //     title: 'Startup Pitch Competition',
  //     description: 'Entrepreneurs pitch their innovative ideas to a panel of investors and industry experts.',
  //     startDate: new Date('2024-04-05T13:00:00'),
  //     endDate: new Date('2024-04-05T18:00:00'),
  //     location: 'Innovation Hub',
  //     address: '321 Startup Lane, Austin, TX 78701',
  //     capacity: 100,
  //     registeredCount: 45,
  //     status: 'upcoming',
  //     categories: [{ id: '4', name: 'Competition', slug: 'competition', color: '#EF4444', createdAt: new Date() }],
  //     tags: [
  //       { id: '7', name: 'Startup', slug: 'startup', color: '#10B981', usageCount: 22, createdAt: new Date() },
  //       { id: '8', name: 'Investment', slug: 'investment', color: '#F59E0B', usageCount: 8, createdAt: new Date() }
  //     ],
  //     createdAt: new Date('2024-01-05'),
  //     updatedAt: new Date('2024-01-18')
  //   }
  // ];

  useEffect(() => {
    let filtered = events;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        (event.title && event.title.toLowerCase().includes(q)) ||
        (event.address && event.address.toLowerCase().includes(q)) ||
        (event.city && event.city.toLowerCase().includes(q)) ||
        (event.state && event.state.toLowerCase().includes(q)) ||
        (event.country && event.country.toLowerCase().includes(q))
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedStatus]);

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    setSelectedEvents(
      selectedEvents.length === filteredEvents.length 
        ? [] 
        : filteredEvents.map(event => event.id)
    );
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      console.log('Deleting event:', eventId);
      fetchEvents();
      setDeleteDialog({ isOpen: false });
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'ongoing':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3 mr-1" />;
      default:
        return <AlertCircle className="w-3 h-3 mr-1" />;
    }
  };

  const reloadEvents = () => {
    setFilteredEvents(events);
    setSearchQuery('');
    setSelectedStatus('all');
  }

  const getCapacityStatus = (registered: number, capacity?: number) => {
    if (!capacity) return null;
    const percentage = (registered / capacity) * 100;
    
    if (percentage >= 100) {
      return { color: 'text-red-600', label: 'Full' };
    } else if (percentage >= 80) {
      return { color: 'text-orange-600', label: 'Almost Full' };
    } else if (percentage >= 50) {
      return { color: 'text-yellow-600', label: 'Filling Up' };
    }
    return { color: 'text-green-600', label: 'Available' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Manage workshops, conferences, and meetups</p>
        </div>
        <Link to="/dashboard/events/new">
          <Button icon={<Plus className="w-4 h-4" />}>
            New Event
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
                placeholder="Search events, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            <button className='bg-slate-300 p-3 rounded-lg' onClick={() => { reloadEvents() }}>
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedEvents.length > 0 && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-indigo-700">
              {selectedEvents.length} event(s) selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">
                Bulk Edit
              </Button>
              <Button size="sm" variant="danger">
                Delete Selected
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => {
                // const capacityStatus = getCapacityStatus(event.registeredCount, event.capacity);
                return (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {event.graphic1 && (
                          <img
                            src={`${apiPath}${event.graphic1}`}
                            alt={event.title}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                            crossOrigin="anonymous"
                          />
                        )}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{event.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div>{format(new Date(event.startDate), 'MMM dd, yyyy')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div>
                            {event.endDate
                              ? format(new Date(event.endDate), 'MMM dd, yyyy')
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          {event.address && (
                            <div className="text-xs text-gray-500">{event.address}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(event.status)}`}>
                        {getStatusIcon(event.status)}
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">

                        <Link
                          to={`/dashboard/events/edit/${event.id}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, eventId: event.id })}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first event'
              }
            </p>
            <Link to="/dashboard/events/new">
              <Button>Create New Event</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={() => deleteDialog.eventId && handleDeleteEvent(deleteDialog.eventId)}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone and will affect all registered attendees."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};