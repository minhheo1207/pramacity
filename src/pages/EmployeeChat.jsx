// src/pages/EmployeeChat.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import "../assets/css/employee.css";

// Mock data - danh sách khách hàng đang chat
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    customerId: "C001",
    customerName: "Nguyễn Văn A",
    lastMessage: "Tôi muốn hỏi về thuốc cảm cúm",
    time: "10:30",
    unread: 2,
    status: "online",
  },
  {
    id: 2,
    customerId: "C002",
    customerName: "Trần Thị B",
    lastMessage: "Cảm ơn bạn đã tư vấn",
    time: "09:45",
    unread: 0,
    status: "online",
  },
  {
    id: 3,
    customerId: "C003",
    customerName: "Lê Văn C",
    lastMessage: "Thuốc này có tác dụng phụ không?",
    time: "Hôm qua",
    unread: 1,
    status: "offline",
  },
];

const MOCK_MESSAGES = {
  1: [
    { id: 1, type: "customer", text: "Xin chào, tôi muốn hỏi về thuốc cảm cúm", time: "10:25" },
    { id: 2, type: "employee", text: "Chào bạn! Tôi có thể giúp gì cho bạn về thuốc cảm cúm?", time: "10:26" },
    { id: 3, type: "customer", text: "Thuốc nào phù hợp cho người lớn?", time: "10:28" },
    { id: 4, type: "employee", text: "Bạn có thể dùng Paracetamol 500mg, uống 2 viên/lần, 3 lần/ngày", time: "10:30" },
  ],
  2: [
    { id: 1, type: "customer", text: "Cảm ơn bạn đã tư vấn", time: "09:45" },
  ],
  3: [
    { id: 1, type: "customer", text: "Thuốc này có tác dụng phụ không?", time: "Hôm qua 15:20" },
  ],
};

