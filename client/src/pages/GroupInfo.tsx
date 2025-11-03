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
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from "@/api/axios";
import { toast } from "sonner";

interface Member {
  regNo: string;
  name: string;
  seed: string;
}

interface ClassDetails {
  classId: string;
  className: string;
  code?: string;
  faculty: string;
  memberCount: number;
  members: Member[];
}

const GroupInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch group info from backend
  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/api/chats/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("✅ Group info fetched:", res.data);
        setClassDetails(res.data.class);
      } catch (err) {
        console.error("❌ Error fetching group info:", err);
        toast.error("Failed to load group info");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGroupInfo();
    }
  }, [id]);

  // Filter members based on search
  const filteredMembers = classDetails?.members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading group info...</div>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Group not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--gradient-primary)" }}
      >
        <button 
          onClick={() => navigate(`/chat/${id}`)} 
          className="text-primary-foreground"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-primary-foreground flex-1 text-center truncate">
          Group Info
        </h1>
        <div className="w-6" />
      </div>

      {/* Group Header */}
      <div className="p-6 text-center border-b">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-3xl font-bold">
          {classDetails.classId.substring(0, 2).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold mb-1">{classDetails.className}</h2>
        {classDetails.code && (
          <p className="text-sm text-muted-foreground mb-1">{classDetails.code}</p>
        )}
        <p className="text-sm text-muted-foreground">Group ~ {classDetails.memberCount} members</p>

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

      {/* Settings */}
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

      {/* Members */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{classDetails.memberCount} members</h3>
        </div>
        
        {/* Search Input */}
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="divide-y">
          {filteredMembers.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No members found</p>
          ) : (
            filteredMembers.map((member) => (
              <button
                key={member.regNo}
                onClick={() => navigate(`/member/${member.seed}`)}
                className="w-full flex items-center gap-3 py-3 hover:bg-muted/50 transition"
              >
                <Avatar className="w-10 h-10 bg-accent">
                  <AvatarFallback className="text-accent-foreground font-semibold">
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.regNo}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Save Options Modal */}
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
                  toast.success("Saving to Device Gallery...");
                  setShowSaveOptions(false);
                }}
              />
              <OptionButton
                label="💾 Downloads Folder"
                description="Store in your Downloads folder"
                onClick={() => {
                  toast.success("Saving to Downloads...");
                  setShowSaveOptions(false);
                }}
              />
              <OptionButton
                label="☁️ Cloud Storage"
                description="Backup to cloud (coming soon)"
                onClick={() => {
                  toast.info("Cloud saving not implemented yet.");
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