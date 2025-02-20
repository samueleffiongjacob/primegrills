import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";

interface BackendUser {
  id: number;
  name: string;
  email: string;
  roles: string;
}

interface StaffUser extends BackendUser {
  status: "Active" | "Inactive"; // Added locally
}

const User = () => {
  // auth context
  const { user: currentUser, isAdmin, isAuthenticated } = useAuth();
  
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(100);

  // Fetch users from backend and add status based on current user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        
        const backendUsers: BackendUser[] = await response.json();
        
        // Add status to each user - all are inactive except the current logged-in user
        const processedUsers = backendUsers.map(user => ({
          ...user,
          status: user.email === currentUser?.email ? currentUser.status : "Inactive"
        }));
        
        setUsers(processedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Fallback to sample data if API fails
        setUsers([
          { id: 1, name: "Joshua George", email: "rufus.kenny09@gmail.com", roles: "Waiter", status: "Active" },
          { id: 2, name: "Suleinman Adamu", email: "grilled@example.com", roles: "Waiter", status: "Inactive" },
          // Other sample users...
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, currentUser?.email]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roles.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user can view the content based on their status in context
  const canViewUsers = isAuthenticated && (currentUser?.status === "Active" || isAdmin);

  return (
    <div className="flex max-h-[85vh] bg-gray-100 flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Header */}
        <header className="py-5 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">User</h1>
          {currentUser && (
            <div className="text-sm">
              Logged in as: {currentUser.email} ({currentUser.status})
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading users...</p>
            </div>
          ) : canViewUsers ? (
            <>
              {/* Rest of your component remains the same */}
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
                      <th className="py-2 px-4 text-left">User Name</th>
                      <th className="py-2 px-4 text-left">Roles</th>
                      <th className="py-2 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.slice(0, itemsPerPage).map((user, index) => (
                      <tr
                        key={user.id}
                        className={`shadow-lg rounded-2xl ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="py-2 px-4">{user.id}.</td>
                        <td className="py-2 px-4">{user.name}</td>
                        <td className="py-2 px-4">{user.roles}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
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