import React, { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { formatPaise } from '../../utils/money';
import ItemForm from './ItemForm';
import { btnDanger, btnGhost, btnPrimary, ErrorText, inputCls } from './ui';

const priceLabel = (item) => {
  if (item.variants.length === 0) return formatPaise(item.pricePaise);
  const prices = item.variants.map((v) => v.pricePaise);
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  return lo === hi ? formatPaise(lo) : `${formatPaise(lo)} – ${formatPaise(hi)}`;
};

const AdminMenu = () => {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [form, setForm] = useState(null); // { item, categoryId } while the item form is open

  const load = useCallback(async () => {
    try {
      const [menu, addonGroups] = await Promise.all([adminApi.menu(), adminApi.addonGroups()]);
      setCategories(menu.categories);
      setGroups(addonGroups);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Runs an admin action, then refreshes; failures show inline instead of silently doing nothing.
  const run = async (action) => {
    setError('');
    try {
      await action();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const addCategory = (e) => {
    e.preventDefault();
    run(async () => {
      await adminApi.saveCategory(0, { name: newCategory, sortOrder: categories.length + 1 });
      setNewCategory('');
    });
  };

  const renameCategory = (c) => {
    const name = window.prompt('Rename category', c.name);
    if (name && name.trim() !== c.name) run(() => adminApi.saveCategory(c.id, { name, sortOrder: c.sortOrder }));
  };

  const deleteCategory = (c) => {
    if (window.confirm(`Delete category "${c.name}"?`)) run(() => adminApi.deleteCategory(c.id));
  };

  const deleteItem = (item) => {
    if (window.confirm(`Delete "${item.name}"? Past orders keep it.`)) run(() => adminApi.deleteItem(item.id));
  };

  if (loading) return <p className="text-center text-gray-600">Loading menu…</p>;

  return (
    <div>
      <ErrorText>{error}</ErrorText>

      <form onSubmit={addCategory} className="flex gap-3 mb-6">
        <input className={inputCls} placeholder="New category, e.g. Lunch" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
        <button className={btnPrimary} type="submit">Add category</button>
      </form>

      {categories.length === 0 && <p className="text-gray-500">No categories yet. Add one above, then add items to it.</p>}

      <div className="space-y-6">
        {categories.map((c) => (
          <section key={c.id} className="bg-white rounded-lg shadow">
            <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800">{c.name}</h3>
              <div className="flex gap-2">
                <button className={btnPrimary} onClick={() => setForm({ item: null, categoryId: c.id })}>+ Add item</button>
                <button className={btnGhost} onClick={() => renameCategory(c)}>Rename</button>
                <button className={btnDanger} onClick={() => deleteCategory(c)}>Delete</button>
              </div>
            </div>

            {c.items.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">No items in this category.</p>
            ) : (
              <ul className="divide-y">
                {c.items.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.name}{' '}
                        <span className={`text-xs ${item.isVeg ? 'text-green-600' : 'text-red-600'}`}>● {item.isVeg ? 'Veg' : 'Non-veg'}</span>
                        {item.isSpecial && <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Special</span>}
                        {!item.isAvailable && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Sold out</span>}
                      </p>
                      <p className="text-sm text-gray-500">
                        {priceLabel(item)}
                        {item.variants.length > 0 && ` · ${item.variants.length} sizes`}
                        {item.addonGroups.length > 0 && ` · ${item.addonGroups.map((g) => g.name).join(', ')}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className={btnGhost} onClick={() => run(() => adminApi.setAvailability(item.id, !item.isAvailable))}>
                        {item.isAvailable ? 'Mark sold out' : 'Mark available'}
                      </button>
                      <button className={btnGhost} onClick={() => setForm({ item, categoryId: c.id })}>Edit</button>
                      <button className={btnDanger} onClick={() => deleteItem(item)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {form && (
        <ItemForm
          item={form.item}
          categoryId={form.categoryId}
          categories={categories}
          groups={groups}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            load();
          }}
        />
      )}
    </div>
  );
};

export default AdminMenu;
