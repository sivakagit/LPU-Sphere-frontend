import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";
import { socket } from "@/socket";
import { toast } from "sonner";

interface Group {
  id: string;
  name: string;
  avatar: string;
  unread: number;
  lastMessage?: string;
  time?: string | null;
}

const ChatSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // ✅ Fetch chats from backend
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/api/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Transform backend data to match your UI format
        const chatsWithUnread = (res.data.chats || []).map((chat: any) => {
          const storedUnread = localStorage.getItem(`unread_${chat.id}`);
          return {
            id: chat.id,
            name: chat.name,
            avatar: chat.name.substring(0, 2).toUpperCase(),
            unread: storedUnread ? parseInt(storedUnread) : 0,
            lastMessage: chat.lastMessage,
            time: chat.time,
          };
        });
        
        setGroups(chatsWithUnread);
      } catch (err) {
        console.error("Error fetching chats:", err);
        toast.error("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchChats();
    }
  }, [token]);

  // ✅ Listen for real-time notifications and messages
  useEffect(() => {
    if (!user.regNo) return;

    // Join user's personal room for notifications
    socket.emit("joinUserRoom", user.regNo);

    // Handle new messages in real-time
    const handleNewMessage = (msg: any) => {
      setGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (group.id === msg.classId) {
            const newUnreadCount = group.unread + 1;
            // Store unread count in localStorage
            localStorage.setItem(`unread_${group.id}`, newUnreadCount.toString());
            
            return {
              ...group,
              lastMessage: msg.text,
              time: msg.createdAt,
              unread: newUnreadCount,
            };
          }
          return group;
        })
      );
    };

    // Handle notification events
    const handleNotification = (notif: any) => {
      if (notif.type === "message") {
        // Show toast notification
        toast.info(`${notif.senderName} in ${notif.className}`, {
          description: notif.message,
          action: {
            label: "View",
            onClick: () => navigate(`/chat/${notif.classId}`),
          },
        });

        // Update unread count
        setGroups((prevGroups) =>
          prevGroups.map((group) => {
            if (group.id === notif.classId) {
              const newUnreadCount = group.unread + 1;
              localStorage.setItem(`unread_${group.id}`, newUnreadCount.toString());
              
              return {
                ...group,
                unread: newUnreadCount,
              };
            }
            return group;
          })
        );
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("notification", handleNotification);
    };
  }, [user.regNo, navigate]);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeGroup = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
    // Also remove from localStorage
    localStorage.removeItem(`unread_${id}`);
  };

  // ✅ Handle chat click - clear unread and navigate
  const handleChatClick = (groupId: string) => {
    // Reset unread count
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId ? { ...group, unread: 0 } : group
      )
    );
    
    // Clear from localStorage
    localStorage.removeItem(`unread_${groupId}`);
    
    // Navigate to chat
    navigate(`/chat/${groupId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--gradient-primary)" }}
      >
        <button onClick={() => navigate(-1)} className="text-primary-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full bg-card"
            autoFocus
          />
        </div>
      </div>

      <div className="divide-y">
        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "No chats found" : "No chats yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {searchQuery ? "Try a different search" : "Join a class to start chatting"}
            </p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div
              key={group.id}
              className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleChatClick(group.id)}
            >
              <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
                {group.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{group.name}</h3>
                {group.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {group.lastMessage}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* ✅ Unread Badge - only show if count > 0 */}
                {group.unread > 0 && (
                  <div className="w-6 h-6 rounded-sm bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {group.unread > 99 ? "99+" : group.unread}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent chat click
                    removeGroup(group.id);
                  }}
                  className="p-1 hover:bg-muted rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSearch;