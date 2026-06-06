import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: HealthSafetyLayout } = createPageLayout({
  page: "healthSafety",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Health & Safety", path: "/health-safety" },
  ],
});

export { generateMetadata };
export default HealthSafetyLayout;
