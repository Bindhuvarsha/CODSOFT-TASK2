import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, Clock, MapPin, Phone, Mail, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-400 flex items-center justify-center text-white shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                Dine<span className="text-brand-500">Desk</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Elevating dining experiences through seamless digital ordering, intelligent table management, and an expedited kitchen display workflow.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium bg-amber-950/40 border border-amber-800/40 rounded-lg px-3 py-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CodSoft Task 2 Full Stack Project</span>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500" />
              Service Hours
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Mon – Thu:</span>
                <span className="text-white font-medium">12:00 PM – 10:30 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Friday:</span>
                <span className="text-white font-medium">12:00 PM – 11:30 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Saturday – Sun:</span>
                <span className="text-white font-medium">11:00 AM – 11:30 PM</span>
              </div>
              <p className="text-xs text-brand-400 pt-1">
                * Kitchen accepts last orders 30 minutes before closing.
              </p>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-500" />
              Location & Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>108 Culinary Avenue, Gourmet District, Manhattan, NY 10001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>+1 (555) 789-3463</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>concierge@dinedesk.restaurant</span>
              </li>
            </ul>
          </div>

          {/* Quick System Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              Portals & Roles
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <Link href="/menu" className="hover:text-brand-400 transition-colors py-1">
                → Digital Guest Menu
              </Link>
              <Link href="/reservations" className="hover:text-brand-400 transition-colors py-1">
                → Table Booking Engine
              </Link>
              <Link href="/orders" className="hover:text-brand-400 transition-colors py-1">
                → Live Order Tracker
              </Link>
              <Link href="/kitchen" className="hover:text-amber-400 transition-colors py-1 font-medium">
                → Kitchen Display System (KDS)
              </Link>
              <Link href="/admin" className="hover:text-brand-400 transition-colors py-1">
                → Restaurant Manager & Floor Plan
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DineDesk Restaurant Platform. Built for CodSoft Web Development Internship (Task 2).</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              Built with Next.js, Node.js, PostgreSQL, Tailwind CSS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
