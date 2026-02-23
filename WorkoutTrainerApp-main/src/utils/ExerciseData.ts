
const vid1 = require("../../assets/videos/vid1.mp4");
const vid2 = require("../../assets/videos/vid2.mp4");
const vid3 = require("../../assets/videos/vid3.mp4");
const vid4 = require("../../assets/videos/vid4.mp4");
const vid5 = require("../../assets/videos/vid5.mp4");
const vid6 = require("../../assets/videos/vid6.mp4");
const vid7 = require("../../assets/videos/vid7.mp4");
const vid8 = require("../../assets/videos/vid8.mp4");

const ph1 = require("../../assets/photos/ph1.jpg");
const ph2 = require("../../assets/photos/ph2.jpg");
const ph3 = require("../../assets/photos/ph3.jpg");
const ph4 = require("../../assets/photos/ph4.jpg");
const ph5 = require("../../assets/photos/ph5.jpg");
const ph6 = require("../../assets/photos/ph6.jpg");
const ph7 = require("../../assets/photos/ph7.jpg");
const ph8 = require("../../assets/photos/ph8.jpg");


export interface Exercise {
  id: number;
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
    id: 1,
    name: "Crunches",
    video: vid1,
    photo: ph1,
    type: "strength",
    muscle: "abs",
    equipment: "dumbbell",
    difficulty: "beginner",
    met: 3.8,
    instructions:
      "Lay flat on your back with your knees bent and your feet flat on the ground, about a foot from your lower back. Place your fingertips on your temples with your palms facing out. Draw your belly into the base of your spine to engage the muscles, then raise your head and shoulders off the floor. Return to starting position and repeat.",
    tags: ["abs", "strength", "bodyweight", "intermediate"],
  },
  {
    id: 2,
    name: "Hand Plank",
    video: vid2,
    photo: ph2,
    type: "strength",
    muscle: "abs",
    equipment: "bodyweight",
    difficulty: "intermediate",
    met: 3.0,
    instructions:
      "Start in a kneeling position with your hands planted on the ground. Start in a kneeling position with your hands planted on the ground.",
    tags: ["abs", "strength", "bodyweight", "intermediate"],
  },
  {
    id: 3,
    name: "Laying Leg Raises",
    video: vid3,
    photo: ph3,
    type: "strength",
    muscle: "abs",
    equipment: "bodyweight",
    difficulty: "advanced",
    met: 4.2,
    instructions:
      "Start in a kneeling position with your hands planted on the ground. Start in a kneeling position with your hands planted on the ground.",
    tags: ["abs", "strength", "bodyweight", "advanced"],
  },
  {
    id: 4,
    name: "Dumbbell Russian Twist",
    video: vid4,
    photo: ph4,
    type: "strength",
    muscle: "abs",
    equipment: "dumbbell",
    difficulty: "easy",
    met: 4.5,
    instructions:
      "Sit on the floor and flex your knees and hips to a 90 degree angle. Your feet should be hovering off the ground. (If that's too hard start with heels on the floor) Rotate your upper spine to engage your obliques.",
    tags: ["abs", "strength", "dumbbell", "easy"],
  },
  {
    id: 5,
    name: "Chin Ups",
    video: vid5,
    photo: ph5,
    type: "strength",
    muscle: "arms",
    equipment: "bodyweight",
    difficulty: "advanced",
    met: 5.0,
    instructions:
      "Grab the bar shoulder width apart with a supinated grip (palms facing you). With your body hanging and arms fully extended, pull yourself up until your chin is past the bar. Slowly return to starting position. Repeat.",
    tags: ["arms", "strength", "bodyweight", "advanced"],
  },
  {
    id: 6,
    name: "Dumbbell Curl",
    video: vid6,
    photo: ph6,
    type: "strength",
    muscle: "arms",
    equipment: "dumbbell",
    difficulty: "intermediate",
    met: 3.2,
    instructions:
      "Stand up straight with a dumbbell in each hand at arm's length. Raise one dumbbell and twist your forearm until it is vertical and your palm faces the shoulder. Lower to original position and repeat with opposite arm.",
    tags: ["arms", "strength", "dumbbell", "easy"],
  },
  {
    id: 7,
    name: "Dumbbell Hammer Curl",
    video: vid7,
    photo: ph7,
    type: "strength",
    muscle: "arms",
    equipment: "dumbbell",
    difficulty: "easy",
    met: 3.3,
    instructions:
      "Hold the dumbbells with a neutral grip (thumbs facing the ceiling). Slowly lift the dumbbell up to chest height. Return to starting position and repeat.",
    tags: ["arms", "strength", "dumbbell", "easy"],
  },
  {
    id: 8,
    name: "Cable Bayesian Curl",
    video: vid8,
    photo: ph8,
    type: "strength",
    muscle: "arms",
    equipment: "cable machine",
    difficulty: "intermediate",
    met: 3.5,
    instructions:
      "Use a handle attachment. The cable should be set all the way to the bottom of the machine. Face away from the cable machine. Stagger your stance so you have a better base of support. Face your palm forward. Flex at the elbow and extend.",
    tags: ["arms", "strength", "cable machine", "intermediate"],
  },
  

];

export default ExerciseData;