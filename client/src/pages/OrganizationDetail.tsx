import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Image, FileText, Link, Search, Bell, Palette, Camera, Download, Trash2, Edit, Users, GraduationCap, BookOpen, Code } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const organizationData: Record<string, { name: string; icon: any; members: number; id: string }> = {
  "academic-excellence": { name: "Academic Excellence", icon: GraduationCap, members: 136, id: "13-206" },
  "knowledge-hub": { name: "Knowledge Hub", icon: BookOpen, members: 203, id: "14-301" },
  "tech-society": { name: "Tech Society", icon: Code, members: 189, id: "15-402" },
};

const members = [
  { name: "You", seed: "you", regNo: "11801234" },
  { name: "Bashi", seed: "bashi", regNo: "11802567" },
  { name: "Dharani", seed: "dharani", regNo: "11803891" },
  { name: "Nahulya", seed: "nahulya", regNo: "11804512" },
  { name: "Ram", seed: "ram", regNo: "11805923" },
  { name: "Saran", seed: "saran", regNo: "11806734" },
  { name: "Megha", seed: "megha", regNo: "11807845" },
];

const OrganizationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const org = organizationData[id || ""] || { name: "Organization", icon: Users, members: 0, id: "00-000" };
  const Icon = org.icon;

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.regNo.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div 
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--gradient-primary)" }}
      >
        <button onClick={() => navigate(-1)} className="text-primary-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-primary-foreground">
          {org.name}
        </h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Organization Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center mb-4">
            <Icon className="w-16 h-16 text-accent-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-1 text-foreground">{org.name} : {org.id}</h2>
          <p className="text-sm text-muted-foreground">Group ~ {org.members} members</p>
        </div>

        {/* Media Links */}
        <div className="flex justify-around py-4">
          <button className="flex flex-col items-center gap-1 text-foreground">
            <Image className="w-6 h-6" />
            <span className="text-xs">Images</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-foreground">
            <FileText className="w-6 h-6" />
            <span className="text-xs">Files</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-foreground">
            <Link className="w-6 h-6" />
            <span className="text-xs">Links</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-foreground">
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </button>
        </div>

        {/* Add Description */}
        <button className="w-full py-3 flex items-center justify-center gap-2 text-sm text-foreground hover:bg-accent transition-colors rounded-lg">
          <Edit className="w-4 h-4" />
          ADD DESCRIPTION
        </button>

        {/* Settings Section */}
        <div className="space-y-0 divide-y border-t border-b">
          <MenuItem icon={Bell} text="Notification" />
          <MenuItem icon={Palette} text="Chat Theme" />
          <MenuItem icon={Download} text="Save to Photos" badge="(default)" />
          <MenuItem icon={Trash2} text="Clear Chat" />
        </div>

        {/* Members Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">{org.members} members</h3>
          </div>
          <div className="mb-3">
            <Input
              placeholder="Search by name or registration number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-0 divide-y">
            {filteredMembers.map(member => (
              <MemberItem 
                key={member.seed} 
                name={member.name} 
                seed={member.seed}
                regNo={member.regNo}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon: Icon, text, badge }: { icon: any; text: string; badge?: string }) => (
  <button className="w-full py-3 px-4 hover:bg-accent/50 transition-colors flex items-center justify-between text-foreground">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      <span>{text}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && <span className="text-sm text-muted-foreground">{badge}</span>}
      <span className="text-muted-foreground">›</span>
    </div>
  </button>
);

const MemberItem = ({ name, seed, regNo }: { name: string; seed: string; regNo: string }) => {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate(`/member/${seed}`)}
      className="w-full py-3 px-4 hover:bg-accent/50 transition-colors flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-left">
          <div className="font-medium text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{regNo}</div>
        </div>
      </div>
      <span className="text-muted-foreground">›</span>
    </button>
  );
};

export default OrganizationDetail;
