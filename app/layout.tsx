import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Thomas Makoye | Developer & Creative',
  description: 'Portfolio of Thomas Makoye — software engineering, system administration, and creative media.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0e14] text-gray-200 antialiased">
        <SiteHeader />
        <main className="min-h-[calc(100vh-180px)]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
