import React from 'react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#1A1918] text-white py-14">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight">NeatWash</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#C8430E] text-white">
                kucek.id
              </span>
            </div>
            <p className="text-xs text-white/65 leading-relaxed max-w-sm">
              Delivering excellence every step ahead. Modern laundry management with live tracking, door-to-door pickup, and subscription quota packages.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-xs">
            <p className="font-extrabold uppercase tracking-wider text-white/40">Quick Navigation</p>
            <ul className="space-y-2 text-white/75">
              <li><a href="#home" className="hover:text-white transition">Home</a></li>
              <li><a href="#about" className="hover:text-white transition">About Us</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing Packages</a></li>
              <li><Link to="/track/KCK-202611-001" className="hover:text-[#FDBE1A] transition">Live Order Tracking</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5 text-xs">
            <p className="font-extrabold uppercase tracking-wider text-white/40">Platform Portals (2 Active Roles)</p>
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/app"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold flex items-center justify-between transition"
              >
                <span>Portal Pelanggan (Self-Service)</span>
                <span>&rarr;</span>
              </Link>
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-xl bg-[#C8430E] hover:bg-[#B0390B] text-white font-bold flex items-center justify-between transition"
              >
                <span>Dashboard Superadmin (POS & Kanban)</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-2">
          <p>&copy; {new Date().getFullYear()} NeatWash • kucek.id Laundry Platform. All rights reserved.</p>
          <p>Clean Code & SOLID Architecture • Golang + React.js</p>
        </div>
      </div>
    </footer>
  );
};
