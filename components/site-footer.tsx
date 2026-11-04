import Link from 'next/link';
import { Github, Mail, Shield } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-900 bg-black py-10 text-center">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-5">
        <Shield className="mb-3 h-7 w-7 text-[#00e6e6] opacity-60" />
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} Thomas Makoye. System Online.</p>
        <div className="mt-5 flex gap-5 text-gray-500">
          <Link href="https://github.com/" aria-label="GitHub" className="hover:text-[#00e6e6]"><Github size={19} /></Link>
          <Link href="mailto:contact@example.com" aria-label="Email" className="hover:text-[#00e6e6]"><Mail size={19} /></Link>
        </div>
      </div>
    </footer>
  );
}
