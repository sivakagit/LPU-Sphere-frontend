import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, MoreVertical, Send, Image, FileText, BarChart3, Printer, GraduationCap, BookOpen, Code, LogOut, Bell, Search, Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const organizationData: Record<string, { name: string; icon: any; id: string }> = {
  "academic-excellence": { name: "Academic Excellence", icon: GraduationCap, id: "13-206" },
  "knowledge-hub": { name: "Knowledge Hub", icon: BookOpen, id: "14-301" },
  "tech-society": { name: "Tech Society", icon: Code, id: "15-402" },
};

interface Message {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
}

const OrganizationChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromTab = (location.state as any)?.from || "events";
  const [message, setMessage] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const org = organizationData[id || ""] || { name: "Organization", icon: GraduationCap, id: "00-000" };
  const Icon = org.icon;

  useEffect(() => {
    const storedMessages = localStorage.getItem(`org-chat-${id}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [id]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isSent: true
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem(`org-chat-${id}`, JSON.stringify(updatedMessages));
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div 
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--gradient-primary)" }}
      >
        <button onClick={() => navigate("/app", { state: { activeTab: fromTab } })} className="text-primary-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div 
          className="flex-1 cursor-pointer flex items-center gap-2"
          onClick={() => navigate(`/organization/${id}`)}
        >
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
          <h1 className="text-base font-semibold text-primary-foreground">{org.name} : {org.id}</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-primary-foreground">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate(`/organization/${id}`)}>
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

      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-center my-3">
          <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
            Today
          </span>
        </div>

        <div className="bg-secondary/50 border border-border p-4 mx-4 my-2 rounded-lg">
          <p className="text-xs font-bold mb-2">ORGANIZATION ANNOUNCEMENT:</p>
          <p className="text-xs leading-relaxed mb-3">
            Welcome to {org.name}!<br/>
            This is our official communication channel.<br/>
            Stay updated with all activities and events.<br/>
            Let's collaborate and grow together!
          </p>
          <p className="text-xs text-right text-muted-foreground">10:00 AM</p>
        </div>

        <div className="mb-4 px-4 flex justify-start">
          <div className="bg-card p-3 rounded-lg shadow-sm max-w-[80%]">
            <p className="text-sm mb-1">Excited to be part of this organization!</p>
            <span className="text-xs text-muted-foreground">10:15 AM</span>
          </div>
        </div>

        <div className="mb-4 px-4 flex justify-end">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-sm max-w-[80%]">
            <p className="text-sm mb-1">Looking forward to upcoming events</p>
            <span className="text-xs opacity-80">10:16 AM</span>
          </div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`mb-4 px-4 flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg shadow-sm max-w-[80%] ${
              msg.isSent 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card'
            }`}>
              <p className="text-sm mb-1">{msg.text}</p>
              <span className={`text-xs ${msg.isSent ? 'opacity-80' : 'text-muted-foreground'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

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
            placeholder=""
            className="flex-1 rounded-full bg-card"
          />
          <Button 
            size="icon" 
            variant="ghost"
            className="rounded-full"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationChat;
