"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/blog", label: "Blog posts", icon: FileText },
  { href: "/newsletter", label: "Newsletter", icon: Mail },
];

export function AdminShell({
  children,
  fullWidth = false,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div
          className={cn(
            "mx-auto flex items-center justify-between px-4 py-4",
            fullWidth ? "w-full" : "max-w-6xl"
          )}
        >
          <div className="flex items-center gap-8">
            <Link href="/blog" className="text-lg font-semibold text-slate-900">
              ThoughtSpace <span className="text-brand-500">Admin</span>
            </Link>
            <nav className="flex gap-1">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                    pathname.startsWith(href)
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </header>
      <main
        className={cn(
          fullWidth ? "w-full" : "mx-auto max-w-6xl px-4 py-8"
        )}
      >
        {children}
      </main>
    </div>
  );
}
