import React from "react";
import { PlusCircle, MessageSquare } from "lucide-react";
import s from "../../../styles/ai-assistant.module.css";

interface Props {
  onNewChat: () => void;
}

const ConversationSidebar: React.FC<Props> = ({ onNewChat }) => {
  return (
    <aside className={s.left_sidebar} aria-label="Conversation history">
      <div className={s.sidebar_header}>
        <h2>Conversations</h2>
        <button
          className={s.new_chat_btn}
          onClick={onNewChat}
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
            <MessageSquare size={12} className={s.convo_icon} color="inherit" />
            <span className={s.convo_text}>
              Constitution Section 125 clarification
            </span>
          </button>
          <button className={s.convo_item}>
            <MessageSquare size={12} className={s.convo_icon} color="inherit" />
            <span className={s.convo_text}>Performance audit triggers</span>
          </button>
        </div>

        <div className={s.convo_group}>
          <div className={s.convo_group_title}>Yesterday</div>
          <button className={s.convo_item}>
            <MessageSquare size={12} className={s.convo_icon} color="inherit" />
            <span className={s.convo_text}>
              Procurement compliance requirements
            </span>
          </button>
          <button className={s.convo_item}>
            <MessageSquare size={12} className={s.convo_icon} color="inherit" />
            <span className={s.convo_text}>Financial reporting deadlines</span>
          </button>
        </div>

        <div className={s.convo_group}>
          <div className={s.convo_group_title}>Last 7 Days</div>
          <button className={s.convo_item}>
            <MessageSquare size={12} className={s.convo_icon} color="inherit" />
            <span className={s.convo_text}>state Auditor General powers</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ConversationSidebar;
