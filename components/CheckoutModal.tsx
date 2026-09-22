import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Building2, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { CartItem, RetailerProfile, WholesaleCompanyInfo, PaymentMethod, WholesaleOrder } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentRetailer: RetailerProfile;
  company: WholesaleCompanyInfo;
  onOrderSuccess: (newOrder: WholesaleOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  currentRetailer,
  company,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [applyCashDiscount, setApplyCashDiscount] = useState<boolean>(true);
  const [poNumber, setPoNumber] = useState<string>(`PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [notes, setNotes] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    `${currentRetailer.shopName}, ${currentRetailer.shopAddress}, ${currentRetailer.city}, ${currentRetailer.district}, ${currentRetailer.state} - ${currentRetailer.pincode}`
  );
  const [complianceAccepted, setComplianceAccepted] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const totalFreeUnits = cart.reduce((sum, item) => sum + item.freeUnits, 0);
  const schemeSavings = cart.reduce((sum, item) => sum + (item.freeUnits * item.medicine.ptr), 0);

  // Cash discount (2% if chosen for UPI/NEFT)
  const isEligibleForCd = paymentMethod === 'UPI' || paymentMethod === 'NEFT';
  const cashDiscountAmount = (applyCashDiscount && isEligibleForCd) 
    ? Math.round(subtotal * (company.cashDiscountPercent / 100) * 100) / 100 
    : 0;

  const taxableAmount = Math.max(0, subtotal - cashDiscountAmount);

  // GST calculation
  const totalGst = cart.reduce((sum, item) => {
    // Proportional GST after cash discount
    const itemRatio = item.itemTotal / (subtotal || 1);
    const itemDiscounted = item.itemTotal - (cashDiscountAmount * itemRatio);
    return sum + (itemDiscounted * (item.medicine.gstRate / 100));
  }, 0);

  const cgst = totalGst / 2;
  const sgst = totalGst / 2;
  const igst = 0; // Local state intra-state Odisha GST

  const deliveryFee = subtotal >= company.minOrderFreeDelivery ? 0 : company.defaultDeliveryFee;
  const grandTotal = Math.round(taxableAmount + totalGst + deliveryFee);

  // Available Credit for Retailer
  const availableCredit = Math.max(0, currentRetailer.creditLimit - currentRetailer.creditUsed);
  const hasEnoughCredit = availableCredit >= grandTotal;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(company.bankDetails.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePlaceOrder = () => {
    if (!complianceAccepted) return;
    if (paymentMethod === 'CREDIT' && !hasEnoughCredit && currentRetailer.status === 'APPROVED') {
      alert(`Order value (₹${grandTotal}) exceeds your available credit limit (₹${availableCredit}). Please select UPI or Bank Transfer.`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `SPW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newOrder: WholesaleOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        orderDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        retailer: currentRetailer,
        items: [...cart],
        subtotal,
        schemeFreeUnitsTotal: totalFreeUnits,
        schemeSavingsValue: schemeSavings,
        cashDiscountApplied: applyCashDiscount && isEligibleForCd,
        cashDiscountAmount,
        taxableAmount,
        cgst,
        sgst,
        igst,
        deliveryCharge: deliveryFee,
        totalAmount: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'UPI' && utrNumber ? 'PAID' : (paymentMethod === 'CREDIT' ? 'CREDIT_APPROVED' : 'PENDING'),
        paymentReference: utrNumber ? `UPI-UTR-${utrNumber}` : undefined,
        orderStatus: 'PENDING',
        poNumber,
        notes,
        deliveryAddress,
        trackingInfo: {
          route: `${currentRetailer.city} Chemist Distribution Route`,
          estimatedDelivery: currentRetailer.city.toLowerCase().includes('sundargarh') 
            ? 'Today by 5:00 PM (Local Van)' 
            : 'Tomorrow (24h Express Route)',
        }
      };

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Wholesale Purchase Order Checkout</h2>
              <p className="text-xs text-slate-300">
                Billing to: <strong className="text-white">{currentRetailer.shopName}</strong> &bull; DL: {currentRetailer.dl20B}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
          
          {/* Left Column: Form Details & Payment */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Chemist Details Review */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 text-sm">{currentRetailer.shopName}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Licensed Chemist</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>Owner: <strong className="text-slate-800">{currentRetailer.ownerName}</strong></div>
                <div>Mobile: <strong className="text-slate-800">{currentRetailer.mobile}</strong></div>
                <div>GSTIN: <span className="font-mono font-medium text-slate-800">{currentRetailer.gstin}</span></div>
                <div>DL Form 20B: <span className="font-mono font-medium text-slate-800">{currentRetailer.dl20B}</span></div>
              </div>
            </div>

            {/* Chemist PO Number & Instructions */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chemist Purchase Order (PO) Number:
                </label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  placeholder="e.g. PO/SEP/2026/08"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Address:
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Packing / Dispatch Instructions (Optional):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Pack cold-chain items separately, deliver by 4 PM"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Select Wholesale Payment Terms:
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* 1. UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Instant UPI QR</div>
                    <div className="text-[11px] text-emerald-700 font-medium">Extra 2% CD Applicable</div>
                  </div>
                </button>

                {/* 2. Bank NEFT */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NEFT')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    paymentMethod === 'NEFT'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Bank RTGS / NEFT</div>
                    <div className="text-[11px] text-emerald-700 font-medium">SBI Current A/C Transfer</div>
                  </div>
                </button>

                {/* 3. Wholesale Credit */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    paymentMethod === 'CREDIT'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">{currentRetailer.creditDaysAllowed} Days Credit</div>
                    <div className="text-[11px] text-slate-500">
                      Avail: ₹{availableCredit.toLocaleString('en-IN')}
                    </div>
                  </div>
                </button>

                {/* 4. COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Truck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Delivery Collection</div>
                    <div className="text-[11px] text-slate-500">Cash/Cheque on Delivery</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic Payment Method Details Panel */}
            {paymentMethod === 'UPI' && (
              <div className="bg-slate-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Scan & Pay via Any UPI App:</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    Pay: ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                  {/* Dynamic simulated QR Code visual */}
                  <div className="w-24 h-24 bg-white border border-slate-300 rounded-lg p-1.5 flex flex-col items-center justify-center shrink-0">
                    <div className="w-full h-full bg-slate-900 rounded flex flex-col items-center justify-center p-1 text-white text-[9px] text-center font-mono leading-tight">
                      <QrCode className="w-12 h-12 text-white mb-0.5" />
                      <span>UPI QR</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block">UPI VPA:</span>
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                          {company.bankDetails.upiId}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="text-emerald-700 hover:text-emerald-800 text-[11px] font-semibold flex items-center gap-0.5"
                        >
                          {copiedUpi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      GPay, PhonePe, Paytm, or BHIM accepted.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Enter Bank UTR / Reference No. (Optional or after payment):
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 428192849102"
                    className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-md font-mono"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'NEFT' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                <span className="font-bold text-slate-800 block">Shakti Pharma Bank Account Details:</span>
                <div className="bg-white p-3 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
                  <div>Account Name: <strong className="text-slate-900 block">{company.bankDetails.accountName}</strong></div>
                  <div>Bank Name: <strong className="text-slate-900 block">{company.bankDetails.bankName}</strong></div>
                  <div>Account No: <strong className="font-mono text-slate-900 block">{company.bankDetails.accountNumber}</strong></div>
                  <div>IFSC Code: <strong className="font-mono text-slate-900 block">{company.bankDetails.ifscCode}</strong></div>
                  <div className="col-span-2 text-slate-500 text-[11px]">
                    Branch: {company.bankDetails.branch}
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'CREDIT' && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                hasEnoughCredit ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex justify-between items-center font-bold">
                  <span>Wholesale Credit Terms ({currentRetailer.creditDaysAllowed} Days):</span>
                  <span>Limit: ₹{currentRetailer.creditLimit.toLocaleString('en-IN')}</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Already Utilized:</span>
                    <span>₹{currentRetailer.creditUsed.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Available Balance:</span>
                    <span>₹{availableCredit.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                {!hasEnoughCredit && (
                  <p className="text-rose-700 font-semibold pt-1 border-t border-rose-200">
                    Warning: Order amount (₹{grandTotal}) exceeds current available credit limit. Please clear pending invoices or choose UPI.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Compliance Confirmation */}
          <div className="lg:col-span-5 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-200">
                Order Value Summary
              </h3>

              {/* Items summary */}
              <div className="max-h-48 overflow-y-auto space-y-2 text-xs pr-1">
                {cart.map((item) => (
                  <div key={item.medicine.id} className="flex justify-between items-start text-slate-700">
                    <div>
                      <div className="font-semibold text-slate-900">{item.medicine.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.quantity} packs &bull; ₹{item.medicine.ptr.toFixed(2)}/pack
                        {item.freeUnits > 0 && (
                          <span className="text-amber-700 font-bold ml-1">
                            (+{item.freeUnits} Free)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-slate-900">
                      ₹{item.itemTotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Schemes bonus callout */}
              {schemeSavings > 0 && (
                <div className="bg-amber-100/70 border border-amber-200 rounded-lg p-2 text-xs text-amber-900 flex justify-between items-center font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Scheme Bonus Goods:</span>
                  </span>
                  <span className="font-bold">+{totalFreeUnits} Free Packs (₹{schemeSavings.toFixed(0)})</span>
                </div>
              )}

              {/* 2% Cash discount toggle */}
              {isEligibleForCd && (
                <label className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={applyCashDiscount}
                    onChange={(e) => setApplyCashDiscount(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <div className="text-emerald-900 font-medium">
                    <span className="font-bold">2% Cash Discount (CD)</span> for prepaid payment
                    <span className="block text-[10px] text-emerald-700">
                      You save ₹{((subtotal * company.cashDiscountPercent) / 100).toFixed(2)} immediately
                    </span>
                  </div>
                </label>
              )}

              {/* Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>PTR Subtotal:</span>
                  <span className="font-semibold text-slate-800">₹{subtotal.toFixed(2)}</span>
                </div>

                {cashDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Cash Discount (2%):</span>
                    <span>-₹{cashDiscountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxable Value:</span>
                  <span className="font-semibold text-slate-800">₹{taxableAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>CGST (Intra-state Odisha):</span>
                  <span>₹{cgst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>SGST (Intra-state Odisha):</span>
                  <span>₹{sgst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee.toFixed(2)}`}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                  <span className="text-sm font-bold">Total Net Payable:</span>
                  <span className="text-xl font-extrabold text-emerald-700">
                    ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Regulatory Drug Law Compliance Checkbox */}
              <label className="flex items-start gap-2 pt-2 border-t border-slate-200 cursor-pointer text-[11px] text-slate-600 leading-tight">
                <input
                  type="checkbox"
                  checked={complianceAccepted}
                  onChange={(e) => setComplianceAccepted(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5 shrink-0"
                />
                <span>
                  I declare under the <strong>Drugs and Cosmetics Act, 1940</strong> that our medical store holds valid retail drug licences (Form 20/21) and all prescription drugs will be dispensed under registered pharmacist supervision.
                </span>
              </label>
            </div>

            {/* Submit Order Button */}
            <div className="mt-5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!complianceAccepted || isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Generating Tax Invoice & Booking...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Place Order (₹{grandTotal.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
