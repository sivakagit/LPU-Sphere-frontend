import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Send,
  Image,
  FileText,
  BarChart3,
  Printer,
  LogOut,
  Bell,
  Search,
  Archive,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/api/axios"; // ✅ using the new API file

interface Message {
  _id: string;
  classId: string;
  senderRegNo: string;
  senderName: string;
  text: string;
  createdAt: string;
}

interface ChatInfo {
  id: string;
  name: string;
  avatar: string;
  type: string;
}

const ChatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fromTab = (location.state as any)?.from || "chats";
  const [message, setMessage] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRegNo = user?.regNo || "";
  const userName = user?.name || "You";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat info and messages
  useEffect(() => {
    const fetchChatData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // ✅ Fetch all chats
        const chatRes = await api.get("/chats");
        const currentChat = chatRes.data.chats?.find((chat: any) => chat.id === id);
        if (currentChat) {
          setChatInfo(currentChat);
        }

        // ✅ Fetch messages for this chat
        const messagesRes = await api.get(`/chats/${id}/messages`);
        setMessages(messagesRes.data.messages || []);
        setError("");
      } catch (err: any) {
        console.error("❌ Error fetching chat data:", err);
        setError(err.response?.data?.error || "Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [id]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send a message
  const handleSend = async () => {
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      const response = await api.post(`/chats/${id}/messages`, {
        text: message.trim(),
        senderRegNo: userRegNo,
        senderName: userName,
      });

      if (response.data.message) {
        setMessages((prev) => [...prev, response.data.message]);
      }

      setMessage("");
    } catch (err: any) {
      console.error("❌ Error sending message:", err);
      alert(err.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--gradient-primary)" }}
      >
        <button
          onClick={() => navigate("/app", { state: { activeTab: fromTab } })}
          className="text-primary-foreground"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div
          className="flex-1 cursor-pointer flex items-center gap-2"
          onClick={() => navigate(`/group-info/${id}`)}
        >
          <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {chatInfo?.avatar}
          </div>
          <h1 className="text-base font-semibold text-primary-foreground">
            {chatInfo?.name || id}
          </h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-primary-foreground">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate(`/group-info/${id}`)}>
              <Search className="w-4 h-4 mr-2" />
              Group Info
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="w-4 h-4 mr-2" />
              Mute Notifications
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="w-4 h-4 mr-2" />
              Archive Group
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Exit Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="flex justify-center my-3">
          <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
            Today
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-10">
            <p className="text-lg font-semibold mb-2">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSent = msg.senderRegNo === userRegNo;
            return (
              <div
                key={msg._id}
                className={`mb-4 px-4 flex gap-2 ${
                  isSent ? "justify-end" : "justify-start"
                }`}
              >
                {!isSent && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {msg.senderName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg shadow-sm max-w-[80%] ${
                    isSent ? "bg-primary text-primary-foreground" : "bg-card"
                  }`}
                >
                  {!isSent && (
                    <p className="text-xs font-semibold mb-1 opacity-80">
                      {msg.senderName}
                    </p>
                  )}
                  <p className="text-sm mb-1">{msg.text}</p>
                  <span
                    className={`text-xs ${
                      isSent ? "opacity-80" : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
                {isSent && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground flex-shrink-0">
                    {userName.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-secondary border-t p-3">
        {showAttachments && (
          <div className="flex items-center gap-2 mb-3">
            <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-card rounded-xl hover:bg-muted">
              <Image className="w-5 h-5" />
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-card rounded-xl hover:bg-muted">
              <FileText className="w-5 h-5" />
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-card rounded-xl hover:bg-muted">
              <BarChart3 className="w-5 h-5" />
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-card rounded-xl hover:bg-muted">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => setShowAttachments(!showAttachments)}
          >
            <span className="text-xl">+</span>
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-card"
            disabled={sending}
          />
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={handleSend}
            disabled={!message.trim() || sending}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;