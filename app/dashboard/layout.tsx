import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: DashboardLayout } = createPageLayout({
  page: "dashboard",
  noIndex: true,
});

export { generateMetadata };
export default DashboardLayout;
