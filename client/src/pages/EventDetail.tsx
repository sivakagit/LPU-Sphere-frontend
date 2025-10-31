import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--gradient-primary)" }}
      >
        <button onClick={() => navigate(-1)} className="text-primary-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-primary-foreground flex-1">Event Details</h1>
        <button onClick={() => navigate("/app")} className="text-primary-foreground">
          <Home className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4">
        <div className="bg-card rounded-xl overflow-hidden shadow-lg mb-4">
          <div className="bg-primary text-primary-foreground px-4 py-2">
            <h2 className="font-bold">23DC</h2>
          </div>
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop"
            alt="23DC Event"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="bg-card rounded-xl p-4 shadow-md space-y-4">
          <p className="text-sm leading-relaxed">
            From walking the beautiful pathways of LPU to shaping skylines worldwide, Mr. Sahil Dujja and Mr. Mohit Chawla have built a global legacy with 23DC Architects, a leading name in modern architecture, which is now revolutionizing luxury, sustainable, and futuristic design on an international scale.
          </p>

          <p className="text-sm leading-relaxed">
            Our #ProudVertos credit LPU's unparalleled infrastructure and world-class faculty for nurturing their architectural acumen. Immersive exposure to global trends and hands-on learning at LPU laid the foundation for their ambitious journey.
          </p>

          <p className="text-sm leading-relaxed">
            Today, 23DC Architects is a force in the architectural world, as it has been recognized in prestigious design publications and acclaimed for its innovative projects, standing as a symbol of excellence in modern architecture.
          </p>

          <p className="text-sm leading-relaxed">
            We are truly proud of their journey, which proves that with the right education, passion, and determination, #LPUAlumni don't just build careers, they build legacies.
          </p>

          <p className="text-sm text-primary">
            To know more about #ArchitectureAtLPU, visit{" "}
            <a href="http://www.lpu.in" className="underline font-semibold">
              www.lpu.in
            </a>
          </p>
        </div>

        <Button 
          className="w-full mt-6 rounded-full"
          onClick={() => navigate("/app")}
        >
          Back to Events
        </Button>
      </div>
    </div>
  );
};

export default EventDetail;
