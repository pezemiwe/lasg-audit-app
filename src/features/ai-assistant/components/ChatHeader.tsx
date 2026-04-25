import React from "react";
import { Sparkles, Share2, Download } from "lucide-react";
import s from "../../../styles/ai-assistant.module.css";

const ChatHeader: React.FC = () => {
  return (
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
  );
};

export default ChatHeader;
