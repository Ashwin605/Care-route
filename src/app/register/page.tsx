import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | CARE ROUTE',
  description: 'Join the intelligent healthcare referral coordination network.',
};

export default function RegisterPage() {
  return (
    <AuthLayout
      heading="COORDINATE CARE.\nFASTER."
      subheading="Join the intelligent healthcare referral network and connect with capacity-aware hospitals."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
