import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Tag, 
  AlertCircle, 
  Check, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  Package, 
  Building,
  Sparkles,
  Layers
} from 'lucide-react';
import { Medicine, DrugSchedule } from '../types';

interface MedicineCatalogueProps {
  medicines: Medicine[];
  onAddToCart: (medicine: Medicine, quantity: number) => void;
  cartQuantities: Record<string, number>;
  selectedCategory: string;
  searchQuery: string;
}

export const MedicineCatalogue: React.FC<MedicineCatalogueProps> = ({
  medicines,
  onAddToCart,
  cartQuantities,
  selectedCategory,
  searchQuery,
}) => {
  const [selectedSchedule, setSelectedSchedule] = useState<string>('ALL');
  const [onlySchemes, setOnlySchemes] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'name' | 'ptr-asc' | 'ptr-desc' | 'margin'>('name');

  // Local state for quantity input in each card before adding to cart
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  const getQuantity = (id: string, minOrderQty: number) => {
    return itemQuantities[id] || minOrderQty || 1;
  };

  const handleQuantityChange = (id: string, delta: number, minOrderQty: number) => {
    const current = getQuantity(id, minOrderQty);
    const updated = Math.max(minOrderQty || 1, current + delta);
    setItemQuantities(prev => ({ ...prev, [id]: updated }));
  };

  // Filter and sort medicines
  const filteredMedicines = useMemo(() => {
    return medicines
      .filter((med) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = med.name.toLowerCase().includes(q);
          const matchSalt = med.saltComposition.toLowerCase().includes(q);
          const matchCompany = med.company.toLowerCase().includes(q);
          const matchBatch = med.batchNumber.toLowerCase().includes(q);
          if (!matchName && !matchSalt && !matchCompany && !matchBatch) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'ALL' && med.category !== selectedCategory) {
          return false;
        }

        // Schedule filter
        if (selectedSchedule !== 'ALL' && med.schedule !== selectedSchedule) {
          return false;
        }

        // Schemes filter
        if (onlySchemes && !med.scheme) {
          return false;
        }

        // In Stock filter
        if (onlyInStock && (!med.inStock || med.stockQuantity <= 0)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'ptr-asc') return a.ptr - b.ptr;
        if (sortBy === 'ptr-desc') return b.ptr - a.ptr;
        if (sortBy === 'margin') {
          const marginA = ((a.mrp - a.ptr) / a.mrp);
          const marginB = ((b.mrp - b.ptr) / b.mrp);
          return marginB - marginA;
        }
        return 0;
      });
  }, [medicines, searchQuery, selectedCategory, selectedSchedule, onlySchemes, onlyInStock, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Secondary Filter & Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left side filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Drug Schedule:</span>
          <button
            onClick={() => setSelectedSchedule('ALL')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedSchedule === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Schedules
          </button>
          <button
            onClick={() => setSelectedSchedule('Schedule H')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedSchedule === 'Schedule H'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Schedule H (Rx)
          </button>
          <button
            onClick={() => setSelectedSchedule('Schedule H1')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedSchedule === 'Schedule H1'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
            }`}
          >
            Schedule H1 (High Alert)
          </button>
          <button
            onClick={() => setSelectedSchedule('OTC')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedSchedule === 'OTC'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            OTC & Wellness
          </button>

          <span className="h-4 w-px bg-slate-200 mx-1 hidden sm:inline" />

          {/* Quick Checkbox Chips */}
          <label className="inline-flex items-center gap-1.5 cursor-pointer bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-100">
            <input
              type="checkbox"
              checked={onlySchemes}
              onChange={(e) => setOnlySchemes(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-slate-700 font-medium">Schemes Only (10+1)</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-100">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-slate-700 font-medium">In Stock Only</span>
          </label>
        </div>

        {/* Right side Sort & Item count */}
        <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-slate-500">
            Showing <strong className="text-slate-800">{filteredMedicines.length}</strong> products
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
            >
              <option value="name">Name (A-Z)</option>
              <option value="margin">Highest Margin %</option>
              <option value="ptr-asc">PTR (Low to High)</option>
              <option value="ptr-desc">PTR (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredMedicines.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No medicines matched your filters</h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search terms, removing schedule filters, or clearing the category selection.
          </p>
          <button
            onClick={() => {
              setSelectedSchedule('ALL');
              setOnlySchemes(false);
              setOnlyInStock(false);
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMedicines.map((med) => {
          const qty = getQuantity(med.id, med.minOrderQty);
          const marginPercent = Math.round(((med.mrp - med.ptr) / med.mrp) * 100);
          const alreadyInCart = cartQuantities[med.id] || 0;
          
          // Scheme free units preview
          let bonusPreview = 0;
          if (med.schemeBonusEvery && med.schemeBonusUnits) {
            bonusPreview = Math.floor(qty / med.schemeBonusEvery) * med.schemeBonusUnits;
          }

          return (
            <div 
              key={med.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-emerald-200"
              id={`medicine-card-${med.id}`}
            >
              {/* Card Top: Badges & Category */}
              <div className="p-4 pb-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {med.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Schedule Indicator */}
                    {med.schedule === 'Schedule H1' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                        <ShieldAlert className="w-2.5 h-2.5 text-red-600" />
                        Rx H1
                      </span>
                    )}
                    {med.schedule === 'Schedule H' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <ShieldAlert className="w-2.5 h-2.5 text-amber-600" />
                        Rx H
                      </span>
                    )}
                    {med.schedule === 'OTC' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        OTC
                      </span>
                    )}

                    {/* Low Stock Warning */}
                    {med.isLowStock && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        Low Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Medicine Title & Company */}
                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {med.name}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span>{med.company}</span>
                </div>

                {/* Salt / Molecule Composition */}
                <div className="mt-2 text-xs bg-slate-50 text-slate-700 p-2 rounded-lg font-mono leading-relaxed border border-slate-100">
                  <span className="text-slate-400 font-sans text-[11px] block uppercase tracking-wider font-semibold">Composition:</span>
                  {med.saltComposition}
                </div>

                {/* Scheme Callout Banner */}
                {med.scheme && (
                  <div className="mt-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-lg p-2 flex items-center justify-between text-xs text-amber-900">
                    <span className="font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Scheme: {med.scheme}
                    </span>
                    {bonusPreview > 0 && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        +{bonusPreview} FREE
                      </span>
                    )}
                  </div>
                )}

                {/* Pack, Batch, Expiry & HSN Info */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Pack Size:</span>
                    <strong className="text-slate-800">{med.packSize}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Batch & Expiry:</span>
                    <strong className="text-slate-800 font-mono">{med.batchNumber}</strong> &bull; {med.expiryDate}
                  </div>
                  <div>
                    <span className="text-slate-400 block">GST / HSN:</span>
                    <span>{med.gstRate}% &bull; HSN {med.hsnCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Stock Available:</span>
                    <span className={med.stockQuantity < 30 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-medium'}>
                      {med.stockQuantity} packs left
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Bottom: Wholesale Pricing & Add to Cart Controls */}
              <div className="p-4 pt-3 mt-3 bg-slate-50/70 border-t border-slate-100">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span>MRP: <del className="text-slate-400">₹{med.mrp.toFixed(2)}</del></span>
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-1 rounded text-[10px]">
                        {marginPercent}% Margin
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xs text-slate-500 font-medium">Wholesale PTR:</span>
                      <span className="text-lg font-extrabold text-slate-900">
                        ₹{med.ptr.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400">+ GST</span>
                    </div>
                  </div>

                  {alreadyInCart > 0 && (
                    <div className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{alreadyInCart} in Cart</span>
                    </div>
                  )}
                </div>

                {/* Quantity adjustment & Add button */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => handleQuantityChange(med.id, -1, med.minOrderQty)}
                      className="px-2 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-40"
                      disabled={qty <= med.minOrderQty}
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input 
                      type="number"
                      value={qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || med.minOrderQty;
                        setItemQuantities(prev => ({ ...prev, [med.id]: Math.max(med.minOrderQty, val) }));
                      }}
                      className="w-12 text-center text-xs font-bold text-slate-800 py-1.5 focus:outline-none"
                      min={med.minOrderQty}
                    />
                    <button
                      onClick={() => handleQuantityChange(med.id, 1, med.minOrderQty)}
                      className="px-2 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-40"
                      disabled={qty >= med.stockQuantity}
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onAddToCart(med, qty)}
                    disabled={!med.inStock || med.stockQuantity <= 0}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Order (₹{(med.ptr * qty).toFixed(0)})</span>
                  </button>
                </div>

                {med.minOrderQty > 1 && (
                  <div className="text-[10px] text-slate-500 mt-1.5 text-center">
                    Minimum Order Quantity (MOQ): {med.minOrderQty} packs
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
