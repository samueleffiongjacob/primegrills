import React from 'react';

interface Tab {
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  count?: number;
  color?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: number;
  onChange: (index: number) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => onChange(index)}
              className={`
                group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm
                ${activeTab === index 
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.icon && (
                <span className={`mr-2 ${activeTab === index ? tab.color : 'text-gray-400'}`}>
                  {tab.icon}
                </span>
              )}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${activeTab === index
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-900'}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export const TabPanel: React.FC<{ children: React.ReactNode; active: boolean }> = ({
  children,
  active
}) => {
  if (!active) return null;
  return <div className="py-4">{children}</div>;
};
