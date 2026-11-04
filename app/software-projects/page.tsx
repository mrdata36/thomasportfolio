import Image from 'next/image';
import { ExternalLink, Github, Smartphone } from 'lucide-react';
import { db } from '@/lib/db';
import { PageHeading } from '@/components/page-heading';

export const dynamic = 'force-dynamic';

export default async function SoftwareProjectsPage() {
  const projects = await db.softwareProject.findMany({ orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }] });
  return (
    <section className="min-h-screen px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <PageHeading eyebrow="SELECTED WORK" title="Software Projects" description="A selection of digital products and software I have designed and built." />
        {projects.length ? <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => <article key={project.id} className="group overflow-hidden rounded-xl border border-gray-800 bg-[#0d131a] transition hover:border-[#00e6e6]/70">
            {project.imageUrl ? <div className="relative aspect-[16/8] bg-[#0a0e14]">
              <Image src={project.imageUrl} alt={project.title} fill unoptimized className="object-cover transition duration-500 group-hover:scale-[1.02]" />
            </div> : <div className="flex aspect-[16/8] items-center justify-center bg-[#0a0e14]"><Smartphone className="h-14 w-14 text-[#00e6e6]/70" /></div>}
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white">{project.title}</h2>
              <p className="mt-3 leading-relaxed text-gray-400">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-full border border-[#00e6e6]/20 bg-[#00e6e6]/10 px-3 py-1 text-xs text-[#00e6e6]">{tag}</span>)}</div>
              <div className="mt-6 flex gap-5 text-sm">
                {project.liveUrl && <a className="inline-flex items-center gap-2 text-[#00e6e6] hover:text-white" href={project.liveUrl} target="_blank" rel="noreferrer">Live project <ExternalLink size={15} /></a>}
                {project.repoUrl && <a className="inline-flex items-center gap-2 text-gray-400 hover:text-white" href={project.repoUrl} target="_blank" rel="noreferrer"><Github size={15} /> Source code</a>}
              </div>
            </div>
          </article>)}
        </div> : <p className="rounded-xl border border-gray-800 bg-[#0d131a] p-8 text-gray-400">Projects will appear here once they are added from the admin dashboard.</p>}
      </div>
    </section>
  );
}
