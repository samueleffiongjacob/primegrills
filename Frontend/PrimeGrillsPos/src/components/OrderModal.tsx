import React from 'react';
import ModalWrapper from './UI/Modal';
import { formatCurrency } from '../utils/formatCurrency';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    customerName: string;
    date: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    status: string;
  } | null;
}

const dummyOrder = {
    id: "ORD-001",
    customerName: "John Doe",
    date: "2024-01-15",
    items: [
        { name: "Classic Burger", quantity: 2, price: 12.99 },
        { name: "French Fries", quantity: 1, price: 4.99 },
        { name: "Soda", quantity: 2, price: 2.99 }
    ],
    total: 36.95,
    status: "pending"
};

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, order }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-orange-400';
      default:
        return 'bg-gray-300';
    }
  };

  order = order || dummyOrder;

  return (
    <ModalWrapper maxWidth="max-w-[600px]">
      <div className="p-5 max-w-[600px] w-full relative bg-white rounded-lg shadow dark:bg-slate-900">
        {/* Header */}
        <div className="border-b-2 border-gray-200 pb-4 mb-5">
          <h2 className="text-2xl font-semibold">Order Details</h2>
          <p className="text-gray-600">Order ID: {order.id}</p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          <div>
            <h3 className="text-xl font-medium mb-3">Customer Information</h3>
            <p className="text-gray-600 mb-2">Name: {order.customerName}</p>
            <p className="text-gray-600 mb-2">
              Date: {new Date(order.date).toLocaleDateString()}
            </p>
            <span className={`px-3 py-1.5 rounded-full text-sm text-white ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="mt-5">
          <h3 className="text-xl font-medium mb-4">Order Items</h3>
          
          {/* Header Row */}
          <div className="grid grid-cols-4 py-2 border-b font-semibold text-gray-700">
            <span>Item</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Total</span>
          </div>

          {/* Items */}
          {order.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 py-3 border-b border-gray-100">
              <span className="text-gray-800">{item.name}</span>
              <span className="text-gray-600">{item.quantity}</span>
              <span className="text-gray-600">{formatCurrency(item.price)}</span>
              <span className="text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}

          {/* Total Row */}
          <div className="grid grid-cols-4 py-3 border-t-2 border-gray-200 font-semibold mt-2">
            <span>Total</span>
            <span></span>
            <span></span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 items-center justify-between p-8 border-gray-200 dark:border-gray-600">
            <button
                onClick={isOpen ? onClose : undefined}
                className={'px-4 md:px-8 h-12 text-center text-black border rounded-sm'}
            >
                Cancel
            </button>
            <button
                
                onClick={onClose}
                className={'px-4 md:px-8 h-12 text-center bg-primary text-white rounded-sm'}
            >
                Process
            </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
