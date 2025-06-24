'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification en cours...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get('token');
    setToken(tokenFromURL);

    if (!tokenFromURL) {
      setStatus('error');
      setMessage('Lien invalide ou expiré');
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/Patients/verify-email/${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Email vérifié avec succès !');
        } else {
          setStatus('error');
          setMessage(data.message || "Échec de la vérification");
        }
      } catch (err) {
        setStatus('error');
        setMessage('Erreur serveur. Réessayez plus tard.');
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg text-center space-y-4">
        {status === 'loading' && (
          <>
            <p className="text-gray-600">Validation en cours...</p>
            <div className="animate-spin h-10 w-10 mx-auto border-4 border-emerald-500 border-t-transparent rounded-full" />
          </>
        )}
        {status === 'success' && (
          <>
            <h2 className="text-xl font-bold text-emerald-600">{message}</h2>
            <Link
              href="/login"
              className="mt-4 inline-block px-6 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              Se connecter
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="text-xl font-bold text-red-600">{message}</h2>
            <Link
              href="/register"
              className="mt-4 inline-block px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Refaire la demande
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
