import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import logo from '../../assets/images/primeLogo.png';
import { motion } from 'framer-motion';

interface BackendUser {
  id: number;
  name: string;
  email: string;
  roles: string;
  image: string; // URL to image
  shift: string;
  shiftHours: string; // Added shift hours
}

interface StaffUser extends BackendUser {
  status: "Active" | "Inactive";
}

const User = () => {
  const { user: currentUser, isAdmin, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(100);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        
        const backendUsers: BackendUser[] = await response.json();
        const processedUsers :StaffUser[] = backendUsers.map(user => ({
           ...user,
          // status: user.email === currentUser?.email ? currentUser.status : "Inactive"
          status: user.email === currentUser?.email && currentUser?.status === "Active"
          ? "Active"
          : "Inactive",
        }));
        setUsers(processedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([
          { id: 1, name: "Joshua George", email: "rufus.kenny09@gmail.com", roles: "Waiter", status: "Active", image: logo, shift: 'Morning', shiftHours: "8 AM - 4 PM" },
          { id: 2, name: "Suleinman Adamu", email: "grilled@example.com", roles: "Waiter", status: "Inactive", image: logo, shift: 'Afternoon', shiftHours: "4 PM - 12 AM" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, currentUser?.email, currentUser?.status]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roles.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canViewUsers = isAuthenticated && (currentUser?.status === "Active" || isAdmin);

  return (
    <div className="flex max-h-[85vh] bg-gray-100 flex-col">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="py-5 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Users</h1>
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
                  <input
                    type="number"
                    placeholder="100"
                    className="w-24 p-2 pl-3 border rounded-lg border-[#EE7F61] bg-gray-300 text-black"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  />
                  <input
                    type="search"
                    placeholder="Search"
                    className="w-64 p-2 pl-3 border rounded-lg border-[#EE7F61] bg-gray-300 text-black"
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
                      <th className="py-2 px-4 text-left">Roles</th>
                      <th className="py-2 px-4 text-left">Status</th>
                      <th className="py-2 px-4 text-left">Image</th>
                      <th className="py-2 px-4 text-left">Shift</th>
                      <th className="py-2 px-4 text-left">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.slice(0, itemsPerPage).map((user, index) => (
                      <tr key={user.id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}` }>
                        <td className="py-2 px-4">{index + 1}.</td>
                        <td className="py-2 px-4">{user.name}</td>
                        <td className="py-2 px-4">{user.roles}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                        </td>
                        <td className="py-2 px-4">
                          <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full border" />
                        </td>
                        <td className="py-2 px-4">{user.shift}</td>
                        <td className="text-gray-500 text-sm">({user.shiftHours})</td>
                      </tr>
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

export default User;
