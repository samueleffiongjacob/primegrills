import React from 'react';
import { UserCircleIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  return (
    <div className="h-[calc(100vh-7.5rem)] w-full mr-4 overflow-hidden">
      <div className="h-full p-6 bg-gray-50">
        {/* Settings Container */}
        <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden">
          {/* Settings Header - Sticky */}
          <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          {/* Settings Content - Scrollable */}
          <div className="overflow-y-auto h-[calc(100%-80px)] px-6">
            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
              {/* Profile Section */}
              <div className="col-span-2 space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <UserCircleIcon className="h-8 w-8 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg"
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
                      />
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Change Photo
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Security</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Settings */}
              <div className="space-y-6">
                {/* Notifications */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <BellIcon className="h-8 w-8 text-yellow-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">Email Notifications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">Push Notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button - Sticky at bottom */}
            <div className="sticky bottom-0 bg-white py-4 mt-8 border-t border-gray-200">
              <div className="flex justify-end">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;