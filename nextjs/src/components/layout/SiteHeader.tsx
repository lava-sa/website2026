"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Facebook,
  Instagram,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

/* ─── White-bg dropdown (Row 2) ────────────────────────────────────────────── */
function NavDropdown({
  label,
  children,
  width = "w-56",
}: {
  label: string;
  children: React.ReactNode;
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    // Use click (bubble) so we don’t fight link activation order on the same tap.
    document.addEventListener("click", handleOutside, true);
    document.addEventListener("touchstart", handleOutside, true);
    return () => {
      document.removeEventListener("click", handleOutside, true);
      document.removeEventListener("touchstart", handleOutside, true);
    };
  }, [open]);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(e) => {
        const next = e.relatedTarget as Node | null;
        if (next && ref.current?.contains(next)) return;
        setOpen(false);
      }}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-secondary transition-colors py-2"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown className={cn("h-3 w-3 opacity-50 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div
        className={cn(
          "absolute top-full left-0 bg-white shadow-2xl border border-border/80 z-[500]",
          "transition-all duration-200 ease-out",
          width,
          open ? "opacity-100 translate-y-0 pointer-events-auto visible" : "invisible opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Dark-bg dropdown (Row 3) ─────────────────────────────────────────────── */
function CategoryDropdown({
  label,
  href,
  children,
  width = "w-56",
  highlight = false,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
  width?: string;
  highlight?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleOutside, true);
    document.addEventListener("touchstart", handleOutside, true);
    return () => {
      document.removeEventListener("click", handleOutside, true);
      document.removeEventListener("touchstart", handleOutside, true);
    };
  }, [open]);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(e) => {
        const next = e.relatedTarget as Node | null;
        if (next && ref.current?.contains(next)) return;
        setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1 text-[10px] font-bold tracking-[0.12em] uppercase py-3 transition-colors",
          highlight ? "text-secondary hover:text-white" : "text-white hover:text-secondary"
        )}
      >
        {label}
        <ChevronDown className={cn("h-2.5 w-2.5 opacity-50 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div
        className={cn(
          "absolute top-full left-0 bg-white shadow-2xl border border-border/80 z-[500]",
          "transition-all duration-200 ease-out",
          width,
          open ? "opacity-100 translate-y-0 pointer-events-auto visible" : "invisible opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <div className="border-b border-border/60 px-5 py-2.5">
          <Link href={href} className="text-[11px] font-bold uppercase tracking-wider text-primary hover:text-secondary transition-colors">
            View All {label} →
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── Simple link list ──────────────────────────────────────────────────────── */
function DropdownLinks({
  label,
  links,
  footer,
}: {
  label?: string;
  links: [string, string][];
  footer?: [string, string];
}) {
  return (
    <div className="py-2">
      <div className="">
        {label && (
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary/80 px-5 mb-3 mt-2">
            {label}
          </p>
        )}
        <ul className="flex flex-col">
          {links.map(([text, href]) => (
            <li key={href}>
              <Link 
                href={href} 
                className="text-[13px] font-medium text-copy hover:text-secondary hover:bg-gray-50/80 block px-5 py-2.5 transition-all duration-200"
              >
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {footer && (
        <div className="bg-surface border-t border-border/60 px-5 py-3">
          <Link href={footer[1]} className="text-xs font-semibold text-primary hover:text-secondary transition-colors">
            {footer[0]}
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─── SiteHeader ────────────────────────────────────────────────────────────── */
const SiteHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count: cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Expanded Vacuum Machines list based on User Request
  const VACUUM_MACHINES: [string, string][] = [
    ["V.100® Premium X", "/products/v100-premium-x"],
    ["V.300® Premium X", "/products/v300-premium-x"],
    ["V.300® White (Limited Edition)", "/products/v300-white"],
    ["V.300® Black (Limited Edition)", "/products/v300-black"],
    ["V.400® Premium (Commercial)", "/products/v400-premium"],
    ["V.500® Premium (72cm)", "/products/v500-premium"],
    ["V.500® Premium XXL (121cm)", "/products/v500-premium-xxl"],
    ["Lava® Spare Parts", "/products/spare-parts"],
  ];

  return (
    <>
    <header className="w-full sticky top-0 z-[280] overflow-visible">

      {/* ── Row 1: Social · Phone · Contact ──────────────────────────────── */}
      <div className="bg-primary text-white border-b border-white/10">
        <div className="section-container flex items-center justify-between py-2">
          {/* Left: Social media */}
          <div className="flex items-center gap-3">
            <Link href="https://facebook.com/lavasouthafrica" aria-label="Facebook" className="text-white/60 hover:text-secondary transition-colors">
              <Facebook className="h-3.5 w-3.5" />
            </Link>
            <Link href="https://instagram.com/lavasouthafrica" aria-label="Instagram" className="text-white/60 hover:text-secondary transition-colors">
              <Instagram className="h-3.5 w-3.5" />
            </Link>
          </div>
          {/* Centre: Phone */}
          <Link
            href="tel:+27721605556"
            className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider hover:text-secondary transition-colors"
          >
            <Phone className="h-3 w-3 shrink-0" />
            <span>+27 (0)72 160 5556</span>
          </Link>
          {/* Right: Contact + email */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-[11px] text-white/50 font-medium tracking-wider">
              info@lava-sa.co.za
            </span>
            <Link href="/contact" className="text-[11px] font-medium tracking-wider uppercase hover:text-secondary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 2: Logo · Nav · Icons ─────────────────────────────────────── */}
      <div className={cn("bg-white border-b border-border/60 transition-all duration-200 overflow-visible", isScrolled ? "py-2 shadow-md" : "py-3")}>
        <div className="section-container flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="relative z-10 shrink-0">
            <Image
              src="/images/logo/lava-sa-logo-petrol.webp"
              alt="Lava-SA logo"
              title="Lava-SA — German Vacuum Sealers"
              width={200}
              height={56}
              className="h-11 sm:h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">

            {/* Vacuum Packaging */}
            <NavDropdown label="Vacuum Packaging" width="w-72">
              <DropdownLinks
                label="Guides & Info"
                links={[
                  ["Advantages of Vacuum Packaging", "/vacuum-packaging/advantages"],
                  ["Shelf Life Chart", "/vacuum-packaging/shelf-life-chart"],
                  ["Our Vacuum Bags", "/vacuum-packaging/bags-guide"],
                  ["Expert Tips", "/vacuum-packaging/expert-tips"],
                ]}
              />
              <DropdownLinks
                label="Advanced Techniques"
                links={[
                  ["Dry Aging Under Vacuum", "/vacuum-packaging/dry-aging"],
                  ["Meat Aging in a Vacuum", "/vacuum-packaging/meat-aging"],
                  ["Lava Gift Ideas", "/vacuum-packaging/gift-ideas"],
                ]}
                footer={["Watch Lava TV →", "/lava-tv"]}
              />
            </NavDropdown>

            {/* Applications */}
            <NavDropdown label="Applications" width="w-64">
              <DropdownLinks
                label="Shop by Use"
                links={[
                  ["Home Kitchen", "/applications/kitchen"],
                  ["Hunters & Game", "/applications/hunter-game"],
                  ["Anglers & Fishing", "/applications/angler-fishing"],
                  ["Butchery", "/applications/butchery"],
                  ["Biltong & Charcuterie", "/applications/biltong"],
                  ["Food Production", "/applications/food-production"],
                ]}
              />
            </NavDropdown>

            {/* Shopping Help */}
            <NavDropdown label="Shopping Help" width="w-56">
              <DropdownLinks
                label="Help & Support"
                links={[
                  ["Lava Points", "/rewards"],
                  ["Delivery & Shipping", "/help/delivery"],
                  ["Returns & Exchanges", "/help/returns"],
                  ["2-Year Warranty", "/help/warranty"],
                  ["FAQ", "/help/faq"],
                  ["Contact Us", "/contact"],
                ]}
              />
            </NavDropdown>

            <span className="text-border mx-2 opacity-50">|</span>

            <Link href="/about" className="text-sm font-bold tracking-tight text-primary hover:text-secondary transition-colors pt-0.5">About Lava-SA</Link>
            <Link href="/lava-tv" className="text-sm font-bold tracking-tight text-primary hover:text-secondary transition-colors pt-0.5">Lava TV</Link>

          </nav>

          {/* Icons + mobile toggle */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button onClick={() => setSearchOpen(true)} className="p-2 text-primary hover:text-secondary transition-colors hidden sm:flex" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account" className="p-2 text-primary hover:text-secondary transition-colors hidden sm:flex" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="relative p-2 text-primary hover:text-secondary transition-colors" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-[9px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden p-2 text-primary ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Row 3: Product Category Bar with Dropdowns ───────────────────── */}
      <div className="bg-on-dark-subtle text-white hidden lg:block overflow-visible">
        <div className="section-container">
          <ul className="flex items-center justify-between">

            <li>
              <CategoryDropdown label="Vacuum Machines" href="/products/vacuum-machines" width="w-72">
                <DropdownLinks
                  links={VACUUM_MACHINES}
                />
              </CategoryDropdown>
            </li>
            <li className="text-white/15">|</li>

            <li>
              <CategoryDropdown label="Vacuum Bags & Rolls" href="/products/bags-rolls" width="w-60">
                <DropdownLinks
                  links={[
                    ["Embossed Vacuum Bags", "/products/vacuum-bags"],
                    ["Embossed Vacuum Rolls", "/products/vacuum-rolls"],
                  ]}
                />
              </CategoryDropdown>
            </li>
            <li className="text-white/15">|</li>

            <li>
              <CategoryDropdown label="Containers & Lids" href="/products/containers-lids" width="w-72">
                <DropdownLinks
                  links={[
                    ["Glass Vacuum Containers", "/products/glass-containers"],
                    ["Vacuum sealer for Glass Jar", "/products/glass-jar-sealer"],
                    ["Vacuum Acrylic Lids", "/products/acrylic-lids"],
                    ["Stainless Steel Vacuum Containers", "/products/stainless-containers"],
                    ["Vacuum Containers and Lids", "/products/containers-lids"],
                  ]}
                />
              </CategoryDropdown>
            </li>
            <li className="text-white/15">|</li>

            <li>
              <CategoryDropdown label="Butchery Accessories" href="/products/butchery-accessories" width="w-72">
                <DropdownLinks
                  links={[
                    ["Butchery Machinery", "/products/butchery-machinery"],
                    ["Cutting and Display Boards", "/products/butchery-boards"],
                    ["Hanging Systems", "/products/butchery-hanging"],
                    ["Knives", "/products/butchery-knives"],
                    ["Protective Clothing", "/products/butchery-protective"],
                    ["Scales", "/products/butchery-scales"],
                    ["Tools", "/products/butchery-tools"],
                  ]}
                />
              </CategoryDropdown>
            </li>
            <li className="text-white/15">|</li>

            <li>
              <CategoryDropdown label="Sous Vide" href="/products/sous-vide" width="w-64">
                <DropdownLinks
                  links={[
                    ["Sous Vide Circulators", "/products/sous-vide#circulators"],
                    ["Sous Vide Containers", "/products/sous-vide#containers"],
                  ]}
                />
              </CategoryDropdown>
            </li>
            <li className="text-white/15">|</li>

            <li>
              <CategoryDropdown label="Special Offers" href="/products/special-offers" width="w-48" highlight>
                <DropdownLinks
                  links={[
                    ["Bundle Deals", "/products/special-offers#bundles"],
                    ["Clearance", "/products/special-offers#clearance"],
                  ]}
                />
              </CategoryDropdown>
            </li>

          </ul>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[88px] z-50 bg-white lg:hidden overflow-y-auto border-t border-border/60">
          <div className="p-6 space-y-8">

            <div className="space-y-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">Vacuum Machines</p>
              <nav className="grid grid-cols-1 gap-1">
                {VACUUM_MACHINES.map(([label, href]) => (
                  <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-primary border-b border-border pb-3 pt-2 hover:text-secondary transition-colors">
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">Shop Products</p>
              <nav className="grid grid-cols-1 gap-1">
                {[
                  ["Vacuum Bags", "/products/vacuum-bags"],
                  ["Vacuum Rolls", "/products/vacuum-rolls"],
                  ["Containers & Lids", "/products/containers-lids"],
                  ["Butchery Accessories", "/products/butchery-accessories"],
                  ["Sous Vide", "/products/sous-vide"],
                  ["Special Offers", "/products/special-offers"],
                  ["Spare Parts", "/products/spare-parts"],
                ].map(([label, href]) => (
                  <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                    className={cn("text-base font-semibold border-b border-border pb-3 pt-2",
                      label === "Special Offers" ? "text-secondary" : "text-primary")}>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">Applications</p>
              <nav className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  ["Home Kitchen", "/applications/kitchen"],
                  ["Hunters & Game", "/applications/hunter-game"],
                  ["Anglers & Fishing", "/applications/angler-fishing"],
                  ["Butchery", "/applications/butchery"],
                  ["Biltong & Charcuterie", "/applications/biltong"],
                  ["Food Production", "/applications/food-production"],
                ].map(([label, href]) => (
                  <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-copy hover:text-primary transition-colors">
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">About & Help</p>
              <nav className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  ["About Lava-SA", "/about"],
                  ["Lava TV", "/lava-tv"],
                  ["Delivery Info", "/help/delivery"],
                  ["Returns", "/help/returns"],
                  ["Warranty", "/help/warranty"],
                  ["FAQ", "/help/faq"],
                  ["Contact", "/contact"],
                ].map(([label, href]) => (
                  <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-copy hover:text-primary transition-colors">
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

          </div>
        </div>
      )}

    </header>

      {/* ── Search Overlay ──────────────────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center border-b border-border px-5 py-4">
              <Search className="h-5 w-5 text-copy-muted shrink-0 mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                    setSearchOpen(false);
                  }
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                className="flex-1 text-base text-primary placeholder:text-copy-muted outline-none bg-transparent"
              />
              <button onClick={() => setSearchOpen(false)} className="ml-3 text-copy-muted hover:text-primary transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 py-3 text-xs text-copy-muted">
              Popular: <span className="space-x-3">
                {["V300", "V500", "Vacuum Bags", "Butchery", "Spare Parts"].map(t => (
                  <button key={t} onClick={() => { window.location.href = `/search?q=${encodeURIComponent(t)}`; setSearchOpen(false); }}
                    className="hover:text-primary transition-colors">{t}</button>
                ))}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SiteHeader;
