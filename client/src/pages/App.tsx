import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Events from "@/components/app/Events";
import Chats from "@/components/app/Chats";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

const AppMain = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Check if we should open the chats tab
    if (location.state?.activeTab === "chats") {
      setActiveTab("chats");
    }
  }, [location.state]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    toast.success("Logged out successfully");
    
    // Navigate to login
    navigate("/login");
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    if (!name) return "bg-indigo-600";
    const colors = [
      "bg-indigo-600",
      "bg-emerald-600",
      "bg-violet-600",
      "bg-rose-600",
      "bg-amber-600",
      "bg-cyan-600",
      "bg-fuchsia-600",
      "bg-lime-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div 
          className="sticky top-0 z-10 pt-4 pb-2 px-4"
          style={{ background: "var(--gradient-primary)" }}
        >
          {/* Header with Avatar */}
          <div className="w-full max-w-md mx-auto flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold text-foreground">LPU Live</h1>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full">
                  <Avatar className={`h-10 w-10 cursor-pointer bg-accent`}>
                    <AvatarFallback className="text-white bg-accent font-semibold">
                      {getInitials(user?.name || "User")}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.regNo || "N/A"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user?.role || "Student"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 bg-transparent">
            <TabsTrigger 
              value="events"
              className="rounded-full text-foreground data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="chats"
              className="rounded-full text-foreground data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              Chats
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="events" className="mt-0">
          <Events />
        </TabsContent>

        <TabsContent value="chats" className="mt-0">
          <Chats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppMain;