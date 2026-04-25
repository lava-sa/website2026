"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Mail,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  Upload,
  History,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",             label: "Dashboard",     icon: LayoutDashboard, exact: true  },
  { href: "/admin/display",     label: "Live display",  icon: Monitor,         exact: true  },
  { href: "/admin/products",    label: "Products",      icon: Package,         exact: false },
  { href: "/admin/orders",      label: "Orders",        icon: ShoppingCart,    exact: false },
  { href: "/admin/order-history", label: "Order history", icon: History,      exact: false },
  { href: "/admin/import",      label: "Import data",   icon: Upload,          exact: false },
  { href: "/admin/mailing-list", label: "Mailing list", icon: Mail,            exact: false },
  { href: "/admin/customers",   label: "Customers",     icon: Users,           exact: false },
  { href: "/admin/reviews",     label: "Reviews",       icon: Star,            exact: false },
];

function NavItem({ href, label, icon: Icon, exact }: typeof NAV[0]) {
  const path = usePathname();
  const active = exact ? path === href : path.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors",
        active
          ? "bg-white/15 text-white"
          : "text-white/60 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
      {active && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />}
    </Link>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  const sidebar = (
    <aside className="flex flex-col h-full bg-primary w-64 shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Image
          src="/images/logo/lava-sa-logo-white.webp"
          alt="Lava South Africa"
          width={140}
          height={40}
          className="h-9 w-auto object-contain"
        />
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mt-1.5">
          Admin Dashboard
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View website
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-red-300 transition-colors w-full"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="flex">{sidebar}</div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 bg-primary px-4 py-3">
          <button onClick={() => setMobileOpen(true)} className="text-white">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-white font-bold text-sm">Lava Admin</span>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} className="ml-auto text-white">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
