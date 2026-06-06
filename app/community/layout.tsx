import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: CommunityLayout } = createPageLayout({
  page: "community",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Community", path: "/community" },
  ],
});

export { generateMetadata };
export default CommunityLayout;
