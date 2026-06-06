import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: LoginLayout } = createPageLayout({
  page: "login",
  noIndex: true,
});

export { generateMetadata };
export default LoginLayout;
