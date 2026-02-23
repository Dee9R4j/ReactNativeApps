import { Difficulty } from "@/types/global";


const vid1 = require("../../assets/videos/vid1.mp4");


const ph1 = require("../../assets/photos/ph1.jpg");



export interface Exercise {
  id: string;
  name: string;
  video: number; 
  photo: number;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  met: number;
  instructions?: string;
  tags?: string[];
}

const ExerciseData: Exercise[] = [
  {
    id: '1',
    name: "Rickshaw Carry",
    video: vid1,
    photo: ph1,
    type: "Strongman",
    muscle: "arms",
    equipment: "Others",
    difficulty: "Beginner" as Difficulty,
    met: 3.8,
    instructions:
      "Please connect the internet to see this.",
    tags: ["arms", "strongman", "others", "beginner"],
  },
  
];

export default ExerciseData;