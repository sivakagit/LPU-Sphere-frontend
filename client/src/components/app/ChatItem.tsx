import { useNavigate } from "react-router-dom";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  regNo?: string;
  type: "group" | "personal";
  lastMessage?: string;
  time: string;
  unread: number;
}

interface ChatItemProps {
  chat: Chat;
}

const ChatItem = ({ chat }: ChatItemProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/chat/${chat.id}`, { state: { from: "chats" } })}
      className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm flex-shrink-0">
        {chat.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
          <span className="text-xs text-muted-foreground ml-2">{chat.time}</span>
        </div>
        {chat.regNo && (
          <p className="text-xs text-muted-foreground mb-1">{chat.regNo}</p>
        )}
        {chat.lastMessage && (
          <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
        )}
      </div>
      {chat.unread > 0 && (
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
          {chat.unread}
        </div>
      )}
    </div>
  );
};

export default ChatItem;
