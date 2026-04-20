"use client";

import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactMapSection = () => {
  return (
    <section className="bg-white">
      <div className="relative w-full h-[600px] lg:h-[700px]">
        {/* Google Map Background */}
        <div className="absolute inset-0 z-0 bg-primary-wash">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3583.916849885822!2d28.006941511210816!3d-26.068999958319693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e957404dc77d337%3A0xc38db993206fd92a!2s5%20Stirling%20Rd%2C%20Bryanston%2C%20Sandton%2C%202191!5e0!3m2!1sen!2sza!4v1712749842525!5m2!1sen!2sza" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: "grayscale(20%) contrast(1.1) brightness(1.05)" }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Lava SA Location"
            className="pointer-events-none md:pointer-events-auto"
          />
        </div>

        {/* Floating Contact Card Area */}
        <div className="section-container relative z-10 h-full flex flex-col justify-end lg:justify-center pb-8 lg:pb-0">
          
          <div className="bg-white/95 backdrop-blur-md border border-border/60 rounded-2xl shadow-2xl p-8 lg:p-12 max-w-lg w-full lg:mr-auto ml-auto lg:ml-0 mt-auto lg:mt-0 animate-in slide-in-from-bottom-8 duration-700">
            
            <div className="mb-10">
              <h2 className="text-3xl font-black text-primary mb-4">Contact Us</h2>
              <p className="text-copy text-sm">
                Get in touch with us for expert advice on vacuum sealing, technical support, 
                or any questions about our durable German-engineered machines.
              </p>
            </div>

            <div className="space-y-8 mb-10">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary-wash flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-secondary mb-1">Address</h3>
                  <p className="text-sm text-primary font-semibold">Lava-SA Vacuum Sealing Machines</p>
                  <p className="text-sm text-copy">5 Stirling Rd, Bryanston,<br />Sandton, 2191</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary-wash flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-secondary mb-1">Phone Number</h3>
                  <a href="tel:+27721605556" className="text-sm text-primary hover:text-secondary transition-colors font-semibold">+27 72 160 5556</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary-wash flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-secondary mb-1">Email Address</h3>
                  <a href="mailto:info@lava-sa.co.za" className="text-sm text-primary hover:text-secondary transition-colors font-semibold">info@lava-sa.co.za</a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border/60">
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">Send an Inquiry</p>
              
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Name *" className="w-full bg-[#f9f9f9] border border-border/60 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors" />
                  <input type="text" placeholder="Surname *" className="w-full bg-[#f9f9f9] border border-border/60 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors" />
                </div>
                <input type="email" placeholder="Email Address *" className="w-full bg-[#f9f9f9] border border-border/60 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors" />
                <textarea placeholder="Your Inquiry *" rows={4} className="w-full bg-[#f9f9f9] border border-border/60 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors resize-none"></textarea>
                <button type="button" className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-4 rounded-md transition-colors shadow-md">
                  Send Email
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMapSection;
