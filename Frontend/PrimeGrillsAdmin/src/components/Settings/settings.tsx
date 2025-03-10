import { useState } from 'react';

// Define types first before using them
type NotificationType = "order" | "review" | "marketing";
type SectionId = "Notifications"; // Add more section types here if needed

// Define section type
interface Section {
  id: SectionId;
  title: string;
  icon: string;
}

// Define props for Icon component
interface IconProps {
  name: string;
}

const Settings = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("Notifications");
  const [notifications, setNotifications] = useState<Record<NotificationType, boolean>>({
    order: true,
    review: false,
    marketing: false,
  });

  const handleNotificationToggle = (type: NotificationType) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSave = (section: string) => {
    alert(`${section} settings saved successfully!`);
  };

  const sections: Section[] = [
    { id: "Notifications", title: "Notifications", icon: "bell" },
  ];

  // Render icon based on name
  const Icon = ({ name }: IconProps) => {
    switch (name) {
      case 'clock':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        );
      case 'bell':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex max-h-[90vh]">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 bg-gradient-to-r from-indigo-800 to-orange-600">
          <h2 className="text-white text-xl font-bold">Settings</h2>
          <p className="text-indigo-100 text-sm">Manage your preferences</p>
        </div>
        <nav className="p-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center space-x-3 py-3 px-4 rounded-lg transition-all mb-2 text-left ${
                activeSection === section.id
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className={activeSection === section.id ? "text-indigo-600" : "text-gray-500"}>
                <Icon name={section.icon} />
              </span>
              <span>{section.title}</span>
              {activeSection === section.id && (
                <span className="ml-auto w-1 h-6 rounded-full bg-indigo-800"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 max-h-[90vh] overflow-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          {activeSection === "Notifications" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-medium">Preferences</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: "Order Notifications", type: "order" as NotificationType, description: "Get notified when a new order is placed" },
                  { label: "Review Notifications", type: "review" as NotificationType, description: "Receive alerts when customers leave reviews" },
                  { label: "Marketing Updates", type: "marketing" as NotificationType, description: "Stay updated with promotional opportunities" },
                ].map(({ label, type, description }) => (
                  <div key={type} className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{label}</h3>
                        <p className="text-sm text-gray-500 mt-1">{description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[type]}
                          onChange={() => handleNotificationToggle(type)}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full peer ${notifications[type] ? 'bg-indigo-800' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${notifications[type] ? 'after:translate-x-5' : ''}`}></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => handleSave("Notification Preferences")}
                  className="px-5 py-2 bg-indigo-800 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;