import React from 'react';
import { 
  Building2, 
  ShoppingCart, 
  FileText, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  UserCheck, 
  LayoutDashboard, 
  Store,
  ChevronDown
} from 'lucide-react';
import { RetailerProfile, WholesaleCompanyInfo } from '../types';

interface NavbarProps {
  company: WholesaleCompanyInfo;
  currentRetailer: RetailerProfile | null;
  cartCount: number;
  cartTotal: number;
  activeView: 'catalogue' | 'orders' | 'schemes' | 'admin' | 'compliance';
  setActiveView: (view: 'catalogue' | 'orders' | 'schemes' | 'admin' | 'compliance') => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  company,
  currentRetailer,
  cartCount,
  cartTotal,
  activeView,
  setActiveView,
  onOpenCart,
  onOpenAuth,
  isAdminMode,
  setIsAdminMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs no-print">
      {/* Top Regulatory & Compliance Header */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Govt. Licensed Wholesale Distributor
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="text-slate-400 font-mono text-[11px]">
              DL 20B: <strong className="text-slate-200">{company.dl20B}</strong> &bull; DL 21B: <strong className="text-slate-200">{company.dl21B}</strong>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400 font-mono text-[11px]">
              GSTIN: <strong className="text-slate-200">{company.gstin}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a 
              href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Shakti%20Pharma%2C%20I%20want%20to%20place%20a%20wholesale%20medicine%20order.`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Order: {company.whatsapp}</span>
            </a>
            <span className="hidden sm:inline text-slate-500">|</span>
            <a 
              href={`tel:${company.phone}`}
              className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{company.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Company Name */}
          <div 
            onClick={() => { setActiveView('catalogue'); setIsAdminMode(false); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold text-xl group-hover:bg-emerald-700 transition-colors">
              <span className="font-serif">Rx</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                  {company.name}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  B2B Wholesale
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {company.city}, {company.state} &bull; Est. 2012
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => { setActiveView('catalogue'); setIsAdminMode(false); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'catalogue' && !isAdminMode
                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Medicine Catalogue
            </button>
            <button
              onClick={() => { setActiveView('schemes'); setIsAdminMode(false); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'schemes' && !isAdminMode
                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <span>Bulk Schemes</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">10+1</span>
              </span>
            </button>
            <button
              onClick={() => { setActiveView('orders'); setIsAdminMode(false); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'orders' && !isAdminMode
                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              My Orders & Invoices
            </button>
            <button
              onClick={() => { setActiveView('compliance'); setIsAdminMode(false); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'compliance' && !isAdminMode
                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Licence & CDSCO
            </button>
          </nav>

          {/* Right Action Elements */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Admin Switcher Toggle */}
            <button
              onClick={() => {
                const nextMode = !isAdminMode;
                setIsAdminMode(nextMode);
                if (nextMode) {
                  setActiveView('admin');
                } else {
                  setActiveView('catalogue');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isAdminMode 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title="Toggle between Chemist Store and Wholesale Admin Panel"
            >
              {isAdminMode ? (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Panel</span>
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Admin Mode</span>
                </>
              )}
            </button>

            {/* Chemist Profile / Login Button */}
            {currentRetailer ? (
              <button 
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {currentRetailer.shopName.charAt(0)}
                </div>
                <div className="hidden md:block leading-tight text-left">
                  <div className="text-xs font-semibold text-slate-800 max-w-[130px] truncate">
                    {currentRetailer.shopName}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <UserCheck className="w-2.5 h-2.5" />
                    <span>DL Verified</span>
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Chemist Login / Register</span>
              </button>
            )}

            {/* Wholesale Cart Button */}
            {!isAdminMode && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium shadow-xs transition-colors"
                id="cart-button"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">Cart</span>
                {cartCount > 0 ? (
                  <span className="bg-white text-emerald-800 font-bold text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                    {cartCount}
                  </span>
                ) : (
                  <span className="text-emerald-100 text-xs">0</span>
                )}
                {cartTotal > 0 && (
                  <span className="hidden md:inline text-xs font-medium pl-1 border-l border-emerald-500">
                    ₹{cartTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden items-center justify-between gap-1 pt-2.5 border-t border-slate-100 mt-2 text-xs font-medium text-slate-600 overflow-x-auto">
          <button
            onClick={() => { setActiveView('catalogue'); setIsAdminMode(false); }}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
              activeView === 'catalogue' && !isAdminMode ? 'text-emerald-700 font-bold bg-emerald-50' : ''
            }`}
          >
            Catalogue
          </button>
          <button
            onClick={() => { setActiveView('schemes'); setIsAdminMode(false); }}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
              activeView === 'schemes' && !isAdminMode ? 'text-emerald-700 font-bold bg-emerald-50' : ''
            }`}
          >
            Bulk Schemes (10+1)
          </button>
          <button
            onClick={() => { setActiveView('orders'); setIsAdminMode(false); }}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
              activeView === 'orders' && !isAdminMode ? 'text-emerald-700 font-bold bg-emerald-50' : ''
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => { setActiveView('compliance'); setIsAdminMode(false); }}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
              activeView === 'compliance' && !isAdminMode ? 'text-emerald-700 font-bold bg-emerald-50' : ''
            }`}
          >
            DL & CDSCO
          </button>
        </div>
      </div>
    </header>
  );
};
