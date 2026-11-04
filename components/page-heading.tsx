export function PageHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && <p className="mb-3 font-mono text-sm text-[#00e6e6]">{eyebrow}</p>}
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
      <div className="my-5 h-1 w-16 bg-[#00e6e6]" />
      {description && <p className="text-lg leading-relaxed text-gray-400">{description}</p>}
    </div>
  );
}
