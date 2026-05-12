'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '../../services/auth-service';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('Auth callback error:', error);
        router.push('/auth/login?error=' + encodeURIComponent(error));
        return;
      }

      if (token) {
        localStorage.setItem('auth_callback_token', token);
      }

      const user = await authService.getCurrentUser();
      if (user) {
        router.push('/');
      } else {
        router.push('/auth/login?error=authentication_failed');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-500">Completing authentication...</p>
      </div>
    </main>
  );
}