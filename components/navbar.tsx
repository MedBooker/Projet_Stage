'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sun, Moon, User, LogOut, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const links = [
    { name: "Accueil", href: "/" },
    { name: "Médecins", href: "/doctors" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
    { name: "Chat", href: "/chat" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("auth_token");
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 dark:bg-emerald-950/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-emerald-950/80 shadow-sm">
      <div className="container flex h-20 items-center justify-between px-4 mx-auto">
        <Link href="/" className="flex items-center space-x-3 group">
          <svg
            className="h-10 w-10 text-emerald-600 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91c4.59-1.15 8-5.86 8-10.91V5l-8-3z"
              fill="currentColor"
            />
            <path
              d="M12 12c1.93 0 3.5-1.57 3.5-3.5S13.93 5 12 5s-3.5 1.57-3.5 3.5S10.07 12 12 12z"
              fill="#FEF3C7"
            />
          </svg>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
            Clinique Amitié
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-10">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative text-sm font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-600 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400"
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full p-2 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-3 focus:outline-none"
                  aria-label="Profil utilisateur"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="truncate max-w-[140px] text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/patient/profile">Mon Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/patient/settings">Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/patient/">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-full"
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Inscription
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <motion.nav
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMenuOpen ? "auto" : 0,
          opacity: isMenuOpen ? 1 : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`md:hidden overflow-hidden bg-white dark:bg-emerald-950 border-t dark:border-emerald-900 ${
          isMenuOpen ? "pb-4 pt-2" : ""
        }`}
      >
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between px-6 py-4 border-b dark:border-emerald-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="truncate max-w-[140px] text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu utilisateur">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/patient/profile">Mon Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/patient/settings">Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/patient/">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
        <ul className="space-y-3 px-6">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`block py-2 text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}

          <li className="pt-2 flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              Changer de Thème
            </Button>

            {isAuthenticated ? (
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800/50"
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
              

            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </li>
        </ul>
      </motion.nav>
    </header>
  );
}