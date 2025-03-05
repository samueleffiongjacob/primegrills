import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { showToast } from '../utils/toast';
import logo from '@assets/images/primeLogo.png'
import ModalWrapper from './UI/Modal';

// Types for our order data
interface item {
    name: string;
    count: number;
}

interface Order {
    id: string;
    img: string;
    customerName: string;
    orderDate: string;
    items: item[];
    totalAmount: number;
    status: 'completed' | 'canceled' | 'pending';
    cancellationReason?: string;
}


// interface OrderProps {
//     orders: Order[];
// }

export const CompletedOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [OrderModal, setOrderModal] = useState<Order | undefined>(undefined);
    const [IsOpen, setIsOpen] = useState(false);

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
                        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
                        orderDate: '2023-07-20',
                        items: [
                            { name: 'Prime Ribeye Steak', count: 1}, 
                            { name: 'Grilled Vegetables', count: 3}
                        ],
                        totalAmount: 8900.99,
                        status: 'completed'
                    },
                    {
                        id: '2',
                        customerName: 'Jane Smith',
                        img: '',
                        orderDate: '2023-07-19',
                        items:  [
                            { name: 'BBQ Ribs', count: 4}, 
                            { name: 'Grilled Vegetables', count: 3}
                        ],
                        totalAmount: 4500.99,
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

    const handleModal = (order: Order) => {
        setIsOpen(true);
        setOrderModal(order);


    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-20rem)] hide-scrollbar">
            <div className="bg-green-500 px-6 py-4 sticky top-0 z-10">
                <h2 className="text-white text-xl font-semibold">Completed Orders</h2>
            </div>
            <div className="overflow-auto h-[calc(100%-3.5rem)] hide-scrollbar">
                <table className="w-full table-auto">
                    <thead className="bg-gray-800 text-white sticky top-0 z-10">
                        <tr>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Order ID</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Customer Name</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Order Date</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Items</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completed.map(order => (
                            <tr 
                            onClick={() => handleModal(order)}  
                            key={order.id} className="hover:bg-green-400/50 bg-secondary border-b border-gray-200">
                                <td className=" p-4">
                                    <span className='text-gray-700 font-bold'>{order.id}</span>
                                </td>
                                <td className=" p-4">
                                    <div className="flex items-center gap-4">
                                        <img 
                                        src={order.img || logo} 
                                        alt={order.customerName || 'Prime-Grills'} 
                                        className='h-12 w-12 rounded-full object-contain p-1 border border-gray-500'
                                        />
                                        <span className="font-semibold text-gray-800">{order.customerName}</span>
                                    </div>
                                </td>
                                <td className=" p-4">
                                    <span className="text-gray-700">{order.orderDate}</span>
                                </td>
                                <td className=" p-4">
                                    <span className="text-gray-700">{order.items.map((item) => {return item.name}).join(', ')}</span>
                                </td>
                                <td className=" p-4">
                                    <span className="text-green-600">₦{order.totalAmount.toFixed(2)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {IsOpen && (
                <OrderStatus order={OrderModal} isOpen={IsOpen} onClose={() => setIsOpen(false)} />
            )}
        </div>
    );
};

export const CanceledOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [OrderModal, setOrderModal] = useState<Order | undefined>(undefined);
    const [IsOpen, setIsOpen] = useState(false);

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
                        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
                        orderDate: '2023-07-20',
                        items:  [
                            { name: 'Prime Ribeye Steak', count: 1}, 
                            { name: 'Grilled Vegetables', count: 5}
                        ],
                        totalAmount: 8900.99,
                        status: 'completed'
                    },
                    {
                        id: '2',
                        customerName: 'Jane Smith',
                        img: '',
                        orderDate: '2023-07-19',
                        items:  [
                            { name: 'Prime BBQ Steak', count: 2}, 
                            { name: 'Coleslaw', count: 3}
                        ],
                        totalAmount: 4500.99,
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

    const handleModal = (order: Order) => {
        setIsOpen(true);
        setOrderModal(order);

    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-20rem)] hide-scrollbar">
            <div className="bg-red-500 px-6 py-4 sticky top-0 z-10">
                <h2 className="text-white text-xl font-semibold">Canceled Orders</h2>
            </div>
            <div className="overflow-auto h-[calc(100%-3.5rem)]">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Order ID</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Customer Name</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Order Date</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Items</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Total Amount</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {canceled.map(order => (
                            <tr
                            onClick={() => handleModal(order)}  
                            key={order.id} className="hover:bg-red-400/50 bg-secondary border-b border-gray-200">
                                <td className=" p-4">
                                    <span className='text-gray-700 font-bold'>{order.id}</span>
                                </td>
                                <td className=" p-4">
                                    <div className="flex items-center gap-4">
                                        <img 
                                        src={order.img || logo} 
                                        alt={order.customerName || 'Prime-Grills'} 
                                        className='h-12 w-12 rounded-full object-contain p-1 border border-gray-500'
                                        />
                                        <span className="font-semibold text-gray-800">{order.customerName}</span>
                                    </div>
                                </td>
                                <td className=" p-4">
                                    <span className="text-gray-700">{order.orderDate}</span>
                                </td>
                                <td className=" p-4">
                                    <span className="text-gray-700">{order.items.map((item) => {return item.name}).join(', ')}</span>
                                </td>
                                <td className=" p-4">
                                    <span className="text-green-600">₦{order.totalAmount.toFixed(2)}</span>
                                </td>
                                <td>
                                    <span className='text-red-500 font-bold italic'>{order.cancellationReason}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {IsOpen && (
                <OrderStatus order={OrderModal} isOpen={IsOpen} onClose={() => setIsOpen(false)} />
            )}
        </div>
    );
};


export const PendingOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [OrderModal, setOrderModal] = useState<Order | undefined>(undefined);
    const [IsOpen, setIsOpen] = useState(false);

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
                        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
                        orderDate: '2023-07-20',
                        items:  [
                            { name: 'Prime Ribeye Steak', count: 1}, 
                            { name: 'Grilled Vegetables', count: 3}
                        ],
                        totalAmount: 8900.99,
                        status: 'pending'
                    },
                    {
                        id: '2',
                        customerName: 'Jane Smith',
                        img: '',
                        orderDate: '2023-07-19',
                        items:  [
                            { name: 'Prime Ribeye Steak', count: 1}, 
                            { name: 'Grilled Vegetables', count: 3}
                        ],
                        totalAmount: 4500.99,
                        status: 'canceled',
                        cancellationReason: 'Customer request'
                    },
                ];
        
                setOrders(dummyOrders);
            }
        };

        fetchOrders();
    }, []);

    const canceled = orders.filter(order => order.status === 'pending');

    const handleModal = (order: Order) => {
        setIsOpen(true);
        setOrderModal(order);


    }


    return (
        <div
        
        className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-20rem)] hide-scrollbar">
            <div className="bg-amber-500 px-6 py-4 sticky top-0 z-10">
                <h2 className="text-white text-xl font-semibold">Pending Orders</h2>
            </div>
            <div className="overflow-auto h-[calc(100%-3.5rem)]">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Order ID</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Customer Name</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Order Date</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Items</th>
                            <th className="px-4 border-y border-gray-200 text-left py-2">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {canceled.map(order => (
                            <tr
                            onClick={() => handleModal(order)} 
                            key={order.id} className="hover:bg-amber-400/50 bg-secondary border-b border-gray-200">
                                <td className=" p-4">
                                    <span className='text-gray-700 font-bold'>{order.id}</span>
                                </td>
                                <td className=" p-4">
                                    <div className="flex items-center gap-4">
                                        <img 
                                        src={order.img || logo} 
                                        alt={order.customerName || 'Prime-Grills'} 
                                        className='h-12 w-12 rounded-full object-contain p-1 border border-gray-500'
                                        />
                                        <span className="font-semibold text-gray-800">{order.customerName}</span>
                                    </div>
                                </td>
                                <td className=" p-4">
                                    <span className="text-gray-700">{order.orderDate}</span>
                                </td>
                                <td className=" p-4">
                                <span className="text-gray-700">{order.items.map((item) => {return item.name}).join(', ')}</span>
                                </td>
                                <td className=" p-4">
                                    <span className="text-green-600">₦{order.totalAmount.toFixed(2)}</span>
                                </td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {IsOpen && (
                <OrderStatus order={OrderModal} isOpen={IsOpen} onClose={() => setIsOpen(false)} />
            )}
        </div>
    );
};


interface OrderStatusProps {
  isOpen: boolean;
  order: Order | undefined;
  onClose: () => void;

}

const OrderStatus: React.FC<OrderStatusProps> = ({ order, isOpen, onClose }) => {
  // Demo data - replace with actual data
  

  const getStatusColor = (orderStatus: string) => {
    switch (orderStatus) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!order) return null;

  return (
    <ModalWrapper
    onClick={isOpen ? onClose : undefined} 
    maxWidth='max-w-[600px]'>
        <div 
          key={order.id}
          className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
              <p className="text-gray-600">{order.customerName}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-600 font-bold">Items: 
                {order.items.map((item, index) => (
                    <div key={index} className='flex gap-4'>
                        <span className='text-gray-600'>
                            {item.name}
                        </span>
                        <span className='text-gray-600'>
                            X{item.count}
                        </span>
                    </div>
                ))}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{order.orderDate}</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
    </ModalWrapper>
  );
};

export default OrderStatus;
