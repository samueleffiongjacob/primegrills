import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/authContext";
import logo from '../../assets/images/primeLogo.png';
import { motion, AnimatePresence } from 'framer-motion';
import StaffForm, { StaffFormData } from "./StaffForm";
import pencil from '../../assets/images/pencil.png';
import trash from '../../assets/images/trash.png';
import { getCookie } from "../../utils/cookie";
import LoginHistoryModal from "../LoginHistory";
import { showToast } from '../../utils/toast';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  last_login?: string;
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
    if (!response.ok) showToast.error("Failed to fetch staff");
    return response.json();
  },
  
  async create(data: StaffFormData): Promise<StaffUser> {
    const csrfToken = getCookie("csrftoken");
    const response = await fetch(`${this.baseUrl}/register_staff/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-CSRFToken": csrfToken || "",
      },
      credentials: "include",
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      toast.error(errorData.error || "Failed to create staff")
    }
    
    return response.json();
  },
  
  async update(data: StaffFormData, id: number): Promise<StaffUser> {
    console.log(JSON.stringify(data))
    const response = await fetch(`${this.baseUrl}/api/manager/staffs/update/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      toast.error(errorData.error || "Failed to update staff")
    }
    
    return response.json();
  },
  
  async delete(id: number): Promise<void> {
    const csrfToken = getCookie("csrftoken");
    const response = await fetch(`${this.baseUrl}/api/staffs/delete/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "X-CSRFToken": csrfToken || "",
      },
      credentials: "include"
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      toast.error(errorData.error || "Failed to delete staff")
      throw new Error(errorData.error || "Failed to delete staff");
    }
  }
};

// Component configurations
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

const Staff = () => {
  const { user: currentUser, isAdmin, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<StaffFormData | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState(false);
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

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setFormMode('add');
    setFormOpen(true);
  };

  const handleEditUser = (user: StaffUser) => {
    setSelectedUser({
      id: user.id, // Ensure the id is set
      name: user.name,
      email: user.email,
      username: user.username,
      password: '', // Don't send password for edit
      phone: user.phone,
      address: user.address,
      staff_profile: {
        ...user.staff_profile
      },
    });
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleSubmitUser = async (formData: StaffFormData) => {
    setActionLoading(true);
    try {
      if (formMode === 'add') {
        await StaffService.create(formData);
      } else {
        // Pass the id to the update method when in edit mode
        if (selectedUser && selectedUser.id) {
          await StaffService.update(formData, selectedUser.id);
        } else {
          toast.error("No user selected for editing")
          throw new Error("No user selected for editing");
        }
      }
      await fetchUsers();
      setFormOpen(false);
    } catch (error) {
      //toast.error(`Error ${formMode === 'add' ? 'adding' : 'updating'} user:`)
      console.error(`Error ${formMode === 'add' ? 'adding' : 'updating'} user:`, error);
      throw error;
    } finally {
      setTimeout(() => toast.dismiss(), 5000)
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    setActionLoading(true);
    try {
      await StaffService.delete(id);
      await fetchUsers();
    } catch (error) {
      toast.error('Error deleting user:')
      console.error('Error deleting user:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };


  
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
  const canManageUsers = isAuthenticated && isAdmin;

  return (
    <div className="flex max-h-[85vh] bg-gray-100 flex-col">
      <ToastContainer />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="py-5 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Staff Management</h1>
          {canManageUsers && (
            <button
              onClick={handleAddUser}
              className="bg-[#EE7F61] text-white px-4 py-2 rounded-lg hover:bg-[#e06a4c] focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
              disabled={actionLoading}
            >
              Add New Staff
            </button>
          )}
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
                          <th className="py-3 px-4 text-left">S/N</th> 
                          <th className="py-3 px-4 text-left">Staff Name</th>
                          <th className="py-3 px-4 text-left">Email</th>
                          <th className="py-3 px-4 text-left">Role</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Image</th>
                          <th className="py-3 px-4 text-left">Shift</th>
                          <th className="py-3 px-4 text-left">Hours</th>
                          <th className="py-3 px-4 text-left">Login Activity</th>
                          {canManageUsers && <th className="py-3 px-4 text-center">Actions</th>}
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
                            <td className="py-3 px-4 text-gray-600">{index + 1}</td> {/* Updated to show S/N */}
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
                            <td className="py-3 px-4 text-gray-600">
                              <div className="flex items-center">
                                <LoginHistoryModal userId={user.id} trigger="click"/>
                              </div>
                            </td>
                            {canManageUsers && (
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="p-2 hover:text-[#bf360c] hover:bg-orange-50 rounded mr-1"
                                  aria-label={`Edit ${user.name}`}
                                  title="Edit staff member"
                                >
                                  <img src={pencil} alt="Edit" className="h-5 w-5"/>
                                </button>
                                <button 
                                  className="p-2 hover:text-red-600 hover:bg-red-50 rounded"
                                  onClick={() => handleDeleteUser(user.id)}
                                  aria-label={`Delete ${user.name}`}
                                  title="Delete staff member"
                                >
                                  <img src={trash} alt="Delete" className="h-5 w-5"/>
                                </button>
                              </td>
                            )}
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
      
      {/* Staff Form Modal */}
      <StaffForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitUser}
        onDelete={handleDeleteUser}
        initialData={selectedUser}
        mode={formMode}
      />
    </div>
  );
};

export default Staff;