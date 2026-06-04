import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center dark:bg-gray-950">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        404
      </p>
      <h1 className="mt-2 text-2xl font-bold text-foreground">
        Admin page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        This section does not exist yet or the link is outdated. Return to the
        admin dashboard.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button className="gap-2" render={<Link href="/admin" />}>
          <Home className="size-4" />
          Admin Dashboard
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          render={<Link href="/" />}
        >
          <ArrowLeft className="size-4" />
          View Site
        </Button>
      </div>
    </div>
  );
}
