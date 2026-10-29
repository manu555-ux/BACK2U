// BACK2U - Campus Lost & Found Prototype Data
// This file contains realistic sample items and initial claims for demonstration and evaluation.

export const initialItems = [
  {
    id: 1,
    title: "Navy Blue Ergonomic Backpack",
    category: "Bags",
    type: "Found",
    location: "Central Library, 2nd Floor (Silent Study Area)",
    date: "Today, 11:30 AM",
    description: "A dark navy blue Wildcraft backpack left next to study carrel #14. Contains notebooks and a stationery pouch.",
    emoji: "🎒",
    color: "lavender",
    imageUrl: null,
    status: "Available",
    owner: "Campus Security Desk",
    secret: "Inside front mini-pocket has a keychain shaped like Saturn with blue rings.",
    approved: true,
    contact: "security.desk@campus.edu",
    createdAt: "2026-10-26T11:30:00.000Z"
  },
  {
    id: 2,
    title: "Sony Noise-Canceling Earbuds Case",
    category: "Electronics",
    type: "Lost",
    location: "Campus Cafeteria, North Wing Window Tables",
    date: "Yesterday, 2:15 PM",
    description: "Matte white charging case for WF-1000XM4. Lost during lunch hour near the juice counter.",
    emoji: "🎧",
    color: "mint",
    imageUrl: null,
    status: "Available",
    owner: "A student",
    secret: "Has a tiny metallic Pikachu sticker slightly peeling on the bottom edge.",
    approved: true,
    contact: "student24@campus.edu",
    createdAt: "2026-10-25T14:15:00.000Z"
  },
  {
    id: 3,
    title: "Engineering Mathematics IV Ruled Notebook",
    category: "Books & Notes",
    type: "Found",
    location: "Block B, Room 204 (Lecture Hall)",
    date: "Oct 24, 4:45 PM",
    description: "Hardbound 200-page spiral notebook with extensive differential equation derivations and red margin notes.",
    emoji: "📓",
    color: "peach",
    imageUrl: null,
    status: "Available",
    owner: "Class Representative",
    secret: "The last page has a hand-drawn pencil sketch of Professor Sharma with 'M4 Done!' written below it.",
    approved: true,
    contact: "classrep.mech@campus.edu",
    createdAt: "2026-10-24T16:45:00.000Z"
  },
  {
    id: 4,
    title: "Student Smart ID Card",
    category: "ID & Cards",
    type: "Found",
    location: "Main Auditorium Entrance Steps",
    date: "Oct 23, 10:00 AM",
    description: "Official campus RFID student identification card in a transparent lanyard holder. Identity masked on public feed.",
    emoji: "🪪",
    color: "blue",
    imageUrl: null,
    status: "Available",
    owner: "Campus Security Desk",
    secret: "Lanyard strap has a red enamel badge saying 'Robotics Club Lead 2025' attached to the clip.",
    approved: true,
    contact: "security.desk@campus.edu",
    createdAt: "2026-10-23T10:00:00.000Z"
  },
  {
    id: 5,
    title: "Insulated Stainless Steel Water Bottle",
    category: "Other",
    type: "Lost",
    location: "Sports Complex, Badminton Court 2",
    date: "Oct 22, 6:00 PM",
    description: "Silver 750ml vacuum flask with a matte black twist cap and rubber grip loop.",
    emoji: "🧴",
    color: "rose",
    imageUrl: null,
    status: "Available",
    owner: "A student",
    secret: "Small circular dent on the bottom rim and a tiny star sticker inside the cap.",
    approved: true,
    contact: "student5@campus.edu",
    createdAt: "2026-10-22T18:00:00.000Z"
  },
  {
    id: 6,
    title: "Casio fx-991CW Scientific Calculator",
    category: "Electronics",
    type: "Found",
    location: "Computer Center, Lab 3, Desk 18",
    date: "Oct 21, 5:30 PM",
    description: "Black scientific calculator with slide-on protective hard case. Left behind after the practical exam.",
    emoji: "🧮",
    color: "amber",
    imageUrl: null,
    status: "Reunited",
    owner: "Lab Assistant",
    secret: "Inside of the hard case has a formula cheat sheet taped with yellow cellophane.",
    approved: true,
    contact: "lab.assistant@campus.edu",
    createdAt: "2026-10-21T17:30:00.000Z"
  },
  {
    id: 7,
    title: "Bunch of 3 Keys on Leather Carabiner",
    category: "Keys",
    type: "Found",
    location: "Hostel 3 Gate / Bike Parking",
    date: "Oct 20, 9:15 PM",
    description: "Set of room keys with a brass Godrej key and two smaller locker keys attached to a brown leather clip.",
    emoji: "🔑",
    color: "mint",
    imageUrl: null,
    status: "Available",
    owner: "Hostel Warden Office",
    secret: "One key has a neon green rubber identifier ring, and the carabiner is stamped 'TIMBER'.",
    approved: true,
    contact: "warden.h3@campus.edu",
    createdAt: "2026-10-20T21:15:00.000Z"
  }
];

