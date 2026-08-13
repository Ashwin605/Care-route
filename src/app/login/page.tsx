import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in | CARE ROUTE',
  description: 'Secure access to intelligent healthcare referral coordination.',
};

export default function LoginPage() {
  return (
    <AuthLayout
      heading="THE RIGHT CARE.\nAT THE RIGHT TIME."
      subheading="Secure access to intelligent healthcare referral coordination."
    >
      <LoginForm />
    </AuthLayout>
  );
}
