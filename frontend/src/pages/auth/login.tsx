import type { Metadata } from 'next';
import LoginPageClient from './LoginPageClient';

export const metadata: Metadata = {
  title: 'Sign In - Article Blog',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return <LoginPageClient />;
}