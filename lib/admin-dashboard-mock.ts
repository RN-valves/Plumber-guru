export type StatCardData = {
  label: string;
  value: number;
  change: number;
  trend: "up" | "down";
};

export type ActivityType = "register" | "job" | "verify";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  message: string;
  time: string;
  actionLabel: string;
  actionHref: string;
};

export type PendingPlumber = {
  id: string;
  name: string;
  city: string;
  phone: string;
  documentsSubmitted: number;
  avatar?: string;
};

export type CityPerformance = {
  city: string;
  plumbers: number;
  jobs: number;
  avgRating: number;
  growth: number;
};

export const STAT_CARDS: StatCardData[] = [
  { label: "Total Plumbers registered", value: 12847, change: 12.4, trend: "up" },
  { label: "Plumbers verified this month", value: 892, change: 8.2, trend: "up" },
  { label: "Active jobs posted", value: 634, change: 3.1, trend: "down" },
  { label: "Customer leads today", value: 47, change: 18.6, trend: "up" },
  { label: "Invoices generated", value: 2156, change: 5.4, trend: "up" },
  { label: "Support tickets open", value: 23, change: 11.2, trend: "down" },
];

export const REGISTRATION_TREND = [
  { date: "4 May", count: 28 },
  { date: "5 May", count: 35 },
  { date: "6 May", count: 31 },
  { date: "7 May", count: 42 },
  { date: "8 May", count: 38 },
  { date: "9 May", count: 45 },
  { date: "10 May", count: 52 },
  { date: "11 May", count: 48 },
  { date: "12 May", count: 41 },
  { date: "13 May", count: 55 },
  { date: "14 May", count: 49 },
  { date: "15 May", count: 58 },
  { date: "16 May", count: 44 },
  { date: "17 May", count: 62 },
  { date: "18 May", count: 57 },
  { date: "19 May", count: 51 },
  { date: "20 May", count: 66 },
  { date: "21 May", count: 59 },
  { date: "22 May", count: 54 },
  { date: "23 May", count: 71 },
  { date: "24 May", count: 63 },
  { date: "25 May", count: 68 },
  { date: "26 May", count: 74 },
  { date: "27 May", count: 69 },
  { date: "28 May", count: 76 },
  { date: "29 May", count: 72 },
  { date: "30 May", count: 81 },
  { date: "31 May", count: 78 },
  { date: "1 Jun", count: 85 },
  { date: "2 Jun", count: 92 },
];

export const PLUMBERS_BY_CITY = [
  { name: "Delhi", value: 2840, fill: "#3b82f6" },
  { name: "Mumbai", value: 2310, fill: "#f97316" },
  { name: "Bangalore", value: 1980, fill: "#22c55e" },
  { name: "Hyderabad", value: 1650, fill: "#a855f7" },
  { name: "Chennai", value: 1420, fill: "#ef4444" },
  { name: "Others", value: 3647, fill: "#94a3b8" },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    type: "register",
    message: "Ramesh Kumar registered from Delhi",
    time: "2 min ago",
    actionLabel: "View profile",
    actionHref: "/admin/plumbers",
  },
  {
    id: "a2",
    type: "job",
    message: "New job posted in Mumbai — Bathroom renovation",
    time: "5 min ago",
    actionLabel: "View job",
    actionHref: "/admin/jobs",
  },
  {
    id: "a3",
    type: "verify",
    message: "Verification request from Suresh Patel",
    time: "10 min ago",
    actionLabel: "Review",
    actionHref: "/admin/plumbers/verify",
  },
  {
    id: "a4",
    type: "register",
    message: "Anita Desai registered from Bangalore",
    time: "14 min ago",
    actionLabel: "View profile",
    actionHref: "/admin/plumbers",
  },
  {
    id: "a5",
    type: "job",
    message: "New job posted in Hyderabad — Pipe leak repair",
    time: "22 min ago",
    actionLabel: "View job",
    actionHref: "/admin/jobs",
  },
  {
    id: "a6",
    type: "verify",
    message: "Verification request from Mohan Singh",
    time: "28 min ago",
    actionLabel: "Review",
    actionHref: "/admin/plumbers/verify",
  },
  {
    id: "a7",
    type: "register",
    message: "Vikram Reddy registered from Chennai",
    time: "35 min ago",
    actionLabel: "View profile",
    actionHref: "/admin/plumbers",
  },
  {
    id: "a8",
    type: "job",
    message: "Job completed in Pune — Water heater install",
    time: "41 min ago",
    actionLabel: "View job",
    actionHref: "/admin/jobs",
  },
  {
    id: "a9",
    type: "verify",
    message: "Documents uploaded by Priya Sharma",
    time: "48 min ago",
    actionLabel: "Review",
    actionHref: "/admin/plumbers/verify",
  },
  {
    id: "a10",
    type: "register",
    message: "Arjun Mehta registered from Ahmedabad",
    time: "55 min ago",
    actionLabel: "View profile",
    actionHref: "/admin/plumbers",
  },
];

export const PENDING_VERIFICATIONS: PendingPlumber[] = [
  {
    id: "p1",
    name: "Suresh Patel",
    city: "Ahmedabad",
    phone: "+91 98765 43210",
    documentsSubmitted: 3,
  },
  {
    id: "p2",
    name: "Mohan Singh",
    city: "Jaipur",
    phone: "+91 91234 56789",
    documentsSubmitted: 2,
  },
  {
    id: "p3",
    name: "Priya Sharma",
    city: "Lucknow",
    phone: "+91 99887 76655",
    documentsSubmitted: 4,
  },
  {
    id: "p4",
    name: "Karan Verma",
    city: "Indore",
    phone: "+91 97654 32109",
    documentsSubmitted: 3,
  },
  {
    id: "p5",
    name: "Deepak Joshi",
    city: "Nagpur",
    phone: "+91 94567 89012",
    documentsSubmitted: 2,
  },
];

export const TOP_CITIES: CityPerformance[] = [
  { city: "Delhi", plumbers: 2840, jobs: 412, avgRating: 4.7, growth: 14 },
  { city: "Mumbai", plumbers: 2310, jobs: 389, avgRating: 4.6, growth: 11 },
  { city: "Bangalore", plumbers: 1980, jobs: 356, avgRating: 4.8, growth: 18 },
  { city: "Hyderabad", plumbers: 1650, jobs: 298, avgRating: 4.5, growth: 9 },
  { city: "Chennai", plumbers: 1420, jobs: 267, avgRating: 4.6, growth: 12 },
  { city: "Pune", plumbers: 1180, jobs: 234, avgRating: 4.7, growth: 15 },
  { city: "Kolkata", plumbers: 1050, jobs: 201, avgRating: 4.4, growth: 7 },
  { city: "Ahmedabad", plumbers: 980, jobs: 189, avgRating: 4.5, growth: 10 },
];
