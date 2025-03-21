import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, X, Search, UserPlus, Send } from "lucide-react";
import { useAuth } from "../context/authContext";

// Define types
interface Message {
  id: number;
  sender: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  thread_id: number;
  messages: any[]; // Store all thread messages
}

interface StaffUser {
  id: number;
  username: string;
  user_type: string;
  role?: string;
}

const MessagesPage = () => {
  const [openMessage, setOpenMessage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("customers");
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();

  // Fetch messages and staff users on component mount
  useEffect(() => {
    fetchMessages();
    fetchStaffUsers();
  }, [activeTab]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // Fetch messages based on active tab
      const messagesResponse = await fetch(
        `${import.meta.env.VITE_MESSAGE_BACKEND_URL}/api/my-threads/${activeTab === "customers" ? "customers" : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for sending cookies with the request
        }
      );
      const messagesData = await messagesResponse.json();
      setMessages(formatMessages(messagesData.results || messagesData));
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffUsers = async () => {
    try {
      const staffResponse = await fetch(`${import.meta.env.VITE_MESSAGE_BACKEND_URL}/api/staffs/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const staffData = await staffResponse.json();
      
      // Transform the staff data to match our expected format
      if (staffData && staffData.results) {
        const formattedStaffUsers = staffData.results.map(item => ({
          id: item.user.id,
          username: item.user.username,
          user_type: item.user.user_type,
          role: item.role
        }));
        setStaffUsers(formattedStaffUsers);
      }
    } catch (error) {
      console.error("Error fetching staff users:", error);
    }
  };

  // Format messages from API response
  const formatMessages = (data: any[]): Message[] => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(thread => {
      // Get the latest message in the thread
      const threadMessages = thread.messages || [];
      const latestMessage = threadMessages.length > 0 
        ? threadMessages[threadMessages.length - 1] 
        : null;
      
      const senderName = latestMessage?.sender?.username || "Unknown";
      
      return {
        id: thread.id,
        thread_id: thread.id, // Store thread ID separately
        sender: senderName,
        subject: `Message from ${senderName}`,
        content: latestMessage?.content || "No content",
        timestamp: latestMessage ? new Date(latestMessage.timestamp).toLocaleString() : "Unknown time",
        read: false, // Implement read status if available from backend
        messages: threadMessages, // Store all messages for displaying history
      };
    });
  };

  const toggleMessage = (id: number) => {
    setOpenMessage(openMessage === id ? null : id);
  };

  const sendReply = async (messageId: number) => {
    if (!reply.trim()) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_MESSAGE_BACKEND_URL}/api/thread-messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ 
          thread: messageId,
          content: reply 
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setReply("");
        // Refresh messages after sending reply
        fetchMessages();
      } else {
        console.error("Error sending reply:", data);
        alert("Failed to send reply. Please try again.");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("An error occurred while sending your reply.");
    }
  };
  
  const sendMessageToStaff = async () => {
    if (selectedStaff.length === 0 || !newMessage.trim() || !subject.trim()) {
      alert("Please fill all required fields");
      return;
    }
  
    try {
      let response;
      
      if (selectedStaff.length === 1) {
        // Send to single user
        response = await fetch(`${import.meta.env.VITE_MESSAGE_BACKEND_URL}/api/send-message/${selectedStaff[0]}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
          body: JSON.stringify({
            content: newMessage,
            subject: subject // Added subject field
          }),
        });
      } else {
        // Send to multiple users
        response = await fetch(`${import.meta.env.VITE_MESSAGE_BACKEND_URL}/api/send-group-message/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
          body: JSON.stringify({
            user_ids: selectedStaff,
            content: newMessage,
            subject: subject // Added subject field
          }),
        });
      }

      const data = await response.json();
      if (response.ok) {
        setNewMessage("");
        setSubject("");
        setSelectedStaff([]);
        setIsModalOpen(false);
        alert("Message sent successfully!");
        // Refresh messages after sending
        fetchMessages();
      } else {
        console.error("Error sending message:", data);
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const filteredStaff = staffUsers.filter(staff => 
    staff.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (staff.role && staff.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleStaffSelection = (userId: number) => {
    if (selectedStaff.includes(userId)) {
      setSelectedStaff(selectedStaff.filter(id => id !== userId));
    } else {
      setSelectedStaff([...selectedStaff, userId]);
    }
  };

  const renderThreadMessages = (msg: Message) => {
    if (!msg.messages || msg.messages.length === 0) {
      return <p className="italic text-gray-500">No messages in this thread</p>;
    }

    return (
      <div className="space-y-3">
        {msg.messages.map((threadMsg) => (
          <div key={threadMsg.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{threadMsg.sender?.username || "Unknown"}</span>
              <span className="text-sm text-gray-500">
                {new Date(threadMsg.timestamp).toLocaleString()}
              </span>
            </div>
            <p>{threadMsg.content}</p>
          </div>
        ))}
      </div>
    );
  };

  if (!currentUser) {
    return <div className="p-6">Please login to view messages</div>;
  }
  
  return (
    <div className="p-6 bg-gray-100 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Messages</h1>

      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === "customers" ? "bg-[#2f3585] text-white" : "bg-gray-300 text-gray-700"}`}
            onClick={() => {
              setActiveTab("customers");
            }}
          >
            Messages from Customers
          </button>
      
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === "staff" ? "bg-[#2f3585] text-white" : "bg-gray-300 text-gray-700"}`}
            onClick={() => {
              setActiveTab("staff");
            }}
          >
            Messages from Staff
          </button>

          <button
            className="px-4 py-2 bg-[#EE7F61] text-white rounded-lg flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Send size={16} />
            Send Message
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2f3585]"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No messages found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-lg shadow-md p-4 transition ${!msg.read ? "border-l-4 border-orange-500" : ""}`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleMessage(msg.id)}
              >
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{msg.subject}</h2>
                  <p className="text-sm text-gray-600">{msg.sender} - {msg.timestamp}</p>
                </div>
                {openMessage === msg.id ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
              </div>

              {openMessage === msg.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 text-gray-700"
                >
                  {/* Display all messages in thread */}
                  <div className="mb-4">
                    {renderThreadMessages(msg)}
                  </div>
                  
                  <div className="mt-4">
                    <textarea
                      className="w-full p-2 border rounded-md"
                      placeholder="Type your reply..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    ></textarea>
                    <button
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md flex items-center gap-2"
                      onClick={() => sendReply(msg.thread_id)}
                    >
                      <Send size={16} />
                      Send Reply
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Send Message Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Send Message</h2>
              <X className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipients ({selectedStaff.length} selected)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 p-2 border rounded-md mb-2"
                  placeholder="Search staff by name or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-md">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <div 
                      key={staff.id} 
                      className={`p-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer ${
                        selectedStaff.includes(staff.id) ? "bg-blue-50" : ""
                      }`}
                      onClick={() => toggleStaffSelection(staff.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(staff.id)}
                        onChange={() => {}}
                        className="h-4 w-4"
                      />
                      <div>
                        <span className="font-medium">{staff.username}</span>
                        {staff.role && <span className="text-sm text-gray-500 ml-2">({staff.role})</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No staff found</div>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={4}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              ></textarea>
            </div>
            
            <button
              className="px-4 py-2 bg-[#EE7F61] text-white rounded-md w-full flex items-center justify-center gap-2"
              onClick={sendMessageToStaff}
              disabled={selectedStaff.length === 0 || !newMessage.trim() || !subject.trim()}
            >
              <Send size={16} />
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;