import { Suspense } from 'react';
import VerifyEmailContent from '@/components/VerifyEmailContent';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}