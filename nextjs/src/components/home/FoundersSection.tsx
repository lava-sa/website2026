"use client";

import React from "react";
import Image from "next/image";

const FoundersSection = () => {
  return (
    <section className="bg-white py-24 border-y border-border/40">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Left */}
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-black text-primary leading-tight">
              A Family Business from <span className="text-secondary">Baden-Württemberg.</span>
            </h2>
            
            <div className="space-y-6 text-copy text-lg leading-relaxed">
              <p>
                For two generations, we, the Landig family, have been passionately running our family business in Bad Saulgau, Upper Swabia, crafting <strong>LAVA vacuum sealers</strong> renowned for their durability and precision.
              </p>
              <p>
                What began over 40 years ago as a small specialist operation has evolved into a thriving medium-sized company, proudly serving over 350,000 customers worldwide with <strong>German-made vacuum sealers</strong> and high-quality kitchen equipment.
              </p>
              <p>
                Our journey from humble beginnings to a global leader in <strong>vacuum sealing technology</strong> reflects our unwavering commitment to innovation and excellence.
              </p>
              <p>
                Despite our growth, our focus remains unchanged: delivering <strong>practical, high-performance vacuum sealers</strong> that meet the needs of homes, restaurants, and industries across South Africa and beyond!
              </p>
            </div>
          </div>

          {/* Image Right */}
          <div className="relative">
             <div className="relative rounded-3xl overflow-hidden shadow-2xl p-2 bg-white border border-border/60">
                <Image 
                  src="/images/about/founders.webp"
                  alt="Landig Family Business - German Made Lava Vacuum Sealers"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-2xl object-cover hover:scale-[1.02] transition-transform duration-700"
                />
             </div>
             
             {/* Decorative block */}
             <div className="absolute -bottom-6 -left-6 h-32 w-32 bg-primary-wash rounded-full -z-10 blur-2xl opacity-70"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
