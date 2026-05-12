'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../generated/com/yuelin/user/v1/user';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallbackPath?: string;
}

export function AuthGuard({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/auth/login' 
}: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackPath);
    }
  }, [isLoading, isAuthenticated, router, fallbackPath]);

  useEffect(() => {
    if (!isLoading && user && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user.role as UserRole)) {
        router.push('/');
      }
    }
  }, [isLoading, user, requiredRoles, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role as UserRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-500 mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, 'children'>
): React.FC<P> {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}