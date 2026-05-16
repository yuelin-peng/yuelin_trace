'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LoginForm } from '../../components/auth/LoginForm';
import { authService } from '../../services/auth-service';

export default function LoginPageClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      await authService.login(email, password);
      
      // Determine redirect target
      const returnTo = router.query.returnTo;
      let redirectUrl = '/';
      
      if (returnTo && typeof returnTo === 'string') {
        // If returnTo is register page, go home instead
        if (returnTo === '/auth/register' || returnTo.startsWith('/auth/register')) {
          redirectUrl = '/';
        } else {
          redirectUrl = returnTo;
        }
      }
      
      router.push(redirectUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      if (message === 'Authentication required' || message === 'Invalid credentials') {
        setError("Authentication failed. Either the account doesn't exist or the password is incorrect.");
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold text-gray-900">Article Blog</h1>
            </Link>
            <p className="mt-2 text-gray-500">Sign in to your account</p>
          </div>

          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
