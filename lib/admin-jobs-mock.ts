export type JobStatus = "active" | "filled" | "expired" | "reported";
export type JobType = "full_time" | "contract" | "gig" | "emergency";
export type LeadStatus = "new" | "assigned" | "resolved" | "cancelled";
export type LeadUrgency = "urgent" | "normal";

export type AdminJob = {
  id: string;
  title: string;
  postedBy: string;
  city: string;
  salary: number;
  skills: string[];
  applications: number;
  status: JobStatus;
  jobType: JobType;
  postedDate: string;
  featured?: boolean;
};

export type FeaturedJob = {
  id: string;
  title: string;
  city: string;
  salary: number;
};

export type CustomerLead = {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  problem: string;
  urgency: LeadUrgency;
  budget: string;
  assignedTo: string | null;
  status: LeadStatus;
  createdAt: string;
};

export type SkillDemand = {
  skill: string;
  jobCount: number;
  percent: number;
};

export const JOB_SUMMARY = {
  activeJobs: 634,
  filledToday: 28,
  expiredJobs: 45,
  avgSalary: 18500,
};

export const JOB_TYPES: { value: JobType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "full_time", label: "Full-time" },
  { value: "contract", label: "Contract" },
  { value: "gig", label: "Gig" },
  { value: "emergency", label: "Emergency" },
];

export const JOB_STATUS_OPTIONS: { value: JobStatus | "all"; label: string }[] =
  [
    { value: "all", label: "All statuses" },
    { value: "active", label: "Active" },
    { value: "filled", label: "Filled" },
    { value: "expired", label: "Expired" },
    { value: "reported", label: "Reported" },
  ];

