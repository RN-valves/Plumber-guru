import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: FindPlumberLayout } = createPageLayout({
  page: "findPlumber",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Find Plumber", path: "/find-plumber" },
  ],
});

export { generateMetadata };
export default FindPlumberLayout;
