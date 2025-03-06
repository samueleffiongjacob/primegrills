import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import logo from '../../assets/images/primeLogo.png';
import { motion } from 'framer-motion';

interface BackendUser {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  image: string;
  shift: string;
  shiftHours: string;
  address: string;
  age: string;
  phone: string;
  gender: string;
  password: string;
  
}

interface StaffUser extends BackendUser {
  status: "Active" | "Inactive";
}

const Staff = () => {
  const { user: currentUser, isAdmin, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(100);

  useEffect(() => {
    fetchUsers();
  }, [isAuthenticated, currentUser?.email, currentUser?.status]);

  const fetchUsers = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/staffs/all/");
      if (!response.ok) throw new Error("Failed to fetch staffs");
      
      const backendUsers: BackendUser[] = await response.json();
      const processedUsers: StaffUser[] = backendUsers.map(user => ({
        ...user,
        status: user.email === currentUser?.email && currentUser?.status === "Active"
          ? "Active"
          : "Inactive",
      }));
      setUsers(processedUsers);
    } catch (error) {
      console.error("Error fetching staffs:", error);
      setUsers([
        { 
          id: 1, 
          name: "Joshua George", 
          email: "rufus.kenny09@gmail.com", 
          username: "joshg",
          role: "Waiter", 
          status: "Active", 
          image: logo, 
          shift: 'Morning', 
          shiftHours: "8 AM - 4 PM",
          address: "123 Main St",
          age: "28",
          phone: "555-1234",
          gender: "Male",
          password: ''
        },
        { 
          id: 2, 
          name: "Suleinman Adamu", 
          email: "grilled@example.com", 
          username: "sadamu",
          role: "Waiter", 
          status: "Inactive", 
          image: logo, 
          shift: 'Afternoon', 
          shiftHours: "4 PM - 12 AM",
          address: "456 Oak Ave",
          age: "32",
          phone: "555-5678",
          gender: "Male",
          password: ''
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canViewUsers = isAuthenticated && (currentUser?.status === "Active" || isAdmin);
  const canManageUsers = isAuthenticated && isAdmin;

  return (
    <div className="flex max-h-[85vh] bg-gray-100 flex-col">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="py-5 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Staff</h1>

        </header>
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <motion.div 
              className="flex justify-self-center mt-[10%] items-center h-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <img src={logo} className="w-16 h-16" alt="Loading..." />
            </motion.div>
          ) : canViewUsers ? (
            <>
              <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex gap-4 ml-auto">  
                  <div className="mb-4 md:mb-0">
                    <select 
                      className="border-[#EE7F61] border rounded-lg  p-2 mr-4"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                  <input
                    type="search"
                    placeholder="Search Staff..."
                    className="w-64 p-2 pl-3 border rounded-lg border-[#EE7F61]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr className="bg-[#EE7F61] text-white p-4">
                      <th className="py-2 px-4 text-left">S/N</th>
                      <th className="py-2 px-4 text-left">Staff Name</th>
                      <th className="py-2 px-4 text-left">Role</th>
                      <th className="py-2 px-4 text-left">Status</th>
                      <th className="py-2 px-4 text-left">Image</th>
                      <th className="py-2 px-4 text-left">Shift</th>
                      <th className="py-2 px-4 text-left">Hours</th>
                      {canManageUsers && <th className="py-2 px-4 text-center">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.slice(0, itemsPerPage).map((user, index) => (
                      <motion.tr 
                        key={user.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}` }
                        >
                        <td className="py-2 px-4">{index + 1}.</td>
                        <td className="py-2 px-4">{user.name}</td>
                        <td className="py-2 px-4">{user.role}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                        </td>
                        <td className="py-2 px-4">
                          <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full border" />
                        </td>
                        <td className="py-2 px-4">{user.shift}</td>
                        <td className="text-gray-500 text-sm">({user.shiftHours})</td>
                    
                      </motion.tr >
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <h2 className="text-xl font-semibold mb-4">Access Restricted</h2>
                <p className="mb-4">Please log in to view user data.</p>
                {currentUser && currentUser.status === "Inactive" && (
                  <p className="text-red-600">Your account is inactive. Please contact an administrator.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Staff;