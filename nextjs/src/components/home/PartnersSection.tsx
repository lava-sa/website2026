"use client";

import React from "react";
import Image from "next/image";

const partners = [
  { name: "Crous Broers", src: "/images/partners/crous-broers.webp" },
  { name: "Ivory Macadamias", src: "/images/partners/ivory-macadamias-food-and-beverage-company.webp" },
  { name: "Dry Ager SA", src: "/images/partners/dry-ager-south-africa.webp" },
  { name: "Kitchen Frontiers", src: "/images/partners/kitchen-frontiers-logo.webp" },
];

const PartnersSection = () => {
  return (
    <section className="bg-[#fcfcfa] py-20 border-b border-border/40">
      <div className="section-container text-center">
        <h2 className="text-3xl lg:text-4xl font-black text-primary mb-4">
          Lava-SA Vacuum Sealing Machines.<br />
          <span className="text-secondary">Trusted by Industry Leaders</span>
        </h2>
        <p className="text-copy max-w-3xl mx-auto text-lg mb-12">
          Quality speaks for itself. These respected South African businesses have chosen Lava Vacuum
          Sealing Machines and Bags for their operations, recognizing our commitment to food preservation
          and storage excellence.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-24 opacity-80">
          {partners.map((partner, index) => (
            <div key={index} className="relative h-20 w-32 md:h-24 md:w-40 hover:opacity-100 transition-opacity duration-300">
               <Image 
                 src={partner.src}
                 alt={`${partner.name} Logo`}
                 fill
                 className="object-contain filter grayscale hover:grayscale-0 transition-all duration-500"
               />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
