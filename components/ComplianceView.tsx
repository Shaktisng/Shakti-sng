import React from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  AlertTriangle, 
  Scale, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  FileText,
  ExternalLink
} from 'lucide-react';
import { WholesaleCompanyInfo } from '../types';

interface ComplianceViewProps {
  company: WholesaleCompanyInfo;
  onOpenRegister: () => void;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({ company, onOpenRegister }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory Compliance & Regulatory Framework</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Licensed Medicine Wholesale Distribution
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Operating under the strict statutory provisions of the <strong>Drugs and Cosmetics Act, 1940</strong>, <strong>Drugs and Cosmetics Rules, 1945</strong>, and <strong>State Drugs Control Administration, Odisha & CDSCO</strong>.
        </p>
      </div>

      {/* Grid of Key Licenses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Form 20B */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Allopathic Drugs Wholesale
            </span>
            <h3 className="font-bold text-base text-slate-900">Form 20B Wholesale Licence</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-900">
            {company.dl20B}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Permits wholesale sale and distribution of drugs other than those specified in Schedule C, C(1) and X across Odisha.
          </p>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Licence Active & Valid</span>
          </div>
        </div>

        {/* Form 21B */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Biologicals & Injections
            </span>
            <h3 className="font-bold text-base text-slate-900">Form 21B Wholesale Licence</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-900">
            {company.dl21B}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Permits wholesale distribution of Schedule C and C(1) biological formulations, sera, toxoids, vaccines, and sterile injections with cold chain.
          </p>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Licence Active & Valid</span>
          </div>
        </div>

        {/* GSTIN & PAN */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tax & Revenue Registration
            </span>
            <h3 className="font-bold text-base text-slate-900">GSTIN Registration</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-900">
            {company.gstin}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Registered taxpayer under Odisha Goods & Services Tax (OGST/CGST) under State Code 21. PAN: <span className="font-mono font-bold">{company.pan}</span>.
          </p>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Regular 100% Tax Compliant</span>
          </div>
        </div>
      </div>

      {/* Rules & Mandates Explained for Retail Chemists */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-400" />
          <span>Requirements for Retail Chemist Shops & Hospitals</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-2 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <h4 className="font-bold text-white text-sm">1. Valid Drug Licence (Form 20/21)</h4>
            <p className="leading-relaxed">
              Wholesale deliveries are strictly restricted to entities possessing an active Retail Drug Licence issued by State Drug Licensing Authority.
            </p>
          </div>

          <div className="space-y-2 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <h4 className="font-bold text-white text-sm">2. Schedule H & H1 Dispensing</h4>
            <p className="leading-relaxed">
              Schedule H and H1 medications supplied under invoice must be sold by retailers exclusively against registered medical practitioner's prescription.
            </p>
          </div>

          <div className="space-y-2 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <h4 className="font-bold text-white text-sm">3. Mandatory Invoice Record-Keeping</h4>
            <p className="leading-relaxed">
              Retailers must preserve our GST Tax Invoices showing Batch Numbers and Expiry Dates for a minimum statutory period of three (3) years.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Operating in Sundargarh, Rourkela, Rajgangpur, and surrounding areas.
          </div>
          <button
            onClick={onOpenRegister}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            Register / Verify Your Medical Store Licence
          </button>
        </div>
      </div>
    </div>
  );
};
