import React from "react";
import { Copy, BookOpen } from "lucide-react";
import s from "../../../styles/ai-assistant.module.css";
import type { Message } from "../types";

interface Props {
  messages: Message[];
  isTyping: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onEmpty: React.ReactNode;
}

const MessagesList: React.FC<Props> = ({
  messages,
  isTyping,
  scrollAreaRef,
  messagesEndRef,
  onEmpty,
}) => {
  return (
    <div className={s.messages_area} ref={scrollAreaRef}>
      {messages.length === 0 ? (
        onEmpty
      ) : (
        <>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${s.msg_wrap} ${msg.isUser ? s.msg_user : s.msg_ai}`}
            >
              <div className={s.msg_avatar}>{msg.isUser ? "👤" : "🤖"}</div>
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
  );
};

export default MessagesList;
