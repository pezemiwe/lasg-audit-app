import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/Layout/Navbar";
import s from "../../styles/ai-assistant.module.css";
import type { Message } from "../../features/ai-assistant/types";
import { AI_RESPONSES } from "../../features/ai-assistant/utils/aiResponses";
import AuthHeader from "../../features/ai-assistant/components/AuthHeader";
import ConversationSidebar from "../../features/ai-assistant/components/ConversationSidebar";
import ChatHeader from "../../features/ai-assistant/components/ChatHeader";
import WelcomeState, {
  type AIAssistantTopic,
} from "../../features/ai-assistant/components/WelcomeState";
import MessagesList from "../../features/ai-assistant/components/MessagesList";
import ChatInput from "../../features/ai-assistant/components/ChatInput";
import QuickLinksSidebar from "../../features/ai-assistant/components/QuickLinksSidebar";

const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const topic: AIAssistantTopic = location.pathname.includes(
    "ai-audit-procedures",
  )
    ? "audit-procedures"
    : "regulations";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

    setTimeout(() => {
      const randomResponse =
        AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];

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

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  const resetChat = () => {
    setMessages([]);
    setIsTyping(false);
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-(--bg)`}>
      {!user ? <Navbar /> : <AuthHeader user={user} />}

      <div className={s.main_layout}>
        <ConversationSidebar onNewChat={resetChat} />

        <main className={s.chat_area}>
          <ChatHeader topic={topic} />
          <MessagesList
            messages={messages}
            isTyping={isTyping}
            scrollAreaRef={scrollAreaRef}
            messagesEndRef={messagesEndRef}
            onEmpty={
              <WelcomeState onExampleClick={handleExampleClick} topic={topic} />
            }
          />
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            isTyping={isTyping}
          />
        </main>

        <QuickLinksSidebar setInput={setInput} topic={topic} />
      </div>
    </div>
  );
};

export default AIAssistant;
