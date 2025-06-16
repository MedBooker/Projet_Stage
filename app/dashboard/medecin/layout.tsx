// app/dashboard/medecin/layout.tsx
'use client';

import ProtectedLayout from '@/components/auth/ProtectedLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MedecinLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-emerald-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg m-4 md:m-6">
            <h2 className="text-xl font-bold mb-6 text-emerald-700 dark:text-emerald-400">Dashboard Médecin</h2>
            <nav className="space-y-2">
              <Link href="/dashboard/medecin" passHref legacyBehavior>
                <a>
                  <button className="w-full text-left px-4 py-2 rounded hover:bg-emerald-100 dark:hover:bg-gray-700 transition">
                    Accueil
                  </button>
                </a>
              </Link>

              <Link href="/dashboard/medecin/planning" passHref legacyBehavior>
                <a>
                  <button className="w-full text-left px-4 py-2 rounded hover:bg-emerald-100 dark:hover:bg-gray-700 transition">
                    Mon Planning
                  </button>
                </a>
              </Link>

              <Link href="/dashboard/medecin/appointments" passHref legacyBehavior>
                <a>
                  <button className="w-full text-left px-4 py-2 rounded hover:bg-emerald-100 dark:hover:bg-gray-700 transition">
                    Mes Rendez-vous
                  </button>
                </a>
              </Link>

              <button
                onClick={() => router.push('/login')}
                className="w-full text-left px-4 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                Déconnexion
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedLayout>
  );
}