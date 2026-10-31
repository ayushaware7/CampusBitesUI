import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLiveOrders from './AdminLiveOrders';
import AdminPastOrders from './AdminPastOrders';
import AdminMenu from './AdminMenu';
import AdminAddonGroups from './AdminAddonGroups';
import AdminBranding from './AdminBranding';
import useLiveOrders from './useLiveOrders';

const TABS = [
  { id: 'menu', label: 'Menu' },
  { id: 'addons', label: 'Add-ons' },
  { id: 'live', label: 'Live Orders' },
  { id: 'past', label: 'Past Orders' },
  { id: 'branding', label: 'Branding' },
];

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('menu');
  const navigate = useNavigate();
  const live = useLiveOrders(); // polled here so the badge is right on every tab

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const buttonClass = (id) =>
    activeView === id
      ? 'text-lg font-medium text-white bg-brand-500 py-2 px-4 rounded-lg shadow-md'
      : 'text-lg font-medium text-gray-600 hover:text-brand-500 py-2 px-4';

  const views = {
    menu: <AdminMenu />,
    addons: <AdminAddonGroups />,
    live: <AdminLiveOrders {...live} />,
    past: <AdminPastOrders />,
    branding: <AdminBranding />,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 p-4 bg-white shadow rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex flex-wrap gap-2 items-center">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveView(tab.id)} className={`${buttonClass(tab.id)} flex items-center`}>
                {tab.label}
                {tab.id === 'live' && live.orders.length > 0 && (
                  <span
                    aria-label={`${live.orders.length} live orders`}
                    className={`ml-2 rounded-full min-w-[1.5rem] h-6 px-1.5 flex items-center justify-center text-sm font-bold ${
                      activeView === 'live' ? 'bg-white text-brand-600' : 'bg-brand-500 text-white'
                    }`}
                  >
                    {live.orders.length}
                  </span>
                )}
              </button>
            ))}
            <button onClick={handleLogout} className="text-lg font-medium text-red-500 hover:text-red-700 py-2 px-4">
              Logout
            </button>
          </div>
        </div>

        <div className="content-area">{views[activeView]}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
