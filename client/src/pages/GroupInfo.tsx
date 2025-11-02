import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import api from "@/api/axios"; // ✅ Make sure this points to your axios instance

const GroupInfo = () => {
  const navigate = useNavigate();
  const { id: classId } = useParams(); // e.g., CSE3A
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch members from backend
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/api/classes/${classId}/members`);
        setMembers(res.data);
      } catch (err) {
        console.error("Error fetching class members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [classId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--gradient-primary)" }}
      >
        <button onClick={() => navigate(-1)} className="text-primary-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-primary-foreground flex-1 text-center truncate">
          {classId}
        </h1>
        <div className="w-6" />
      </div>

      {/* Group Info */}
      <div className="p-6 text-center border-b">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-[#8B4513] text-white flex items-center justify-center text-2xl font-bold">
          {classId?.slice(0, 4) || "CL"}
        </div>
        <h2 className="text-2xl font-bold mb-1">{classId}</h2>
        <p className="text-sm text-muted-foreground">
          Group • {members.length} members
        </p>

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

      {/* Options */}
      <div className="divide-y">
        <MenuItem icon={Bell} text="Notification" />
        <MenuItem icon={Palette} text="Chat Theme" />
        <MenuItem
          icon={Download}
          text="Save to Photos"
          onClick={() => setShowSaveOptions(true)}
        />
        <MenuItem icon={Trash2} text="Clear Chat" />
      </div>

      {/* Members List */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">
            {loading ? "Loading..." : `${members.length} members`}
          </h3>
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="divide-y">
          {!loading && members.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No members found.
            </p>
          )}

          {members.map((member) => (
            <button
              key={member.regNo}
              className="w-full flex items-center gap-3 py-3 hover:bg-muted/50 transition"
            >
              <img
                src={
                  member.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 text-left">
                <p className="font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.regNo}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
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

// Reusable Components
const MenuItem = ({ icon: Icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all"
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="flex-1 text-left truncate">{text}</span>
    <ChevronRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
  </button>
);

const OptionButton = ({ label, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-3 rounded-xl bg-muted/40 hover:bg-muted transition-all"
  >
    <div className="font-medium">{label}</div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </button>
);

const IconButton = ({ icon: Icon, label }) => (
  <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition">
    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
    <span className="text-xs sm:text-sm">{label}</span>
  </button>
);

export default GroupInfo;
