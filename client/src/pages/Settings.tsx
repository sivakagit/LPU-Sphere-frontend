import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ArrowLeft, ChevronRight, Star, Moon, Sun, Bell, BellOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import React, { useState, ChangeEvent } from "react";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [muted, setMuted] = useState<boolean>(false);
  const [muteDays, setMuteDays] = useState<number>(1);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMuteDays(Number(e.target.value));
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      
      <div
        className="sticky top-0 z-10 px-2 py-3 mb-4"
        style={{ background: "var(--gradient-primary)", borderRadius: "12px" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="text-primary-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-primary-foreground">Settings</h2>
        </div>
        <Input
          type="text"
          placeholder="Search"
          className="rounded-full bg-card border-none focus:ring-2 focus:ring-primary"
        />
      </div>

     
      <MenuItem
        icon={<img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />}
        text="Sreejth Mn"
        to="/profile"
      />

   
      <div className="divide-y mt-4 space-y-2">
        
        <div className="flex flex-col gap-2 p-4 hover:bg-muted/50 transition-colors duration-300 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {muted ? (
                <BellOff className="w-6 h-6 text-cyan-400" />
              ) : (
                <Bell className="w-6 h-6 text-yellow-400" />
              )}
              <span className="font-medium text-lg">
                {muted ? "Notifications Muted" : "Notifications"}
              </span>
            </div>

           
            <button
              onClick={() => setMuted(!muted)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-500 ${
                muted
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_10px_#9333ea,0_0_20px_#0ea5e9]"
                  : "bg-[linear-gradient(90deg,#e5e7eb,#f9fafb)] shadow-inner"
              }`}
            >
              <span
                className={`absolute h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ${
                  muted ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {muted && (
            <div className="flex items-center gap-3 pl-9 mt-2">
              <span className="text-sm text-muted-foreground">Mute for:</span>
              <select
                value={muteDays}
                onChange={handleChange}
                className="bg-background border border-muted rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
              >
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={0}>Always</option>
              </select>
              <span className="text-sm font-medium">
                {muteDays === 0 ? "Always" : `${muteDays} day(s)`}
              </span>
            </div>
          )}
        </div>

        
        <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl transition-colors duration-300">
          <span className="text-left">🌞 Theme</span>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-500 
              ${theme === "dark"
                ? "bg-[linear-gradient(90deg,#0ea5e9,#9333ea)] shadow-[0_0_10px_#9333ea,0_0_20px_#0ea5e9]"
                : "bg-[linear-gradient(90deg,#e5e7eb,#f9fafb)] shadow-inner"}`}
          >
            <span
              className={`absolute flex items-center justify-center h-7 w-7 transform rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)] transition-all duration-500 ease-in-out ${
                theme === "dark" ? "translate-x-8" : "translate-x-1"
              }`}
            >
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_#22d3ee]" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_6px_#facc15]" />
              )}
            </span>
          </button>
        </div>

       
        <MenuItem icon="🔒" text="Privacy" />
        <MenuItem icon={<Star className="w-5 h-5" />} text="Starred Messages" />
      </div>

      
      <div className="divide-y mt-8 space-y-2">
        <MenuItem icon="🎓" text="LPU Touch" />
        <MenuItem icon="🎓" text="UMS" />
      </div>
      
<div className="sticky bottom-4 flex justify-center">
  <Button
    variant="destructive"
    size="sm"
    onClick={() => navigate("/login")}
    className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm shadow-md"
  >
    <LogOut className="w-4 h-4" />
    Logout
  </Button>
</div>

    </div>
  );
};

interface MenuItemProps {
  icon: string | React.ReactNode;
  text: string;
  badge?: string;
  to?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, badge, to }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => to && navigate(to)}
      className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 rounded-xl transition-colors duration-300"
    >
      {typeof icon === "string" ? (
        <span className="text-xl">{icon}</span>
      ) : (
        icon
      )}
      <span className="flex-1 text-left">{text}</span>
      {badge && <span className="text-sm text-muted-foreground">{badge}</span>}
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
    
  );
};

export default Settings;
