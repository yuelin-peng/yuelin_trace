import React, { useState } from 'react';
import clsx from 'clsx';

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export function LoginForm({ onSubmit, isLoading, error, className }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }
    if (!email.includes('@')) {
      setValidationError('Please enter a valid email');
      return;
    }
    if (!password) {
      setValidationError('Password is required');
      return;
    }

    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={clsx('space-y-4', className)}>
      {(error || validationError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
          {error || validationError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="you@example.com"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Your password"
          disabled={isLoading}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={clsx(
          'w-full py-3 rounded-lg font-medium transition-colors',
          isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        )}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" className="rounded border-gray-300" />
          Remember me
        </label>
        <a href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
          Forgot password?
        </a>
      </div>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <a href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign up
        </a>
      </p>
    </form>
  );
}

export default LoginForm;