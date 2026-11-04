'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { ImagePlus, LogOut, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Resource = 'skills' | 'software-projects' | 'media-gallery';
type RecordItem = Record<string, unknown> & { id: string };
type Field = { name: string; label: string; help?: string; kind?: 'textarea' | 'select' | 'tags' | 'number' | 'range'; options?: string[]; required?: boolean };
type PortfolioSettings = {
  displayName: string;
  roles: string[];
  heroDescription: string;
  aboutIntro: string;
  aboutDescription: string;
  profilePhotoUrl: string;
};

const skillCategories = [
  'Development', 'Frontend', 'Backend', 'Infrastructure', 'DevOps', 'Security',
  'Database', 'Network', 'Design', 'Video', 'Data', 'Mobile', 'API',
  'IT Support', 'Hosting', 'Audio', 'Project Management', 'Other',
];
const skillIcons = ['Code', 'Server', 'Terminal', 'Database', 'Laptop', 'Globe', 'Smartphone', 'PenTool', 'Video'];

const sections: { key: Resource; title: string; fields: Field[] }[] = [
  { key: 'skills', title: 'Skills', fields: [
    { name: 'name', label: 'Skill name', required: true },
    { name: 'category', label: 'Category', kind: 'select', options: skillCategories },
    { name: 'iconName', label: 'Icon', kind: 'select', options: skillIcons },
    { name: 'description', label: 'Description', kind: 'textarea' },
    { name: 'level', label: 'My skill level (%)', kind: 'range' },
    { name: 'sortOrder', label: 'Display order', kind: 'number' },
  ] },
  { key: 'software-projects', title: 'Software projects', fields: [
    { name: 'title', label: 'Project title', required: true }, { name: 'description', label: 'Description', kind: 'textarea', required: true },
    { name: 'imageUrl', label: 'Image URL' }, { name: 'repoUrl', label: 'Repository URL' },
    { name: 'liveUrl', label: 'Live project URL' }, { name: 'tags', label: 'Tags (comma separated)', kind: 'tags' },
    { name: 'sortOrder', label: 'Display order', kind: 'number' },
  ] },
  { key: 'media-gallery', title: 'Media portfolio', fields: [
    { name: 'title', label: 'Title', required: true }, { name: 'type', label: 'Media type', kind: 'select', options: ['IMAGE', 'VIDEO'], required: true },
    { name: 'mediaUrl', label: 'Media link or direct URL', help: 'Pinterest: open the pin and copy its full URL from the browser address bar (format: pinterest.com/pin/123456789/). Do not use the short pin.it link or paste embed HTML. YouTube, Vimeo, TikTok and Instagram video links can embed; other social videos open at their source.', required: true },
    { name: 'thumbnailUrl', label: 'Preview image URL (optional)', help: 'For Pinterest, leave this blank; the pin preview is embedded automatically. For other social posts, optionally paste a direct image URL ending in .jpg, .png or similar. Do not paste iframe/embed code here. For videos, use this for the thumbnail.' },
    { name: 'tool', label: 'Tool (Inkscape, Kdenlive, OBS…)' }, { name: 'description', label: 'Description', kind: 'textarea' },
    { name: 'tags', label: 'Tags (comma separated)', kind: 'tags' }, { name: 'sortOrder', label: 'Display order', kind: 'number' },
  ] },
];
const itemLabels: Record<Resource, string> = {
  skills: 'skill',
  'software-projects': 'software project',
  'media-gallery': 'media item',
};

const defaults: Record<Resource, Record<string, string>> = {
  skills: { name: '', category: 'Development', iconName: 'Code', description: '', level: '50', sortOrder: '0' },
  'software-projects': { title: '', description: '', imageUrl: '', repoUrl: '', liveUrl: '', tags: '', sortOrder: '0' },
  'media-gallery': { title: '', type: 'IMAGE', mediaUrl: '', thumbnailUrl: '', tool: '', description: '', tags: '', sortOrder: '0' },
};

