'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (isAuthenticated && isMounted) {
    router.push('/dashboard/patient');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/Patients/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Erreur d'authentification", {
          description: data.message || "Les identifiants fournis sont incorrects",
          action: {
            label: 'Réessayer',
            onClick: () => document.getElementById('email')?.focus()
          },
        });
        return;
      }

      sessionStorage.setItem('auth_token', data.access_token);
      sessionStorage.setItem('user', JSON.stringify({
        name: `${data.prenom} ${data.nom}`,
        email: data.email,
        phone: data.phone 
      }));

      toast.success("Connexion réussie", {
        description: `Bienvenue, ${data.prenom} ! Redirection en cours...`,
        duration: 1500,
      });

      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        router.push('/dashboard/patient');
      }, 1500);
    } catch (error) {
      toast.error("Erreur de connexion", {
        description: "Un problème est survenu lors de la connexion. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/95 via-teal-50/95 to-blue-50/95 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-emerald-100/30 dark:border-emerald-900/20"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">
              Accès Patient
            </h1>
          </motion.div>
          <motion.p 
            className="text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Connectez-vous à votre espace sécurisé
          </motion.p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Adresse Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="h-11 bg-white/90 dark:bg-gray-700/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe *
              </Label>
              <a 
                href="/forgot-password" 
                className="text-xs font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 hover:underline transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="h-11 bg-white/90 dark:bg-gray-700/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                ) : (
                  <Eye className="h-5 w-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion en cours...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Se connecter <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nouveau patient ?{' '}
            <a 
              href="/register" 
              className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 hover:underline transition-colors"
            >
              Faire une demande d'inscription
            </a>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <p className="text-xs text-center text-gray-400 dark:text-gray-500">
            En vous connectant, vous acceptez nos {' '}
            <a href="/terms" className="underline hover:text-gray-600 dark:hover:text-gray-300">conditions d'utilisation</a>{' '}
            et notre {' '}
            <a href="/privacy" className="underline hover:text-gray-600 dark:hover:text-gray-300">politique de confidentialité</a>.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}