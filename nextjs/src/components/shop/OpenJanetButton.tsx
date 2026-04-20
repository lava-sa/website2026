"use client";

import { MessageCircle, Mic } from "lucide-react";

export default function OpenJanetButton() {
  return (
    <button 
      onClick={() => window.dispatchEvent(new CustomEvent('open-janet'))}
      className="flex items-center w-full text-left gap-4 bg-primary p-4 hover:bg-primary/95 transition-all group cursor-pointer border border-transparent hover:border-border shadow-sm hover:shadow-md"
    >
      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0 group-hover:scale-110 shadow-sm transition-transform duration-300">
        <MessageCircle className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white leading-none group-hover:text-pink-100 transition-colors">Not sure this is the right machine?</p>
        <p className="text-xs text-white/70 mt-1">Chat with Janet — she'll match you to the perfect model.</p>
      </div>
      <div className="shrink-0 flex items-center gap-1.5 bg-secondary text-white text-xs font-bold px-4 py-2 group-hover:bg-white group-hover:text-primary transition-colors whitespace-nowrap shadow-sm">
        <Mic className="h-3.5 w-3.5" />
        Chat Now
      </div>
    </button>
  );
}
