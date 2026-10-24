import React, { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { formatPaise, toPaise, toRupees } from '../../utils/money';
import { btnDanger, btnGhost, btnPrimary, ErrorText, inputCls, Modal } from './ui';

const blank = { name: '', minSelect: 0, maxSelect: 1, addons: [] };

const fromGroup = (g) => ({
  name: g.name,
  minSelect: g.minSelect,
  maxSelect: g.maxSelect,
  addons: g.addons.map((a) => ({ id: a.id, name: a.name, price: toRupees(a.pricePaise), soldOut: !a.isAvailable })),
});

// e.g. a "Toppings" group: pick 0 to 2 of Extra cheese (+₹20), Olives (+₹15).
const GroupForm = ({ group, onSaved, onClose }) => {
  const [f, setF] = useState(group ? fromGroup(group) : blank);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (patch) => setF((prev) => ({ ...prev, ...patch }));
  const setAddon = (i, patch) => set({ addons: f.addons.map((a, j) => (j === i ? { ...a, ...patch } : a)) });

  const submit = async (e) => {
    e.preventDefault();
    const addons = f.addons.map((a, i) => ({
      id: a.id || 0,
      name: a.name,
      pricePaise: a.price === '' ? 0 : toPaise(a.price),
      soldOut: a.soldOut,
      sortOrder: i,
    }));
    if (addons.some((a) => Number.isNaN(a.pricePaise))) return setError('Add-on prices must be 0 or more.');

    setSaving(true);
    setError('');
    try {
      await adminApi.saveAddonGroup(group ? group.id : 0, {
        name: f.name,
        minSelect: Number(f.minSelect),
        maxSelect: Number(f.maxSelect),
        sortOrder: 0,
        addons,
      });
      onSaved();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal title={group ? `Edit ${group.name}` : 'New add-on group'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <ErrorText>{error}</ErrorText>
        <label className="block">
          <span className="text-sm text-gray-700">Group name (what the customer sees)</span>
          <input className={inputCls} value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="Toppings" required />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Customer must pick at least</span>
            <input className={inputCls} type="number" min="0" value={f.minSelect} onChange={(e) => set({ minSelect: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">…and at most</span>
            <input className={inputCls} type="number" min="1" value={f.maxSelect} onChange={(e) => set({ maxSelect: e.target.value })} />
          </label>
        </div>
        <p className="text-xs text-gray-500">At least 0 = optional. At least 1 and at most 1 = the customer must choose exactly one.</p>

        <fieldset className="border rounded-lg p-3 space-y-2">
          <legend className="px-1 text-sm font-medium text-gray-700">Options</legend>
          {f.addons.map((a, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input className={`${inputCls} flex-1 min-w-[8rem]`} placeholder="Option name" value={a.name} onChange={(e) => setAddon(i, { name: e.target.value })} required />
              <input className={`${inputCls} w-28`} type="number" min="0" step="0.01" placeholder="Extra ₹" value={a.price} onChange={(e) => setAddon(i, { price: e.target.value })} />
              <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={a.soldOut} onChange={(e) => setAddon(i, { soldOut: e.target.checked })} /> Sold out</label>
              <button type="button" className={btnDanger} onClick={() => set({ addons: f.addons.filter((_, j) => j !== i) })}>Remove</button>
            </div>
          ))}
          <button type="button" className={btnGhost} onClick={() => set({ addons: [...f.addons, { id: 0, name: '', price: '', soldOut: false }] })}>
            + Add option
          </button>
        </fieldset>

        <div className="flex justify-end gap-3">
          <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
          <button type="submit" className={btnPrimary} disabled={saving}>{saving ? 'Saving…' : 'Save group'}</button>
        </div>
      </form>
    </Modal>
  );
};

const AdminAddonGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = new, object = edit

  const load = useCallback(async () => {
    try {
      setGroups(await adminApi.addonGroups());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (g) => {
    if (!window.confirm(`Delete "${g.name}"? It is removed from every item that uses it.`)) return;
    setError('');
    try {
      await adminApi.deleteAddonGroup(g.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading…</p>;

  return (
    <div>
      <ErrorText>{error}</ErrorText>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600 text-sm">Groups are shared: attach the same group to many items from the item form.</p>
        <button className={btnPrimary} onClick={() => setEditing(null)}>+ New group</button>
      </div>

      {groups.length === 0 && <p className="text-gray-500">No add-on groups yet.</p>}
      <ul className="space-y-3">
        {groups.map((g) => (
          <li key={g.id} className="bg-white rounded-lg shadow p-4 flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-medium text-gray-800">
                {g.name} <span className="text-sm text-gray-500">(pick {g.minSelect === g.maxSelect ? g.maxSelect : `${g.minSelect}–${g.maxSelect}`})</span>
              </p>
              <p className="text-sm text-gray-500">
                {g.addons.map((a) => `${a.name}${a.pricePaise > 0 ? ` +${formatPaise(a.pricePaise)}` : ''}${a.isAvailable ? '' : ' (sold out)'}`).join(', ') || 'No options'}
              </p>
            </div>
            <div className="flex gap-2">
              <button className={btnGhost} onClick={() => setEditing(g)}>Edit</button>
              <button className={btnDanger} onClick={() => remove(g)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editing !== undefined && (
        <GroupForm
          group={editing}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            load();
          }}
        />
      )}
    </div>
  );
};

export default AdminAddonGroups;
