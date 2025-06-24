
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type VerificationStatus = 'idle' | 'loading' | 'success' | 'error';

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Vérification en cours...');
  const [status, setStatus] = useState<VerificationStatus>('idle');

  useEffect(() => {
    if (!token) {
      setMessage('Lien de vérification invalide');
      setStatus('error');
      return;
    }

    const verifyEmail = async () => {
      setStatus('loading');
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/Patients/verify-email/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setMessage('Email vérifié avec succès !');
          setStatus('success');
        } else {
          setMessage(data.message || "Échec de la vérification");
          setStatus('error');
        }
      } catch (error) {
        setMessage("Problème de connexion au serveur");
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transition-all duration-300">
        <div className="text-center space-y-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full border-4 border-emerald-300 border-t-transparent animate-spin"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Validation en cours</h2>
              <p className="text-gray-500">Veuillez patienter...</p>
            </div>
          )}

          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="mx-auto flex items-center justify-center h-24 w-24">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-emerald-50 animate-pulse"></div>
                  <svg
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-14 w-14 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{message}</h2>
              <p className="text-gray-600">Vous pouvez maintenant accéder à votre compte.</p>
              <Link
                href="/login"
                className="inline-block w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                Se connecter
              </Link>
            </div>
          )}

          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="mx-auto flex items-center justify-center h-24 w-24">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-red-50 animate-pulse"></div>
                  <svg
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-14 w-14 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{message}</h2>
              <p className="text-gray-600">
                Veuillez réessayer ou contacter le support si le problème persiste.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/register"
                  className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors duration-300 text-center"
                >
                  Refaire la demande
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-lg shadow-md transition-all duration-300"
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}