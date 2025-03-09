import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/authContext";
import logo from '../../assets/images/primeLogo.png';
import { motion } from 'framer-motion';
import { TrashIcon, SearchIcon } from "lucide-react"; // Replace imported image with icon component
import { getCookie } from "../../utils/cookie";

interface ClientProps {
  id: number;
  name: string;
  email: string;
  username: string;
  image: string;
  address: string;
  phone: string;
}

// Extracted to environment variable for easier configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const Clients = () => {
  const { user: currentUser, isAdmin, isAuthenticated } = useAuth();
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Memoize fetchClients to avoid recreating the function on every render
  const fetchClients = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const csrfToken = getCookie("csrftoken");
      const response = await fetch(`${API_BASE_URL}/api/users/all/`, {
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrfToken || "",
        },
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch clients: ${response.status}`);
      }
      
      const clientsData: ClientProps[] = await response.json();
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Failed to load clients. Please try again later.");
      
      // Only use mock data in development
      if (process.env.NODE_ENV === 'development') {
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
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients, isAuthenticated, currentUser?.email, currentUser?.staff_profile.status]);
       
  const handleDeleteClient = async (id: number) => {
    setActionLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/delete/user/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete client');
      }
      
      // Update client list without refetching
      setClients(prevClients => prevClients.filter(client => client.id !== id));
      setShowDeleteConfirm(null);
      
    } catch (error) {
      console.error('Error deleting client:', error);
      setError("Failed to delete client. Please try again later.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    (client.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (client.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (client.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  const canViewClients = isAuthenticated && (currentUser?.staff_profile.status === "Active" || isAdmin);
  const canManageClients = isAuthenticated && isAdmin;

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="py-5 text-xl px-6 font-semibold mb-6 border-b">Clients</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <img src={logo} className="w-16 h-16" alt="Loading..." />
          </motion.div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <button 
            onClick={fetchClients}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          >
            Try Again
          </button>
        </div>
      ) : !canViewClients ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <h3 className="font-bold">Access Restricted</h3>
          <p>Please log in with an active account to view Clients data.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
              {filteredClients.length > 0 && (
                <div className="text-gray-600 self-center">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredClients.length)} of {filteredClients.length}
                </div>
              )}
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
          
          {filteredClients.length === 0 ? (
            <div className="bg-gray-100 p-8 text-center rounded-lg">
              <p className="text-gray-600">No clients found matching your search criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-[#EE7F61] text-white">
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
                    {currentClients.map((client, index) => (
                      <motion.tr 
                        key={client.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{startIndex + index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{client.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{client.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                            {client.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{client.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img 
                            src={client.image} 
                            alt={`${client.name}'s avatar`} 
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              // Fallback for broken images
                              const target = e.target as HTMLImageElement;
                              target.src = logo;
                              target.onerror = null;
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{client.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`tel:${client.phone}`} className="hover:underline">
                            {client.phone}
                          </a>
                        </td>
                        {canManageClients && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            {showDeleteConfirm === client.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                  disabled={actionLoading}
                                  onClick={() => handleDeleteClient(client.id)}
                                >
                                  {actionLoading ? 'Deleting...' : 'Confirm'}
                                </button>
                                <button
                                  className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs"
                                  onClick={() => setShowDeleteConfirm(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                                onClick={() => setShowDeleteConfirm(client.id)}
                                aria-label={`Delete ${client.name}`}
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 px-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                      currentPage === 1 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-[#EE7F61] text-white hover:bg-[#D16E53]'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Create a simple pagination with current page in the middle when possible
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        const offset = Math.min(Math.max(currentPage - 3, 0), totalPages - 5);
                        pageNum = i + 1 + offset;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-full ${
                            currentPage === pageNum 
                              ? 'bg-[#EE7F61] text-white' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="self-center">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${
                      currentPage === totalPages 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-[#EE7F61] text-white hover:bg-[#D16E53]'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Clients;