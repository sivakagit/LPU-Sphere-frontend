import { useNavigate } from "react-router-dom";
import { Mic, Camera, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Meeting = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div 
        className="sticky top-0 z-10 px-4 py-4 text-center"
        style={{ background: "var(--gradient-primary)" }}
      >
        <h1 className="text-xl font-semibold text-primary-foreground">
          Meeting
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="w-64 h-64 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
            alt="Meeting host"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex gap-8">
          <button className="w-12 h-12 rounded-full bg-card border flex items-center justify-center hover:bg-muted">
            <Mic className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 rounded-full bg-card border flex items-center justify-center hover:bg-muted">
            <Camera className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="bg-[#F4D9A6] px-6 py-3 rounded-lg text-center">
            <span className="font-mono text-sm">lghtDvuojn784#92b</span>
          </div>
          
          <Button 
            className="w-full bg-[#F4D9A6] text-foreground hover:bg-[#F4D9A6]/90 py-6 text-lg rounded-lg"
          >
            Join Now
          </Button>
        </div>
      </div>

      <div className="pb-8 flex justify-center">
        <button 
          onClick={() => navigate("/app")}
          className="w-12 h-12 rounded-full flex items-center justify-center"
        >
          <Home className="w-7 h-7 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default Meeting;
