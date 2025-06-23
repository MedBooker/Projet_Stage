'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  label: string;
  href: string;
};

interface SidebarProps {
  navItems: NavItem[];
}

export default function Sidebar({ navItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg m-4 md:m-6">
      <h2 className="text-xl font-bold mb-6 text-emerald-700 dark:text-emerald-400">Dashboard Admin</h2>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label} passHref legacyBehavior>
              <button
                className={`w-full text-left px-4 py-2 rounded hover:bg-emerald-100 dark:hover:bg-gray-700 ${
                  isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-gray-700 dark:text-emerald-400' : ''
                }`}
              >
                {item.label}
              </button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// Pour afficher les éléments dans layout
Sidebar.Item = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link href={item.href} passHref legacyBehavior>
      <button
        className={`w-full text-left px-4 py-2 rounded hover:bg-emerald-100 dark:hover:bg-gray-700 ${
          isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-gray-700 dark:text-emerald-400' : ''
        }`}
      >
        {item.label}
      </button>
    </Link>
  );
};