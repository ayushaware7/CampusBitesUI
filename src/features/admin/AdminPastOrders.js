import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import OrderCard from './OrderCard';
import { ErrorText } from './ui';

const AdminPastOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .orders('past')
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <ErrorText>{error}</ErrorText>
      {loading && <p className="text-center text-gray-600">Loading orders…</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="text-center text-gray-500 py-10">No completed or rejected orders yet.</p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
      {orders.length === 200 && <p className="text-center text-sm text-gray-500 mt-4">Showing the latest 200 orders.</p>}
    </div>
  );
};

export default AdminPastOrders;
