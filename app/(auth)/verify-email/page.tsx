'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token  = searchParams.get('token');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/Patients/verify-email/${token}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ token })
          });

          const data = await response.json();

          if (response.ok) {
            setMessage('Votre compte a été validé avec succès !');
          } else {
            setMessage(data.message || 'Une erreur s\'est produite.');
          }
        } catch (error) {
          setMessage('Erreur de connexion avec le serveur.');
        } finally {
          setLoading(false);
        }
      };

      verifyEmail();
    }
  }, [token]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{message}</h2>
      {message.includes('succès') && (
        <p><a href="/login">Cliquez ici pour vous connecter</a></p>
      )}
    </div>
  );
};

export default VerifyEmail;
