import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  AlertCircle
} from 'lucide-react';
import { CartItem, RetailerProfile, WholesaleCompanyInfo } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (medicineId: string, newQty: number) => void;
  onRemoveItem: (medicineId: string) => void;
  onClearCart: () => void;
  currentRetailer: RetailerProfile | null;
  company: WholesaleCompanyInfo;
  onOpenCheckout: () => void;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentRetailer,
  company,
  onOpenCheckout,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const totalFreeUnits = cart.reduce((sum, item) => sum + item.freeUnits, 0);
  const schemeSavings = cart.reduce((sum, item) => sum + (item.freeUnits * item.medicine.ptr), 0);
  
  // Total GST calculation across items
  const totalGst = cart.reduce((sum, item) => sum + item.gstAmount, 0);
  const deliveryFee = subtotal >= company.minOrderFreeDelivery || cart.length === 0 ? 0 : company.defaultDeliveryFee;
  const grandTotal = subtotal + totalGst + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-white">Wholesale Order Cart</h2>
                <p className="text-xs text-slate-300">
                  {cart.length} item{cart.length === 1 ? '' : 's'} &bull; Direct B2B Pricing
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-700 text-base mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-5">
                  Browse our wholesale catalogue and add medicines to create your purchase order.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Browse Medicines
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center pb-3 text-xs text-slate-500 font-medium">
                  <span>Medicine & Pack Details</span>
                  <button
                    onClick={onClearCart}
                    className="text-rose-600 hover:text-rose-700 text-xs flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>

                <div className="space-y-4 pt-3">
                  {cart.map((item) => (
                    <div key={item.medicine.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 leading-tight">
                            {item.medicine.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {item.medicine.company} &bull; <span className="font-mono">{item.medicine.batchNumber}</span> (Exp: {item.medicine.expiryDate})
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.medicine.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Scheme bonus indicator */}
                      {item.freeUnits > 0 && (
                        <div className="mt-2 bg-amber-100/80 border border-amber-200 rounded-md px-2 py-1 text-xs text-amber-900 font-medium flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                            <span>Scheme Bonus:</span>
                          </span>
                          <span className="font-bold text-amber-950">
                            +{item.freeUnits} FREE Pack{item.freeUnits > 1 ? 's' : ''} (Worth ₹{(item.freeUnits * item.medicine.ptr).toFixed(0)})
                          </span>
                        </div>
                      )}

                      {/* Stepper & Price Row */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200/80">
                        <div className="flex items-center gap-1 border border-slate-300 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.medicine.id, item.quantity - 1)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                            disabled={item.quantity <= item.medicine.minOrderQty}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-bold text-xs text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.medicine.id, item.quantity + 1)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                            disabled={item.quantity >= item.medicine.stockQuantity}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-slate-500">
                            ₹{item.medicine.ptr.toFixed(2)} &times; {item.quantity}
                          </div>
                          <div className="text-sm font-extrabold text-slate-900">
                            ₹{item.itemTotal.toFixed(2)}
                            <span className="text-[10px] text-slate-400 font-normal ml-1">
                              (+{item.medicine.gstRate}% GST)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              
              {/* Scheme savings badge */}
              {schemeSavings > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-emerald-800">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Total Free Bonus Goods:</span>
                  </span>
                  <span className="font-bold text-emerald-900">
                    {totalFreeUnits} Free Packs (₹{schemeSavings.toFixed(2)} Saved)
                  </span>
                </div>
              )}

              {/* B2B Calculation lines */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>PTR Base Subtotal:</span>
                  <span className="font-semibold text-slate-800">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (CGST + SGST):</span>
                  <span className="font-semibold text-slate-800">₹{totalGst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Wholesale Delivery Fee:</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                        FREE (Above ₹{company.minOrderFreeDelivery})
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-800">₹{deliveryFee.toFixed(2)}</span>
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                  <div>
                    <span className="text-sm font-bold block">Net Invoice Value:</span>
                    <span className="text-[10px] text-slate-500 font-normal">Inclusive of all taxes & delivery</span>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-700">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Retailer KYC Status notice */}
              {!currentRetailer ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                  <p className="font-semibold mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Chemist Login Required
                  </p>
                  <p className="text-[11px] text-amber-800 mb-2">
                    Orders can only be billed to retail chemists with valid Form 20B/21B Drug Licences.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg text-xs transition-colors"
                  >
                    Login or Register Medical Store
                  </button>
                </div>
              ) : currentRetailer.status === 'PENDING_VERIFICATION' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-900">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-800">
                    <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>DL Verification in Progress</span>
                  </div>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Your Drug Licence is under verification by Shakti Pharma. You can still submit your PO for priority review.
                  </p>
                  <button
                    onClick={onOpenCheckout}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Proceed to Place PO Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenCheckout}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <span>Proceed to Wholesale Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
