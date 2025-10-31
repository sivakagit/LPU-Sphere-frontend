import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Github,
  Linkedin,
  Globe,
  ChevronRight,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import profilePhoto from "@/assets/profile-photo.jpg";

const Profile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [description, setDescription] = useState("");
  const { profile, updateProfile } = useProfile(userId || undefined);

  const [links, setLinks] = useState({
    github_url: "https://github.com/Sreejith7448",
    linkedin_url: "https://www.linkedin.com/in/sreejith-mn",
    portfolio_url: "https://sreejithmnportfolio.netlify.app",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  useEffect(() => {
    if (profile) {
      setDescription(profile.description || "");
      setLinks({
        github_url: profile.github_url || "https://github.com/Sreejith7448",
        linkedin_url:
          profile.linkedin_url || "https://www.linkedin.com/in/sreejith-mn",
        portfolio_url:
          profile.portfolio_url || "https://sreejithmnportfolio.netlify.app",
      });
    }
  }, [profile]);

  const handleSaveDescription = async () => {
    if (description.length <= 300) {
      await updateProfile({ ...profile, description });
      setIsEditingDesc(false);
    }
  };

  const handleSaveLinks = async () => {
    await updateProfile({ ...profile, ...links });
    setIsEditingLinks(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-400 shadow-md">
        <button onClick={() => navigate(-1)} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-white flex-1 tracking-wide">
          PROFILE
        </h1>
      </div>

      
      <div className="p-6 text-center border-b border-muted/40">
        <div className="w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-orange-500/50 shadow-lg">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold mb-1">
          {profile?.name || "Sreejth Mn"}
        </h2>
        <p className="text-muted-foreground">{profile?.reg_no || "12205460"}</p>

        {/* Description */}
        {!isEditingDesc && description && (
          <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">
            {description}
          </p>
        )}

      
        {isEditingDesc && (
          <div className="mt-3 max-w-md mx-auto">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (max 300 characters)"
              maxLength={300}
              className="min-h-[100px] bg-card"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                {description.length}/300
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingDesc(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveDescription}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

       
        {!isEditingDesc && (
          <Button
            variant="default"
            className="mt-4 bg-orange-500 text-white hover:bg-orange-600 shadow-md transition-all"
            onClick={() => setIsEditingDesc(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {description ? "EDIT DESCRIPTION" : "ADD DESCRIPTION"}
          </Button>
        )}

        
        <div className="mt-3">
          {!isEditingLinks ? (
            <Button
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:opacity-90 shadow-md"
              onClick={() => setIsEditingLinks(true)}
            >
              <Edit className="w-4 h-4 mr-2" /> Edit Links
            </Button>
          ) : (
            <div className="flex justify-center gap-3">
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleSaveLinks}
              >
                <Save className="w-4 h-4 mr-2" /> Save All
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsEditingLinks(false)}
                className="text-red-500 hover:bg-red-100"
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      
      <div className="divide-y border-t border-muted/40">
        {[
          {
            key: "github_url",
            label: "GitHub",
            icon: <Github className="w-5 h-5 text-gray-800 dark:text-gray-100" />,
          },
          {
            key: "linkedin_url",
            label: "LinkedIn",
            icon: <Linkedin className="w-5 h-5 text-blue-600" />,
          },
          {
            key: "portfolio_url",
            label: "Portfolio",
            icon: <Globe className="w-5 h-5 text-orange-500" />,
          },
        ].map(({ key, label, icon }) => {
          const url = links[key as keyof typeof links];
          return (
            <div
              key={key}
              className="flex items-center justify-between p-4 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="p-2 bg-muted rounded-full shadow-inner">
                  {icon}
                </div>

                {isEditingLinks ? (
                  <Input
                    type="text"
                    value={url}
                    onChange={(e) =>
                      setLinks({ ...links, [key]: e.target.value })
                    }
                    className="flex-1"
                  />
                ) : (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-left font-medium text-orange-600 hover:underline"
                  >
                    {label}
                  </a>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Profile;
