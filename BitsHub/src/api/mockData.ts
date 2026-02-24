// src/api/mockData.ts

export const dummyEvents = [
  {
    id: 1,
    title: "BitsHub Tech Symposium 2026",
    description: "Annual tech gathering featuring AI, Web3, and emerging tech talks.",
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
    venue: "Main Auditorium",
    organiser: "Tech Club",
    isActive: true,
    isBookmarked: false,
  },
  {
    id: 2,
    title: "Cultural Fiesta Night",
    description: "Music, dance, and cultural performances by various regional associations.",
    image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop",
    venue: "Open Air Theatre",
    organiser: "Cultural Council",
    isActive: true,
    isBookmarked: false,
  },
  {
    id: 3,
    title: "24-Hour Hackathon",
    description: "Build innovative software solutions overnight. Free food and prizes!",
    image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
    venue: "Library Seminar Hall",
    organiser: "Developers Society",
    isActive: true,
    isBookmarked: false,
  }
];

export const dummySlots = [
  {
    id: 101,
    event_id: 1,
    date_id: 1,
    dateString: "2026-03-15",
    startTime: "10:00 AM",
    endTime: "04:00 PM",
    availableCapacity: 500,
  },
  {
    id: 102,
    event_id: 2,
    date_id: 2,
    dateString: "2026-03-16",
    startTime: "06:00 PM",
    endTime: "11:00 PM",
    availableCapacity: 800,
  },
  {
    id: 103,
    event_id: 3,
    date_id: 3,
    dateString: "2026-03-17",
    startTime: "09:00 AM",
    endTime: "09:00 AM (Next Day)",
    availableCapacity: 150,
  }
];

export const dummyTicketTypes = [
  {
    id: 201,
    event_id: 1,
    name: "General Admission",
    price: 0,
    totalQuantity: 400,
  },
  {
    id: 202,
    event_id: 1,
    name: "VIP Access",
    price: 500,
    totalQuantity: 100,
  },
  {
    id: 203,
    event_id: 2,
    name: "Standard Entry",
    price: 200,
    totalQuantity: 800,
  },
  {
    id: 204,
    event_id: 3,
    name: "Hacker Pass (Free)",
    price: 0,
    totalQuantity: 150,
  }
];

export const dummyBookings: any[] = [];
