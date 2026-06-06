import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: RegisterLayout } = createPageLayout({
  page: "register",
  noIndex: true,
});

export { generateMetadata };
export default RegisterLayout;
