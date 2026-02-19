import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Layout/Navbar";
import s from "../../styles/ai-assistant.module.css";
// import ps from "../../styles/pages.module.css";
import {
  Send,
  Paperclip,
  Share2,
  Download,
  Copy,
  BookOpen,
  Scale,
  DollarSign,
  Info,
  PlusCircle,
  MessageSquare,
  Clock,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const responses = [
        "Under <strong>Section 125(2)</strong> of the 1999 Constitution, the State Auditor-General must audit all LGA accounts and report findings to the House of Assembly.<br/><br/><strong>Section 120</strong> further mandates that all revenues be paid into a Consolidated Revenue Fund with proper annual accounting.",

        "Compliance audits are triggered by <strong>material deviations</strong> from the Public Finance Management Act, late submission of annual accounts (beyond the statutory 90-day deadline), or indicators of non-adherence to the Fiscal Responsibility Act procurement provisions.",

        "The State Auditor-General has constitutional authority under <strong>Section 125</strong> to audit all LGA accounts, issue mandates, and report directly to the State House of Assembly. The role is independent and non-partisan, with security of tenure.",

        '<strong>Performance audits</strong> assess efficiency, effectiveness, and economy (the "3 Es") of government programmes, while <strong>financial audits</strong> verify the accuracy of financial statements and compliance with accounting standards. Performance audits ask "are we getting value for money?" — financial audits ask "are the numbers correct?"',
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  const resetChat = () => {
    setMessages([]);
    setIsTyping(false);
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-(--bg)`}>
      {!user ? (
        <Navbar />
      ) : (
        /* Minimal Header for Authenticated User */
        <header
          style={{
            height: "60px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            padding: "0 1.5rem",
            background: "#fff",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                border: "none",
                background: "transparent",
                color: "#4b5563",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
              onClick={() => navigate("/dashboard")}
            >
              <ChevronLeft size={18} />
              Back to Dashboard
            </button>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
              {user.name}
            </span>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#064e3b",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "0.85rem",
              }}
            >
              {user.name.charAt(0)}
            </div>
          </div>
        </header>
      )}

      <div className={s.main_layout}>
        {/* Left Sidebar */}
        <aside className={s.left_sidebar} aria-label="Conversation history">
          <div className={s.sidebar_header}>
            <h2>Conversations</h2>
            <button
              className={s.new_chat_btn}
              onClick={resetChat}
              aria-label="Start new chat"
            >
              <PlusCircle size={14} />
              New Chat
            </button>
          </div>

          <div className={s.convo_list}>
            <div className={s.convo_group}>
              <div className={s.convo_group_title}>Today</div>
              <button className={`${s.convo_item} ${s.convo_item_active}`}>
                <MessageSquare
                  size={12}
                  className={s.convo_icon}
                  color="inherit"
                />
                <span className={s.convo_text}>
                  Constitution Section 125 clarification
                </span>
              </button>
              <button className={s.convo_item}>
                <MessageSquare
                  size={12}
                  className={s.convo_icon}
                  color="inherit"
                />
                <span className={s.convo_text}>Performance audit triggers</span>
              </button>
            </div>

            <div className={s.convo_group}>
              <div className={s.convo_group_title}>Yesterday</div>
              <button className={s.convo_item}>
                <MessageSquare
                  size={12}
                  className={s.convo_icon}
                  color="inherit"
                />
                <span className={s.convo_text}>
                  Procurement compliance requirements
                </span>
              </button>
              <button className={s.convo_item}>
                <MessageSquare
                  size={12}
                  className={s.convo_icon}
                  color="inherit"
                />
                <span className={s.convo_text}>
                  Financial reporting deadlines
                </span>
              </button>
            </div>

            <div className={s.convo_group}>
              <div className={s.convo_group_title}>Last 7 Days</div>
              <button className={s.convo_item}>
                <MessageSquare
                  size={12}
                  className={s.convo_icon}
                  color="inherit"
                />
                <span className={s.convo_text}>
                  state Auditor General powers
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Center Chat Area */}
        <main className={s.chat_area}>
          {/* Header */}
          <div className={s.chat_header}>
            <div className={s.ch_avatar}>
              <Sparkles size={20} color="#000" />
            </div>
            <div className={s.ch_info}>
              <h1 className={s.ch_title}>Regulations AI</h1>
              <div className={s.ch_status}>
                <span className={s.ch_status_dot}></span>
                Online
              </div>
            </div>
            <div className={s.ch_actions}>
              <button className={s.ch_btn} aria-label="Share">
                <Share2 size={12} />
                Share
              </button>
              <button className={s.ch_btn} aria-label="Export">
                <Download size={12} />
                Export
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={s.messages_area} ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className={s.welcome_state}>
                <div className={s.welcome_icon}>
                  <Sparkles size={32} color="#000" />
                </div>
                <h2 className={s.welcome_title}>
                  Ask Me About Lagos Audit Regulations
                </h2>
                <p className={s.welcome_desc}>
                  I'm trained on the 1999 Constitution, the Audit Act, Fiscal
                  Responsibility Act, and all relevant Lagos State regulations.
                  Ask anything about Financial, Performance, or Compliance audit
                  frameworks — I'll cite specific sections.
                </p>

                <div className={s.welcome_examples}>
                  <button
                    className={s.example_card}
                    onClick={() =>
                      handleExampleClick(
                        "What are the financial reporting requirements for LGAs under the 1999 Constitution?",
                      )
                    }
                  >
                    <span className={s.example_icon}>📊</span>
                    <p className={s.example_text}>
                      What are the financial reporting requirements for LGAs
                      under the 1999 Constitution?
                    </p>
                  </button>
                  <button
                    className={s.example_card}
                    onClick={() =>
                      handleExampleClick(
                        "Explain the role and powers of the State Auditor General",
                      )
                    }
                  >
                    <span className={s.example_icon}>🏛️</span>
                    <p className={s.example_text}>
                      Explain the role and powers of the State Auditor General
                    </p>
                  </button>
                  <button
                    className={s.example_card}
                    onClick={() =>
                      handleExampleClick(
                        "What triggers a compliance audit for an LGA?",
                      )
                    }
                  >
                    <span className={s.example_icon}>⚖️</span>
                    <p className={s.example_text}>
                      What triggers a compliance audit for an LGA?
                    </p>
                  </button>
                  <button
                    className={s.example_card}
                    onClick={() =>
                      handleExampleClick(
                        "How are performance audits different from financial audits?",
                      )
                    }
                  >
                    <span className={s.example_icon}>📈</span>
                    <p className={s.example_text}>
                      How are performance audits different from financial
                      audits?
                    </p>
                  </button>
                </div>
              </div>
            ) : (
              // Message List
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${s.msg_wrap} ${
                      msg.isUser ? s.msg_user : s.msg_ai
                    }`}
                  >
                    <div className={s.msg_avatar}>
                      {msg.isUser ? "👤" : "🤖"}
                    </div>
                    <div className={s.msg_content}>
                      <div
                        className={s.msg_bubble}
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      ></div>
                      <div className={s.msg_meta}>
                        <span>{msg.timestamp}</span>
                        {!msg.isUser && (
                          <div className={s.msg_actions}>
                            <button className={s.msg_action_btn}>
                              <Copy size={10} /> Copy
                            </button>
                            <button className={s.msg_action_btn}>
                              <BookOpen size={10} /> Cite
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className={`${s.msg_wrap} ${s.msg_ai}`}>
                    <div className={s.msg_avatar}>🤖</div>
                    <div className={s.msg_content}>
                      <div className={s.msg_bubble}>
                        <div className={s.typing_indicator}>
                          <div className={s.typing_dot}></div>
                          <div className={s.typing_dot}></div>
                          <div className={s.typing_dot}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={s.input_area}>
            <div className={s.input_inner}>
              <div className={s.input_row}>
                <div className={s.input_wrap}>
                  <textarea
                    className={s.chat_input}
                    placeholder="Ask about Nigerian audit regulations…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <div className={s.input_actions}>
                    <button
                      className={s.input_action_btn}
                      aria-label="Attach file"
                    >
                      <Paperclip size={14} />
                    </button>
                  </div>
                </div>
                <button
                  className={s.send_btn}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className={s.input_hint}>
                Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new
                line
              </p>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className={s.right_sidebar} aria-label="Reference Panel">
          <div className={s.sidebar_section}>
            <h3 className={s.sidebar_section_title}>Quick Links</h3>
            <div className={s.quick_links}>
              <button
                className={s.quick_link}
                onClick={() => setInput("What does Section 125(2) say?")}
              >
                <BookOpen size={12} className={s.quick_link_icon} />
                Section 125(2)
              </button>
              <button
                className={s.quick_link}
                onClick={() =>
                  setInput("Explain the Fiscal Responsibility Act")
                }
              >
                <Scale size={12} className={s.quick_link_icon} />
                Fiscal Responsibility Act
              </button>
              <button
                className={s.quick_link}
                onClick={() => setInput("What are the audit timelines?")}
              >
                <Clock size={12} className={s.quick_link_icon} />
                Audit Timelines
              </button>
              <button
                className={s.quick_link}
                onClick={() => setInput("Procurement compliance rules")}
              >
                <DollarSign size={12} className={s.quick_link_icon} />
                Procurement Rules
              </button>
              <button
                className={s.quick_link}
                onClick={() => setInput("Lagos State Audit Law 2015")}
              >
                <Info size={12} className={s.quick_link_icon} />
                Lagos State Law
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AIAssistant;
