import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: BrandsLayout } = createPageLayout({
  page: "brands",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Brands", path: "/brands" },
  ],
});

export { generateMetadata };
export default BrandsLayout;
