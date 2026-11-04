import Link from 'next/link';
import Image from 'next/image';
import {
  Code,
  Database,
  ChevronRight,
  Globe,
  Laptop,
  PenTool,
  Server,
  Smartphone,
  Terminal,
  Video,
  UserRound,
} from 'lucide-react';
import { PageHeading } from '@/components/page-heading';
import { TypingRole } from '@/components/typing-role';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const skillIconMap = { Code, Database, Globe, Laptop, PenTool, Server, Smartphone, Terminal, Video };

export default async function HomePage() {
  const [skills, projects, savedSettings] = await Promise.all([
    db.skill.findMany({
      take: 8,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, category: true, iconName: true, description: true, level: true },
    }),
    db.softwareProject.findMany({
      take: 2,
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      select: { id: true, title: true, description: true, tags: true },
    }),
    db.portfolioSettings.findUnique({ where: { id: 'main' } }),
  ]);
  const settings = savedSettings ?? {
    displayName: 'Thomas Makoye',
    roles: ['Full-Stack Developer', 'System Administrator', 'Graphic Designer'],
    heroDescription: 'Bridging the gap between robust system administration, creative design, and innovative full-stack software engineering.',
    aboutIntro: 'I am a dedicated IT Officer and Full-Stack Developer. My career is fueled by a deep passion for both system administration and software engineering.',
    aboutDescription: 'I believe understanding underlying infrastructure is just as important as writing clean, efficient code. From configuring robust Linux environments and containerizing applications to designing intuitive UI/UX with Inkscape and building complex React applications.',
    profilePhotoUrl: '',
  };

  return (
    <>
      <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(#00e6e6 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="pointer-events-none absolute right-[12%] top-1/4 h-96 w-96 rounded-full bg-[#00e6e6]/10 blur-[100px] mix-blend-screen" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 text-center sm:px-8 md:grid-cols-[1.2fr_0.8fr] md:text-left">
          <div>
            <p className="mb-3 flex items-center justify-center gap-2 font-mono text-sm text-[#00e6e6] md:justify-start">
              <Terminal className="h-4 w-4" /> thomas@portfolio:~$ whoami
            </p>
            <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {settings.displayName}
              <TypingRole roles={settings.roles} />
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 md:mx-0 md:text-xl">
              {settings.heroDescription}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 md:justify-start">
              <Link
                href="#projects"
                className="group flex items-center rounded bg-[#00e6e6] px-8 py-4 font-bold text-[#0a0e14] shadow-[0_0_15px_rgba(0,230,230,0.4)] transition-colors hover:bg-[#00c2c2]"
              >
                Explore My Work <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/media-gallery"
                className="rounded border border-gray-700 bg-transparent px-8 py-4 font-semibold text-gray-300 transition hover:border-[#00e6e6] hover:text-[#00e6e6]"
              >
                Media Gallery
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm md:max-w-md">
            <div className="relative aspect-square rounded-full border-2 border-dashed border-[#00e6e6]/40 p-3 shadow-[0_0_45px_rgba(0,230,230,0.12)]">
              <div className="relative h-full w-full overflow-hidden rounded-full border border-[#00e6e6]/20 bg-[#0d131a]">
                {settings.profilePhotoUrl ? (
                  <Image src={settings.profilePhotoUrl} alt={`${settings.displayName} profile photo`} fill unoptimized priority className="object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-gray-600">
                    <UserRound className="h-28 w-28 text-[#00e6e6]/50 sm:h-36 sm:w-36" />
                    <span className="mt-4 text-sm">Add your photo in Admin → Home page</span>
                  </div>
                )}
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-full border border-transparent border-t-[#00e6e6]/70 motion-safe:animate-[spin_30s_linear_infinite]" />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative border-y border-gray-800 bg-[#0d131a] py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 md:grid-cols-2">
          <div className="w-full">
            <h2 className="mb-6 flex items-center text-3xl font-bold text-white md:text-4xl">
              <Terminal className="mr-3 h-8 w-8 text-[#00e6e6]" />
              whoami
            </h2>
            <div className="mb-8 h-1 w-16 bg-[#00e6e6]" />
            <div className="rounded-lg border border-gray-800 bg-[#0a0e14] p-6 font-mono text-sm leading-relaxed text-gray-300 shadow-inner md:text-base">
              <p className="mb-4">
                <span className="text-[#00e6e6]">thomas@portfolio</span>:<span className="text-blue-400">~</span>$ cat about.txt
              </p>
              <p className="mb-4 text-gray-400">
                {settings.aboutIntro}
              </p>
              <p className="text-gray-400">
                {settings.aboutDescription}
              </p>
              <p className="mt-4 text-gray-500">
                <span className="text-[#00e6e6]">thomas@portfolio</span>:<span className="text-blue-400">~</span>$ <span className="animate-pulse">_</span>
              </p>
            </div>
          </div>
          <div className="flex w-full justify-center">
            <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-full border-2 border-dashed border-[#00e6e6]/30 motion-safe:animate-[spin_60s_linear_infinite]">
              <div className="absolute inset-4 flex items-center justify-center rounded-full border border-[#00e6e6]/10">
                <Server className="h-24 w-24 text-[#00e6e6]/50 motion-safe:animate-[spin_60s_linear_infinite_reverse]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="relative bg-[#0a0e14] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-16 flex flex-col items-start justify-between md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Technical Arsenal</h2>
              <div className="mb-6 h-1 w-16 bg-[#00e6e6]" />
              <p className="text-gray-400">Tools, frameworks, and technologies deployed in my environment.</p>
            </div>
          </div>

          {skills.length ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {skills.map(skill => {
                const Icon = skillIconMap[skill.iconName as keyof typeof skillIconMap] ?? Code;
                return (
                  <article
                    key={skill.id}
                    className="group flex flex-col items-center justify-center rounded border border-gray-800 bg-[#0d131a] p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:border-[#00e6e6] hover:shadow-[0_0_15px_rgba(0,230,230,0.2)]"
                  >
                    <div className="mb-4 rounded-full border border-transparent bg-[#0a0e14] p-4 text-gray-400 transition-colors group-hover:border-[#00e6e6]/30 group-hover:text-[#00e6e6]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-200 transition-colors group-hover:text-white">{skill.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">{skill.category}</p>
                    <p className="mt-3 line-clamp-2 min-h-8 text-xs leading-relaxed text-gray-400">{skill.description}</p>
                    <div className="mt-4 w-full">
                      <div className="mb-1 flex justify-between text-xs text-gray-500"><span>My level</span><span className="text-[#00e6e6]">{skill.level}%</span></div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
                        <div className="h-full rounded-full bg-[#00e6e6] transition-all" style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="rounded-lg border border-gray-800 bg-[#0d131a] p-6 text-gray-400">Skills will appear here once they are added.</p>
          )}

          <div className="mt-10 text-center md:text-left">
            <Link href="/skills" className="font-medium text-[#00e6e6] hover:text-white">View all skills <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section id="projects" className="relative border-t border-gray-800 bg-[#0d131a] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-16">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Deployed Projects</h2>
            <div className="mb-6 h-1 w-16 bg-[#00e6e6]" />
            <p className="text-gray-400">A selection of software projects built to solve real-world problems.</p>
          </div>

          {projects.length ? (
            <div className="grid gap-8 lg:grid-cols-2">
              {projects.map((project, index) => {
                const Icon = index % 2 === 0 ? Smartphone : Globe;
                return (
                  <article
                    key={project.id}
                    className="group relative flex h-full flex-col overflow-hidden rounded border border-gray-800 bg-[#0a0e14] p-8 transition-all hover:border-[#00e6e6] hover:shadow-[0_0_20px_rgba(0,230,230,0.15)]"
                  >
                    <div className="absolute right-0 top-0 p-6 opacity-5 transition-opacity group-hover:opacity-20">
                      <Icon className="h-24 w-24 text-[#00e6e6]" />
                    </div>
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="mb-6 flex items-center justify-between">
                        <div className="rounded border border-gray-800 bg-[#0d131a] p-3 text-gray-400 transition-colors group-hover:border-[#00e6e6]/50 group-hover:text-[#00e6e6]">
                          <Icon className="h-8 w-8" />
                        </div>
                      </div>
                      <h3 className="mb-4 text-2xl font-bold text-white transition-colors group-hover:text-[#00e6e6]">{project.title}</h3>
                      <p className="mb-8 flex-grow leading-relaxed text-gray-400">{project.description}</p>
                      <div className="mt-auto flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="rounded border border-[#00e6e6]/20 bg-[#00e6e6]/10 px-3 py-1 text-xs font-medium text-[#00e6e6]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="rounded-lg border border-gray-800 bg-[#0a0e14] p-6 text-gray-400">Projects will appear here once they are added.</p>
          )}
          <div className="mt-10">
            <Link href="/software-projects" className="font-medium text-[#00e6e6] hover:text-white">Browse all projects <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
