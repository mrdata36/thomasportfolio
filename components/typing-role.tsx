'use client';

import { useEffect, useState } from 'react';

const defaultRoles = ['Full-Stack Developer', 'System Administrator', 'Graphic Designer'];

export function TypingRole({ roles = defaultRoles }: { roles?: string[] }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && typedText === role) {
      timeout = setTimeout(() => setIsDeleting(true), 1600);
    } else if (isDeleting && typedText === '') {
      timeout = setTimeout(() => {
        setRoleIndex(index => (index + 1) % roles.length);
        setIsDeleting(false);
      }, 350);
    } else {
      const nextLength = typedText.length + (isDeleting ? -1 : 1);
      timeout = setTimeout(() => setTypedText(role.slice(0, nextLength)), isDeleting ? 45 : 85);
    }

    return () => clearTimeout(timeout);
  }, [isDeleting, roleIndex, roles, typedText]);

  return (
    <span className="mt-3 flex min-h-14 flex-wrap items-center text-4xl font-semibold leading-tight sm:min-h-20 sm:text-6xl">
      <span className="text-[#00e6e6]">{typedText}</span>
      <span aria-hidden="true" className="typing-cursor ml-1 inline-block h-10 w-[3px] bg-[#00e6e6] sm:h-14" />
    </span>
  );
}
