"use client";

import React, { useState } from 'react';
import { Bell,  CheckCircle,  AlertTriangle, Info } from 'lucide-react';

// --- TYPE DEFINITIONS ---

type NotificationCategory = 'system' | 'update' | 'message' | 'alert';

interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
}

// --- MOCK DATA ---

const mockNotifications: Notification[] = [
  {
    id: '1',
    category: 'system',
    title: 'System Update Successful',
    message: 'The system has been updated to version 2.5.1 with new features and security enhancements.',
    timestamp: '2 hours ago',
    read: false,
    archived: false,
  },
  {
    id: '2',
    category: 'alert',
    title: 'High CPU Usage Detected',
    message: 'The server is experiencing high CPU usage. Please investigate to prevent performance issues.',
    timestamp: '5 hours ago',
    read: false,
    archived: false,
  },
  {
    id: '3',
    category: 'message',
    title: 'New Message from Support',
    message: 'A new message has been received from the support team regarding your recent inquiry.',
    timestamp: '1 day ago',
    read: true,
    archived: false,
  },
  {
    id: '4',
    category: 'update',
    title: 'New Feature Available',
    message: 'A new feature has been added to the dashboard. Check it out now!',
    timestamp: '3 days ago',
    read: true,
    archived: true,
  },
];

// --- HELPER COMPONENTS ---

const NotificationIcon = ({ category }: { category: NotificationCategory }) => {
  switch (category) {
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
    className={`p-4 mb-4 rounded-lg shadow-md flex items-start dark:bg-gray-600 bg-white space-x-4 ${
      notification.read ? 'bg-gray-100 dark:bg-gray-600' : 'bg-white  '
    }`}
  >
    <div className="flex-shrink-0 dark:text-white">
      <NotificationIcon category={notification.category} />
    </div>
    <div className="flex-grow ">
      <h3 className="font-semibold dark:text-white text-lg">{notification.title}</h3>
      <p className="text-gray-600 dark:text-white">{notification.message}</p>
      <span className="text-sm dark:text-white text-gray-400">{notification.timestamp}</span>
    </div>
    <div className="flex flex-col space-y-2">
      {!notification.read && (
        <button
          onClick={() => onMarkAsRead(notification.id)}
          className="text-blue-500 hover:underline"
        >
          Mark as Read
        </button>
      )}
      <button
        onClick={() => onArchive(notification.id)}
        className="text-gray-500 hover:underline"
      >
        {notification.archived ? 'Unarchive' : 'Archive'}
      </button>
    </div>
  </div>
);

// --- MAIN NOTIFICATION PAGE COMPONENT ---

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

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
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-800">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Notifications</h1>
        <p className="text-gray-500 dark:text-white">
          Manage your notifications and stay up-to-date with the latest updates.
        </p>
      </header>

      <main>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent</h2>
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
            <p className="text-gray-500">No recent notifications.</p>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Archived</h2>
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
            <p className="text-gray-500">No archived notifications.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default NotificationsPage;