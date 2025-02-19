import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { showToast } from '../utils/toast';

// Types for our order data
interface Order {
    id: string;
    customerName: string;
    orderDate: string;
    items: string[];
    totalAmount: number;
    status: 'completed' | 'canceled';
    cancellationReason?: string;
}


// interface OrderProps {
//     orders: Order[];
// }

export const CompletedOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {

        const fetchOrders = async () => {
            try {
                await showToast.promise(
                    axios.get<Order[]>('https://api.example.com/orders'),
                    {
                        loading: 'Fetching orders...',
                        success: 'Orders loaded successfully!',
                        error: 'Failed to load orders',
                    }
                );
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                showToast.error('Error loading orders: ' + errorMessage);
                console.error('Error fetching orders:', error);
                const dummyOrders: Order[] = [
                    {
                        id: '1',
                        customerName: 'John Doe',
                        orderDate: '2023-07-20',
                        items: ['Prime Ribeye Steak', 'Grilled Vegetables'],
                        totalAmount: 89.99,
                        status: 'completed'
                    },
                    {
                        id: '2',
                        customerName: 'Jane Smith',
                        orderDate: '2023-07-19',
                        items: ['BBQ Ribs', 'Coleslaw'],
                        totalAmount: 45.99,
                        status: 'canceled',
                        cancellationReason: 'Customer request'
                    },
                ];
        
                setOrders(dummyOrders);
            }
        };

        fetchOrders();
        
    }, []);

    const completed = orders.filter(order => order.status === 'completed');
    

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-20rem)] hide-scrollbar">
            <div className="bg-green-500 px-6 py-4 sticky top-0 z-10">
                <h2 className="text-white text-xl font-semibold">Completed Orders</h2>
            </div>
            <div className="overflow-auto h-[calc(100%-3.5rem)] hide-scrollbar">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-800 text-white sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2">Order ID</th>
                            <th className="px-4 py-2">Customer Name</th>
                            <th className="px-4 py-2">Order Date</th>
                            <th className="px-4 py-2">Items</th>
                            <th className="px-4 py-2">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completed.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{order.id}</td>
                                <td className="border px-4 py-2">{order.customerName}</td>
                                <td className="border px-4 py-2">{order.orderDate}</td>
                                <td className="border px-4 py-2">{order.items.join(', ')}</td>
                                <td className="border px-4 py-2">${order.totalAmount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const CanceledOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get<Order[]>('https://api.example.com/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                const dummyOrders: Order[] = [
                    {
                        id: '1',
                        customerName: 'John Doe',
                        orderDate: '2023-07-20',
                        items: ['Prime Ribeye Steak', 'Grilled Vegetables'],
                        totalAmount: 89.99,
                        status: 'completed'
                    },
                    {
                        id: '2',
                        customerName: 'Jane Smith',
                        orderDate: '2023-07-19',
                        items: ['BBQ Ribs', 'Coleslaw'],
                        totalAmount: 45.99,
                        status: 'canceled',
                        cancellationReason: 'Customer request'
                    },
                ];
        
                setOrders(dummyOrders);
            }
        };

        fetchOrders();
    }, []);

    const canceled = orders.filter(order => order.status === 'canceled');


    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-20rem)] hide-scrollbar">
            <div className="bg-red-500 px-6 py-4 sticky top-0 z-10">
                <h2 className="text-white text-xl font-semibold">Canceled Orders</h2>
            </div>
            <div className="overflow-auto h-[calc(100%-3.5rem)]">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-2">Order ID</th>
                            <th className="px-4 py-2">Customer Name</th>
                            <th className="px-4 py-2">Order Date</th>
                            <th className="px-4 py-2">Items</th>
                            <th className="px-4 py-2">Total Amount</th>
                            <th className="px-4 py-2">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {canceled.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{order.id}</td>
                                <td className="border px-4 py-2">{order.customerName}</td>
                                <td className="border px-4 py-2">{order.orderDate}</td>
                                <td className="border px-4 py-2">{order.items.join(', ')}</td>
                                <td className="border px-4 py-2">${order.totalAmount.toFixed(2)}</td>
                                <td className="border px-4 py-2">{order.cancellationReason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

interface OrderStatusProps {
  status: 'pending' | 'completed' | 'cancelled';
}

const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  // Demo data - replace with actual data
  const orders = [
    {
      id: '001',
      customer: 'John Doe',
      items: ['Classic Burger', 'Fries', 'Coke'],
      total: 2500,
      time: '10:30 AM',
      status
    },
    // Add more orders as needed
  ];

  const getStatusColor = (orderStatus: string) => {
    switch (orderStatus) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-20rem)] overflow-auto hide-scrollbar">
      {orders.map((order) => (
        <div 
          key={order.id}
          className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
              <p className="text-gray-600">{order.customer}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-600">Items: {order.items.join(', ')}</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{order.time}</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;
