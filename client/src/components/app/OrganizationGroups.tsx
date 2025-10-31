import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Globe, Users, Briefcase, Code, Palette, Music, Trophy, Leaf, Camera, Lightbulb, Heart, Beaker, Newspaper, Film, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const organizations = [
  { id: "academic-excellence", name: "Academic Excellence", icon: GraduationCap },
  { id: "knowledge-hub", name: "Knowledge Hub", icon: BookOpen },
  { id: "global-affairs", name: "Global Affairs", icon: Globe },
  { id: "community", name: "Community", icon: Users },
  { id: "career-dev", name: "Career Dev", icon: Briefcase },
  { id: "tech-society", name: "Tech Society", icon: Code },
  { id: "arts-council", name: "Arts Council", icon: Palette },
  { id: "music-club", name: "Music Club", icon: Music },
  { id: "sports-committee", name: "Sports Committee", icon: Trophy },
  { id: "eco-warriors", name: "Eco Warriors", icon: Leaf },
  { id: "photography", name: "Photography", icon: Camera },
  { id: "innovation-lab", name: "Innovation Lab", icon: Lightbulb },
  { id: "social-service", name: "Social Service", icon: Heart },
  { id: "science-society", name: "Science Society", icon: Beaker },
  { id: "media-team", name: "Media Team", icon: Newspaper },
  { id: "film-society", name: "Film Society", icon: Film },
];

const availableGroups = [
  { id: "literature-club", name: "Literature Club", icon: BookOpen },
  { id: "debate-society", name: "Debate Society", icon: Users },
  { id: "robotics", name: "Robotics", icon: Beaker },
  { id: "dance-troupe", name: "Dance Troupe", icon: Music },
  { id: "entrepreneurship", name: "Entrepreneurship", icon: Lightbulb },
  { id: "gaming-club", name: "Gaming Club", icon: Trophy },
  { id: "astronomy", name: "Astronomy", icon: Globe },
  { id: "theatre", name: "Theatre", icon: Film },
];

const OrganizationGroups = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddGroup = (group: { id: string; name: string; icon: any }) => {
    toast({
      title: "Group Added",
      description: `${group.name} has been added to your organizations.`,
    });
    setIsDialogOpen(false);
  };

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3 bg-primary text-primary-foreground px-3 py-1 rounded-md inline-block">
        Organization Groups
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {organizations.map((org) => {
          const Icon = org.icon;
          return (
            <button
              key={org.id}
              onClick={() => navigate(`/organization-chat/${org.id}`, { state: { from: "events" } })}
              className="flex flex-col items-center gap-1 hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md">
                <Icon className="w-8 h-8" />
              </div>
              <span className="text-xs text-center text-foreground mt-1 leading-tight max-w-[70px]">
                {org.name}
              </span>
            </button>
          );
        })}
        
        {/* Add New Group Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex flex-col items-center gap-1 hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-muted-foreground/50 flex items-center justify-center shadow-md">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <span className="text-xs text-center text-foreground mt-1 leading-tight">
                Add Group
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Organization Group</DialogTitle>
              <DialogDescription>
                Choose a group to add to your organizations
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-4">
              {availableGroups.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <button
                    key={group.id}
                    onClick={() => handleAddGroup(group)}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                      <GroupIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-center text-foreground">{group.name}</span>
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrganizationGroups;
