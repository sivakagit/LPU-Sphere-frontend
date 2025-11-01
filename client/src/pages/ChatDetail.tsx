import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Send, ArrowLeft, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRegNo = user?.regNo || "";
  const userName = user?.name || "You";

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch messages on load
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await api.get(`/chats/${id}/messages`);
      setMessages(res.data.messages || []);
      setLoading(false);
    };
    fetchMessages();
  }, [id]);

  // Scroll to bottom whenever messages update
  useEffect(() => scrollToBottom(), [messages]);

  // Socket.IO setup
  useEffect(() => {
    if (!id) return;

    socket.emit("joinRoom", id);

    socket.on("newMessage", (msg: Message) => {
      if (msg.classId === id) setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [id]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    const text = message.trim();

    try {
      const response = await api.post(`/chats/${id}/messages`, { text });
      setMessages((prev) => [...prev, response.data.message]);
      socket.emit("sendMessage", {
        classId: id,
        regNo: userRegNo,
        name: userName,
        text,
      });
      setMessage("");
    } finally {
      setSending(false);
    }
  };

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
          onClick={() => navigate("/app")}
        />
        <h1 className="text-lg font-semibold flex-1">
          Group Chat ({id})
        </h1>
        <MoreVertical />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => {
          const isMe = msg.senderRegNo === userRegNo;
          return (
            <div
              key={msg._id}
              className={`flex mb-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-xl max-w-xs ${
                  isMe
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {!isMe && (
                  <div className="text-xs font-bold mb-1">
                    {msg.senderName}
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 flex items-center gap-2 border-t bg-white">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} disabled={!message.trim() || sending}>
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatDetail;
