import React from 'react';
import { describeLine } from '../../utils/cart';
import { formatPaise } from '../../utils/money';

const BADGE = {
  PLACED: 'bg-yellow-100 text-yellow-800',
  PREPARING: 'bg-blue-100 text-blue-800',
  READY: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-700',
  REJECTED: 'bg-red-100 text-red-700',
};

// One order, with optional action buttons (children).
const OrderCard = ({ order, children }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
      <div>
        <p className="text-2xl font-bold tracking-widest text-orange-600">{order.code}</p>
        <p className="text-sm text-gray-600">
          {order.customerName} · {order.customerPhone}
        </p>
        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${BADGE[order.status] || ''}`}>{order.status}</span>
    </div>

    <ul className="divide-y text-sm">
      {order.items.map((l, i) => (
        <li key={i} className="py-2 flex justify-between gap-3">
          <div>
            <p className="font-medium text-gray-800">{l.quantity} × {l.itemName}</p>
            {describeLine({ variantName: l.variantName, addons: l.addons }) && (
              <p className="text-gray-500">{describeLine({ variantName: l.variantName, addons: l.addons })}</p>
            )}
          </div>
          <p className="text-gray-700">{formatPaise(l.unitPricePaise * l.quantity)}</p>
        </li>
      ))}
    </ul>

    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t mt-1">
      <span className="font-bold text-gray-800">Total {formatPaise(order.totalPaise)}</span>
      <div className="flex gap-2">{children}</div>
    </div>
  </div>
);

export default OrderCard;
