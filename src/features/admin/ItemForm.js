import React, { useState } from 'react';
import { adminApi } from '../../services/api';
import { toPaise, toRupees } from '../../utils/money';
import { btnDanger, btnGhost, btnPrimary, ErrorText, inputCls, Modal } from './ui';

const empty = (categoryId) => ({
  categoryId,
  name: '',
  description: '',
  imageUrl: '',
  price: '',
  isVeg: true,
  isSpecial: false,
  soldOut: false,
  sortOrder: 0,
  variants: [],
  groupIds: [],
});

const fromItem = (item) => ({
  categoryId: item.categoryId,
  name: item.name,
  description: item.description,
  imageUrl: item.imageUrl,
  price: item.variants.length > 0 ? '' : toRupees(item.pricePaise),
  isVeg: item.isVeg,
  isSpecial: item.isSpecial,
  soldOut: !item.isAvailable,
  sortOrder: item.sortOrder,
  variants: item.variants.map((v) => ({
    id: v.id,
    name: v.name,
    price: toRupees(v.pricePaise),
    soldOut: !v.isAvailable,
  })),
  groupIds: item.addonGroups.map((g) => g.id),
});

// Create (item null) or edit an item together with its variants and add-on groups.
const ItemForm = ({ item, categoryId, categories, groups, onSaved, onClose }) => {
  const [f, setF] = useState(() => (item ? fromItem(item) : empty(categoryId)));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (patch) => setF((prev) => ({ ...prev, ...patch }));
  const setVariant = (i, patch) => set({ variants: f.variants.map((v, j) => (j === i ? { ...v, ...patch } : v)) });
  const toggleGroup = (id) =>
    set({ groupIds: f.groupIds.includes(id) ? f.groupIds.filter((g) => g !== id) : [...f.groupIds, id] });

  const submit = async (e) => {
    e.preventDefault();
    const hasVariants = f.variants.length > 0;
    const base = hasVariants ? 0 : toPaise(f.price);
    if (!hasVariants && !(base > 0)) return setError('Enter a price greater than 0.');
    const variants = f.variants.map((v, i) => ({
      id: v.id || 0,
      name: v.name,
      pricePaise: toPaise(v.price),
      soldOut: v.soldOut,
      sortOrder: i,
    }));
    if (variants.some((v) => !(v.pricePaise > 0))) return setError('Every size needs a price greater than 0.');

    setSaving(true);
    setError('');
    try {
      await adminApi.saveItem(item ? item.id : 0, {
        categoryId: Number(f.categoryId),
        name: f.name,
        description: f.description,
        imageUrl: f.imageUrl,
        pricePaise: base,
        isVeg: f.isVeg,
        isSpecial: f.isSpecial,
        soldOut: f.soldOut,
        sortOrder: Number(f.sortOrder) || 0,
        variants,
        addonGroupIds: f.groupIds,
      });
      onSaved();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal title={item ? `Edit ${item.name}` : 'Add item'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <ErrorText>{error}</ErrorText>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Name</span>
            <input className={inputCls} value={f.name} onChange={(e) => set({ name: e.target.value })} required />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Category</span>
            <select className={inputCls} value={f.categoryId} onChange={(e) => set({ categoryId: e.target.value })} required>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-gray-700">Description</span>
          <input className={inputCls} value={f.description} onChange={(e) => set({ description: e.target.value })} maxLength={500} />
        </label>
        <label className="block">
          <span className="text-sm text-gray-700">Image URL (https://… or /images/…)</span>
          <input className={inputCls} value={f.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} />
        </label>

        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.isVeg} onChange={(e) => set({ isVeg: e.target.checked })} /> Veg</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.isSpecial} onChange={(e) => set({ isSpecial: e.target.checked })} /> Today's special</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.soldOut} onChange={(e) => set({ soldOut: e.target.checked })} /> Sold out</label>
        </div>

        <fieldset className="border rounded-lg p-3">
          <legend className="px-1 text-sm font-medium text-gray-700">Price</legend>
          {f.variants.length === 0 ? (
            <label className="block">
              <span className="text-sm text-gray-700">Price (₹)</span>
              <input className={inputCls} type="number" min="0" step="0.01" value={f.price} onChange={(e) => set({ price: e.target.value })} />
            </label>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">This item has sizes, so each size carries its own price.</p>
              {f.variants.map((v, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <input className={`${inputCls} flex-1 min-w-[8rem]`} placeholder="Size, e.g. Large" value={v.name} onChange={(e) => setVariant(i, { name: e.target.value })} required />
                  <input className={`${inputCls} w-28`} type="number" min="0" step="0.01" placeholder="₹" value={v.price} onChange={(e) => setVariant(i, { price: e.target.value })} required />
                  <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={v.soldOut} onChange={(e) => setVariant(i, { soldOut: e.target.checked })} /> Sold out</label>
                  <button type="button" className={btnDanger} onClick={() => set({ variants: f.variants.filter((_, j) => j !== i) })}>Remove</button>
                </div>
              ))}
            </div>
          )}
          <button type="button" className={`${btnGhost} mt-3`} onClick={() => set({ variants: [...f.variants, { id: 0, name: '', price: '', soldOut: false }] })}>
            + Add a size
          </button>
        </fieldset>

        <fieldset className="border rounded-lg p-3">
          <legend className="px-1 text-sm font-medium text-gray-700">Add-on groups</legend>
          {groups.length === 0 ? (
            <p className="text-sm text-gray-500">No add-on groups yet. Create them in the "Add-ons" tab.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {groups.map((g) => (
                <label key={g.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={f.groupIds.includes(g.id)} onChange={() => toggleGroup(g.id)} />
                  {g.name}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
          <button type="submit" className={btnPrimary} disabled={saving}>{saving ? 'Saving…' : 'Save item'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default ItemForm;
