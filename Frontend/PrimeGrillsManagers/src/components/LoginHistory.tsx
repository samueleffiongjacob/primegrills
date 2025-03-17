import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

// Type definition for login history
interface LoginRecord {
  id: number;
  user_id: number;
  timestamp: string;
  action: 'login' | 'logout';
}

interface LoginHistoryProps {
  userId: number;
  trigger: 'hover' | 'click';
}

// Service for fetching login history
const LoginHistoryService = {
  baseUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  
  async getUserLoginHistory(userId: number): Promise<LoginRecord[]> {
    const response = await fetch(`${this.baseUrl}/api/login-history/${userId}/`, {
      method: 'GET',
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch login history");
    }
    
    return response.json();
  }
};

// Helper to group login records by date
const groupByDate = (records: LoginRecord[]) => {
  const groups: Record<string, LoginRecord[]> = {};
  
  records.forEach(record => {
    const date = format(new Date(record.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
  });
  
  return groups;
};

const LoginHistoryModal = ({ userId, trigger = 'click' }: LoginHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch login history when modal opens
  const fetchLoginHistory = async () => {
    if (!isOpen) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const history = await LoginHistoryService.getUserLoginHistory(userId);
      setLoginHistory(history);
    } catch (err) {
      console.error("Error fetching login history:", err);
      setError("Failed to load login history");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLoginHistory();
  }, [isOpen, userId]);
  
  // Get today and yesterday's date strings
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
  
  // Group login records by date
  const groupedHistory = groupByDate(loginHistory);
  
  // Extract today and yesterday's records
  const todaysRecords = groupedHistory[today] || [];
  const yesterdaysRecords = groupedHistory[yesterday] || [];
  
  // Event handlers based on trigger type
  const eventHandlers = trigger === 'hover' 
    ? {
        onMouseEnter: () => setIsOpen(true),
        onMouseLeave: () => setIsOpen(false),
      }
    : {
        onClick: () => setIsOpen(!isOpen),
      };
  
  return (
    <div className="relative inline-block">
      {/* Trigger element */}
      <button
        className="text-blue-600 underline focus:outline-none"
        {...eventHandlers}
        aria-label="View login history"
      >
        View History
      </button>
      
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-72 h-90 overflow-y-auto rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4"
            style={{ right: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Login History</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {loading ? (
              <div className="py-4 flex justify-center">
                <svg className="animate-spin h-5 w-5 text-[#EE7F61]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm py-2">{error}</div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {/* Today's logins */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Today
                  </h4>
                  {todaysRecords.length > 0 ? (
                    <ul className="space-y-2">
                      {todaysRecords.map((record) => (
                        <li key={record.id} className="text-sm flex justify-between items-center bg-gray-50 rounded p-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            record.action === 'login' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.action === 'login' ? 'Login' : 'Logout'}
                          </span>
                          <span className="text-gray-600">
                            {format(new Date(record.timestamp), 'h:mm a')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No logins recorded today</p>
                  )}
                </div>
                
                {/* Yesterday's logins */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Yesterday
                  </h4>
                  {yesterdaysRecords.length > 0 ? (
                    <ul className="space-y-2">
                      {yesterdaysRecords.map((record) => (
                        <li key={record.id} className="text-sm flex justify-between items-center bg-gray-50 rounded p-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            record.action === 'login' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.action === 'login' ? 'Login' : 'Logout'}
                          </span>
                          <span className="text-gray-600">
                            {format(new Date(record.timestamp), 'h:mm a')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No logins recorded yesterday</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4 pt-2 border-t border-gray-200">
              <button
                onClick={() => fetchLoginHistory()}
                className="text-xs text-[#EE7F61] hover:text-[#e06a4c] focus:outline-none"
              >
                Refresh data
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginHistoryModal;