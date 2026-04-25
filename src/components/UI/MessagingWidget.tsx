import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Search,
  ChevronLeft,
  Paperclip,
  CheckCheck,
  Circle,
  Shield,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { User as UserType } from "../../types";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

const MOCK_MESSAGE_TIMESTAMP = new Date(Date.now() - 3600000);
const MOCK_MESSAGE_TIMESTAMP_2 = new Date(Date.now() - 1800000);

const ROLE_LABELS: Record<string, string> = {
  STATE_AUDITOR_GENERAL: "Auditor General",
  AUDIT_SUPERVISOR: "Audit Supervisor",
  AUDIT_LEAD: "Audit Lead",
  TEAM_AUDITOR: "Team Auditor",
  HEAD_OF_LOCAL_GOVERNMENT: "Head of LGA",
};

const ROLE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  STATE_AUDITOR_GENERAL: { bg: "#fef9c3", text: "#713f12", border: "#fde047" },
  AUDIT_SUPERVISOR: { bg: "#dbeafe", text: "#1e3a8a", border: "#93c5fd" },
  AUDIT_LEAD: { bg: "#dcfce7", text: "#14532d", border: "#86efac" },
  TEAM_AUDITOR: { bg: "#f3e8ff", text: "#581c87", border: "#c084fc" },
  HEAD_OF_LOCAL_GOVERNMENT: {
    bg: "#ffe4e6",
    text: "#881337",
    border: "#fda4af",
  },
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const formatTime = (date: Date) =>
  new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDateLabel = (date: Date): string => {
  const now = new Date();
  const d = new Date(date);
  if (d.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getContactsForUser = (currentUser: UserType | null) => {
  if (!currentUser) return [];
  const contacts = [
    {
      id: "user-ag",
      name: "Audr. Gen. Fashola",
      role: "STATE_AUDITOR_GENERAL",
      online: true,
      department: "Office of the Auditor General",
    },
    {
      id: "user-sup-mushin",
      name: "Sup. Adebayo",
      role: "AUDIT_SUPERVISOR",
      online: true,
      department: "Mushin Zone",
    },
    {
      id: "user-sup-6",
      name: "Sup. Okafor",
      role: "AUDIT_SUPERVISOR",
      online: false,
      department: "Apapa Zone",
    },
    {
      id: "user-lead-1",
      name: "Lead Johnson",
      role: "AUDIT_LEAD",
      online: true,
      department: "Mushin Audit Team",
    },
    {
      id: "user-auditor-1",
      name: "Auditor Tobi",
      role: "TEAM_AUDITOR",
      online: true,
      department: "Mushin Audit Team",
    },
    {
      id: "user-hlg-mushin",
      name: "HLG Adewunmi",
      role: "HEAD_OF_LOCAL_GOVERNMENT",
      online: false,
      department: "Mushin LGA Council",
    },
  ];
  if (currentUser.role === "STATE_AUDITOR_GENERAL")
    return contacts.filter((c) => c.id !== currentUser.id);
  if (currentUser.role === "AUDIT_SUPERVISOR")
    return contacts.filter(
      (c) => c.role === "STATE_AUDITOR_GENERAL" || c.role === "AUDIT_LEAD",
    );
  if (currentUser.role === "AUDIT_LEAD")
    return contacts.filter(
      (c) =>
        c.role === "AUDIT_SUPERVISOR" ||
        c.role === "TEAM_AUDITOR" ||
        c.role === "HEAD_OF_LOCAL_GOVERNMENT",
    );
  if (currentUser.role === "TEAM_AUDITOR")
    return contacts.filter((c) => c.role === "AUDIT_LEAD");
  if (currentUser.role === "HEAD_OF_LOCAL_GOVERNMENT")
    return contacts.filter((c) => c.role === "AUDIT_LEAD");
  return contacts;
};

interface MessagingWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessagingWidget: React.FC<MessagingWidgetProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      senderId: "user-ag",
      receiverId: "user-lead-1",
      content:
        "Please update the status on the Mushin LGA audit engagement. We need the field reports by end of week.",
      timestamp: MOCK_MESSAGE_TIMESTAMP,
      isRead: true,
    },
    {
      id: "m2",
      senderId: "user-lead-1",
      receiverId: "user-ag",
      content:
        "Understood. The team has completed 80% of fieldwork. I will compile the interim report today.",
      timestamp: MOCK_MESSAGE_TIMESTAMP_2,
      isRead: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts = getContactsForUser(user).filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  useEffect(() => {
    if (!isOpen) setTimeout(() => setActiveChat(null), 350);
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeChat || !user) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        senderId: user.id,
        receiverId: activeChat,
        content: inputValue.trim(),
        timestamp: new Date(),
        isRead: false,
      },
    ]);
    setInputValue("");
  };

  const getActiveContact = () => contacts.find((c) => c.id === activeChat);
  const getUnreadCount = (contactId: string) =>
    messages.filter(
      (m) => m.senderId === contactId && m.receiverId === user?.id && !m.isRead,
    ).length;
  const getLastMessage = (contactId: string) => {
    const thread = messages.filter(
      (m) =>
        (m.senderId === user?.id && m.receiverId === contactId) ||
        (m.senderId === contactId && m.receiverId === user?.id),
    );
    return thread[thread.length - 1] ?? null;
  };

  const currentChatMessages = messages.filter(
    (m) =>
      (m.senderId === user?.id && m.receiverId === activeChat) ||
      (m.senderId === activeChat && m.receiverId === user?.id),
  );

  if (!user) return null;

  const activeContact = getActiveContact();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(2, 6, 23, 0.55)",
          zIndex: 9997,
          backdropFilter: "blur(3px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "520px",
          maxWidth: "100vw",
          zIndex: 9998,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f8fafc",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* ─── HEADER ─── */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)",
            flexShrink: 0,
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem 0.875rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              {activeChat ? (
                <button
                  onClick={() => setActiveChat(null)}
                  title="Back to contacts"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.375rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "#fff",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                  }
                >
                  <ChevronLeft size={18} />
                </button>
              ) : (
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MessageSquare size={17} color="rgba(255,255,255,0.9)" />
                </div>
              )}
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.62rem",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {activeChat ? "Secure Conversation" : "LASG Audit Platform"}
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.3,
                  }}
                >
                  {activeChat ? activeContact?.name : "Secure Messages"}
                </h2>
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {activeChat && activeContact && (
                <div
                  style={{
                    padding: "0.2rem 0.6rem",
                    borderRadius: "100px",
                    background: "rgba(255,255,255,0.12)",
                    fontSize: "0.68rem",
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Circle
                    size={7}
                    fill={activeContact.online ? "#4ade80" : "#94a3b8"}
                    color={activeContact.online ? "#4ade80" : "#94a3b8"}
                  />
                  {activeContact.online ? "Online" : "Offline"}
                </div>
              )}
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.375rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "rgba(255,255,255,0.8)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Sub-header: contact strip in chat view */}
          {activeChat && activeContact && (
            <div
              style={{
                padding: "0.875rem 1.25rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
              }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#fff",
                    border: "2px solid rgba(255,255,255,0.25)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {getInitials(activeContact.name)}
                </div>
                {activeContact.online && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      right: "-2px",
                      width: "13px",
                      height: "13px",
                      background: "#4ade80",
                      borderRadius: "50%",
                      border: "2px solid #065f46",
                    }}
                  />
                )}
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {activeContact.department}
                </p>
                <span
                  style={{
                    marginTop: "0.2rem",
                    display: "inline-block",
                    padding: "0.1rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    background: "rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {ROLE_LABELS[activeContact.role] ?? activeContact.role}
                </span>
              </div>
            </div>
          )}

          {/* Sub-header: self-identity in contacts view */}
          {!activeChat && (
            <div
              style={{
                padding: "0.75rem 1.25rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  flexShrink: 0,
                }}
              >
                {getInitials(user.name ?? "U")}
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {user.name}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    marginTop: "0.15rem",
                  }}
                >
                  <Circle size={7} fill="#4ade80" color="#4ade80" />
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {ROLE_LABELS[user.role ?? ""] ?? user.role}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── BODY ─── */}
        {activeChat ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                background: "#f1f5f9",
              }}
            >
              {currentChatMessages.length === 0 ? (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    padding: "3rem 1rem",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "16px",
                      background: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MessageSquare size={28} color="#94a3b8" />
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#64748b",
                    }}
                  >
                    No messages yet
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.78rem",
                      color: "#94a3b8",
                      textAlign: "center",
                    }}
                  >
                    Start a secure conversation with {activeContact?.name}
                  </p>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      textAlign: "center",
                      margin: "0.25rem 0 0.875rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: "#94a3b8",
                        background: "#e2e8f0",
                        padding: "0.2rem 0.8rem",
                        borderRadius: "100px",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {formatDateLabel(currentChatMessages[0].timestamp)}
                    </span>
                  </div>
                  {currentChatMessages.map((msg, idx) => {
                    const isOwn = msg.senderId === user.id;
                    const isSameGroup =
                      idx > 0 &&
                      currentChatMessages[idx - 1].senderId === msg.senderId;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: "flex",
                          justifyContent: isOwn ? "flex-end" : "flex-start",
                          alignItems: "flex-end",
                          gap: "0.5rem",
                          marginTop: isSameGroup ? "0.2rem" : "0.875rem",
                        }}
                      >
                        {!isOwn && (
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "8px",
                              background: "#064e3b",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              color: "#fff",
                              flexShrink: 0,
                              opacity: isSameGroup ? 0 : 1,
                            }}
                          >
                            {getInitials(activeContact?.name ?? "?")}
                          </div>
                        )}
                        <div
                          style={{
                            maxWidth: "72%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: isOwn ? "flex-end" : "flex-start",
                          }}
                        >
                          <div
                            style={{
                              padding: "0.65rem 0.95rem",
                              borderRadius: isOwn
                                ? "14px 14px 4px 14px"
                                : "14px 14px 14px 4px",
                              background: isOwn ? "#064e3b" : "#fff",
                              color: isOwn ? "#fff" : "#1e293b",
                              fontSize: "0.875rem",
                              lineHeight: "1.55",
                              boxShadow: isOwn
                                ? "0 2px 8px rgba(6,78,59,0.2)"
                                : "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
                            }}
                          >
                            {msg.content}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              marginTop: "0.25rem",
                              padding: "0 0.2rem",
                            }}
                          >
                            <span
                              style={{ fontSize: "0.65rem", color: "#94a3b8" }}
                            >
                              {formatTime(msg.timestamp)}
                            </span>
                            {isOwn && (
                              <CheckCheck
                                size={12}
                                color={msg.isRead ? "#064e3b" : "#94a3b8"}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div
              style={{
                padding: "1rem 1.25rem",
                background: "#fff",
                borderTop: "1px solid #e2e8f0",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "0.6rem",
                  background: "#f8fafc",
                  borderRadius: "14px",
                  border: "1.5px solid #e2e8f0",
                  padding: "0.5rem 0.5rem 0.5rem 0.75rem",
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0.375rem",
                    cursor: "pointer",
                    color: "#94a3b8",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#475569";
                    (
                      e.currentTarget.style as CSSStyleDeclaration &
                        Record<string, string>
                    ).background = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#94a3b8";
                    e.currentTarget.style.background = "none";
                  }}
                >
                  <Paperclip size={16} />
                </button>
                <textarea
                  rows={1}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontSize: "0.875rem",
                    color: "#1e293b",
                    resize: "none",
                    lineHeight: "1.5",
                    maxHeight: "120px",
                    overflowY: "auto",
                    paddingTop: "0.375rem",
                    paddingBottom: "0.375rem",
                    fontFamily: "inherit",
                  }}
                  placeholder="Type a secure message…"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  style={{
                    background: inputValue.trim() ? "#064e3b" : "#e2e8f0",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.5rem 0.7rem",
                    cursor: inputValue.trim() ? "pointer" : "not-allowed",
                    color: inputValue.trim() ? "#fff" : "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (inputValue.trim())
                      e.currentTarget.style.background = "#065f46";
                  }}
                  onMouseLeave={(e) => {
                    if (inputValue.trim())
                      e.currentTarget.style.background = "#064e3b";
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
              <p
                style={{
                  margin: "0.4rem 0 0 0.25rem",
                  fontSize: "0.65rem",
                  color: "#94a3b8",
                }}
              >
                Press{" "}
                <kbd
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    borderRadius: "3px",
                    padding: "0 3px",
                    fontSize: "0.65rem",
                  }}
                >
                  Enter
                </kbd>{" "}
                to send ·{" "}
                <kbd
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    borderRadius: "3px",
                    padding: "0 3px",
                    fontSize: "0.65rem",
                  }}
                >
                  Shift+Enter
                </kbd>{" "}
                for new line
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Search */}
            <div
              style={{
                padding: "0.875rem 1.25rem",
                background: "#fff",
                borderBottom: "1px solid #f1f5f9",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "0.5rem 0.875rem",
                }}
              >
                <Search size={15} color="#94a3b8" />
                <input
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontSize: "0.875rem",
                    color: "#1e293b",
                  }}
                  placeholder="Search contacts or department…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Section label */}
            <div style={{ padding: "0.75rem 1.25rem 0.375rem", flexShrink: 0 }}>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  color: "#64748b",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                }}
              >
                Accessible Contacts ({contacts.length})
              </span>
            </div>

            {/* List */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "0.375rem 0.75rem 1rem",
              }}
            >
              {contacts.length === 0 ? (
                <div
                  style={{
                    padding: "3rem 1rem",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "0.875rem",
                  }}
                >
                  No contacts found
                </div>
              ) : (
                contacts.map((contact) => {
                  const unread = getUnreadCount(contact.id);
                  const lastMsg = getLastMessage(contact.id);
                  const color = ROLE_COLORS[contact.role] ?? {
                    bg: "#f3f4f6",
                    text: "#374151",
                    border: "#d1d5db",
                  };
                  return (
                    <button
                      key={contact.id}
                      onClick={() => setActiveChat(contact.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.875rem",
                        padding: "0.75rem",
                        borderRadius: "12px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.15s",
                        marginBottom: "0.125rem",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f1f5f9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div
                          style={{
                            width: "46px",
                            height: "46px",
                            borderRadius: "12px",
                            background: "#064e3b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            color: "#fff",
                            letterSpacing: "0.03em",
                          }}
                        >
                          {getInitials(contact.name)}
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-2px",
                            right: "-2px",
                            width: "13px",
                            height: "13px",
                            borderRadius: "50%",
                            background: contact.online ? "#22c55e" : "#cbd5e1",
                            border: "2px solid #f8fafc",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              color: "#0f172a",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              maxWidth: "180px",
                            }}
                          >
                            {contact.name}
                          </span>
                          {lastMsg && (
                            <span
                              style={{
                                fontSize: "0.67rem",
                                color: "#94a3b8",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                                marginLeft: "0.5rem",
                              }}
                            >
                              {formatTime(lastMsg.timestamp)}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.2rem",
                              minWidth: 0,
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.66rem",
                                fontWeight: 600,
                                padding: "0.1rem 0.45rem",
                                borderRadius: "4px",
                                background: color.bg,
                                color: color.text,
                                border: `1px solid ${color.border}`,
                                letterSpacing: "0.03em",
                                display: "inline-block",
                              }}
                            >
                              {ROLE_LABELS[contact.role] ?? contact.role}
                            </span>
                            {lastMsg && (
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "0.75rem",
                                  color: "#64748b",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  maxWidth: "230px",
                                }}
                              >
                                {lastMsg.senderId === user.id ? "You: " : ""}
                                {lastMsg.content}
                              </p>
                            )}
                          </div>
                          {unread > 0 && (
                            <span
                              style={{
                                minWidth: "20px",
                                height: "20px",
                                background: "#064e3b",
                                color: "#fff",
                                borderRadius: "100px",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0 5px",
                                flexShrink: 0,
                              }}
                            >
                              {unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "0.625rem 1.25rem",
                borderTop: "1px solid #f1f5f9",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                flexShrink: 0,
              }}
            >
              <Shield size={12} color="#94a3b8" />
              <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                Messages are encrypted in transit.
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MessagingWidget;
