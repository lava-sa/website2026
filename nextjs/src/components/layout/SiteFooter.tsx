"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Facebook, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  ExternalLink 
} from "lucide-react";

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 mb-20">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image 
                src="/images/logo/lava-sa-logo-white.webp"
                alt="Lava South Africa"
                title="Lava South Africa — German Vacuum Sealers"
                width={160} 
                height={40} 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Distributing premium German vacuum sealers and food preservation technology in South Africa since 2007.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://facebook.com/lavasouthafrica" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="https://instagram.com/lavasouthafrica" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Products</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/products/vacuum-machines" className="text-white/70 hover:text-white transition-colors">Vacuum Machines</Link></li>
              <li><Link href="/products/bags-rolls" className="text-white/70 hover:text-white transition-colors">Vacuum Bags & Rolls</Link></li>
              <li><Link href="/products/containers-lids" className="text-white/70 hover:text-white transition-colors">Containers & Lids</Link></li>
              <li><Link href="/products/spare-parts" className="text-white/70 hover:text-white transition-colors">Spare Parts</Link></li>
              <li><Link href="/products/accessories" className="text-white/70 hover:text-white transition-colors">Accessories</Link></li>
              <li><Link href="/products/sous-vide" className="text-white/70 hover:text-white transition-colors">Sous-Vide</Link></li>
              <li><Link href="/products/special-offers" className="text-secondary hover:text-white transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          {/* Column 3: Info */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Information</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/vacuum-packaging/advantages" className="text-white/70 hover:text-white transition-colors">Why Vacuum Seal?</Link></li>
              <li><Link href="/lava-tv" className="text-white/70 hover:text-white transition-colors">Lava TV</Link></li>
              <li><Link href="/help/faq" className="text-white/70 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="https://la-va.com" target="_blank" className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-1.5">Lava Germany (HQ) <ExternalLink className="h-3 w-3" /></Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Contact Us</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-secondary" />
                <span className="text-white/70">5 Stirling Road, Bryanston,<br />Johannesburg, 2191</span>
              </li>
              <li>
                <Link href="tel:+27721605556" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Phone className="h-5 w-5 shrink-0 text-secondary" />
                  <span>+27 (0)72 160 5556</span>
                </Link>
              </li>
              <li>
                <Link href="mailto:info@lava-sa.co.za" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Mail className="h-5 w-5 shrink-0 text-secondary" />
                  <span>info@lava-sa.co.za</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-bold tracking-wider uppercase text-white/40">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/legal/conditions" className="hover:text-white transition-colors">Conditions of Use</Link>
            <Link href="/legal/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link>
          </div>
          <p>© {currentYear} Lava-SA South Africa. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
