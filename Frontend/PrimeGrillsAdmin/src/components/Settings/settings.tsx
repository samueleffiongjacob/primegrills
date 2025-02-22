import { useState } from "react";
import Button from "../Report/Button";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("Profile");
  const [notifications, setNotifications] = useState({
    order: true,
    review: false,
    marketing: false,
  });

  

  const handleNotificationToggle = (type: string) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSave = (section: string) => {
    alert(`${section} settings saved successfully!`);
  };

  const sections = [
    { id: "Profile", title: "PrimeGrills Profile" },
    { id: "Hours", title: "Operating Hours" },
    { id: "Contact", title: "Contact Information" },
    { id: "Notifications", title: "Notifications" },
  ];

  return (
    <div
      className="min-h-screen flex" >
      {/* Sidebar Links */}
      <div className="w-1/5 bg-white dark:bg-gray-800 shadow-md p-4 space-y-4">
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-2 rounded-md transition-all ${
                activeSection === section.id
                  ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="w-4/5 p-6">
        {activeSection === "Profile" && (
          <div>
            <h2 className="text-xl font-bold mb-4">PrimeGrills Profile</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Organization Name"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <textarea
                placeholder="Brief Description"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
              />
              <Button
                title="Save Changes"
                onClick={() => handleSave("Restaurant Profile")}
              />
            </form>
          </div>
        )}
        {activeSection === "Hours" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Operating Hours</h2>
            <form className="space-y-2">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <div key={day} className="flex justify-between items-center">
                  <label className="w-24">{day}</label>
                  <div className="flex items-center gap-2">
                    <select className="px-2 py-1 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      <option>9:00 AM</option>
                      <option>10:00 AM</option>
                    </select>
                    <span>to</span>
                    <select className="px-2 py-1 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      <option>9:00 PM</option>
                      <option>10:00 PM</option>
                    </select>
                  </div>
                </div>
              ))}
              <Button
                title="Update Hours"
                onClick={() => handleSave("Operating Hours")}
              />
            </form>
          </div>
        )}
        {activeSection === "Contact" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <form className="space-y-4">
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <textarea
                placeholder="Address"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
              />
              <Button
                title="Save Contact Info"
                onClick={() => handleSave("Contact Information")}
              />
            </form>
          </div>
        )}
        {activeSection === "Notifications" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <div className="space-y-4">
              {[
                { label: "Order Notifications", type: "order" },
                { label: "Review Notifications", type: "review" },
                { label: "Marketing Updates", type: "marketing" },
              ].map(({ label, type }) => (
                <div key={type} className="flex justify-between items-center">
                  <label>{label}</label>
                  <input
                    type="checkbox"
                    checked={notifications[type]}
                    onChange={() => handleNotificationToggle(type)}
                    className="toggle-input"
                  />
                </div>
              ))}
              <Button
                title="Save Preferences"
                onClick={() => handleSave("Notification Preferences")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
