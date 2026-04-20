"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#f7f7f7] pt-28 pb-20 lg:py-0">
      {/* Background visual elements for "Star Aesthetic" feel */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl opacity-30" />

      <div className="section-container relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Content Left */}
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700 ease-out">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border/50 shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">German Engineering · Since 2007</span>
            </div>
            
            <h1 className="font-[family-name:var(--font-montserrat)] text-4xl lg:text-6xl xl:text-7xl font-black text-primary leading-[1.1] tracking-tight mb-6">
              The Gold Standard of <span className="text-secondary">Vacuum Sealing.</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-copy leading-relaxed mb-8 max-w-xl">
              From our factory in Germany to your kitchen in South Africa. Experience hospital-grade vacuum technology trusted by 350,000+ experts worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/products/vacuum-machines" className="btn-primary py-4 px-8 text-base group">
                Shop Premium Machines
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/about" className="btn-ghost py-4 px-8 text-base">
                Why Choose Lava?
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:flex items-center gap-6 pt-4 border-t border-border/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span className="text-sm font-bold text-primary">25-Year Pump Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span className="text-sm font-bold text-primary">Hospital-Grade Vacuum</span>
              </div>
            </div>
          </div>
          
          {/* Visual Right */}
          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
             {/* Floating Badge */}
             <div className="absolute -top-6 -right-6 lg:-right-10 z-20 glass-effect p-6 rounded-2xl shadow-xl animate-bounce-subtle">
                <div className="text-center">
                  <span className="block text-4xl font-black text-primary">-0.97<span className="text-xl">bar</span></span>
                  <span className="block text-[10px] font-bold uppercase tracking-tighter text-copy">Maximum Pressure</span>
                </div>
             </div>

             {/* Main Hero Image */}
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white">
                <Image 
                  src="/images/products/lava-v300-premium-white-aesthetic-vacuum-sealer-003.webp"
                  alt="Lava V.300 Premium X"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
             </div>
             
             {/* Product Tag */}
             <div className="absolute bottom-6 left-6 glass-effect px-4 py-2 rounded-lg shadow-lg">
                <span className="text-xs font-bold text-primary">Featured: V.300 Premium X</span>
             </div>
          </div>

        </div>
      </div>
      
      {/* Decorative Brand Text (Star Aesthetic style) */}
      <div className="absolute bottom-0 right-0 -mb-10 lg:-mb-16 select-none pointer-events-none overflow-hidden w-full text-right opacity-[0.03]">
        <span className="font-heading font-black text-[15vw] leading-none uppercase pr-8 block">LAVA ENGINEERED</span>
      </div>
    </section>
  );
};

export default Hero;
