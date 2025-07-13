'use client';
import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Home, CalendarDays, Folder, Pill, MessageSquare, LogOut, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import '@/hooks/echo';

declare global {
  interface Window {
    Echo?: any;
  }
}

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [token, setToken] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);

  const navItems = [
    {
      name: "Accueil",
      href: "/dashboard/patient",
      icon: Home,
      current: pathname === "/dashboard/patient",
    },
    {
      name: "Mes Rendez-vous",
      href: "/dashboard/patient/appointments",
      icon: CalendarDays,
      current: pathname.startsWith("/dashboard/patient/appointments"),
    },
    {
      name: "Dossiers Médicaux",
      href: "/dashboard/patient/medical-records",
      icon: Folder,
      current: pathname.startsWith("/dashboard/patient/medical-records"),
    },
    {
      name: "Notifications",
      href: "/dashboard/patient/notifications",
      icon: MessageSquare,
      current: pathname.startsWith("/dashboard/patient/notifications"),
    },
    {
      name: "Mon Profil",
      href: "/dashboard/patient/profile",
      icon: User,
      current: pathname.startsWith("/dashboard/patient/profile"),
    },
  ];

  useEffect(() => {
    setToken(sessionStorage.getItem('auth_token'));
    setPatientId(sessionStorage.getItem('id'));
  }, []);

  useEffect(() => {
    const countNotifications = async () => {
    try {
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Patients/count-new-notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Erreur:', error);
    } 
  };
    countNotifications();
  }, [token])

  useEffect(() => {
  if (!patientId) {
    console.log('patientId not loaded yet:', patientId);
    return;
  }
  if (!window.Echo) {
    console.error('Echo not initialized');
    return;
  }

  console.log(`✅ Subscribing to patient.${patientId}`);

  const channel = window.Echo.private(`patient.${patientId}`);
  
  
  channel.listen('.unread_count.updated', (data: { patientId: string; unreadCount: number }) => {
    console.log('📩 Notification received:', data);
     if (data.patientId == patientId) {
    setUnreadCount(data.unreadCount);
    }
  });
   return () => {
    console.log('🧹 Unsubscribing from channel');
    channel.stopListening('.unread_count.updated');
    window.Echo.leave(`patient.${patientId}`);
  };
   }, [patientId])

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50/95 to-emerald-50/95 dark:from-gray-950 dark:to-emerald-950/95">
        <div className="flex flex-col md:flex-row">
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6"
          >
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Mon Espace Patient
                </h2>
              </div>

              <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} passHref>
                    <motion.div
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-colors relative",
                        item.current 
                          ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "hover:bg-gray-100/80 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.name}</span>
                      {item.name === "Notifications" && unreadCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                ))}
              </nav>

              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="mt-auto"
              >
                <button
                  onClick={() => router.push('/login')}
                  className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </motion.div>
            </div>
          </motion.aside>

          <main className="flex-1 p-4 md:p-8 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedLayout>
  );
}