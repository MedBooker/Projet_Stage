'use client';
import { useState, useEffect } from 'react';
import { Bell, CalendarClock, AlertTriangle, Info, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'alert' | 'system';
  isRead: boolean;
  created_at: Date;
  relatedId?: string;
}

interface ApiResponse {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  created_at: string;
  relatedId?: string;
}

interface NotificationIconProps {
  type: Notification['type'];
}

const NotificationIcon = ({ type }: NotificationIconProps) => {
  switch(type) {
    case 'appointment': 
      return <CalendarClock className="w-5 h-5 text-blue-500" />;
    case 'alert': 
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    default: 
      return <Info className="w-5 h-5 text-gray-500" />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [view, setView] = useState<'all' | 'unread'>('all');
  const router = useRouter();

  const transformNotification = (apiData: ApiResponse): Notification => ({
    id: apiData.id,
    title: apiData.title,
    message: apiData.message,
    type: apiData.type as Notification['type'],
    isRead: apiData.isRead,
    created_at: new Date(apiData.created_at),
    relatedId: apiData.relatedId
  });

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch('http://127.0.0.1:8000/api/Patients/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      const transformedData = data.map(transformNotification);
      
      setNotifications(transformedData);
      setUnreadCount(transformedData.filter((n: any) => !n.isRead).length);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Échec du chargement des notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = sessionStorage.getItem('auth_token');
      
      await fetch(`http://127.0.0.1:8000/api/Patients/notifications/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_notification: id })
      });
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Échec de la mise à jour');
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      
      await fetch('http://127.0.0.1:8000/api/Patients/notifications/mark-all-read', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('Toutes les notifications marquées comme lues');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Échec de l\'opération');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = view === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // if (notification.type === 'appointment' && notification.relatedId) {
    //   router.push(`/appointments/${notification.relatedId}`);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                >
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-medium">Notifications récentes</h3>
                    <button 
                      onClick={() => setIsDropdownOpen(false)}
                      aria-label="Fermer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => {
                          handleNotificationClick(notification);
                          setIsDropdownOpen(false);
                        }}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <NotificationIcon type={notification.type} />
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.created_at).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t text-center">
                    <button 
                      onClick={() => {
                        router.push('/notifications');
                        setIsDropdownOpen(false);
                      }}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Voir toutes les notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Mes Notifications
          </h2>
          
          <div className="flex gap-3">
            <label htmlFor="notification-view-select" className="sr-only">
              Filtrer les notifications
            </label>
            <select
              id="notification-view-select"
              aria-label="Filtrer les notifications"
              value={view}
              onChange={(e) => setView(e.target.value as 'all' | 'unread')}
              className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes</option>
              <option value="unread">Non lues</option>
            </select>
            
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={`px-3 py-1 rounded text-sm ${
                unreadCount === 0 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Tout marquer comme lu
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Chargement en cours...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">
              {view === 'unread' ? 'Aucune notification non lue' : 'Aucune notification disponible'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.map((notification, index) => (
              <motion.li
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div 
                  className="p-4 flex items-start gap-4 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <NotificationIcon type={notification.type} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(notification.created_at).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}