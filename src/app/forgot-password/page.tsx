import AuthLayout from '@/components/auth/AuthLayout';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | CARE ROUTE',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      heading="REGAIN\nACCESS."
      subheading="Reset your password to securely access the CARE ROUTE network."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
