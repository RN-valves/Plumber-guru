export type AdminStatsResponse = {
  totalPlumbers: number;
  verifiedPlumbers: number;
  pendingVerification: number;
  activeJobs: number;
  newPlumbersThisMonth: number;
  plumbersByCity: { city: string; count: number }[];
  registrationsLast30Days: { date: string; count: number }[];
};

export type PlumberListItem = {
  id: string;
  name: string;
  phone: string;
  city: string;
  skills: string[];
  verified: boolean;
  rating: number;
  jobsDone: number;
  joinedDate: string;
  status: "active" | "inactive" | "suspended";
  available: "available" | "busy" | "offline";
};

export type PlumbersListResponse = {
  plumbers: PlumberListItem[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
};

export type PlumberBulkAction = "verify" | "suspend" | "delete";

export type PlumberBulkPatchBody = {
  ids: string[];
  action: PlumberBulkAction;
};

export type PlumberDetailResponse = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  languages: string[];
  skills: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  lastActive: string;
  status: string;
  available: string;
  location: { lat: number; lng: number } | null;
  adminNotes: string;
  stats: {
    jobsDone: number;
    earningsEstimate: number;
    profileViews: number;
  };
  jobs: {
    id: string;
    title: string;
    customer: string;
    city: string;
    status: string;
    amount: number;
    date: string;
  }[];
  documents: {
    id: string;
    type: string;
    fileName: string;
    uploadedAt: string;
    status: string;
  }[];
  activityLog: {
    id: string;
    action: string;
    detail: string;
    timestamp: string;
  }[];
};

export type JobListItem = {
  id: string;
  title: string;
  postedBy: string;
  city: string;
  salary: number;
  skills: string[];
  applications: number;
  status: string;
  jobType: string;
  postedDate: string;
  featured: boolean;
};

export type JobsListResponse = {
  jobs: JobListItem[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
};

export type JobPatchBody = {
  id?: string;
  ids?: string[];
  action: "feature" | "unfeature" | "update_status" | "delete";
  status?: string;
};

export type PodcastEpisode = {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  guest: string | null;
  duration: string;
  plays: number;
  publishedDate: string;
  status: "published" | "draft";
  featured: boolean;
  language: string;
  audioUrl: string | null;
  coverUrl: string | null;
  createdAt: string;
};

export type PodcastListResponse = {
  episodes: PodcastEpisode[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
};
