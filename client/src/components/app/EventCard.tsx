import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  image: string;
  tag?: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/event/${event.id}`)}
      className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group aspect-square"
    >
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <h3 className="font-bold text-sm mb-0.5">{event.title}</h3>
        {event.subtitle && (
          <p className="text-xs opacity-90">{event.subtitle}</p>
        )}
        {event.date && (
          <p className="text-xs opacity-80 mt-1">{event.date}</p>
        )}
      </div>
      {event.tag && (
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-semibold">
          {event.tag}
        </div>
      )}
    </div>
  );
};

export default EventCard;
