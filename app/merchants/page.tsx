'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MerchantsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to maps page
    router.replace('/maps');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-bitcoin border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to merchant map...</p>
      </div>
    </div>
  );
}
