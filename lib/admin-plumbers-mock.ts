export type PlumberStatus = "active" | "inactive";
export type VerifiedStatus = "verified" | "pending";
export type AvailableStatus = "available" | "busy" | "offline";

export type PlumberListItem = {
  id: string;
  name: string;
  phone: string;
  city: string;
  skills: string[];
  verified: VerifiedStatus;
  rating: number;
  jobsDone: number;
  joinedDate: string;
  status: PlumberStatus;
  available: AvailableStatus;
};

export type VerificationQueueItem = {
  id: string;
  name: string;
  phone: string;
  city: string;
  skills: string[];
  photoUrl?: string;
  submittedAt: string;
  documents: {
    aadhaar: { uploaded: boolean; label: string };
    skillCertificate: { uploaded: boolean; label: string };
    photoId: { uploaded: boolean; label: string };
  };
};

export type VerifiedHistoryItem = {
  id: string;
  name: string;
  city: string;
  verifiedAt: string;
  verifiedBy: string;
};

export type PlumberJob = {
  id: string;
  title: string;
  customer: string;
  city: string;
  status: "completed" | "in_progress" | "applied" | "cancelled";
  amount: number;
  date: string;
};

export type PlumberInvoice = {
  id: string;
  number: string;
  customer: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
};

export type PlumberDocument = {
  id: string;
  type: string;
  fileName: string;
  uploadedAt: string;
  status: "approved" | "pending" | "rejected";
};

export type ActivityLogEntry = {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
};

export type PlumberDetail = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  languages: string[];
  skills: string[];
  verified: VerifiedStatus;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  lastActive: string;
  photoUrl?: string;
  location: { lat: number; lng: number };
  stats: {
    jobsDone: number;
    earningsEstimate: number;
    profileViews: number;
    ratingBreakdown: { stars: number; count: number }[];
  };
  jobs: PlumberJob[];
  invoices: PlumberInvoice[];
  documents: PlumberDocument[];
  activityLog: ActivityLogEntry[];
};

export const PLUMBER_TOTAL_COUNT = 12450;