function toFormValues(resource: Resource, item?: RecordItem) {
  const values = { ...defaults[resource] };
  if (!item) return values;
  for (const key of Object.keys(values)) {
    const value = item[key];
    values[key] = Array.isArray(value) ? value.join(', ') : value == null ? '' : String(value);
  }
  return values;
}

export function AdminDashboard({
  initialData,
  initialSettings,
}: {
  initialData: Record<Resource, RecordItem[]>;
  initialSettings: PortfolioSettings;
}) {
  const router = useRouter();
  const [resource, setResource] = useState<Resource>('skills');
  const [activeTab, setActiveTab] = useState<Resource | 'home-settings'>('skills');
  const [data, setData] = useState(initialData);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [values, setValues] = useState(toFormValues('skills'));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const [rolesText, setRolesText] = useState(initialSettings.roles.join('\n'));
  const [uploading, setUploading] = useState(false);
  const activeSection = sections.find(section => section.key === resource)!;

  function chooseResource(next: Resource) {
    setResource(next);
    setActiveTab(next);
    setEditing(null);
    setValues(toFormValues(next));
    setError('');
  }

  function editItem(item: RecordItem) {
    setEditing(item);
    setValues(toFormValues(resource, item));
    setError('');
    document.getElementById('content-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const payload: Record<string, string | number | string[]> = { ...values };
    for (const field of activeSection.fields) {
      if (field.kind === 'tags') payload[field.name] = values[field.name].split(',').map(tag => tag.trim()).filter(Boolean);
      if (field.kind === 'number' || field.kind === 'range') payload[field.name] = Number(values[field.name]) || 0;
    }

    try {
      const endpoint = `/api/admin/content/${resource}${editing ? `/${editing.id}` : ''}`;
      const response = await fetch(endpoint, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not save this item.');
      setData(current => ({
        ...current,
        [resource]: editing
          ? current[resource].map(item => item.id === editing.id ? result.item as RecordItem : item)
          : [...current[resource], result.item as RecordItem],
      }));
      setEditing(null);
      setValues(toFormValues(resource));
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this item.');
    } finally {
      setBusy(false);
    }
  }

  async function uploadProfileImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.set('image', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not upload this image.');
      setSettings(current => ({ ...current, profilePhotoUrl: result.url }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Could not upload this image.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const payload = {
      displayName: settings.displayName,
      roles: rolesText.split('\n').map(role => role.trim()).filter(Boolean),
      heroDescription: settings.heroDescription,
      aboutIntro: settings.aboutIntro,
      aboutDescription: settings.aboutDescription,
      profilePhotoUrl: settings.profilePhotoUrl,
    };
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not save home page settings.');
      setSettings(result.settings);
      setRolesText(result.settings.roles.join('\n'));
      router.refresh();
    } catch (settingsError) {
      setError(settingsError instanceof Error ? settingsError.message : 'Could not save home page settings.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: RecordItem) {
    if (!window.confirm(`Delete "${String(item.title ?? item.name)}"? This cannot be undone.`)) return;
    setError('');
    try {
      const response = await fetch(`/api/admin/content/${resource}/${item.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not delete this item.');
      setData(current => ({ ...current, [resource]: current[resource].filter(entry => entry.id !== item.id) }));
      if (editing?.id === item.id) {
        setEditing(null);
        setValues(toFormValues(resource));
      }
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete this item.');
    }
  }

  async function logout() {
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Could not sign out. Please try again.');
      router.replace('/admin/login');
      router.refresh();
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : 'Could not sign out.');
    }
  }

  return <section className="min-h-screen px-5 pb-20 pt-32 sm:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div><p className="mb-2 font-mono text-sm text-[#00e6e6]">ADMIN / CONTENT</p><h1 className="text-4xl font-bold text-white">Portfolio dashboard</h1></div>
        <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:border-[#00e6e6] hover:text-[#00e6e6]"><LogOut size={16} /> Sign out</button>
      </div>
      {error && <p role="alert" className="mb-5 text-sm text-red-400">{error}</p>}

      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Content type">
        <button role="tab" aria-selected={activeTab === 'home-settings'} onClick={() => { setActiveTab('home-settings'); setError(''); }}
          className={`rounded-lg px-4 py-2 text-sm transition ${activeTab === 'home-settings' ? 'bg-[#00e6e6] font-semibold text-[#0a0e14]' : 'border border-gray-700 text-gray-300 hover:border-[#00e6e6]'}`}>
          Home page
        </button>
        {sections.map(section => <button key={section.key} role="tab" aria-selected={activeTab === section.key} onClick={() => chooseResource(section.key)}
          className={`rounded-lg px-4 py-2 text-sm transition ${activeTab === section.key ? 'bg-[#00e6e6] font-semibold text-[#0a0e14]' : 'border border-gray-700 text-gray-300 hover:border-[#00e6e6]'}`}>
          {section.title} ({data[section.key].length})
        </button>)}
      </div>

      {activeTab === 'home-settings' ? (
        <form onSubmit={saveSettings} className="max-w-3xl space-y-5 rounded-xl border border-[#00e6e6]/20 bg-[#0d131a] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white">Edit home page content</h2>
          <label className="block text-sm text-gray-300">Display name
            <input required maxLength={100} value={settings.displayName} onChange={event => setSettings(current => ({ ...current, displayName: event.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-gray-700 bg-[#0a0e14] px-3 py-2.5 text-white outline-none focus:border-[#00e6e6]" />
          </label>
          <label className="block text-sm text-gray-300">Typing animation roles (one per line)
            <textarea rows={3} value={rolesText} onChange={event => setRolesText(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gray-700 bg-[#0a0e14] px-3 py-2.5 text-white outline-none focus:border-[#00e6e6]" />
          </label>
          <label className="block text-sm text-gray-300">Hero description
            <textarea rows={3} value={settings.heroDescription} onChange={event => setSettings(current => ({ ...current, heroDescription: event.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-gray-700 bg-[#0a0e14] px-3 py-2.5 text-white outline-none focus:border-[#00e6e6]" />
          </label>
          <label className="block text-sm text-gray-300">About introduction
            <textarea rows={3} value={settings.aboutIntro} onChange={event => setSettings(current => ({ ...current, aboutIntro: event.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-gray-700 bg-[#0a0e14] px-3 py-2.5 text-white outline-none focus:border-[#00e6e6]" />
          </label>
          <label className="block text-sm text-gray-300">About details
            <textarea rows={4} value={settings.aboutDescription} onChange={event => setSettings(current => ({ ...current, aboutDescription: event.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-gray-700 bg-[#0a0e14] px-3 py-2.5 text-white outline-none focus:border-[#00e6e6]" />
          </label>
          <div className="space-y-4 rounded-lg border border-gray-800 bg-[#0a0e14] p-4">
            <p className="text-sm font-medium text-white">Profile photo</p>
            {settings.profilePhotoUrl && <img src={settings.profilePhotoUrl} alt="Current profile" className="h-36 w-36 rounded-full border-2 border-[#00e6e6]/50 object-cover" />}
            <label className="block text-sm text-gray-300">Image URL
              <input type="url" value={settings.profilePhotoUrl.startsWith('/uploads/') ? '' : settings.profilePhotoUrl}
                onChange={event => setSettings(current => ({ ...current, profilePhotoUrl: event.target.value }))}
                placeholder="https://example.com/my-photo.jpg"
                className="mt-1.5 w-full rounded-lg border border-gray-700 bg-[#0d131a] px-3 py-2.5 text-white outline-none focus:border-[#00e6e6]" />
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm text-gray-200 transition hover:border-[#00e6e6] hover:text-[#00e6e6]">
              <ImagePlus size={17} /> {uploading ? 'Uploading…' : 'Upload image from computer'}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadProfileImage} disabled={uploading} className="sr-only" />
            </label>
            <p className="text-xs text-gray-500">JPEG, PNG, WebP or GIF; maximum 5 MB. Uploads are stored on this server.</p>
            {settings.profilePhotoUrl && <button type="button" onClick={() => setSettings(current => ({ ...current, profilePhotoUrl: '' }))} className="ml-3 text-sm text-red-400 hover:text-red-300">Remove photo</button>}
          </div>
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button disabled={busy || uploading} className="rounded-lg bg-[#00e6e6] px-6 py-3 font-bold text-[#0a0e14] transition hover:bg-[#00c2c2] disabled:opacity-50">
            {busy ? 'Saving…' : 'Save home page'}
          </button>
        </form>
      ) : (
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
        <div className="space-y-3">
          {data[resource].length ? data[resource].map(item => <article key={item.id} className="flex items-start justify-between gap-4 rounded-xl border border-gray-800 bg-[#0d131a] p-5">
            <div className="min-w-0"><h2 className="font-semibold text-white">{String(item.title ?? item.name)}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-gray-400">{String(item.description ?? item.category ?? item.mediaUrl ?? '')}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => editItem(item)} aria-label="Edit item" className="rounded-lg border border-gray-700 p-2 text-gray-300 hover:border-[#00e6e6] hover:text-[#00e6e6]"><Pencil size={16} /></button>
              <button onClick={() => remove(item)} aria-label="Delete item" className="rounded-lg border border-gray-700 p-2 text-gray-300 hover:border-red-500 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </article>) : <div className="rounded-xl border border-dashed border-gray-700 p-8 text-center text-gray-400">No {activeSection.title.toLowerCase()} yet. Add the first item using the form.</div>}
        </div>

        <form id="content-form" onSubmit={save} className="scroll-mt-24 rounded-xl border border-[#00e6e6]/20 bg-[#0d131a] p-6">
          <h2 className="mb-5 text-xl font-bold text-white">{editing ? `Edit ${itemLabels[resource]}` : `Add ${itemLabels[resource]}`}</h2>
          <div className="space-y-4">
            {activeSection.fields.map(field => <label key={field.name} className="block text-sm text-gray-300">
              <span className="mb-1.5 block">{field.label}</span>
              {field.kind === 'textarea' ? <textarea required={field.required} rows={4} value={values[field.name]} onChange={event => setValues(current => ({ ...current, [field.name]: event.target.value }))} className="w-full resize-y rounded-lg border border-gray-700 bg-[#0a0e14] px-3 py-2.5 text-white outline-none focus:border-[#00e6e6]" /> :
                field.kind === 'select' ? <select required={field.required} value={values[field.name]} onChange={event => setValues(current => ({ ...current, [field.name]: event.target.value }))} className="w-full rounded-lg border border-gray-700 bg-[#0a0e14] px-3 py-2.5 text-white outline-none focus:border-[#00e6e6]">{field.options?.map(option => <option key={option}>{option}</option>)}</select> :
                  <>{field.kind === 'range' && <span className="mb-1 block text-[#00e6e6]">{values[field.name]}%</span>}<input required={field.required} type={field.kind === 'number' ? 'number' : field.kind === 'range' ? 'range' : 'text'} min={field.kind === 'number' || field.kind === 'range' ? 0 : undefined} max={field.kind === 'range' ? 100 : undefined} value={values[field.name]} onChange={event => setValues(current => ({ ...current, [field.name]: event.target.value }))} className={`w-full rounded-lg border border-gray-700 bg-[#0a0e14] px-3 py-2.5 text-white outline-none focus:border-[#00e6e6] ${field.kind === 'range' ? 'accent-[#00e6e6]' : ''}`} /></>}
              {field.help && <span className="mt-1.5 block text-xs leading-relaxed text-gray-500">{field.help}</span>}
            </label>)}
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
          <div className="mt-6 flex gap-3">
            <button disabled={busy} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#00e6e6] px-4 py-3 font-bold text-[#0a0e14] transition hover:bg-[#00c2c2] disabled:opacity-50"><Plus size={17} />{busy ? 'Saving…' : editing ? 'Save changes' : 'Add item'}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setValues(toFormValues(resource)); }} className="rounded-lg border border-gray-700 px-4 py-3 text-sm text-gray-300 hover:border-gray-500">Cancel</button>}
          </div>
        </form>
      </div>
      )}
    </div>
  </section>;
}
