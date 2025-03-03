import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import logo from '../../assets/images/primeLogo.png';
import { motion } from 'framer-motion';
import trash from "../../assets/images/trash.png";

interface ClientProps {
  id: number;
  name: string;
  email: string;
  username: string;
  image: string;
  address: string;
  phone: string;
}

const Clients = () => {
  const { user: currentUser, isAdmin, isAuthenticated } = useAuth();
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [isAuthenticated, currentUser?.email, currentUser?.status]);

  const fetchClients = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      
      const clientsData: ClientProps[] = await response.json();
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([
        { 
          id: 1, 
          name: "Joshua George", 
          email: "rufus.kenny09@gmail.com", 
          username: "joshg", 
          image: logo, 
          address: "123 Main St",
          phone: "555-1234"
        },
        { 
          id: 2, 
          name: "Suleinman Adamu", 
          email: "grilled@example.com", 
          username: "sadamu",
          image: logo,
          address: "456 Oak Ave",
          phone: "555-5678"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
       
  const handleDeleteClient = async (id: number) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      
      // Refresh client list after successful deletion
      await fetchClients();
      
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canViewClients = isAuthenticated && (currentUser?.status === "Active" || isAdmin);
  const canManageClients = isAuthenticated && isAdmin;

  return (
    <div className="container mx-auto">
      <h1 className="py-5 text-xl px-6 font-semibold mb-6 border-b">Clients</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : canViewClients ? (
        <>
          <div className="flex flex-wrap justify-end gap-4 mb-6 mr-4">
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
            <div>
              <input
                type="text"
                placeholder="Search clients..."
                className="border-[#EE7F61] border rounded-lg  p-2 w-full md:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="bg-[#EE7F61] text-white p-4">
                  <th className="px-6 py-3 text-left tracking-wider">S/N</th>
                  <th className="px-6 py-3 text-left tracking-wider">Client ID</th>
                  <th className="px-6 py-3 text-left tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left tracking-wider">Phone</th>
                  {canManageClients && (
                    <th className="px-6 py-3 text-left tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.slice(0, itemsPerPage).map((client, index) => (
                  <motion.tr 
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={client.image} alt={client.name} className="h-10 w-10 rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.phone}</td>
                    {canManageClients && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="text-red-600 hover:text-red-900"
                          disabled={actionLoading}
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <img src={trash} alt="Delete" className="h-5 w-5" />
                        </button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <h3 className="font-bold">Access Restricted</h3>
          <p>Please log in to view Clients data.</p>
        </div>
      )}
    </div>
  );
};

export default Clients;