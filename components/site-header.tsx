'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Shield, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/home', label: 'Home' },
  { href: '/skills', label: 'Skills' },
  { href: '/software-projects', label: 'Projects' },
  { href: '/media-gallery', label: 'Media' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-[#0a0e14]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8" aria-label="Main navigation">
        <Link href="/home" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Shield className="h-7 w-7 text-[#00e6e6]" />
          <span className="text-white">Thomas<span className="text-[#00e6e6]">.dev</span></span>
        </Link>
        <button className="rounded p-2 text-gray-300 hover:text-[#00e6e6] md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
        <div className={`${open ? 'absolute inset-x-0 top-full flex flex-col border-b border-white/10 bg-[#0d131a] px-5 py-4' : 'hidden'} gap-5 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? 'page' : undefined}
              className={`text-sm transition-colors hover:text-[#00e6e6] ${pathname === href ? 'text-[#00e6e6]' : 'text-gray-300'}`}>
              {label}
            </Link>
          ))}
          <Link href="/admin" onClick={() => setOpen(false)} className="text-sm text-gray-500 transition-colors hover:text-[#00e6e6]">Admin</Link>
        </div>
      </nav>
    </header>
  );
}
