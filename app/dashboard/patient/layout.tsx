'use client';

import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ProtectedLayout >
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-950 py-8 px-4">
        <div className="flex flex-col md:flex-row">
          <aside className="w-full md:w-64 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg m-4 md:m-6">
            <h2 className="text-xl font-bold mb-6 text-emerald-700 dark:text-emerald-400">Mon Espace</h2>
            <nav className="space-y-2">
              <Link href="/dashboard/patient" passHref legacyBehavior>
                <a>
                  <button className="w-full text-left px-4 py-2 rounded hover:bg-emerald-100 dark:hover:bg-gray-700 transition">
                    Accueil
                  </button>
                </a>
              </Link>
              <Link href="/dashboard/patient/appointments" passHref legacyBehavior>
                <a>
                  <button className="w-full text-left px-4 py-2 rounded hover:bg-emerald-100 dark:hover:bg-gray-700 transition">
                    Mes Rendez-vous
                  </button>
                </a>
              </Link>
              <Link href="/dashboard/patient/medical-records" passHref legacyBehavior>
                <a>
                  <button className="w-full text-left px-4 py-2 rounded hover:bg-emerald-100 dark:hover:bg-gray-700 transition">
                    Dossiers Médicaux
                  </button>
                </a>
              </Link>
              <Link href="/dashboard/patient/treatments" passHref legacyBehavior>
                <a>
                  <button className="w-full text-left px-4 py-2 rounded hover:bg-emerald-100 dark:hover:bg-gray-700 transition">
                    Traitements
                  </button>
                </a>
              </Link>
              <Link href="/dashboard/patient/messages" passHref legacyBehavior>
                <a>
                  <button className="w-full text-left px-4 py-2 rounded hover:bg-emerald-100 dark:hover:bg-gray-700 transition">
                    Messages
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

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedLayout>
  );
}