'use client';

import { useMemo, useState } from 'react';
import { Code, Database, Globe, Laptop, PenTool, Search, Server, Smartphone, Terminal, Video } from 'lucide-react';

type Skill = {
  id: string;
  name: string;
  category: string;
  iconName: string;
  description: string;
  level: number;
};

const iconMap = { Code, Database, Globe, Laptop, PenTool, Server, Smartphone, Terminal, Video };

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  const [category, setCategory] = useState('All categories');
  const [query, setQuery] = useState('');
  const categories = useMemo(
    () => ['All categories', ...Array.from(new Set(skills.map(skill => skill.category || 'General'))).sort()],
    [skills],
  );
  const filteredSkills = useMemo(() => {
    const search = query.trim().toLowerCase();
    return skills.filter(skill => {
      const matchesCategory = category === 'All categories' || (skill.category || 'General') === category;
      const matchesSearch = !search ||
        skill.name.toLowerCase().includes(search) ||
        skill.description.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [category, query, skills]);

  if (!skills.length) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-[#0d131a]/80 p-8 text-center">
        <p className="text-gray-400">Skills will appear here once they are added from the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-800 bg-[#0d131a] p-4 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search skills</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search skills..."
            className="w-full rounded-lg border border-gray-700 bg-[#0a0e14] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-[#00e6e6]"
          />
        </label>
        <label>
          <span className="sr-only">Filter by category</span>
          <select
            value={category}
            onChange={event => setCategory(event.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#0a0e14] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00e6e6] sm:min-w-52"
          >
            {categories.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <p className="self-center text-xs text-gray-500 sm:px-2" aria-live="polite">
          {filteredSkills.length} of {skills.length} skills
        </p>
      </div>

      {filteredSkills.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSkills.map(skill => {
            const Icon = iconMap[skill.iconName as keyof typeof iconMap] ?? Code;
            return (
              <article
                key={skill.id}
                className="group flex min-h-56 flex-col rounded-xl border border-gray-800 bg-[#0d131a] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#00e6e6]/70 hover:shadow-[0_0_22px_rgba(0,230,230,0.1)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-800 bg-[#0a0e14] text-gray-400 transition group-hover:border-[#00e6e6]/40 group-hover:text-[#00e6e6]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[#00e6e6]/80">{skill.category || 'General'}</p>
                <h2 className="font-semibold leading-snug text-white transition group-hover:text-[#00e6e6]">{skill.name}</h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-400">
                  {skill.description || 'Details coming soon.'}
                </p>
                <div className="mt-4 border-t border-gray-800/80 pt-3">
                  <div className="mb-1.5 flex justify-between text-xs text-gray-500">
                    <span>My proficiency</span>
                    <span className="font-mono text-[#00e6e6]">{skill.level}%</span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-gray-800"
                    role="progressbar"
                    aria-label={`${skill.name} proficiency`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={skill.level}
                  >
                    <div className="h-full rounded-full bg-[#00e6e6] transition-[width] duration-500" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-700 p-8 text-center text-gray-400">
          No skills match this filter. Try another category or search.
        </p>
      )}
    </div>
  );
}
