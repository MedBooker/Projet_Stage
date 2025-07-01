'use client';

import ProtectedLayout from '@/components/auth/ProtectedLayout';
import Sidebar from '@/components/ui/Sidebar';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const navItems = [
    { label: 'Tableau de bord', href: '/dashboard/admin' },
    { label: 'Patients', href: '/dashboard/admin/patients' },
    { label: 'Gérer les médecins', href: '/dashboard/admin/users' },
  ];

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-emerald-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="flex flex-col md:flex-row">
          <aside className="w-full md:w-64 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg m-4 md:m-6">
            <h2 className="text-xl font-bold mb-6 text-emerald-700 dark:text-emerald-400">Dashboard Admin</h2>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Sidebar.Item key={item.label} item={item} />
              ))}
              <button
                onClick={() => router.push('/login')}
                className="w-full text-left px-4 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                Déconnexion
              </button>
            </nav>
          </aside>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
      </ProtectedLayout>
  );
}