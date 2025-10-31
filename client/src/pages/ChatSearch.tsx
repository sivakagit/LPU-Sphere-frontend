import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const groups = [
  { id: "1", name: "Campus Connect", avatar: "CC", unread: 1 },
  { id: "2", name: "Eduupluse", avatar: "EU", unread: 1 },
  { id: "3", name: "Uni Sphere", avatar: "US", unread: 1 },
  { id: "4", name: "Vertex Society", avatar: "VS", unread: 1 },
  { id: "5", name: "Academic Alliance", avatar: "AA", unread: 1 },
];

const ChatSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleGroups, setVisibleGroups] = useState(groups);

  const filteredGroups = visibleGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeGroup = (id: string) => {
    setVisibleGroups(visibleGroups.filter(g => g.id !== id));
  };

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
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full bg-card"
            autoFocus
          />
        </div>
      </div>

      <div className="divide-y">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="flex items-center gap-3 p-4 hover:bg-muted/50"
          >
            <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
              {group.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{group.name}</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-sm bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {group.unread}
              </div>
              <button
                onClick={() => removeGroup(group.id)}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSearch;
