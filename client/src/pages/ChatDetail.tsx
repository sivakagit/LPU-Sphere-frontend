import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, ArrowLeft, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/api/axios";
import { socket } from "@/socket";

interface Message {
  _id: string;
  classId: string;
  senderRegNo: string;
  senderName: string;
  text: string;
  createdAt: string;
}

const ChatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const userRegNo = user?.regNo;
  const userName = user?.name || "You";

  // ✅ Clear unread count when entering chat
  useEffect(() => {
    if (id) {
      localStorage.removeItem(`unread_${id}`);
    }
  }, [id]);

  // ✅ Fetch messages and class info
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/chats/${id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages || []);
        setClassName(res.data.className || id || "Group Chat");
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMessages();
  }, [id, token]);

  // ✅ Join room and listen for realtime messages
  useEffect(() => {
    if (!id) return;

    socket.emit("joinRoom", id);

    const handleNewMessage = (msg: Message) => {
      if (msg.classId === id) {
        setMessages((prev) => [...prev, msg]);
        // Clear unread count since we're viewing the chat
        localStorage.removeItem(`unread_${id}`);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [id]);

  // ✅ Send message
  const handleSend = () => {
    if (!message.trim() || !id) return;

    socket.emit("sendMessage", {
      classId: id,
      regNo: userRegNo,
      name: userName,
      text: message.trim(),
    });

    setMessage("");
  };

  // ✅ Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading chat...
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center p-4 shadow bg-primary text-white">
        <ArrowLeft 
          className="mr-3 cursor-pointer" 
          onClick={() => navigate("/app", { state: { activeTab: "chats" } })} 
        />
        <div 
          className="flex-1 cursor-pointer"
          onClick={() => navigate(`/group/${id}`)}
        >
          <h1 className="text-lg font-semibold">
            {className}
          </h1>
          <p className="text-xs opacity-80">Tap to view group info</p>
        </div>
        
        {/* ✅ Options Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate(`/group/${id}`)}>
              Group Info
            </DropdownMenuItem>
            <DropdownMenuItem>
              Search Messages
            </DropdownMenuItem>
            <DropdownMenuItem>
              Mute Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Exit Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-2">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRegNo === userRegNo;
            return (
              <div
                key={msg._id}
                className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-xs shadow-sm ${
                    isMe 
                      ? "bg-primary text-white rounded-br-sm" 
                      : "bg-card text-foreground rounded-bl-sm"
                  }`}
                >
                  {!isMe && (
                    <div className="text-xs font-bold mb-1 text-primary">
                      {msg.senderName}
                    </div>
                  )}
                  <div className="break-words">{msg.text}</div>
                  <div className={`text-xs mt-1 ${isMe ? "text-white/70" : "text-muted-foreground"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 flex items-center gap-2 border-t bg-card shadow-lg">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          className="flex-1 rounded-full"
        />
        <Button 
          onClick={handleSend}
          disabled={!message.trim()}
          size="icon"
          className="rounded-full"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatDetail;