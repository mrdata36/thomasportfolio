import { db } from '@/lib/db';
import { PageHeading } from '@/components/page-heading';
import { SkillsGrid } from '@/components/skills-grid';

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  const skills = await db.skill.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true, category: true, iconName: true, description: true, level: true },
  });

  return (
    <section className="relative min-h-screen px-5 pb-24 pt-32 sm:px-8 bg-[#0a0e14] text-gray-200">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#00e6e6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="pointer-events-none absolute right-1/4 top-32 h-96 w-96 rounded-full bg-[#00e6e6]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <PageHeading
          eyebrow="TECHNICAL EXPERTISE"
          title="Technical Arsenal"
          description="Explore my technical skills and filter by category to find the tools and technologies I work with."
        />

        <SkillsGrid skills={skills} />
      </div>
    </section>
  );
}