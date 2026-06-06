import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: AboutLayout } = createPageLayout({
  page: "about",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ],
});

export { generateMetadata };
export default AboutLayout;
