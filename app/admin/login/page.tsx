import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { AdminLoginForm } from '@/components/admin-login-form';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect('/admin');
  return (
    <section className="flex min-h-screen items-center justify-center px-5 pb-16 pt-28">
      <div className="w-full max-w-md rounded-2xl border border-[#00e6e6]/20 bg-[#0d131a] p-8 shadow-[0_0_40px_rgba(0,230,230,0.08)]">
        <p className="mb-2 font-mono text-sm text-[#00e6e6]">ADMIN / AUTHENTICATION</p>
        <h1 className="mb-2 text-3xl font-bold text-white">Admin sign in</h1>
        <p className="mb-7 text-sm text-gray-400">Use the password configured on the server to manage portfolio content.</p>
        <AdminLoginForm />
      </div>
    </section>
  );
}
