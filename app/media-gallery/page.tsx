import { ExternalLink, Play, Film, Image as ImageIcon } from 'lucide-react';
import { db } from '@/lib/db';
import { PageHeading } from '@/components/page-heading';
import { MediaImagePreview } from '@/components/media-image-preview';

export const dynamic = 'force-dynamic';

function videoEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname === 'youtube.com' || parsed.hostname.endsWith('.youtube.com')) {
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
    }
    if (parsed.hostname === 'vimeo.com' || parsed.hostname.endsWith('.vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : url;
    }
    if (parsed.hostname === 'tiktok.com' || parsed.hostname.endsWith('.tiktok.com')) {
      const id = parsed.pathname.match(/\/video\/(\d+)/)?.[1];
      return id ? `https://www.tiktok.com/player/v1/${id}` : null;
    }
    if (parsed.hostname === 'instagram.com' || parsed.hostname.endsWith('.instagram.com')) {
      const match = parsed.pathname.match(/\/(reel|reels|p)\/([A-Za-z0-9_-]+)/);
      return match ? `https://www.instagram.com/${match[1]}/${match[2]}/embed` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function pinterestPinId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'pinterest.com' && !parsed.hostname.endsWith('.pinterest.com')) return null;
    return parsed.pathname.match(/\/pin\/(\d+)/)?.[1] ?? null;
  } catch {
    return null;
  }
}

function mediaPlatform(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (host === 'pinterest.com' || host.endsWith('.pinterest.com')) return 'Pinterest';
    if (host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtu.be') return 'YouTube';
    if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) return 'Vimeo';
    if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) return 'TikTok';
    if (host === 'instagram.com' || host.endsWith('.instagram.com')) return 'Instagram';
    if (host === 'facebook.com' || host.endsWith('.facebook.com') || host === 'fb.watch') return 'Facebook';
    return 'original source';
  } catch {
    return 'original source';
  }
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export default async function MediaGalleryPage() {
  const media = await db.graphicsMedia.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
  const images = media.filter(item => item.type === 'IMAGE');
  const videos = media.filter(item => item.type === 'VIDEO');

  return (
    <section className="relative min-h-screen px-5 pb-24 pt-32 sm:px-8 bg-[#0a0e14] text-gray-200">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#00e6e6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="pointer-events-none absolute left-1/4 top-20 h-96 w-96 rounded-full bg-[#00e6e6]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <PageHeading eyebrow="VISUAL WORK & ASSETS" title="Media Gallery" description="High-impact graphic design crafted with Inkscape and motion/video projects edited via Kdenlive and OBS." />

        {media.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-[#0d131a]/80 p-12 text-center backdrop-blur-md">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="text-gray-400">Media assets will appear here once added from your admin dashboard.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {images.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-[#00e6e6]/10 p-2 text-[#00e6e6] border border-[#00e6e6]/20">
                    <ImageIcon size={20} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Graphics & Design Portfolio</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map(item => {
                    const pinId = pinterestPinId(item.mediaUrl);
                    return (
                    <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-[#0d131a] transition-all duration-300 hover:-translate-y-1 hover:border-[#00e6e6]/60 hover:shadow-[0_0_25px_rgba(0,230,230,0.15)]">
                      <div className={`relative overflow-hidden bg-[#080b10] ${pinId && !item.thumbnailUrl ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
                        {pinId && !item.thumbnailUrl ? (
                          <iframe
                            src={`https://assets.pinterest.com/ext/embed.html?id=${pinId}`}
                            title={`${item.title} on Pinterest`}
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="h-full w-full border-0"
                          />
                        ) : (
                          <MediaImagePreview src={item.thumbnailUrl || item.mediaUrl} alt={item.title} />
                        )}
                      </div>
                      <div className="p-6">
                        {item.tool && (
                          <span className="mb-2 inline-block rounded border border-[#00e6e6]/20 bg-[#00e6e6]/10 px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#00e6e6]">
                            {item.tool}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-white group-hover:text-[#00e6e6] transition-colors">{item.title}</h3>
                        {item.description && <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.description}</p>}
                        <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#00e6e6] transition hover:text-white">
                          View on {mediaPlatform(item.mediaUrl)} <ExternalLink size={15} />
                        </a>
                      </div>
                    </article>
                  );})}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-[#00e6e6]/10 p-2 text-[#00e6e6] border border-[#00e6e6]/20">
                    <Film size={20} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Video & Motion Projects</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {videos.map(item => {
                    const embedUrl = videoEmbedUrl(item.mediaUrl);
                    return (
                      <article key={item.id} className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#0d131a] transition-all duration-300 hover:border-[#00e6e6]/60 hover:shadow-[0_0_25px_rgba(0,230,230,0.15)]">
                        <div className="aspect-video bg-black relative">
                          {isDirectVideo(item.mediaUrl) ? (
                            <video src={item.mediaUrl} poster={item.thumbnailUrl || undefined} controls preload="metadata" className="h-full w-full object-cover" />
                          ) : embedUrl ? (
                            <iframe src={embedUrl} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="h-full w-full" />
                          ) : (
                            <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="flex h-full items-center justify-center gap-2 text-[#00e6e6] hover:text-white bg-[#080b10]">
                              <ExternalLink size={18} /> View on {mediaPlatform(item.mediaUrl)}
                            </a>
                          )}
                        </div>
                        <div className="p-6">
                          {item.tool && (
                            <span className="mb-2 inline-block rounded border border-[#00e6e6]/20 bg-[#00e6e6]/10 px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#00e6e6]">
                              {item.tool}
                            </span>
                          )}
                          <h3 className="flex items-center gap-2 text-lg font-bold text-white group-hover:text-[#00e6e6] transition-colors">
                            <Play size={16} className="text-[#00e6e6]" /> {item.title}
                          </h3>
                          {item.description && <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.description}</p>}
                          <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#00e6e6] transition hover:text-white">
                            View on {mediaPlatform(item.mediaUrl)} <ExternalLink size={15} />
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}