import React from "react";
import { Send, Paperclip } from "lucide-react";
import s from "../../../styles/ai-assistant.module.css";

interface Props {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  isTyping: boolean;
}

const ChatInput: React.FC<Props> = ({ input, setInput, onSend, isTyping }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return (
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
              <button className={s.input_action_btn} aria-label="Attach file">
                <Paperclip size={14} />
              </button>
            </div>
          </div>
          <button
            className={s.send_btn}
            onClick={onSend}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
        <p className={s.input_hint}>
          Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
