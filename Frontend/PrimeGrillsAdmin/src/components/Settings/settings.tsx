import { useState } from "react";
import Button from "../Report/Button";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    order: true,
    review: false,
    marketing: false,
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleNotificationToggle = (type: string) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSave = (section: string) => {
    alert(`${section} settings saved successfully!`);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-600" : "bg-gray-100 text-gray-900"
      } p-6`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        {/* <Button
          onClick={toggleDarkMode}
          title={darkMode ? "Light Mode" : "Dark Mode"}
        /> */}
         <button onClick={toggleDarkMode} title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            {darkMode ? (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m8-8h1M3 12H2m15.364-6.364l-.707-.707m-9.9 9.9-.707.707m9.9 0 .707.707m-.707-9.9.707-.707M12 8a4 4 0 110 8 4 4 0 010-8z"
                />
                </svg>
            ) : (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-900 dark:text-gray-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657A8 8 0 018.34 8.34M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                </svg>
            )}
            </button>
 
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {/* Restaurant Profile */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">PrimeGrills Profile</h2>
          <p className="text-sm mb-4">Update PrimeGrills information</p>
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

        {/* Operating Hours */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Operating Hours</h2>
          <p className="text-sm mb-4">Set your working hours</p>
          <form className="space-y-4">
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

        {/* Contact Information */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
          <p className="text-sm mb-4">Update how customers can reach you</p>
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

        {/* Notification Preferences */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Notifications</h2>
          <p className="text-sm mb-4">Manage notification settings</p>
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
      </div>
    </div>
  );
};

export default Settings;
