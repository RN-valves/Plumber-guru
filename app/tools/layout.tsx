import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: ToolsLayout } = createPageLayout({
  page: "tools",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
  ],
});

export { generateMetadata };
export default ToolsLayout;