export const initialClaims = [
  {
    id: 101,
    itemId: 1,
    itemTitle: "Navy Blue Ergonomic Backpack",
    claimantName: "Ananya Roy",
    claimantContact: "ananya.roy@campus.edu (Roll #23CS042)",
    details: "I lost my Wildcraft bag while studying on the 2nd floor before lunch. It has a miniature Saturn keychain with light blue rings clipped inside the front small zip pouch.",
    status: "Approved for handover",
    submittedAt: "Today, 1:20 PM",
    adminNotes: "Secret verified: matches planet keychain clue perfectly. Scheduled for Security Desk pickup.",
    handoverLocation: "Campus Security Desk, Block A Ground Floor (Bring Student ID)"
  },
  {
    id: 102,
    itemId: 4,
    itemTitle: "Student Smart ID Card",
    claimantName: "Rohan Varma",
    claimantContact: "rohan.v@campus.edu (Roll #24EC108)",
    details: "I dropped my RFID card on the auditorium steps after the orientation event. The lanyard has a special pin attached to it.",
    status: "Pending review",
    submittedAt: "Oct 24, 11:00 AM",
    adminNotes: "",
    handoverLocation: "Campus Security Desk, Block A Ground Floor"
  }
];

export const categories = [
  "All categories",
  "Electronics",
  "Bags",
  "Books & Notes",
  "ID & Cards",
  "Keys",
  "Clothing",
  "Other"
];

export const campusLocations = [
  "Central Library (Ground / 1st / 2nd Floor)",
  "Campus Cafeteria & Food Court",
  "Academic Block A (Classrooms & Dean Office)",
  "Academic Block B (Labs & Lecture Halls)",
  "Student Activity Center (SAC)",
  "Sports Complex & Outdoor Grounds",
  "Main Auditorium & Amphitheater",
  "Hostel Quad / Residential Zone",
  "Computer Center & Server Labs",
  "Campus Bus Stop & Main Gate"
];

export const colorThemes = [
  { id: "mint", name: "Mint Sage", hex: "#e3eddb", border: "#c8dec0" },
  { id: "lavender", name: "Lavender", hex: "#e9e0f5", border: "#d4c5ea" },
  { id: "peach", name: "Warm Peach", hex: "#f7e3d5", border: "#eec9b2" },
  { id: "blue", name: "Sky Mist", hex: "#dcebf2", border: "#bdd8e6" },
  { id: "rose", name: "Soft Rose", hex: "#fae1e6", border: "#ebc2ca" },
  { id: "amber", name: "Warm Honey", hex: "#fcf0d3", border: "#eedba9" }
];

export const emojiOptions = [
  "🎒", "🎧", "📓", "🪪", "🔑", "🧴", "🧮", "💻", "📱", "👓", "🧢", "⌚", "💳", "☂️", "📦"
];
