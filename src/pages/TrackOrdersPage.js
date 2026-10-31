import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../services/api';
import { describeLine } from '../utils/cart';
import { formatPaise } from '../utils/money';

const STEPS = ['PLACED', 'PREPARING', 'READY', 'COMPLETED'];
const LABEL = {
  PENDING_PAYMENT: 'Waiting for payment',
  PLACED: 'Order placed',
  PREPARING: 'Being prepared',
  READY: 'Ready for pickup!',
  COMPLETED: 'Collected',
  REJECTED: 'Rejected by the restaurant',
  CANCELLED: 'Cancelled',
};
const ACTIVE = ['PENDING_PAYMENT', 'PLACED', 'PREPARING', 'READY'];

function remembered() {
  try {
    return JSON.parse(localStorage.getItem('lastOrder') || '{}');
  } catch {
    return {};
  }
}

// Customers find their order with the pickup code and the phone number they ordered with.
const TrackOrdersPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(() => remembered().code || '');
  const [phone, setPhone] = useState(() => remembered().phone || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(async (c, p, quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      setOrder(await publicApi.trackOrder(c, p));
      setError('');
    } catch (err) {
      if (!quiet) setOrder(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // open the order the customer just placed
  useEffect(() => {
    const last = remembered();
    if (last.code && last.phone) lookup(last.code, last.phone);
  }, [lookup]);

  // keep the status fresh while the order is still moving
  useEffect(() => {
    if (!order || !ACTIVE.includes(order.status)) return undefined;
    const timer = setInterval(() => lookup(order.code, phone, true), 8000);
    return () => clearInterval(timer);
  }, [order, phone, lookup]);

  const submit = (e) => {
    e.preventDefault();
    lookup(code, phone);
  };

  const stepIndex = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 px-4 pb-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Track your order</h1>

        <form onSubmit={submit} className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-3 mb-6">
          <input
            className="flex-1 min-w-[8rem] border border-gray-300 rounded-lg px-3 py-2 uppercase"
            placeholder="Order code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <input
            className="flex-1 min-w-[8rem] border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-2 rounded-lg" type="submit">
            {loading ? 'Looking…' : 'Find order'}
          </button>
        </form>

        {error && <p className="text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

        {order && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
              <div>
                <p className="text-sm text-gray-500">Pickup code</p>
                <p className="text-3xl font-bold tracking-widest text-brand-600">{order.code}</p>
              </div>
              <p className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'READY' ? 'bg-green-100 text-green-700'
                : order.status === 'REJECTED' || order.status === 'CANCELLED' ? 'bg-red-100 text-red-700'
                : 'bg-brand-100 text-brand-700'}`}>
                {LABEL[order.status] || order.status}
              </p>
            </div>

            {stepIndex >= 0 && (
              <div className="flex items-center mb-6">
                {STEPS.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={`h-3 w-3 rounded-full ${i <= stepIndex ? 'bg-brand-500' : 'bg-gray-300'}`} title={LABEL[s]} />
                    {i < STEPS.length - 1 && <div className={`flex-1 h-1 ${i < stepIndex ? 'bg-brand-500' : 'bg-gray-300'}`} />}
                  </React.Fragment>
                ))}
              </div>
            )}
            {order.status === 'REJECTED' && (
              <p className="text-sm text-gray-600 mb-4">The restaurant could not make this order. Please contact them about your refund.</p>
            )}

            <ul className="divide-y">
              {order.items.map((l, i) => (
                <li key={i} className="py-3 flex justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-800">{l.quantity} × {l.itemName}</p>
                    {describeLine({ variantName: l.variantName, addons: l.addons }) && (
                      <p className="text-sm text-gray-500">{describeLine({ variantName: l.variantName, addons: l.addons })}</p>
                    )}
                  </div>
                  <p className="text-gray-700">{formatPaise(l.unitPricePaise * l.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-lg pt-4 border-t mt-2">
              <span>Total</span>
              <span>{formatPaise(order.totalPaise)}</span>
            </div>
          </div>
        )}

        <button onClick={() => navigate('/menu')} className="mt-6 text-brand-600 hover:text-brand-700 font-medium">
          ← Back to menu
        </button>
      </div>
    </div>
  );
};

export default TrackOrdersPage;
