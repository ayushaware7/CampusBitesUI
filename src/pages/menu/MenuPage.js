import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import useMenu from '../../hooks/useMenu';
import ItemGrid from '../../components/menu/ItemGrid';
import { formatPaise } from '../../utils/money';

const ALL = 'All';

const MenuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, totalItems, totalPaise } = useCart();
  const { categories, loading, error, reload } = useMenu();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ?category=lunch (from the landing page) matches a category name case-insensitively
  const wanted = (new URLSearchParams(location.search).get('category') || '').toLowerCase();
  const selected = categories.find((c) => c.name.toLowerCase() === wanted)?.name || ALL;
  const visible = selected === ALL ? categories : categories.filter((c) => c.name === selected);
  const hasItems = visible.some((c) => c.items.length > 0);

  const select = (name) => {
    navigate(name === ALL ? '/menu' : `/menu?category=${encodeURIComponent(name)}`);
    setMobileOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-20 left-0 right-0 mx-10 bg-red-50 p-4 rounded-lg shadow-md z-50">
        <div className="text-red-600 mb-3">{error}</div>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={reload}>
          Retry
        </button>
      </div>
    );
  }

  const names = [ALL, ...categories.map((c) => c.name)];
  const categoryButtons = names.map((name, index) => (
    <li key={name}>
      <button
        onClick={() => select(name)}
        className={`w-full text-left py-3 px-6 border-b border-gray-100 transition-colors duration-200 flex items-center ${
          selected === name
            ? 'bg-brand-50 text-brand-600 font-medium border-l-4 border-l-brand-500'
            : 'hover:bg-gray-50 text-gray-700'
        }`}
      >
        {index > 0 && (
          <span className="mr-3 w-6 h-6 flex items-center justify-center bg-brand-500 text-white rounded-full text-sm">
            {index}
          </span>
        )}
        <span className="font-medium">{name}</span>
      </button>
    </li>
  ));

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      {/* Mobile category toggle */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-md z-20 p-2">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-between w-full p-2 bg-brand-500 text-white rounded-lg"
        >
          <span className="font-medium">Categories: {selected}</span>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed top-28 left-0 right-0 bg-white shadow-lg z-20 max-h-64 overflow-y-auto">
          <ul>{categoryButtons}</ul>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 bg-white shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto z-10">
          <div className="p-4 bg-brand-500 text-white">
            <h2 className="text-xl font-bold">Categories</h2>
          </div>
          <ul className="py-2">{categoryButtons}</ul>
        </div>

        <div className="md:ml-64 flex-1 p-6 pt-24 md:pt-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Menu</h1>
          <div className="max-w-6xl mx-auto">
            {!hasItems ? (
              <div className="text-center text-gray-500 py-16">No menu items available yet</div>
            ) : (
              visible
                .filter((c) => c.items.length > 0)
                .map((c) => (
                  <section key={c.id} className="mb-10">
                    {selected === ALL && <h2 className="text-2xl font-semibold text-gray-800 mb-4">{c.name}</h2>}
                    <ItemGrid items={c.items} />
                  </section>
                ))
            )}
          </div>
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 right-0 mb-6 mr-6 z-30">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800">Cart</span>
              <span className="bg-brand-500 text-white px-2 py-1 rounded-full text-xs">{totalItems} items</span>
            </div>
            <div className="text-gray-800 font-medium">Total: {formatPaise(totalPaise)}</div>
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg mt-2 transition-colors duration-200"
            >
              View cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
