import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const courses = [
  { id: "1", name: "Course 1", color: "#F4A460" },
  { id: "2", name: "Course 2", color: "#8B4513" },
  { id: "3", name: "Course 3", color: "#2F4F4F" },
  { id: "4", name: "Course 4", color: "#DC143C" },
  { id: "5", name: "Course 5", color: "#DEB887" },
];

const CourseSelection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCourse = (id: string) => {
    setSelectedCourses(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
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
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="flex items-center gap-4 p-4 hover:bg-muted/50"
          >
            <div 
              className="w-12 h-12 rounded flex items-center justify-center"
              style={{ backgroundColor: course.color }}
            >
              <span className="text-white text-xs font-bold">ICON</span>
            </div>
            <div className="flex-1" />
            <Checkbox
              checked={selectedCourses.includes(course.id)}
              onCheckedChange={() => toggleCourse(course.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSelection;
