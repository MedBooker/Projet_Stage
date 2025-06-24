'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const VerifyEmailContent = dynamic(() => import('@/components/VerifyEmailContent'), {
  ssr: false,
});

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
