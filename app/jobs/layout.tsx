import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: JobsLayout } = createPageLayout({
  page: "jobs",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
  ],
});

export { generateMetadata };
export default JobsLayout;
