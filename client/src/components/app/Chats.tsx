import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MessageCircle, Settings } from "lucide-react";
import ChatItem from "./ChatItem";
import api from "@/api/axios"; // ✅ using axios instance (auto includes baseURL + token)

interface Chat {
  id: string;
  name: string;
  avatar: string;
  type: string;
  lastMessage: string | null;
  time: string | null;
  unread: number;
}

const Chats = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "top" | "unread">("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [classes, setClasses] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRegNo = user?.regNo;

  // ✅ Fetch chats using central API instance
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/api/chats"); // ✅ backend route
        console.log("✅ Chats API response:", res.data);
        setClasses(res.data.chats || []);
      } catch (error: any) {
        console.error("❌ Chats fetch failed:", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  // ✅ Header scroll animation
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Filtered chats
  const filteredChats = Array.isArray(classes)
    ? classes.filter(
        (chat) =>
          chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.id?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="pb-20">
      {/* Sticky Header */}
      <div
        className={`sticky top-[60px] z-20 bg-background transition-all duration-300`}
      >
        <div
          className={`px-4 transition-all duration-300 ${
            isScrolled ? "py-2" : "pt-4 pb-2"
          }`}
        >
          <div className="relative max-w-md mx-auto">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-300 ${
                isScrolled ? "w-4 h-4" : "w-5 h-5"
              }`}
            />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-12 rounded-full bg-card transition-all duration-300 ${
                isScrolled ? "h-9 text-sm" : "h-10"
              }`}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-2 flex gap-3 text-xs border-b">
          {["all", "top", "unread"].map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`py-2 transition-colors ${
                filter === key
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div>
        {loading ? (
          <p className="text-center text-muted-foreground mt-6">
            Loading chats...
          </p>
        ) : filteredChats.length === 0 ? (
          <p className="text-center text-muted-foreground mt-6">
            No chats found.
          </p>
        ) : (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={{
                id: chat.id,
                name: chat.name,
                avatar: chat.avatar,
                type: chat.type as "group" | "personal",
                lastMessage: chat.lastMessage || "No messages yet",
                time: chat.time || "Now",
                unread: chat.unread || 0,
              }}
            />
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur-sm border-t py-3 px-6">
        <div className="max-w-md mx-auto flex justify-around">
          <button
            onClick={() => navigate("/meeting")}
            className="flex flex-col items-center gap-1"
          >
            <Calendar className="w-6 h-6 text-foreground" />
            <span className="text-xs">Meet</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <MessageCircle className="w-6 h-6 text-primary" />
            <span className="text-xs font-semibold text-primary">Chats</span>
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="flex flex-col items-center gap-1"
          >
            <Settings className="w-6 h-6 text-foreground" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chats;
