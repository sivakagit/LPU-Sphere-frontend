import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Link2,
  Search,
  ChevronRight,
  Bell,
  Palette,
  Download,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const members = [
  { id: "1", name: "You", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { id: "2", name: "Bashi", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: "3", name: "Dharani", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
  { id: "4", name: "Nahulya", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  { id: "5", name: "Ram", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop" },
  { id: "6", name: "Saran", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
  { id: "7", name: "Megha", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
];

const GroupInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showSaveOptions, setShowSaveOptions] = useState(false);

  return (
    <div className="min-h-screen bg-background">
     
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--gradient-primary)" }}
      >
        <button onClick={() => navigate(-1)} className="text-primary-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-primary-foreground flex-1 text-center truncate">
          K22GE PES 122
        </h1>
        <div className="w-6" />
      </div>

      
      <div className="p-6 text-center border-b">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-[#8B4513] text-white flex items-center justify-center text-2xl font-bold">
          K22<br />GE
        </div>
        <h2 className="text-2xl font-bold mb-1">K22GE PES - 122</h2>
        <p className="text-sm text-muted-foreground">Group ~ 69 members</p>

        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <IconButton icon={ImageIcon} label="Images" />
          <IconButton icon={FileText} label="Files" />
          <IconButton icon={Link2} label="Links" />
          <IconButton icon={Search} label="Search" />
        </div>

        <Button variant="ghost" className="mt-4 text-sm">
          ✏️ ADD DESCRIPTION
        </Button>
      </div>

     
      <div className="divide-y">
        <MenuItem icon={Bell} text="Notification" />
        <MenuItem icon={Palette} text="Chat Theme" />
        <MenuItem
          icon={Download}
          text="Save to Photos"
          badge="default"
          onClick={() => setShowSaveOptions(true)}
        />
        <MenuItem icon={Trash2} text="Clear Chat" />
      </div>

      
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">136 members</h3>
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="divide-y">
          {members.map((member) => (
            <button
              key={member.id}
              className="w-full flex items-center gap-3 py-3 hover:bg-muted/50 transition"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="flex-1 text-left truncate">{member.name}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

    
      {showSaveOptions && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center animate-fadeIn">
          <div className="bg-card w-full max-w-md rounded-t-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Save Photos To</h3>
              <button onClick={() => setShowSaveOptions(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              <OptionButton
                label="📱 Device Gallery"
                description="Save to your phone's gallery"
                onClick={() => {
                  alert("Saving to Device Gallery...");
                  setShowSaveOptions(false);
                }}
              />
              <OptionButton
                label="💾 Downloads Folder"
                description="Store in your Downloads folder"
                onClick={() => {
                  alert("Saving to Downloads...");
                  setShowSaveOptions(false);
                }}
              />
              <OptionButton
                label="☁️ Cloud Storage"
                description="Backup to cloud (coming soon)"
                onClick={() => {
                  alert("Cloud saving not implemented yet.");
                  setShowSaveOptions(false);
                }}
              />
            </div>

            <Button
              variant="outline"
              className="mt-5 w-full"
              onClick={() => setShowSaveOptions(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};


const MenuItem = ({
  icon: Icon,
  text,
  badge,
  onClick,
}: {
  icon: any;
  text: string;
  badge?: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all"
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="flex-1 text-left truncate">{text}</span>
    {badge && <span className="text-xs text-muted-foreground">{badge}</span>}
    <ChevronRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
  </button>
);


const OptionButton = ({
  label,
  description,
  onClick,
}: {
  label: string;
  description: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left p-3 rounded-xl bg-muted/40 hover:bg-muted transition-all"
  >
    <div className="font-medium">{label}</div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </button>
);


const IconButton = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition">
    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
    <span className="text-xs sm:text-sm">{label}</span>
  </button>
);

export default GroupInfo;
