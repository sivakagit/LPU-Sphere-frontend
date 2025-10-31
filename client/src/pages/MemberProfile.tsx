import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, Github, Linkedin, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const memberData: Record<string, { name: string; id: string; seed: string; description: string; github?: string; linkedin?: string; portfolio?: string }> = {
  "you": { 
    name: "You", 
    id: "12205460", 
    seed: "you",
    description: "Computer Science student passionate about web development and AI. Love building innovative solutions.",
    github: "github.com/yourusername",
    linkedin: "linkedin.com/in/yourusername",
    portfolio: "yourportfolio.com"
  },
  "bashi": { 
    name: "Bashi", 
    id: "12205461", 
    seed: "bashi",
    description: "Full-stack developer with interest in cloud computing and DevOps. Always eager to learn new technologies.",
    github: "github.com/bashi",
    linkedin: "linkedin.com/in/bashi"
  },
  "dharani": { 
    name: "Dharani", 
    id: "12205462", 
    seed: "dharani",
    description: "Data science enthusiast working on machine learning projects. Passionate about turning data into insights.",
    linkedin: "linkedin.com/in/dharani",
    portfolio: "dharani.dev"
  },
  "nahulya": { 
    name: "Nahulya", 
    id: "12205463", 
    seed: "nahulya",
    description: "UI/UX designer and frontend developer. Creating beautiful and intuitive user experiences.",
    github: "github.com/nahulya",
    portfolio: "nahulya.design"
  },
  "ram": { 
    name: "Ram", 
    id: "12205464", 
    seed: "ram",
    description: "Mobile app developer specializing in React Native. Building cross-platform solutions.",
    github: "github.com/ram",
    linkedin: "linkedin.com/in/ram"
  },
  "saran": { 
    name: "Saran", 
    id: "12205465", 
    seed: "saran",
    description: "Backend developer focused on scalable systems and microservices architecture.",
    github: "github.com/saran",
    linkedin: "linkedin.com/in/saran",
    portfolio: "saran.tech"
  },
  "megha": { 
    name: "Megha", 
    id: "12205466", 
    seed: "megha",
    description: "Cybersecurity enthusiast and ethical hacker. Interested in building secure applications.",
    github: "github.com/megha",
    linkedin: "linkedin.com/in/megha"
  },
};

const invitations = [
  "Hi! I'd like to invite you to join our hackathon team. Interested in collaborating?",
  "Hey! Looking for a project teammate for an upcoming assignment. Want to work together?",
  "Hello! We're forming a team for a coding competition. Would you like to join us?",
  "Hi! I'm working on an exciting project and think you'd be a great fit. Interested?",
];

const MemberProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const member = memberData[id || ""] || { name: "Member", id: "00000000", seed: "default", description: "No description available." };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div 
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-center relative"
        style={{ background: "var(--gradient-primary)" }}
      >
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-4 text-primary-foreground"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-primary-foreground">
          PROFILE
        </h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.seed}`} />
            <AvatarFallback className="text-2xl">{member.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mb-1">{member.name}</h2>
          <p className="text-sm text-muted-foreground">{member.id}</p>
        </div>

        {/* Connect Button */}
        <div className="flex justify-center py-4">
          <button 
            onClick={() => setShowConnectDialog(true)}
            className="flex flex-col items-center gap-1 hover:text-primary transition-colors"
          >
            <Users className="w-6 h-6" />
            <span className="text-xs">Connect</span>
          </button>
        </div>

        {/* Description */}
        {member.description && (
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-muted-foreground">{member.description}</p>
          </div>
        )}

        {/* Profile Settings Section */}
        <div className="space-y-0 divide-y border-t border-b">
          <ProfileMenuItem icon={Github} text="GitHub" />
          <ProfileMenuItem icon={Linkedin} text="LinkedIn" />
          <ProfileMenuItem icon={Briefcase} text="Portfolio" />
        </div>
      </div>

      {/* Connect Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Connection Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            <p className="text-sm text-muted-foreground mb-4">Choose a message template:</p>
            {invitations.map((invitation, index) => (
              <button
                key={index}
                className="w-full text-left p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-sm"
                onClick={() => {
                  setShowConnectDialog(false);
                  // Here you could add logic to send the invitation
                }}
              >
                {invitation}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProfileMenuItem = ({ icon: Icon, text, badge }: { icon: any; text: string; badge?: string }) => (
  <button className="w-full py-3 px-4 hover:bg-accent/50 transition-colors flex items-center justify-between">
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

export default MemberProfile;
