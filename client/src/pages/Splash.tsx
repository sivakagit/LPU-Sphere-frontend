import { useNavigate } from "react-router-dom";
import { Fingerprint } from "lucide-react";
import lpuLogo from "@/assets/lpu-logo.png";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "var(--gradient-primary)" }}
    >
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        <img 
          src={lpuLogo} 
          alt="Lovely Professional University" 
          className="w-64 h-auto"
        />
        <button
          onClick={() => navigate("/login")}
          className="p-4 rounded-full hover:bg-black/10 transition-colors active:scale-95"
          aria-label="Login with fingerprint"
        >
          <Fingerprint className="w-16 h-16 text-foreground/80 animate-pulse" />
        </button>
      </div>
    </div>
  );
};

export default Splash;
