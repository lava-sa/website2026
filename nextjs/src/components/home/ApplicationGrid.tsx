"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const apps = [
  {
    id: "hunter",
    title: "Hunters & Game",
    sub: "Preserve venison for up to 3 years",
    image: "/images/applications/hunter.png",
    href: "/applications/hunter-game",
  },
  {
    id: "angler",
    title: "Anglers & Fishing",
    sub: "Lock in freshness from water to plate",
    image: "/images/applications/angler.png",
    href: "/applications/angler-fishing",
  },
  {
    id: "kitchen",
    title: "Home Kitchen",
    sub: "Cut food waste by up to 80%",
    image: "/images/applications/kitchen.png",
    href: "/applications/kitchen",
  },
  {
    id: "biltong",
    title: "Biltong & Charcuterie",
    sub: "SA's finest preserved — the right way",
    image: "/images/applications/biltong.png",
    href: "/applications/biltong",
  },
];

const ApplicationGrid = () => {
  return (
    <section className="bg-white py-24">
      <div className="section-container">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-secondary mb-4">
              Engineered for Every Lifestyle
            </p>
            <h2 className="font-[family-name:var(--font-montserrat)] text-4xl lg:text-5xl font-black text-primary leading-tight">
              Built for your world.
            </h2>
          </div>
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 text-sm font-black text-primary hover:text-secondary transition-colors shrink-0"
          >
            All Applications
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── Grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              className="group relative h-[420px] md:h-[480px] overflow-hidden rounded-xl bg-primary block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              {/* Image */}
              <Image
                src={app.image}
                alt={app.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Overlay — stronger at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 transition-opacity duration-300 group-hover:from-black/90" />

              {/* Content — always visible, slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      {app.sub}
                    </p>
                    <h3 className="font-[family-name:var(--font-montserrat)] text-2xl font-black text-white">
                      {app.title}
                    </h3>
                  </div>
                  <div className="h-11 w-11 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-secondary group-hover:border-secondary transition-all duration-300 shrink-0 ml-4">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ApplicationGrid;
