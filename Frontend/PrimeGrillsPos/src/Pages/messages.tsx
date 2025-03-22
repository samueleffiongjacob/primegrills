import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X, Search, Send, RefreshCw, Plus } from "lucide-react";
import { useAuth } from "../context/authContext";

// Define types
interface Message {
  id: number;
  sender: string;
  receiver: string; // Added receiver field
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  thread_id: number;
  messages: ThreadMessage[];
  isSent?: boolean;
}

interface ThreadMessage {
  id: number;
  content: string;
  timestamp: string;
  sender: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  subject?: string;
}

interface StaffUser {
  id: number;
  email: string;
  username: string;
  user_type: string;
  role?: string;
}

const MessagesPage = () => {
  const [openMessage, setOpenMessage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("manager");
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewThread, setIsNewThread] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { user: currentUser } = useAuth();

  // Fetch messages and staff users on component mount or tab change
  useEffect(() => {
    fetchMessages();
    fetchStaffUsers();
  }, [activeTab]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "customers" 
        ? `${import.meta.env.VITE_MESSAGE_BACKEND_URL}/api/my-threads/customers` 
        : `${import.meta.env.VITE_MESSAGE_BACKEND_URL}/api/my-threads/`;
      
      const messagesResponse = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!messagesResponse.ok) {
        throw new Error(`HTTP error! Status: ${messagesResponse.status}`);
      }
      
      const messagesData = await messagesResponse.json();
      const formattedMessages = formatMessages(messagesData.results || messagesData);

      // Filter messages based on the active tab
      let filteredMessages = formattedMessages;
      if (activeTab === "manager") {
        filteredMessages = formattedMessages.filter((msg) =>
          msg.messages.some((m) => m.sender.email.includes('manager'))
        );
      } else if (activeTab === "staff") {
        filteredMessages = formattedMessages.filter(
          (msg) => !msg.messages.some((m) => m.sender.email.includes('manager'))
        );
      }
  
      setMessages(filteredMessages);
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
      
      if (!staffResponse.ok) {
        throw new Error(`HTTP error! Status: ${staffResponse.status}`);
      }
      
      const staffData = await staffResponse.json();
      
      if (staffData && staffData.results) {
        const formattedStaffUsers = staffData.results
          .map((item) => ({
            id: item.user.id,
            email: item.user.email,
            username: item.user.username,
            user_type: item.user.user_type,
            role: item.role,
          })).filter((staff) => staff.email !== currentUser?.email); // Remove the current user
        setStaffUsers(formattedStaffUsers);
      }
    } catch (error) {
      console.error("Error fetching staff users:", error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  };

  // Format messages from API response
  const formatMessages = (data: any[]): Message[] => {
    if (!data || !Array.isArray(data)) return [];
  
    return data.map((thread) => {
      const threadMessages = thread.messages || [];
      const latestMessage = threadMessages.length > 0
        ? threadMessages[threadMessages.length - 1]
        : null;
      const lastMessage = threadMessages.length > 0
        ? threadMessages[threadMessages.length - 1]
        : null;
  
      const isSentByCurrentUser = lastMessage?.sender?.email === currentUser?.email;
  
      let displayName = "";
      if (isSentByCurrentUser) {
        const recipients = thread.participants?.filter(
          (p) => p.email !== currentUser?.email
        ) || [];
        displayName = recipients.length > 0
          ? recipients.map((r) => r.username).join(", ")
          : "Recipient";
      } else {
        displayName = lastMessage?.sender?.username || "Unknown";
      }
  
      return {
        id: thread.id,
        thread_id: thread.id,
        sender: isSentByCurrentUser ? "You" : lastMessage?.sender?.username || "Unknown",
        receiver: isSentByCurrentUser ? displayName : "You",
        subject: latestMessage?.subject || "No subject",
        content: lastMessage?.content || "No content",
        timestamp: lastMessage ? new Date(lastMessage.timestamp).toLocaleString() : "Unknown time",
        read: isSentByCurrentUser ? true : lastMessage?.read || false,
        isSent: isSentByCurrentUser,
        messages: threadMessages,
      };
    });
  };

  const toggleMessage = async (id: number) => {
    // If opening a message and it's unread and not sent by current user
    const message = messages.find(m => m.id === id);
    if (id !== openMessage && message && !message.read && !message.isSent) {
      try {
        await fetch(`${import.meta.env.VITE_MESSAGE_BACKEND_URL}/api/mark-read/${id}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        
        // Update the local state to reflect the change
        setMessages(messages.map(m => 
          m.id === id ? { ...m, read: true } : m
        ));
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
    
    setOpenMessage(openMessage === id ? null : id);
  };

  const sendReply = async (messageId: number) => {
    if (!reply.trim()) return;
    
    try {
      // This API endpoint handles replies to existing threads
      const response = await fetch(`${import.meta.env.VITE_MESSAGE_BACKEND_URL}/api/thread-messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ 
          thread: messageId,
          content: reply 
          // No subject here - we want to use the original thread subject
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      await response.json();
      setReply("");
      await fetchMessages();
      
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply. Please try again.");
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
        // Send to single user - creates a new thread or uses existing thread
        response = await fetch(`${import.meta.env.VITE_MESSAGE_BACKEND_URL}/api/send-message/${selectedStaff[0]}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
          body: JSON.stringify({
            content: newMessage,
            subject: subject
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
            subject: subject
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      await response.json();
      resetForm();
      await fetchMessages();
      
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const openComposeModal = (newThread = true) => {
    setIsNewThread(newThread);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewMessage("");
    setSubject("");
    setSelectedStaff([]);
    setIsModalOpen(false);
  };

  const filteredStaff = staffUsers.filter(staff => 
    staff.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (staff.role && staff.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleStaffSelection = (userId: number) => {
    setSelectedStaff(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const selectAllVisibleStaff = () => {
    if (filteredStaff.length === selectedStaff.length) {
      // Deselect all if all are selected
      setSelectedStaff([]);
    } else {
      // Select all visible staff
      const allVisibleIds = filteredStaff.map(staff => staff.id);
      setSelectedStaff(allVisibleIds);
    }
  };

  const renderThreadMessages = (msg: Message) => {
    if (!msg.messages || msg.messages.length === 0) {
      return <p className="italic text-gray-500 text-center py-4">No messages in this thread</p>;
    }
  
    return (
      <div className="space-y-3 px-1">
        {msg.messages.map((threadMsg, index) => {
          const isFromCurrentUser = threadMsg.sender?.email === currentUser?.email;
          // Show subject only in the first message
          const showSubject = index === 0;
          
          return (
            <div 
              key={threadMsg.id} 
              className={`p-3 rounded-lg ${
                isFromCurrentUser 
                  ? "bg-blue-50 ml-8 border-l-2 border-blue-400" 
                  : "bg-gray-50 mr-8 border-l-2 border-gray-300"
              }`}
            >
              <div className="flex justify-between mb-1">
                <span className="font-medium">
                  {isFromCurrentUser ? "You" : threadMsg.sender?.username || "Unknown"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(threadMsg.timestamp).toLocaleString()}
                </span>
              </div>
              {/* {showSubject && threadMsg.subject && <p className="font-medium text-gray-700 mb-2">{threadMsg.subject}</p>} */}
              <p className="whitespace-pre-line">{threadMsg.content}</p>
            </div>
          );
        })}
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-lg text-gray-800">Please login to view messages</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-gray-100 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between sticky items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={refreshData} 
            className="flex items-center gap-1 px-3 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-200"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            className="px-4 py-2 bg-[#EE7F61] text-white rounded-md flex items-center gap-2 hover:bg-[#e57054] transition-colors"
            onClick={() => openComposeModal(true)}
          >
            <Plus size={16} />
            New Message
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
         {/*  <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "customers" 
                ? "bg-[#2f3585] text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("customers")}
          >
            Customer Messages
          </button> */}

          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "manager" 
                ? "bg-[#2f3585] text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("manager")}
          >
            Manager Messages
          </button>
      
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "staff" 
                ? "bg-[#2f3585] text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("staff")}
          >
            Staff Messages
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2f3585]"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">No messages found in this category</p>
          <button
            className="mt-4 px-4 py-2 bg-[#EE7F61] text-white rounded-md inline-flex items-center gap-2 hover:bg-[#e57054] transition-colors"
            onClick={() => openComposeModal(true)}
          >
            <Plus size={16} />
            Start a new conversation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden border-l-4 transition-all ${
                !msg.isSent && !msg.read
                  ? "border-orange-500" 
                  : msg.isSent 
                    ? "border-gray-400" 
                    : "border-gray-200"
              }`}
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleMessage(msg.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    {!msg.isSent && !msg.read && (
                      <span className="h-2 w-2 bg-orange-500 rounded-full mr-2" title="Unread"></span>
                    )}
                    <h2 className="text-lg font-medium text-gray-900 truncate mr-2">
                      {msg.subject || "No Subject"}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 flex flex-wrap gap-1">
                    {msg.isSent ? (
                      <>
                        <span className="font-medium">To:</span> 
                        <span>{msg.receiver}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">From:</span> 
                        <span>{msg.sender}</span>
                      </>
                    )}
                    <span className="mx-1">•</span>
                    <span>{msg.timestamp}</span>
                  </p>
                </div>
                <div className="flex items-center">
                  {msg.isSent && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mr-3">Sent</span>
                  )}
                  {openMessage === msg.id ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
                </div>
              </div>

              <AnimatePresence>
                {openMessage === msg.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 bg-gray-50">
                      {renderThreadMessages(msg)}
                    </div>
                    
                    <div className="p-4 bg-white border-t border-gray-200">
                      <textarea
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Type your reply..."
                        rows={3}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                      ></textarea>
                      <div className="mt-3 flex justify-end">
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => sendReply(msg.thread_id)}
                          disabled={!reply.trim()}
                        >
                          <Send size={16} />
                          Send Reply
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Compose Message Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-[#171943] bg-opacity-30 flex justify-center items-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isNewThread ? "New Message" : "Reply to Thread"}
                </h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              
              <div className="space-y-4">
                {isNewThread && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter subject..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Recipients ({selectedStaff.length} selected)
                        </label>
                        <button 
                          className="text-xs text-blue-600 hover:text-blue-800"
                          onClick={selectAllVisibleStaff}
                        >
                          {filteredStaff.length === selectedStaff.length ? "Deselect All" : "Select All"}
                        </button>
                      </div>
                      
                      <div className="relative mb-2">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                              className={`p-3 flex items-center gap-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedStaff.includes(staff.id) ? "bg-blue-50" : ""
                              }`}
                              onClick={() => toggleStaffSelection(staff.id)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedStaff.includes(staff.id)}
                                onChange={() => {}}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
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
                  </>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={5}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-[#EE7F61] text-white rounded-md flex items-center justify-center gap-2 hover:bg-[#e57054] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={sendMessageToStaff}
                    disabled={isNewThread ? 
                      (selectedStaff.length === 0 || !newMessage.trim() || !subject.trim()) : 
                      !newMessage.trim()}
                  >
                    <Send size={16} />
                    {isNewThread ? "Send Message" : "Send Reply"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagesPage;