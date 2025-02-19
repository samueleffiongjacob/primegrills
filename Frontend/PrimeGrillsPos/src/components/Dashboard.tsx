import React, { useState } from 'react';
import { Tabs, TabPanel } from './UI/Tabs';
import OrderStatus, { CanceledOrders, CompletedOrders } from './OrderStatus';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: 'Pending Orders',
      icon: <ClockIcon className="h-5 w-5" />,
      content: <OrderStatus status="pending" />,
      count: 5,
      color: 'text-yellow-500'
    },
    {
      label: 'Completed Orders',
      icon: <CheckCircleIcon className="h-5 w-5" />,
      content: <CompletedOrders />,
      count: 12,
      color: 'text-green-500'
    },
    {
      label: 'Cancelled Orders',
      icon: <XCircleIcon className="h-5 w-5" />,
      content: <CanceledOrders />,
      count: 2,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="h-[calc(100vh-7.5rem)] w-full mr-4 overflow-hidden">
      <div className="p-6 space-y-6 h-full">
        {/* Dashboard Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your restaurant orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tabs.map((tab, index) => (
            <div 
              key={index}
              onClick={() => setActiveTab(index)}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${tab.color}`}>
                    {tab.icon}
                  </div>
                  <h3 className="text-gray-700 font-semibold">{tab.label}</h3>
                </div>
                <span className={`${tab.color} text-xl font-bold`}>
                  {tab.count}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-24rem)] p-6 hide-scrollbar">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="px-6 pt-4 sticky top-0 bg-white z-20"
          />
          
          <div className="overflow-hidden">
            {tabs.map((tab, index) => (
              <TabPanel key={index} active={activeTab === index}>
                {tab.content}
              </TabPanel>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
