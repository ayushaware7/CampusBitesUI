import React, { useState } from 'react';
import { adminApi } from '../../services/api';
import OrderCard from './OrderCard';
import { btnDanger, btnPrimary, ErrorText } from './ui';

// What the canteen can do next from each status (the server enforces the same rules).
const NEXT = {
  PLACED: { to: 'PREPARING', label: 'Start preparing' },
  PREPARING: { to: 'READY', label: 'Mark ready' },
  READY: { to: 'COMPLETED', label: 'Mark collected' },
};
const CAN_REJECT = ['PLACED', 'PREPARING'];

// Shows the live orders the dashboard already loads and polls (see useLiveOrders).
const AdminLiveOrders = ({ orders, loading, error: loadError, reload }) => {
  const [error, setError] = useState('');

  const move = async (order, to) => {
    if (to === 'REJECTED' && !window.confirm(`Reject order ${order.code}? The customer has already paid; refund them from the Razorpay dashboard.`)) return;
    setError('');
    try {
      await adminApi.setOrderStatus(order.id, to);
    } catch (err) {
      setError(err.message);
    }
    reload(); // on failure too: the order may have been changed elsewhere, so show the truth
  };

  return (
    <div>
      <ErrorText>{error || loadError}</ErrorText>
      {loading && <p className="text-center text-gray-600">Loading orders…</p>}
      {!loading && orders.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-2xl font-semibold text-gray-500">No live orders right now 🎉</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o}>
            {CAN_REJECT.includes(o.status) && (
              <button className={btnDanger} onClick={() => move(o, 'REJECTED')}>Reject</button>
            )}
            {NEXT[o.status] && (
              <button className={btnPrimary} onClick={() => move(o, NEXT[o.status].to)}>{NEXT[o.status].label}</button>
            )}
          </OrderCard>
        ))}
      </div>
    </div>
  );
};

export default AdminLiveOrders;