export const CITIES_FILTER = [
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

const TITLES = [
  "Bathroom leak repair",
  "Water heater installation",
  "Kitchen pipe replacement",
  "Drain cleaning specialist",
  "Gas line inspection",
  "Solar geyser setup",
  "Full bathroom renovation",
  "Emergency pipe burst fix",
];
const POSTERS = [
  "Rajesh Builders",
  "Sunita Homes",
  "Metro Facilities",
  "Green Apartments",
  "City Maintenance Co.",
  "Priya Sharma",
  "Amit Constructions",
];
const SKILLS = [
  "Pipe fitting",
  "Water heater",
  "Drain cleaning",
  "Gas line",
  "Bathroom renovation",
];
const STATUSES: JobStatus[] = ["active", "filled", "expired", "reported"];
const TYPES: JobType[] = ["full_time", "contract", "gig", "emergency"];
const CITY_LIST = CITIES_FILTER.slice(1);

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export const MOCK_JOBS: AdminJob[] = Array.from({ length: 36 }, (_, i) => ({
  id: `job-${2000 + i}`,
  title: pick(TITLES, i),
  postedBy: pick(POSTERS, i + 2),
  city: pick(CITY_LIST, i),
  salary: 8000 + (i % 12) * 2500,
  skills: [pick(SKILLS, i), pick(SKILLS, i + 3)].filter(
    (s, idx, arr) => arr.indexOf(s) === idx
  ),
  applications: 2 + (i % 18),
  status: pick(STATUSES, i),
  jobType: pick(TYPES, i),
  postedDate: `${((i % 28) + 1).toString().padStart(2, "0")}/05/2025`,
  featured: i < 5,
}));

export const INITIAL_FEATURED: FeaturedJob[] = MOCK_JOBS.filter(
  (j) => j.featured
)
  .slice(0, 5)
  .map((j) => ({
    id: j.id,
    title: j.title,
    city: j.city,
    salary: j.salary,
  }));

export const LEAD_STATS = {
  newToday: 14,
  assigned: 23,
  resolvedThisWeek: 67,
  avgResponseTime: "42 min",
};

export const MOCK_LEADS: CustomerLead[] = [
  {
    id: "lead-1",
    customerName: "Anil Kapoor",
    phone: "+91 98765 11111",
    city: "Delhi",
    problem: "Kitchen sink pipe leaking badly, water spreading to hall",
    urgency: "urgent",
    budget: "₹2,000 – ₹3,500",
    assignedTo: null,
    status: "new",
    createdAt: "3 Jun 2025, 9:12 AM",
  },
  {
    id: "lead-2",
    customerName: "Meera Joshi",
    phone: "+91 91234 22222",
    city: "Mumbai",
    problem: "Water heater not heating, needs inspection",
    urgency: "normal",
    budget: "₹1,500 – ₹2,500",
    assignedTo: "Ramesh Kumar",
    status: "assigned",
    createdAt: "3 Jun 2025, 8:45 AM",
  },
  {
    id: "lead-3",
    customerName: "Vikram Singh",
    phone: "+91 99887 33333",
    city: "Bangalore",
    problem: "Blocked bathroom drain, foul smell",
    urgency: "urgent",
    budget: "₹800 – ₹1,200",
    assignedTo: null,
    status: "new",
    createdAt: "2 Jun 2025, 6:30 PM",
  },
  {
    id: "lead-4",
    customerName: "Sunita Reddy",
    phone: "+91 97654 44444",
    city: "Hyderabad",
    problem: "New flat — full plumbing check before move-in",
    urgency: "normal",
    budget: "₹5,000 – ₹8,000",
    assignedTo: "Suresh Patel",
    status: "assigned",
    createdAt: "2 Jun 2025, 2:15 PM",
  },
  {
    id: "lead-5",
    customerName: "Karan Mehta",
    phone: "+91 93456 55555",
    city: "Pune",
    problem: "Toilet flush not working",
    urgency: "normal",
    budget: "₹500 – ₹900",
    assignedTo: "Amit Sharma",
    status: "resolved",
    createdAt: "1 Jun 2025, 11:00 AM",
  },
  {
    id: "lead-6",
    customerName: "Deepa Nair",
    phone: "+91 94567 66666",
    city: "Chennai",
    problem: "Pipe burst in terrace — emergency",
    urgency: "urgent",
    budget: "₹3,000 – ₹5,000",
    assignedTo: null,
    status: "new",
    createdAt: "1 Jun 2025, 7:20 AM",
  },
  {
    id: "lead-7",
    customerName: "Rohit Gupta",
    phone: "+91 95678 77777",
    city: "Kolkata",
    problem: "Low water pressure in all taps",
    urgency: "normal",
    budget: "₹1,000 – ₹2,000",
    assignedTo: "Priya Sharma",
    status: "assigned",
    createdAt: "31 May 2025, 4:50 PM",
  },
  {
    id: "lead-8",
    customerName: "Neha Verma",
    phone: "+91 96789 88888",
    city: "Ahmedabad",
    problem: "Cancelled — found local plumber",
    urgency: "normal",
    budget: "₹1,200",
    assignedTo: null,
    status: "cancelled",
    createdAt: "30 May 2025, 10:30 AM",
  },
];

export const JOBS_PER_DAY = [
  { date: "4 May", count: 18 },
  { date: "5 May", count: 22 },
  { date: "6 May", count: 15 },
  { date: "7 May", count: 28 },
  { date: "8 May", count: 24 },
  { date: "9 May", count: 31 },
  { date: "10 May", count: 26 },
  { date: "11 May", count: 19 },
  { date: "12 May", count: 33 },
  { date: "13 May", count: 27 },
  { date: "14 May", count: 21 },
  { date: "15 May", count: 35 },
  { date: "16 May", count: 29 },
  { date: "17 May", count: 23 },
  { date: "18 May", count: 38 },
  { date: "19 May", count: 32 },
  { date: "20 May", count: 25 },
  { date: "21 May", count: 41 },
  { date: "22 May", count: 36 },
  { date: "23 May", count: 28 },
  { date: "24 May", count: 44 },
  { date: "25 May", count: 39 },
  { date: "26 May", count: 33 },
  { date: "27 May", count: 47 },
  { date: "28 May", count: 42 },
  { date: "29 May", count: 37 },
  { date: "30 May", count: 50 },
  { date: "31 May", count: 45 },
  { date: "1 Jun", count: 52 },
  { date: "2 Jun", count: 48 },
];

export const JOBS_BY_CITY = [
  { city: "Delhi", jobs: 142 },
  { city: "Mumbai", jobs: 128 },
  { city: "Bangalore", jobs: 115 },
  { city: "Hyderabad", jobs: 98 },
  { city: "Chennai", jobs: 87 },
  { city: "Pune", jobs: 76 },
  { city: "Kolkata", jobs: 68 },
  { city: "Ahmedabad", jobs: 61 },
  { city: "Jaipur", jobs: 54 },
  { city: "Lucknow", jobs: 49 },
];

export const SKILL_DEMAND: SkillDemand[] = [
  { skill: "Pipe fitting", jobCount: 312, percent: 24.2 },
  { skill: "Water heater", jobCount: 248, percent: 19.2 },
  { skill: "Drain cleaning", jobCount: 196, percent: 15.2 },
  { skill: "Bathroom renovation", jobCount: 174, percent: 13.5 },
  { skill: "Gas line", jobCount: 142, percent: 11.0 },
  { skill: "Solar heater", jobCount: 98, percent: 7.6 },
  { skill: "Emergency repair", jobCount: 76, percent: 5.9 },
  { skill: "Kitchen plumbing", jobCount: 45, percent: 3.4 },
];

export const ASSIGNABLE_PLUMBERS = [
  { id: "pg-1000", name: "Ramesh Kumar", city: "Delhi", phone: "+91 98000" },
  { id: "pg-1001", name: "Suresh Patel", city: "Mumbai", phone: "+91 98137" },
  { id: "pg-1002", name: "Priya Sharma", city: "Bangalore", phone: "+91 98274" },
  { id: "pg-1003", name: "Amit Singh", city: "Hyderabad", phone: "+91 98411" },
  { id: "pg-1004", name: "Vikram Reddy", city: "Chennai", phone: "+91 98548" },
  { id: "pg-1005", name: "Karan Mehta", city: "Pune", phone: "+91 98685" },
];
