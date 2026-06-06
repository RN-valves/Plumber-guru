import { createPageLayout } from "@/lib/page-layout";

const { generateMetadata, default: TrainingLayout } = createPageLayout({
  page: "training",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Training", path: "/training" },
  ],
});

export { generateMetadata };
export default TrainingLayout;
