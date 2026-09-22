import React from 'react';
import { 
  Sparkles, 
  Tag, 
  ShoppingCart, 
  Percent, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Package
} from 'lucide-react';
import { Medicine } from '../types';

interface SchemesViewProps {
  medicines: Medicine[];
  onAddToCart: (medicine: Medicine, quantity: number) => void;
  onExploreAll: () => void;
}

export const SchemesView: React.FC<SchemesViewProps> = ({
  medicines,
  onAddToCart,
  onExploreAll,
}) => {
  const schemeMedicines = medicines.filter(m => !!m.scheme);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Wholesale Bulk Schemes & Free Goods</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            10+1 & 20+2 Free Goods Schemes
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Maximize your chemist retail profit margins with authorized company schemes. Free bonus packs are automatically calculated and invoiced at ₹0 tax base.
          </p>
        </div>

        {/* Promo badges */}
        <div className="mt-6 flex flex-wrap gap-3 text-xs">
          <span className="bg-white text-amber-900 font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-amber-700" />
            <span>2% Extra Cash Discount on Instant UPI / RTGS</span>
          </span>
          <span className="bg-white/20 text-white font-bold px-3 py-1.5 rounded-lg">
            Free Delivery on Orders Above ₹2,500
          </span>
        </div>
      </div>

      {/* Grid of Scheme Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemeMedicines.map((med) => {
          const suggestedQty = med.schemeBonusEvery || 10;
          const freeGoods = med.schemeBonusUnits || 1;
          const retailBonusValue = freeGoods * med.mrp;

          return (
            <div 
              key={med.id}
              className="bg-white rounded-2xl border-2 border-amber-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {med.scheme}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {med.category}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {med.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{med.company}</p>
                <div className="text-xs font-mono text-slate-700 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100">
                  {med.saltComposition}
                </div>

                <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-amber-950">
                    <span>Order {suggestedQty} Packs:</span>
                    <span>Get +{freeGoods} FREE Pack!</span>
                  </div>
                  <div className="text-[11px] text-amber-800">
                    Retail Selling Value of Free Goods: <strong>₹{retailBonusValue.toFixed(0)}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Wholesale PTR:</span>
                    <strong className="text-slate-900 font-extrabold text-sm">₹{med.ptr.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Chemist MRP:</span>
                    <strong className="text-slate-600 line-through">₹{med.mrp.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onAddToCart(med, suggestedQty)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add {suggestedQty} Packs (+{freeGoods} Free)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onExploreAll}
          className="text-xs text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1.5"
        >
          <span>View all other standard wholesale formulations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