export const CITIES = [
  "All cities",
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

export const SKILL_OPTIONS = [
  "All skills",
  "Pipe fitting",
  "Water heater",
  "Bathroom renovation",
  "Drain cleaning",
  "Gas line",
  "Solar heater",
];

const FIRST_NAMES = [
  "Ramesh",
  "Suresh",
  "Priya",
  "Amit",
  "Vikram",
  "Anita",
  "Karan",
  "Deepak",
  "Mohan",
  "Neha",
];
const LAST_NAMES = [
  "Kumar",
  "Patel",
  "Sharma",
  "Singh",
  "Reddy",
  "Verma",
  "Joshi",
  "Gupta",
  "Mehta",
  "Nair",
];
const CITY_LIST = CITIES.slice(1);

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function genPlumbers(count: number): PlumberListItem[] {
  return Array.from({ length: count }, (_, i) => {
    const name = `${pick(FIRST_NAMES, i)} ${pick(LAST_NAMES, i + 3)}`;
    const day = (i % 28) + 1;
    const month = (i % 12) + 1;
    return {
      id: `pg-${1000 + i}`,
      name,
      phone: `+91 ${98000 + i * 137}`.slice(0, 14),
      city: pick(CITY_LIST, i),
      skills: [
        pick(SKILL_OPTIONS, i + 1),
        pick(SKILL_OPTIONS, i + 4),
      ].filter((s) => s !== "All skills"),
      verified: i % 4 === 0 ? "pending" : "verified",
      rating: Number((3.8 + (i % 12) * 0.1).toFixed(1)),
      jobsDone: 5 + (i % 80),
      joinedDate: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/2024`,
      status: i % 9 === 0 ? "inactive" : "active",
      available: pick(
        ["available", "busy", "offline"] as AvailableStatus[],
        i
      ),
    };
  });
}

export const MOCK_PLUMBERS_LIST = genPlumbers(48);

export const VERIFICATION_QUEUE: VerificationQueueItem[] = [
  {
    id: "pg-1002",
    name: "Suresh Patel",
    phone: "+91 98765 43210",
    city: "Ahmedabad",
    skills: ["Pipe fitting", "Drain cleaning"],
    submittedAt: "3 Jun 2025, 10:24 AM",
    documents: {
      aadhaar: { uploaded: true, label: "Aadhaar Card" },
      skillCertificate: { uploaded: true, label: "ITI Certificate" },
      photoId: { uploaded: true, label: "Photo ID" },
    },
  },
  {
    id: "pg-1006",
    name: "Mohan Singh",
    phone: "+91 91234 56789",
    city: "Jaipur",
    skills: ["Water heater", "Bathroom renovation"],
    submittedAt: "3 Jun 2025, 9:15 AM",
    documents: {
      aadhaar: { uploaded: true, label: "Aadhaar Card" },
      skillCertificate: { uploaded: false, label: "Skill Certificate" },
      photoId: { uploaded: true, label: "Photo ID" },
    },
  },
  {
    id: "pg-1010",
    name: "Priya Sharma",
    phone: "+91 99887 76655",
    city: "Lucknow",
    skills: ["Gas line", "Pipe fitting"],
    submittedAt: "2 Jun 2025, 6:40 PM",
    documents: {
      aadhaar: { uploaded: true, label: "Aadhaar Card" },
      skillCertificate: { uploaded: true, label: "Trade License" },
      photoId: { uploaded: false, label: "Photo ID" },
    },
  },
  {
    id: "pg-1014",
    name: "Karan Verma",
    phone: "+91 97654 32109",
    city: "Indore",
    skills: ["Solar heater", "Water heater"],
    submittedAt: "2 Jun 2025, 2:10 PM",
    documents: {
      aadhaar: { uploaded: true, label: "Aadhaar Card" },
      skillCertificate: { uploaded: true, label: "Skill Certificate" },
      photoId: { uploaded: true, label: "Photo ID" },
    },
  },
  {
    id: "pg-1018",
    name: "Deepak Joshi",
    phone: "+91 94567 89012",
    city: "Nagpur",
    skills: ["Drain cleaning"],
    submittedAt: "1 Jun 2025, 11:30 AM",
    documents: {
      aadhaar: { uploaded: false, label: "Aadhaar Card" },
      skillCertificate: { uploaded: true, label: "Certificate" },
      photoId: { uploaded: true, label: "Photo ID" },
    },
  },
  {
    id: "pg-1022",
    name: "Anita Desai",
    phone: "+91 93456 78901",
    city: "Bangalore",
    skills: ["Bathroom renovation", "Pipe fitting"],
    submittedAt: "1 Jun 2025, 8:00 AM",
    documents: {
      aadhaar: { uploaded: true, label: "Aadhaar Card" },
      skillCertificate: { uploaded: true, label: "Skill Certificate" },
      photoId: { uploaded: true, label: "Photo ID" },
    },
  },
];

export const VERIFIED_HISTORY: VerifiedHistoryItem[] = Array.from(
  { length: 50 },
  (_, i) => ({
    id: `vh-${i}`,
    name: `${pick(FIRST_NAMES, i)} ${pick(LAST_NAMES, i + 2)}`,
    city: pick(CITY_LIST, i),
    verifiedAt: `${(i % 28) + 1} May 2025, ${9 + (i % 8)}:${(i % 6) * 10} AM`,
    verifiedBy: pick(["Admin Raj", "Admin Priya", "Admin Vikram"], i),
  })
);

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Delhi: { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
};

export function getPlumberDetail(id: string): PlumberDetail {
  const listItem =
    MOCK_PLUMBERS_LIST.find((p) => p.id === id) ?? MOCK_PLUMBERS_LIST[0];
  const coords = CITY_COORDS[listItem.city] ?? CITY_COORDS.Delhi;

  return {
    id: listItem.id,
    name: listItem.name,
    phone: listItem.phone,
    email: `${listItem.name.toLowerCase().replace(/\s/g, ".")}@example.com`,
    city: listItem.city,
    languages: ["Hindi", "English", listItem.city === "Chennai" ? "Tamil" : "Marathi"].slice(0, 2 + (id.length % 2)),
    skills: listItem.skills,
    verified: listItem.verified,
    rating: listItem.rating,
    reviewCount: 12 + (id.length % 40),
    joinedDate: listItem.joinedDate,
    lastActive: "2 hours ago",
    location: {
      lat: coords.lat + (id.length % 10) * 0.01,
      lng: coords.lng + (id.length % 7) * 0.01,
    },
    stats: {
      jobsDone: listItem.jobsDone,
      earningsEstimate: listItem.jobsDone * 1850,
      profileViews: 340 + id.length * 12,
      ratingBreakdown: [
        { stars: 5, count: 28 },
        { stars: 4, count: 14 },
        { stars: 3, count: 5 },
        { stars: 2, count: 2 },
        { stars: 1, count: 1 },
      ],
    },
    jobs: [
      {
        id: "j1",
        title: "Bathroom leak repair",
        customer: "Rajesh M.",
        city: listItem.city,
        status: "completed",
        amount: 2500,
        date: "28 May 2025",
      },
      {
        id: "j2",
        title: "Water heater installation",
        customer: "Sunita K.",
        city: listItem.city,
        status: "in_progress",
        amount: 4500,
        date: "1 Jun 2025",
      },
      {
        id: "j3",
        title: "Kitchen pipe replacement",
        customer: "Arun P.",
        city: listItem.city,
        status: "applied",
        amount: 3200,
        date: "2 Jun 2025",
      },
    ],
    invoices: [
      {
        id: "inv1",
        number: "PG-INV-2841",
        customer: "Rajesh M.",
        amount: 2500,
        status: "paid",
        date: "28 May 2025",
      },
      {
        id: "inv2",
        number: "PG-INV-2902",
        customer: "Sunita K.",
        amount: 4500,
        status: "pending",
        date: "1 Jun 2025",
      },
    ],
    documents: [
      {
        id: "d1",
        type: "Aadhaar Card",
        fileName: "aadhaar-front.pdf",
        uploadedAt: "15 Apr 2025",
        status: "approved",
      },
      {
        id: "d2",
        type: "Skill Certificate",
        fileName: "iti-certificate.pdf",
        uploadedAt: "15 Apr 2025",
        status: "approved",
      },
      {
        id: "d3",
        type: "Photo ID",
        fileName: "photo-id.jpg",
        uploadedAt: "16 Apr 2025",
        status: "pending",
      },
    ],
    activityLog: [
      {
        id: "al1",
        action: "Logged in",
        detail: "Mobile app — Android",
        timestamp: "3 Jun 2025, 8:12 AM",
      },
      {
        id: "al2",
        action: "Job applied",
        detail: "Kitchen pipe replacement — #J-4421",
        timestamp: "2 Jun 2025, 4:30 PM",
      },
      {
        id: "al3",
        action: "Invoice created",
        detail: "PG-INV-2902 — ₹4,500",
        timestamp: "1 Jun 2025, 11:00 AM",
      },
      {
        id: "al4",
        action: "Profile updated",
        detail: "Added skill: Solar heater",
        timestamp: "30 May 2025, 9:45 AM",
      },
      {
        id: "al5",
        action: "Job completed",
        detail: "Bathroom leak repair — ₹2,500",
        timestamp: "28 May 2025, 6:20 PM",
      },
    ],
  };
}
