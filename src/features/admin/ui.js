import React from 'react';
import { X } from 'lucide-react';

// Small shared bits for the admin screens.
export const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300';
export const btnPrimary =
  'bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-medium px-4 py-2 rounded-lg';
export const btnGhost = 'border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm';
export const btnDanger = 'border border-red-300 hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm';

export const ErrorText = ({ children }) =>
  children ? <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">{children}</p> : null;

export const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto p-4">
    <div className="bg-white w-full max-w-2xl rounded-xl my-8">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700">
          <X size={22} />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  </div>
);
