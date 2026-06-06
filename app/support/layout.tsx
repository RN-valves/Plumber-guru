import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: SupportLayout } = createPageLayout({
  page: "support",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Support", path: "/support" },
  ],
});

export { generateMetadata };
export default SupportLayout;
