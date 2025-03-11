import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/authContext";
import logo from '../../assets/images/primeLogo.png';
import { motion, AnimatePresence } from 'framer-motion';

// Improved typing for backend data
interface StaffProfile {
  role: string;
  gender: string;
  shift: string;
  shiftHours: string;
  age: string;
  status: string;
}

interface StaffUser {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  profileImage?: string;
  phone: string;
  address: string;
  staff_profile: StaffProfile;
}

// API service for better organization
const StaffService = {
  baseUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  
  async getAll(): Promise<StaffUser[]> {
    const response = await fetch(`${this.baseUrl}/api/staffs/all/`, {
      method: 'GET',
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch staff");
    return response.json();
  },
};

// Component configurations
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const Staff = () => {
  const { user: currentUser, isAdmin, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  // Filter users based on search term
  const [statusFilter, setStatusFilter] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");

  // Memoized fetch function
  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const staffUsers = await StaffService.getAll();
      
      // Process users to apply current user's status if needed
      const processedUsers = staffUsers.map(user => ({
        ...user,
        profileImage: user.profileImage || logo, // Default image if missing
        staff_profile: {
          ...user.staff_profile
        
        },
      }));
      
      setUsers(processedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load staff data. Please try again.");

    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser?.email, currentUser?.staff_profile.status]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

 // Filter users based on search term, status, and shift
 const filteredUsers = users.filter(user => 
  (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
  (user.staff_profile?.role?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
  (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
).filter(user => 
  (statusFilter ? user.staff_profile.status === statusFilter : true) &&
  (shiftFilter ? user.staff_profile.shift === shiftFilter : true)
);

  // Permission checks
  const canViewUsers = isAuthenticated && (currentUser?.staff_profile.status === "Active" || isAdmin);

  return (
    <div className="flex max-h-[85vh] bg-gray-100 flex-col">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="py-5 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Staff </h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <motion.div 
              className="flex justify-center items-center h-64"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <img src={logo} className="w-16 h-16" alt="Loading..." />
            </motion.div>
          ) : !canViewUsers ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <h2 className="text-xl font-semibold mb-4">Access Restricted</h2>
                <p className="mb-4">Please log in with appropriate permissions to view staff data.</p>
                {currentUser && currentUser.staff_profile.status === "Inactive" && (
                  <p className="text-red-600">Your account is inactive. Please contact an administrator.</p>
                )}
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                  <p>{error}</p>
                  <button 
                    onClick={fetchUsers} 
                    className="mt-2 text-sm underline"
                  >
                    Try again
                  </button>
                </div>
              )}
              
              <div className="mb-6 flex flex-wrap gap-4 items-center">
                {/* Status Filter */}
                <select 
                  className="border border-gray-300 rounded-lg p-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                
                {/* Shift Filter */}
                <select 
                  className="border border-gray-300 rounded-lg p-2"
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value)}
                >
                  <option value="">All Shifts</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select> 
                <div className="flex items-center gap-4 ml-auto">  
                   {/* Pagination info */}
                   <div className="py-3 px-4 border-t justify-self-start border-gray-200 text-sm text-gray-500">
                      Showing {Math.min(filteredUsers.length, itemsPerPage)} of {filteredUsers.length} staff members
                  </div>
                  <div>
                    <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">Show:</label>
                    <select 
                      id="itemsPerPage"
                      className="border border-gray-300 rounded-lg p-2"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      {ITEMS_PER_PAGE_OPTIONS.map(value => (
                        <option key={value} value={value}>{value} per page</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Search staff..."
                      className="w-64 p-2 pl-3 border rounded-lg border-gray-300 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setSearchTerm('')}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No staff members found{searchTerm ? ' matching your search criteria' : ''}.</p>
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-sm text-[#EE7F61]"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse">
                      <thead>
                        <tr className="bg-[#EE7F61] text-white">
                          <th className="py-3 px-4 text-left">ID</th>
                          <th className="py-3 px-4 text-left">Staff Name</th>
                          <th className="py-3 px-4 text-left">Email</th>
                          <th className="py-3 px-4 text-left">Role</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Image</th>
                          <th className="py-3 px-4 text-left">Shift</th>
                          <th className="py-3 px-4 text-left">Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {filteredUsers.slice(0, itemsPerPage).map((user, index) => (
                            <motion.tr 
                              key={user.id} 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.03 }}
                              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                            >
                              <td className="py-3 px-4 text-gray-600">#{user.id}</td>
                              <td className="py-3 px-4 font-medium">{user.name}</td>
                              <td className="py-3 px-4 text-gray-700">{user.email}</td>
                              <td className="py-3 px-4">{user.staff_profile.role}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  user.staff_profile.status === 'Active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {user.staff_profile.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <img 
                                  src={user.profileImage || logo} 
                                  alt={`${user.name} profile`} 
                                  className="w-10 h-10 rounded-full object-cover border" 
                                />
                              </td>
                              <td className="py-3 px-4">{user.staff_profile.shift}</td>
                              <td className="py-3 px-4 text-gray-600">{user.staff_profile.shiftHours}</td>
                    
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Staff;