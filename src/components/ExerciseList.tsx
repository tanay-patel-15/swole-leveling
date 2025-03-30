
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { fetchExercises } from "@/services/exerciseService";
import { Exercise } from "@/models/types";
import { Search } from "lucide-react";

const ExerciseList = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByBodyPart, setFilterByBodyPart] = useState("");
  const [filterByEquipment, setFilterByEquipment] = useState("");
  
  // Get unique body parts and equipment types
  const bodyParts = [...new Set(exercises.map(ex => ex.bodyPart))].sort();
  const equipmentTypes = [...new Set(exercises.map(ex => ex.equipment))].sort();

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await fetchExercises();
        setExercises(data);
      } catch (error) {
        console.error("Failed to load exercises:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadExercises();
  }, []);

  // Filter exercises based on search and filters
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBodyPart = filterByBodyPart ? exercise.bodyPart === filterByBodyPart : true;
    const matchesEquipment = filterByEquipment ? exercise.equipment === filterByEquipment : true;
    
    return matchesSearch && matchesBodyPart && matchesEquipment;
  });

  if (loading) {
    return <div className="text-center p-8">Loading exercises...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search exercises..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterByBodyPart} onValueChange={setFilterByBodyPart}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Body Part" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Body Parts</SelectItem>
            {bodyParts.map(part => (
              <SelectItem key={part} value={part}>{part}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterByEquipment} onValueChange={setFilterByEquipment}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Equipment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Equipment</SelectItem>
            {equipmentTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.length > 0 ? (
          filteredExercises.map(exercise => (
            <div 
              key={exercise.id} 
              className="border rounded-lg p-4 hover:bg-accent transition-colors"
            >
              <h3 className="font-medium">{exercise.name}</h3>
              <div className="text-sm text-muted-foreground mt-1">
                <div>Target: {exercise.target}</div>
                <div>Body Part: {exercise.bodyPart}</div>
                <div>Equipment: {exercise.equipment}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center p-8">
            No exercises found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseList;
