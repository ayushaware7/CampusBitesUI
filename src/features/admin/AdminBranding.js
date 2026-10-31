import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { btnGhost, btnPrimary, ErrorText, inputCls } from './ui';

const DEFAULT_COLOR = '#f97316'; // the app's default orange, used when no colour is set

// How the restaurant looks to customers: name, tagline, logo and accent colour.
const AdminBranding = () => {
  const [f, setF] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.canteen()
      .then((c) => setF({ name: c.name, tagline: c.tagline, logoUrl: c.logoUrl, primaryColor: c.primaryColor, slug: c.slug }))
      .catch((err) => setError(err.message));
  }, []);

  const set = (patch) => {
    setSaved(false);
    setF((prev) => ({ ...prev, ...patch }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const c = await adminApi.saveCanteen({
        name: f.name,
        tagline: f.tagline,
        logoUrl: f.logoUrl,
        primaryColor: f.primaryColor,
      });
      setF({ name: c.name, tagline: c.tagline, logoUrl: c.logoUrl, primaryColor: c.primaryColor, slug: c.slug });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!f) return error ? <ErrorText>{error}</ErrorText> : <p className="text-gray-500">Loading…</p>;

  const color = f.primaryColor || DEFAULT_COLOR;

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 max-w-2xl space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Branding</h2>
      <p className="text-sm text-gray-500">
        This is what customers see after scanning your QR code. Their link: <code>/r/{f.slug}</code>
      </p>
      <ErrorText>{error}</ErrorText>

      <label className="block">
        <span className="text-sm text-gray-700">Restaurant name</span>
        <input className={inputCls} value={f.name} onChange={(e) => set({ name: e.target.value })} maxLength={100} required />
      </label>

      <label className="block">
        <span className="text-sm text-gray-700">Tagline (optional)</span>
        <input className={inputCls} value={f.tagline} onChange={(e) => set({ tagline: e.target.value })} maxLength={200} placeholder="Fresh. Fast. Local." />
      </label>

      <label className="block">
        <span className="text-sm text-gray-700">Logo link (optional, a https:// image address)</span>
        <input className={inputCls} type="url" value={f.logoUrl} onChange={(e) => set({ logoUrl: e.target.value })} maxLength={500} placeholder="https://example.com/logo.png" />
      </label>
      {f.logoUrl && <img src={f.logoUrl} alt="Logo preview" className="h-16 object-contain border rounded-lg p-1" />}

      <div>
        <span className="text-sm text-gray-700">Accent colour</span>
        <div className="flex items-center gap-3 mt-1">
          <input type="color" aria-label="Pick colour" value={color} onChange={(e) => set({ primaryColor: e.target.value })} className="h-10 w-14 p-0 border rounded" />
          <input className={`${inputCls} w-32`} value={f.primaryColor} onChange={(e) => set({ primaryColor: e.target.value })} placeholder={DEFAULT_COLOR} maxLength={7} />
          <button type="button" className={btnGhost} onClick={() => set({ primaryColor: '' })}>Use default</button>
          <span className="px-3 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: color }}>Preview</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className={btnPrimary} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        {saved && <span className="text-sm text-green-600">Saved. Customers see it on their next page load.</span>}
      </div>
    </form>
  );
};

export default AdminBranding;
