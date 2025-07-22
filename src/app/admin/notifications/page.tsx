"use client";

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Store, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner from 'components/loadingSpinner';
// --- TYPE DEFINITIONS ---

// Represents the raw data from the API
interface ApiNotification {
  _id: string;
  user: string;
  message: string;
  type: string; // e.g., "Restaurant", "Menu"
  createdAt: string;
}

// Extended type for client-side state management (includes read/archived status)
type NotificationCategory = 'restaurant' | 'menu' | 'system' | 'update' | 'message' | 'alert' | 'unknown';

interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
}

// --- HELPER COMPONENTS ---

const generateTitle = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'restaurant':
      return 'Restaurant Update';
    case 'menu':
      return 'Menu Notification';
    default:
      return 'System Notification';
  }
};

const NotificationIcon = ({ category }: { category: NotificationCategory }) => {
  switch (category) {
    case 'restaurant':
      return <Store className="text-purple-500" />;
    case 'menu':
        return <BookOpen className="text-indigo-500" />;
    case 'system':
      return <CheckCircle className="text-green-500" />;
    case 'update':
      return <Info className="text-blue-500" />;
    case 'message':
      return <Bell className="text-yellow-500" />;
    case 'alert':
      return <AlertTriangle className="text-red-500" />;
    default:
      return <Bell />;
  }
};

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onArchive,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onArchive: (id: string) => void;
}) => (
  <div
    className={`p-4 mb-4 rounded-lg shadow-md flex items-start space-x-4 transition-colors duration-300 ${
      notification.read ? 'bg-gray-100 dark:bg-gray-700 opacity-70' : 'bg-white dark:bg-gray-600'
    }`}
  >
    <div className="flex-shrink-0 mt-1">
      <NotificationIcon category={notification.category} />
    </div>
    <div className="flex-grow">
      <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{notification.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{notification.message}</p>
      <span className="text-sm text-gray-400 dark:text-gray-500">{notification.timestamp}</span>
    </div>
    <div className="flex flex-col space-y-2 items-center">
      {!notification.read && (
        <button
          onClick={() => onMarkAsRead(notification.id)}
          className="text-sm text-blue-500 hover:underline whitespace-nowrap"
        >
          Mark as Read
        </button>
      )}
      <button
        onClick={() => onArchive(notification.id)}
        className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
      >
        {notification.archived ? 'Unarchive' : 'Archive'}
      </button>
    </div>
  </div>
);

// --- MAIN NOTIFICATION PAGE COMPONENT ---

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const endpoints = [
        'https://bistroupulse-backend.onrender.com/api/notify/getByRest',
        'https://bistroupulse-backend.onrender.com/api/notify/getByMenu'
      ];

      try {
        // Fetch from all endpoints concurrently
        const responses = await Promise.all(
          endpoints.map(url => fetch(url, { method: 'GET', headers }))
        );

        // Check if any of the requests failed
        for (const response of responses) {
          if (!response.ok) {
            throw new Error(`Failed to fetch data (status: ${response.status})`);
          }
        }

        // Parse all responses as JSON
        const results = await Promise.all(responses.map(res => res.json()));

        // Combine notifications from all results
        const allApiNotifications: ApiNotification[] = results.flatMap(data => data.notifications || []);

        // De-duplicate notifications based on their unique _id
        const uniqueNotifications = Array.from(new Map(allApiNotifications.map(item => [item._id, item])).values());
        
        // Sort notifications by creation date, newest first
        uniqueNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Transform the final list for the UI
        const transformedNotifications: Notification[] = uniqueNotifications.map((notif: ApiNotification) => ({
          id: notif._id,
          category: (notif.type.toLowerCase() as NotificationCategory) || 'unknown',
          title: generateTitle(notif.type),
          message: notif.message,
          timestamp: formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }),
          read: false, 
          archived: false,
        }));

        setNotifications(transformedNotifications);

      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleArchive = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, archived: !n.archived } : n
      )
    );
  };

  const recentNotifications = notifications.filter((n) => !n.archived);
  const archivedNotifications = notifications.filter((n) => n.archived);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Notifications</h1>
        <p className="text-gray-500 dark:text-gray-300 mt-1">
          Stay up-to-date with the latest updates from your restaurants and menus.
        </p>
      </header>

      <main>
        {loading ? (
          <div className="text-center text-gray-500"><LoadingSpinner/></div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Recent</h2>
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onArchive={handleArchive}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No recent notifications.</p>
              )}
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Archived</h2>
              {archivedNotifications.length > 0 ? (
                archivedNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onArchive={handleArchive}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No archived notifications.</p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;