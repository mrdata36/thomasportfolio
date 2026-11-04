import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin-dashboard';
import { db } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');

  const [skills, projects, media, savedSettings] = await Promise.all([
    db.skill.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
    db.softwareProject.findMany({ orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }] }),
    db.graphicsMedia.findMany({ orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }] }),
    db.portfolioSettings.findUnique({
      where: { id: 'main' },
      select: {
        displayName: true,
        roles: true,
        heroDescription: true,
        aboutIntro: true,
        aboutDescription: true,
        profilePhotoUrl: true,
      },
    }),
  ]);
  const settings = savedSettings ?? {
    displayName: 'Thomas Makoye',
    roles: ['Full-Stack Developer', 'System Administrator', 'Graphic Designer'],
    heroDescription: 'Bridging the gap between robust system administration, creative design, and innovative full-stack software engineering.',
    aboutIntro: 'I am a dedicated IT Officer and Full-Stack Developer. My career is fueled by a deep passion for both system administration and software engineering.',
    aboutDescription: 'I believe understanding underlying infrastructure is just as important as writing clean, efficient code. From configuring robust Linux environments and containerizing applications to designing intuitive UI/UX with Inkscape and building complex React applications.',
    profilePhotoUrl: '',
  };

  return <AdminDashboard initialData={{ skills, 'software-projects': projects, 'media-gallery': media }} initialSettings={settings} />;
}