export default function EmployeeChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Kiểm tra quyền nhân viên
  useEffect(() => {
    if (!user || user.role !== 'employee') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoHome = () => {
    // Reset về trạng thái ban đầu (chưa chọn chat nào)
    setActiveChat(null);
    setMessages([]);
    setInputValue("");
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeChat) {
      setMessages(MOCK_MESSAGES[activeChat] || []);
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close message menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMessageMenu && !e.target.closest('.message-menu-wrapper')) {
        setShowMessageMenu(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMessageMenu]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChat) return;

    if (editingMessage) {
      // Edit existing message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingMessage.id
            ? { ...msg, text: inputValue.trim(), edited: true }
            : msg
        )
      );
      setEditingMessage(null);
    } else {
      // Send new message
      const newMessage = {
        id: Date.now(),
        type: "employee",
        text: inputValue.trim(),
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newMessage]);

      // Update last message in conversation
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeChat
            ? { ...conv, lastMessage: inputValue.trim(), unread: 0 }
            : conv
        )
      );
    }

    setInputValue("");
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Kích thước file không được vượt quá 10MB");
      return;
    }

    const newMessage = {
      id: Date.now(),
      type: "employee",
      text: `📎 ${file.name}`,
      file: {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type,
      },
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Update last message in conversation
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeChat
          ? { ...conv, lastMessage: `📎 ${file.name}`, unread: 0 }
          : conv
      )
    );

    // Reset file input
    e.target.value = "";
  };

  const handleEditMessage = (message) => {
    if (message.type !== "employee") return;
    setEditingMessage(message);
    setInputValue(message.text);
    setShowMessageMenu(null);
  };

  const handleRecallMessage = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, recalled: true, text: "Tin nhắn đã được thu hồi" }
          : msg
      )
    );
    setShowMessageMenu(null);
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm("Bạn có chắc muốn xóa tin nhắn này?")) {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      setShowMessageMenu(null);
    }
  };

  const handleDeleteConversation = (convId) => {
    if (window.confirm("Bạn có chắc muốn xóa cuộc trò chuyện này?")) {
      setConversations((prev) => prev.filter((conv) => conv.id !== convId));
      if (activeChat === convId) {
        setActiveChat(null);
        setMessages([]);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setInputValue("");
  };

  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
    // Mark as read
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === chatId ? { ...conv, unread: 0 } : conv
      )
    );
  };

  const activeConversation = conversations.find((c) => c.id === activeChat);

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick reply templates
  const quickReplies = [
    "Xin chào! Tôi có thể giúp gì cho bạn?",
    "Cảm ơn bạn đã liên hệ",
    "Vui lòng chờ trong giây lát",
    "Bạn có câu hỏi gì khác không?",
  ];

  const handleQuickReply = (text) => {
    setInputValue(text);
  };

  const handleEndChat = () => {
    setActiveChat(null);
    setMessages([]);
    setEditingMessage(null);
    setInputValue("");
  };

  return (
    <div className="employee-page">
      {/* Sidebar */}
      <aside className="employee-sidebar">
        <div className="employee-sidebar__header">
          <h2>
            <i className="ri-customer-service-2-line"></i> Tư vấn trực tuyến
          </h2>
          <div className="employee-status">
            <span className="status-dot"></span>
            <span>Đang trực tuyến</span>
          </div>
        </div>

        <div className="employee-search">
          <i className="ri-search-line"></i>
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="employee-conversations">
          {filteredConversations.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
              {searchQuery ? "Không tìm thấy cuộc trò chuyện" : "Chưa có cuộc trò chuyện nào"}
            </div>
          ) : (
            filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${activeChat === conv.id ? "active" : ""}`}
              onClick={() => handleSelectChat(conv.id)}
            >
              <div className="conversation-avatar">
                <i className="ri-user-line"></i>
                {conv.status === "online" && <span className="online-dot"></span>}
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <strong>{conv.customerName}</strong>
                  <span className="conversation-time">{conv.time}</span>
                </div>
                <p className="conversation-preview">{conv.lastMessage}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {conv.unread > 0 && (
                  <span className="conversation-badge">{conv.unread}</span>
                )}
                <button
                  className="conversation-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conv.id);
                  }}
                  title="Xóa cuộc trò chuyện"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
            ))
          )}
        </div>

        <div className="employee-sidebar__footer">
          <button
            className="employee-nav__item"
            onClick={handleGoHome}
          >
            <i className="ri-home-line"></i>
            <span>Về trang chủ</span>
          </button>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="employee-chat">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <header className="employee-chat__header">
              <div className="employee-chat__info">
                <div className="employee-chat__avatar">
                  <i className="ri-user-line"></i>
                  {activeConversation?.status === "online" && (
                    <span className="online-dot"></span>
                  )}
                </div>
                <div>
                  <h3>{activeConversation?.customerName}</h3>
                  <span className="chat-status-text">
                    {activeConversation?.status === "online"
                      ? "Đang trực tuyến"
                      : "Ngoại tuyến"}
                  </span>
                </div>
              </div>
              <div className="employee-chat__actions">
                <button 
                  className="btn btn--ghost btn-sm" 
                  title="Kết thúc chat"
                  onClick={handleEndChat}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </header>

            {/* Messages */}
            <div className="employee-chat__messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message chat-message--${msg.type} ${msg.recalled ? 'recalled' : ''}`}
                >
                  {msg.type === "customer" && (
                    <div className="chat-avatar chat-avatar--sm">
                      <i className="ri-user-line"></i>
                    </div>
                  )}
                  <div className="chat-bubble">
                    {msg.file ? (
                      <div className="chat-file">
                        <div className="file-icon">
                          <i className="ri-file-line"></i>
                        </div>
                        <div className="file-info">
                          <strong>{msg.file.name}</strong>
                          <small>{msg.file.size}</small>
                        </div>
                        <button className="file-download" title="Tải xuống">
                          <i className="ri-download-line"></i>
                        </button>
                      </div>
                    ) : (
                      <p style={{ fontStyle: msg.recalled ? 'italic' : 'normal', opacity: msg.recalled ? 0.7 : 1 }}>
                        {msg.text}
                      </p>
                    )}
                    <div className="chat-time-wrapper">
                      <span className="chat-time">{msg.time}</span>
                      {msg.edited && !msg.recalled && <span className="edited-label">Đã chỉnh sửa</span>}
                    </div>
                  </div>
                  {msg.type === "employee" && !msg.recalled && (
                    <div className="message-menu-wrapper">
                      <button
                        className="message-menu-btn"
                        onClick={() => setShowMessageMenu(showMessageMenu === msg.id ? null : msg.id)}
                        title="Tùy chọn"
                      >
                        <i className="ri-more-2-fill"></i>
                      </button>
                      {showMessageMenu === msg.id && (
                        <div className="message-menu">
                          <button onClick={() => handleEditMessage(msg)}>
                            <i className="ri-edit-line"></i> Chỉnh sửa
                          </button>
                          <button onClick={() => handleRecallMessage(msg.id)}>
                            <i className="ri-arrow-go-back-line"></i> Thu hồi
                          </button>
                          <button onClick={() => handleDeleteMessage(msg.id)} className="danger">
                            <i className="ri-delete-bin-line"></i> Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="chat-message chat-message--customer">
                  <div className="chat-avatar chat-avatar--sm">
                    <i className="ri-user-line"></i>
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Quick Replies */}
            <div className="quick-replies">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  type="button"
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Editing indicator */}
            {editingMessage && (
              <div className="editing-banner">
                <div className="editing-info">
                  <i className="ri-edit-line"></i>
                  <span>Đang chỉnh sửa tin nhắn</span>
                </div>
                <button className="editing-cancel" onClick={handleCancelEdit}>
                  <i className="ri-close-line"></i>
                </button>
              </div>
            )}

            {/* Input */}
            <form className="employee-chat__input" onSubmit={handleSend}>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="*/*"
              />
              <button
                type="button"
                className="chat-attach"
                onClick={handleFileAttach}
                title="Đính kèm file"
              >
                <i className="ri-attachment-line"></i>
              </button>
              <input
                type="text"
                placeholder={editingMessage ? "Chỉnh sửa tin nhắn..." : "Nhập tin nhắn..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="chat-input__field"
              />
              <button
                type="submit"
                className="chat-send"
                disabled={!inputValue.trim()}
                title={editingMessage ? "Cập nhật" : "Gửi tin nhắn"}
              >
                <i className={editingMessage ? "ri-check-line" : "ri-send-plane-fill"}></i>
              </button>
            </form>
          </>
        ) : (
          <div className="employee-chat__empty">
            <i className="ri-message-3-line"></i>
            <h3>Chọn cuộc trò chuyện để bắt đầu</h3>
            <p>Chọn một khách hàng từ danh sách bên trái để xem tin nhắn</p>
          </div>
        )}
      </main>
    </div>
  );
}

