import React, { useState } from 'react';

const OrdersDashboard = () => {
  // Sample data - in a real app, this would come from your API
  const [orders, setOrders] = useState([
    { id: '001', customer: 'Emma Wilson', items: 'Pasta Carbonara, Garlic Bread', total: 24.99, status: 'pending', time: '10:30 AM' },
    { id: '002', customer: 'Liam Johnson', items: 'Grilled Salmon, Caesar Salad', total: 32.50, status: 'paid', time: '11:15 AM' },
    { id: '003', customer: 'Olivia Smith', items: 'Margherita Pizza, Tiramisu', total: 28.75, status: 'delivered', time: '10:05 AM' },
    { id: '004', customer: 'Noah Williams', items: 'Beef Burger, Fries, Coke', total: 19.99, status: 'pending', time: '11:45 AM' },
    { id: '005', customer: 'Ava Brown', items: 'Chicken Curry, Naan Bread, Rice', total: 26.50, status: 'paid', time: '12:20 PM' },
    { id: '006', customer: 'Sophia Jones', items: 'Sushi Platter, Miso Soup', total: 42.99, status: 'delivered', time: '1:10 PM' },
    { id: '007', customer: 'Lucas Davis', items: 'Steak, Roast Potatoes, Salad', total: 38.75, status: 'pending', time: '1:30 PM' },
    { id: '008', customer: 'Isabella Miller', items: 'Vegan Bowl, Fresh Juice', total: 22.50, status: 'paid', time: '2:05 PM' },
    { id: '009', customer: 'Mason Wilson', items: 'Fish & Chips, Tartar Sauce', total: 18.99, status: 'delivered', time: '12:45 PM' },
  ]);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);
  
  // Get counts for each status
  const pendingCount = orders.filter(order => order.status === 'pending').length;
  const paidCount = orders.filter(order => order.status === 'paid').length;
  const deliveredCount = orders.filter(order => order.status === 'delivered').length;
  
  // Function to handle status change
  const changeStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? {...order, status: newStatus} : order
    ));
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = '';
    let textColor = 'text-white';
    
    switch(status) {
      case 'pending':
        bgColor = 'bg-yellow-500';
        break;
      case 'paid':
        bgColor = 'bg-blue-500';
        break;
      case 'delivered':
        bgColor = 'bg-green-500';
        break;
      default:
        bgColor = 'bg-gray-500';
    }
    
    return (
      <span className={`${bgColor} ${textColor} px-2 py-1 rounded-full text-xs font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-h-[90vh] overflow-auto bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
        <div className="p-6 bg-gradient-to-r from-orange-600 to-indigo-800 text-white">
          <h1 className="text-2xl font-bold">Orders Dashboard</h1>
          <p className="text-purple-100">Manage all meal purchase orders</p>
        </div>
        
        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <h2 className="text-3xl font-bold text-gray-800">{pendingCount}</h2>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Paid Orders</p>
                <h2 className="text-3xl font-bold text-gray-800">{paidCount}</h2>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Delivered Orders</p>
                <h2 className="text-3xl font-bold text-gray-800">{deliveredCount}</h2>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b px-6">
          <button 
            onClick={() => setActiveTab('all')}
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'all' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            All Orders
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'pending' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setActiveTab('paid')}
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'paid' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            Paid
          </button>
          <button 
            onClick={() => setActiveTab('delivered')}
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'delivered' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            Delivered
          </button>
        </div>
        
        {/* Orders Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs">
                  <th className="py-3 px-4 text-left font-medium uppercase tracking-wider">Order ID</th>
                  <th className="py-3 px-4 text-left font-medium uppercase tracking-wider">Customer</th>
                  <th className="py-3 px-4 text-left font-medium uppercase tracking-wider">Items</th>
                  <th className="py-3 px-4 text-left font-medium uppercase tracking-wider">Total</th>
                  <th className="py-3 px-4 text-left font-medium uppercase tracking-wider">Time</th>
                  <th className="py-3 px-4 text-left font-medium uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{order.customer}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{order.items}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">${order.total.toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{order.time}</td>
                    <td className="py-4 px-4 text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4 text-sm space-x-2">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => changeStatus(order.id, 'paid')}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          Mark Paid
                        </button>
                      )}
                      {order.status === 'paid' && (
                        <button 
                          onClick={() => changeStatus(order.id, 'delivered')}
                          className="bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded text-xs"
                        >
                          Mark Delivered
                        </button>
                      )}
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2 text-gray-500">No orders found with this status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersDashboard;