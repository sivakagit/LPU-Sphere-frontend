import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import EventCard from "./EventCard";
import OrganizationGroups from "./OrganizationGroups";

const events = [
  { id: "1", title: "23DC", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop", tag: "23DC" },
  { id: "2", title: "ARTFUSION", subtitle: "Creative Showcase", date: "Nov 01, 2025 | 5:00 PM", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop",tag: "ARTFUSION" },
  { id: "3", title: "IGNITE TALKS", subtitle: "Speaker Series", date: "Nov 02, 2025 | 3:00 PM", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",tag: "IGNITE TALKS" },
  { id: "4", title: "TechTribe 2025", subtitle: "Innovation Fest", date: "Nov 16, 2025 | Mechanical Block A", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop" },
  { id: "5", title: "RHYTHMIC BEATS", subtitle: "Music Festival", date: "Nov 17, 2025 | 6:00 PM", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop" },
  { id: "6", title: "CAMPUS CARNIVAL", subtitle: "Fun Fair", date: "Oct 27, 2025 | 2:00 PM", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop" },
  { id: "7", title: "CODE CLASH", subtitle: "Hackathon", date: "Oct 26, 2025 | 10:00 AM", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop" },
  { id: "8", title: "SPORTSX", subtitle: "Athletics Meet", date: "Dec 19, 2025 | 8:00 AM", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop" },
  { id: "9", title: "ECOSPHERE", subtitle: "Sustainability Summit", date: "Dec 23, 2025 | 11:00 AM", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop" },
];

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20">
      <div className={`sticky top-[60px] z-20 px-4 transition-all duration-300 ${isScrolled ? 'py-2' : 'pt-4 pb-2'}`}>
        <div className="relative max-w-md mx-auto">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-300 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-12 rounded-full bg-card transition-all duration-300 ${isScrolled ? 'h-9 text-sm' : 'h-10'}`}
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-sm font-semibold mb-3 bg-primary text-primary-foreground px-3 py-1 rounded-md inline-block">
            Events
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        <OrganizationGroups />
      </div>
    </div>
  );
};

export default Events;
