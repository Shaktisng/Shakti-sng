import React from 'react';
import { 
  Search, 
  Truck, 
  ShieldCheck, 
  BadgePercent, 
  FileCheck2, 
  Sparkles,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { MedicineCategory, WholesaleCompanyInfo } from '../types';

interface HeroBannerProps {
  company: WholesaleCompanyInfo;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: MedicineCategory[];
  totalMedicinesCount: number;
  onExploreSchemes: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  company,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalMedicinesCount,
  onExploreSchemes,
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden py-10 px-4 sm:px-6">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            CDSCO & Odisha Drug Authority Registered
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <Truck className="w-3.5 h-3.5 text-sky-400" />
            Sundargarh & Western Odisha Distribution
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <BadgePercent className="w-3.5 h-3.5 text-amber-400" />
            Live Schemes: 10+1 & 20+2 Free
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
              Order Medicines Online <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Direct From Wholesale Stockist
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
              Exclusively for licensed Chemists, Retail Medical Stores & Hospitals. Browse {totalMedicinesCount}+ allopathic, generic, cardiac, and surgical formulations at direct Price-to-Retailer (PTR) rates with instant GST Tax Invoice.
            </p>

            {/* Fast Medicine Search Bar */}
            <div className="bg-white p-1.5 rounded-xl shadow-lg max-w-2xl flex items-center gap-2 border border-slate-200">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicine brand (e.g. Dolo 650, Augmentin), salt, or company..."
                className="w-full text-slate-800 text-sm sm:text-base py-2 focus:outline-none placeholder:text-slate-400"
                id="medicine-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={() => {}}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Search</span>
              </button>
            </div>

            {/* Quick Contact & WhatsApp Order Button */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-400 font-medium">Quick Order / Bulk Enquiry:</span>
              <a
                href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Shakti%20Pharma%2C%20I%20am%20a%20chemist%20and%20want%20to%20place%20a%20medicine%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg font-semibold transition-all hover:scale-105"
                id="hero-whatsapp-btn"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {company.whatsapp}</span>
              </a>
              <span className="text-slate-500 hidden sm:inline">&bull;</span>
              <span className="text-slate-400 hidden sm:inline">Dispatch orders till 6:00 PM daily</span>
            </div>
          </div>

          {/* Right Highlights Card */}
          <div className="lg:col-span-4 bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Wholesale Distributor Desk
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Form 20B / 21B B2B Invoicing</div>
                  <div className="text-slate-400">Strictly regulated sale with Batch, Expiry & HSN on official GST invoice.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Daily Delivery Routes</div>
                  <div className="text-slate-400">Sundargarh, Rourkela, Rajgangpur, Jharsuguda daily van dispatches.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Wholesale Credit Facility</div>
                  <div className="text-slate-400">Up to 15-30 days credit terms available for verified chemist partners.</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Free delivery on orders above ₹{company.minOrderFreeDelivery}</span>
              <button
                onClick={onExploreSchemes}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 group"
              >
                <span>View Schemes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold text-xs shrink-0 mr-1">
            Categories:
          </span>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            All Medicines ({totalMedicinesCount})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
