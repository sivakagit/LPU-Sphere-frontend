import { useNavigate } from "react-router-dom";
import { LogOut, ChevronRight, User, Shield, Moon, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

type UserData = {
  regNo: string;
  name: string;
  role: string;
  classes: string[];
};

type MenuItemProps = {
  icon: React.ReactNode;
  text: string;
  to?: string;
  onClick?: () => void;
};

const MenuItem = ({ icon, text, to, onClick }: MenuItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-2xl cursor-pointer transition"
      onClick={() => (to ? navigate(to) : onClick?.())}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{text}</span>
      </div>
      <ChevronRight size={20} />
    </div>
  );
};

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<UserData | null>(null);

  // ✅ Load current user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({
      title: "Logged out successfully",
      description: "You’ve been logged out.",
    });
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/profile")}
        >
          View Profile
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 bg-muted rounded-2xl mb-6">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-sm text-gray-500">Reg No: {user.regNo}</p>
        <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        <MenuItem icon={<User />} text="Edit Profile" to="/profile" />
        <MenuItem
          icon={<Shield />}
          text="Privacy & Security"
          to="/settings/security"
        />
        <MenuItem
          icon={<Moon />}
          text={`Theme: ${theme === "dark" ? "Dark" : "Light"}`}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
        <MenuItem icon={<Info />} text="About App" to="/about" />
      </div>

      {/* Logout */}
      <div className="mt-auto pt-6">
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Settings;
