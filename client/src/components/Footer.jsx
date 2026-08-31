import React from 'react';
import { PhoneCall } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#F5F5F5] text-gray-800 text-xs sm:text-sm mt-auto">
      

      {/* Main Footer Content */}
      <div className="pt-10 pb-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-8 items-start">
          
          {/* Social Links Col */}
          <div className="md:col-span-1 flex items-start gap-3 pt-1">
            {/* Instagram - Outlined Rounded Square */}
            <a href="#" aria-label="Instagram" className="text-[#555555] hover:text-black transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="6" ry="6"></rect>
                <circle cx="12" cy="12" r="4.5"></circle>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle>
              </svg>
            </a>
            {/* LinkedIn - Solid Rounded Square with white 'in' */}
            <a href="#" aria-label="LinkedIn" className="text-[#555555] hover:opacity-90 transition-opacity">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                {/* 'in' text in white */}
                <path fill="#F5F5F5" d="M6.5 9.5h2.5v8H6.5v-8zM7.75 6.25a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM11.5 9.5h2.4v1.1h.04c.33-.63 1.15-1.3 2.36-1.3 2.53 0 3 1.66 3 3.8v4.4h-2.5v-3.9c0-.93-.02-2.13-1.3-2.13-1.3 0-1.5 1.02-1.5 2.06v4h-2.5v-8z"/>
              </svg>
            </a>
          </div>

          {/* Column 1: About Us */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-sm">About Us</h4>
            <ul className="space-y-2.5 text-gray-500 text-[13px]">
              <li><a href="#" className="hover:text-[#C23434] transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-[#C23434] transition-colors">Blogs</a></li>
              <li><a href="#" className="hover:text-[#C23434] transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 2: Help and Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-sm">Help and Support</h4>
            <ul className="space-y-2.5 text-gray-500 text-[13px]">
              <li><a href="#" className="hover:text-[#C23434] transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-[#C23434] transition-colors">Shipping &amp; Returns</a></li>
              <li><a href="#" className="hover:text-[#C23434] transition-colors">Payment Methods</a></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-sm">Categories</h4>
            <ul className="space-y-2.5 text-gray-500 text-[13px]">
              <li><a href="#" className="hover:text-[#C23434] transition-colors">Cultural Books Clearance</a></li>
              <li><a href="#" className="hover:text-[#C23434] transition-colors">Stationery</a></li>
              <li><a href="#" className="hover:text-[#C23434] transition-colors">External School Books</a></li>
              <li><a href="#" className="hover:text-[#C23434] transition-colors">Handcraft Supplies</a></li>
            </ul>
          </div>

          {/* Column 4: Install App & Payment Gateways */}
          <div className="md:col-span-2 space-y-5">
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-3">Install App</h4>
              <div className="flex items-center gap-2.5">
                {/* App Store Badge */}
                <a href="#" className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2.5 hover:bg-gray-900 transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.1c.67-.83 1.13-1.97.99-3.1-.98.04-2.19.66-2.88 1.47-.62.72-1.16 1.88-1.01 3.01 1.09.08 2.23-.55 2.9-1.38z"/>
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[7px] text-gray-400 uppercase tracking-wide">Download on the</div>
                    <div className="text-[13px] font-semibold">App Store</div>
                  </div>
                </a>

                {/* Google Play Badge */}
                <a href="#" className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2.5 hover:bg-gray-900 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594z"/>
                    <path fill="#34A853" d="M5.27 21.978L14.584 12.02l3.515 3.493-11.252 6.37c-.697.397-1.416.15-1.577-.905z"/>
                    <path fill="#FBBC04" d="M5.27 2.022c.161-1.055.88-1.302 1.577-.905l11.252 6.37-3.543 3.52L5.27 2.022z"/>
                    <path fill="#EA4335" d="M5.27 2.022v19.956l9.314-9.958L5.27 2.022z"/>
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[7px] text-gray-400 uppercase tracking-wide">GET IT ON</div>
                    <div className="text-[13px] font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[var(--primary-text)] text-sm mb-3">Secured Payment Gateways</h4>
              <div className="flex flex-wrap items-center gap-3">
                {/* Cash on Delivery */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-color)] transition hover:border-[#c53938]">
                  <svg className="w-5 h-5 text-[#c53938]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                  <span className="text-xs font-bold text-[var(--primary-text)]">Cash</span>
                </div>

                {/* InstaPay */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-color)] transition hover:border-[#5C2D91]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#5C2D91] text-white">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                      <path d="M5 17.5L12 5.5L19 17.5H13.2L12 14.2L10.8 17.5H5Z" fill="white" />
                    </svg>
                  </span>
                  <span className="text-xs font-bold text-[var(--primary-text)]">InstaPay</span>
                </div>

                {/* Vodafone Cash */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-color)] transition hover:border-[#E60000]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#E60000] text-white">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                      <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="2.5" fill="none" />
                      <path d="M12 8.5v3.8l2.5 1.3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="text-xs font-bold text-[var(--primary-text)]">Vodafone Cash</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#C23434] px-6 sm:px-12 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-gray-500">
          {/* Copyright */}
          <div className="text-[11px]">
            © 2026, <strong className="text-[#C23434] font-semibold">EL D7E7</strong> - HTML Ecommerce Template <br className="sm:hidden" /> All rights reserved
          </div>

          {/* Hotline Contact */}
          <div className="flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-[#C23434]" />
            <div className="text-left">
              <div className="text-sm font-bold text-[#C23434]">01005535668</div>
              <div className="text-[9px] text-gray-400 leading-tight">
                Working: 10:00 AM - 11:00 PM <br />
                Except Thursday Close on 5 PM | Friday Open on 2 PM
              </div>
            </div>
          </div>

          {/* Follow Us & Offer */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 text-xs">Follow Us</span>
              <div className="flex gap-1.5">
                <a href="#" aria-label="Facebook" className="w-5 h-5 rounded-full bg-[#C23434] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-5 h-5 rounded-full bg-[#C23434] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="w-5 h-5 rounded-full bg-[#C23434] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <span className="text-[9px] text-gray-400">Up to 10% discount on your first subscribe</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
