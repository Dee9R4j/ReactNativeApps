import { IDateTimeParts } from "./types";

// Function to parse ISO date string
export const parseDateTime = (dateString: string): IDateTimeParts => {
  const dateObj = new Date(dateString);

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");

  // 24-hour format
  const hours24 = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");

  // 12-hour format
  let hours12 = dateObj.getHours();
  const ampm = hours12 >= 12 ? "pm" : "am";
  hours12 = hours12 % 12 || 12;

  return {
    year,
    month,
    day,
    hours: hours24,
    minutes,
    seconds,
    date: `${day}-${month}-${year}`,
    time24: `${hours24}:${minutes}:${seconds}`,   // 24-hour format
    time12: `${hours12}:${minutes} ${ampm}`,     // 12-hour format
  };
};
