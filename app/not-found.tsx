import Link from "next/link";
import { Home, LayoutDashboard, Shield, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 mb-6">
        <Wrench className="w-8 h-8 text-white" strokeWidth={2.5} />
      </span>
      <p className="text-sm font-medium text-[#F97316] uppercase tracking-wider mb-2">
        404
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        Yeh page nahi mila!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Jo page aap dhoondh rahe hain, woh maujood nahi hai. Neeche se sahi
        jagah chunein.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F97316] text-white font-semibold hover:bg-[#ea580c] transition-colors shadow-sm"
        >
          <Home className="w-5 h-5" />
          Homepage
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:border-[#F97316] hover:text-[#F97316] transition-colors dark:border-gray-700 dark:text-gray-200"
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:border-[#F97316] hover:text-[#F97316] transition-colors dark:border-gray-700 dark:text-gray-200"
        >
          <Shield className="w-5 h-5" />
          Admin
        </Link>
      </div>
    </main>
  );
}
