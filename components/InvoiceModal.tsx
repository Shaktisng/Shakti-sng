import React from 'react';
import { 
  Printer, 
  X, 
  Download, 
  Building2, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2 
} from 'lucide-react';
import { WholesaleOrder, WholesaleCompanyInfo } from '../types';

interface InvoiceModalProps {
  order: WholesaleOrder | null;
  onClose: () => void;
  company: WholesaleCompanyInfo;
}

// Helper to convert number to Indian words
function numberToWords(num: number): string {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ',
    'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + Math.floor(num)).substr(-9);
  const m = Math.round((num - Math.floor(num)) * 100);

  const match = n.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!match) return '';

  let str = '';
  str += Number(match[1]) !== 0 ? (a[Number(match[1])] || b[match[1][0]] + ' ' + a[match[1][1]]) + 'Crore ' : '';
  str += Number(match[2]) !== 0 ? (a[Number(match[2])] || b[match[2][0]] + ' ' + a[match[2][1]]) + 'Lakh ' : '';
  str += Number(match[3]) !== 0 ? (a[Number(match[3])] || b[match[3][0]] + ' ' + a[match[3][1]]) + 'Thousand ' : '';
  str += Number(match[4]) !== 0 ? (a[Number(match[4])] || b[match[4][0]] + ' ' + a[match[4][1]]) + 'Hundred ' : '';
  str += Number(match[5]) !== 0 ? ((str !== '') ? 'and ' : '') + (a[Number(match[5])] || b[match[5][0]] + ' ' + a[match[5][1]]) : '';

  let paise = '';
  if (m > 0) {
    paise = ' and ' + (a[m] || b[Math.floor(m / 10)] + ' ' + a[m % 10]) + 'Paise';
  }

  return 'Rupees ' + (str.trim() || 'Zero') + paise + ' Only';
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  onClose,
  company,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNo = order.orderNumber.replace('SPW', 'INV');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden my-4 border border-slate-300">
        
        {/* Modal Top Actions (No Print) */}
        <div className="no-print bg-slate-900 text-white p-3 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>Tax Invoice / Delivery Challan:</span>
            <code className="text-emerald-400 font-mono">{invoiceNo}</code>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Paper Container */}
        <div className="p-6 sm:p-8 text-slate-900 text-[11px] leading-tight font-sans bg-white print:p-0">
          
          {/* Top Title */}
          <div className="text-center pb-2 border-b-2 border-slate-800">
            <h1 className="text-lg font-extrabold uppercase tracking-wide text-slate-900">
              TAX INVOICE & BATCH QUALITY CERTIFICATE
            </h1>
            <p className="text-[10px] text-slate-600 font-medium">
              (Issued under Rule 65 of Drugs and Cosmetics Rules, 1945 & Section 31 of CGST/OGST Act, 2017)
            </p>
          </div>

          {/* Company & Buyer Header Info */}
          <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-300">
            {/* Wholesale Distributor (Supplier) */}
            <div className="border-r border-slate-200 pr-3">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">
                Wholesale Supplier / Stockist:
              </span>
              <h2 className="text-sm font-extrabold text-slate-900">{company.name}</h2>
              <p className="text-slate-600 mt-0.5">{company.address}, {company.city} - {company.pincode}, {company.state}</p>
              <p className="text-slate-600">Phone: {company.phone} | WhatsApp: {company.whatsapp} | Email: {company.email}</p>
              
              <div className="mt-2 bg-slate-50 p-2 rounded border border-slate-200 grid grid-cols-2 gap-1 text-[10px]">
                <div>DL No. 20B: <strong className="font-mono">{company.dl20B}</strong></div>
                <div>DL No. 21B: <strong className="font-mono">{company.dl21B}</strong></div>
                <div>GSTIN: <strong className="font-mono text-emerald-800">{company.gstin}</strong></div>
                <div>PAN: <strong className="font-mono">{company.pan}</strong></div>
              </div>
            </div>

            {/* Buyer / Retail Chemist (Consignee) */}
            <div className="pl-1">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">
                Billed & Shipped To (Chemist):
              </span>
              <h3 className="text-sm font-bold text-slate-900">{order.retailer.shopName}</h3>
              <p className="text-slate-600 mt-0.5">{order.deliveryAddress}</p>
              <p className="text-slate-600">Owner: {order.retailer.ownerName} | Mobile: {order.retailer.mobile}</p>
              
              <div className="mt-2 bg-slate-50 p-2 rounded border border-slate-200 grid grid-cols-2 gap-1 text-[10px]">
                <div>Chemist DL 20: <strong className="font-mono">{order.retailer.dl20B}</strong></div>
                <div>Chemist DL 21: <strong className="font-mono">{order.retailer.dl21B}</strong></div>
                <div>GSTIN: <strong className="font-mono">{order.retailer.gstin}</strong></div>
                <div>State Code: <strong className="font-mono">21 (Odisha)</strong></div>
              </div>
            </div>
          </div>

          {/* Invoice Metadata Row */}
          <div className="grid grid-cols-4 gap-2 py-2.5 bg-slate-100 px-3 rounded border border-slate-200 my-3 text-[10px]">
            <div>
              <span className="text-slate-500 block">Invoice No:</span>
              <strong className="text-slate-900 font-mono text-xs">{invoiceNo}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Invoice Date:</span>
              <strong className="text-slate-900">{order.orderDate}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Chemist PO No:</span>
              <strong className="text-slate-900 font-mono">{order.poNumber || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Payment Terms:</span>
              <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                {order.paymentMethod} &bull; {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto border border-slate-300 rounded">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="bg-slate-800 text-white text-left font-bold border-b border-slate-800">
                  <th className="p-1.5 text-center w-8">#</th>
                  <th className="p-1.5">Description & Molecule</th>
                  <th className="p-1.5">Company</th>
                  <th className="p-1.5 font-mono">HSN</th>
                  <th className="p-1.5 font-mono">Batch</th>
                  <th className="p-1.5">Expiry</th>
                  <th className="p-1.5 text-right">Qty</th>
                  <th className="p-1.5 text-right text-amber-300">Free</th>
                  <th className="p-1.5 text-right">MRP</th>
                  <th className="p-1.5 text-right">PTR Rate</th>
                  <th className="p-1.5 text-right">Taxable</th>
                  <th className="p-1.5 text-right">GST</th>
                  <th className="p-1.5 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {order.items.map((item, idx) => {
                  const lineTaxable = item.itemTotal;
                  const lineTotal = lineTaxable + item.gstAmount;

                  return (
                    <tr key={item.medicine.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="p-1.5 text-center text-slate-500">{idx + 1}</td>
                      <td className="p-1.5 font-semibold text-slate-900">
                        {item.medicine.name}
                        <span className="block text-[9px] text-slate-500 font-normal font-mono">
                          {item.medicine.saltComposition}
                        </span>
                      </td>
                      <td className="p-1.5 text-slate-600">{item.medicine.company}</td>
                      <td className="p-1.5 font-mono text-slate-600">{item.medicine.hsnCode}</td>
                      <td className="p-1.5 font-mono font-semibold text-slate-900">{item.medicine.batchNumber}</td>
                      <td className="p-1.5 text-slate-600">{item.medicine.expiryDate}</td>
                      <td className="p-1.5 text-right font-bold text-slate-900">{item.quantity}</td>
                      <td className="p-1.5 text-right font-bold text-amber-700">
                        {item.freeUnits > 0 ? `+${item.freeUnits}` : '-'}
                      </td>
                      <td className="p-1.5 text-right text-slate-500">₹{item.medicine.mrp.toFixed(2)}</td>
                      <td className="p-1.5 text-right font-medium">₹{item.medicine.ptr.toFixed(2)}</td>
                      <td className="p-1.5 text-right font-semibold">₹{lineTaxable.toFixed(2)}</td>
                      <td className="p-1.5 text-right text-slate-600">{item.medicine.gstRate}%</td>
                      <td className="p-1.5 text-right font-extrabold text-slate-900">
                        ₹{lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Scheme Savings Banner if applicable */}
          {order.schemeSavingsValue > 0 && (
            <div className="mt-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded text-[10px] text-amber-900 flex justify-between font-semibold">
              <span>Wholesale Scheme Bonus Benefit:</span>
              <span>{order.schemeFreeUnitsTotal} Free Packs Provided (Retail Value Saved: ₹{order.schemeSavingsValue.toFixed(2)})</span>
            </div>
          )}

          {/* Financial Calculation Summary & Bank Row */}
          <div className="grid grid-cols-12 gap-4 mt-3 pt-2">
            
            {/* Left 7 cols: Bank Details & Amount in words */}
            <div className="col-span-7 space-y-2">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[10px]">
                <span className="font-bold text-slate-800 block mb-0.5">Amount Chargeable (in words):</span>
                <p className="font-semibold text-slate-900 italic">
                  {numberToWords(order.totalAmount)}
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[10px] space-y-0.5">
                <span className="font-bold text-slate-800 block">Bank Account for RTGS / NEFT / UPI Payment:</span>
                <div className="text-slate-700">A/C Name: <strong className="text-slate-900">{company.bankDetails.accountName}</strong></div>
                <div className="text-slate-700">Bank: {company.bankDetails.bankName}, {company.bankDetails.branch}</div>
                <div className="flex gap-4">
                  <div>A/C No: <strong className="font-mono text-slate-900">{company.bankDetails.accountNumber}</strong></div>
                  <div>IFSC: <strong className="font-mono text-slate-900">{company.bankDetails.ifscCode}</strong></div>
                </div>
                <div>UPI ID: <strong className="font-mono text-emerald-800">{company.bankDetails.upiId}</strong></div>
              </div>
            </div>

            {/* Right 5 cols: Totals breakdown */}
            <div className="col-span-5 bg-slate-50 p-3 rounded border border-slate-200 text-[10px] space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Total PTR Value:</span>
                <span className="font-semibold text-slate-800">₹{order.subtotal.toFixed(2)}</span>
              </div>

              {order.cashDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Cash Discount (2%):</span>
                  <span>-₹{order.cashDiscountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span className="font-semibold text-slate-800">₹{order.taxableAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>CGST (Odisha 21):</span>
                <span>₹{order.cgst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>SGST (Odisha 21):</span>
                <span>₹{order.sgst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery & Handling:</span>
                <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge.toFixed(2)}`}</span>
              </div>

              <div className="pt-2 border-t-2 border-slate-800 flex justify-between items-baseline font-bold text-slate-900 text-xs">
                <span>Total Invoice Value:</span>
                <span className="text-sm font-extrabold text-emerald-800">
                  ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Statutory Terms & Signatures */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-300 text-[9px] text-slate-500">
            <div>
              <span className="font-bold text-slate-700 block mb-1 uppercase">Declaration & Terms of Sale:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                <li>We hereby certify that food/medicines mentioned in this invoice are manufactured according to GMP standards and warrant that products comply with the Drugs and Cosmetics Act, 1940.</li>
                <li>Store biologicals and cold-chain vaccines between 2°C to 8°C immediately upon delivery.</li>
                <li>Schedule H & H1 drugs are to be sold strictly by retail chemists on doctor's prescription.</li>
                <li>Disputes, if any, subject to Sundargarh jurisdiction only.</li>
              </ul>
            </div>

            <div className="flex flex-col justify-between items-end text-right">
              <div>
                <span className="font-bold text-slate-800 block text-[10px]">For {company.name}</span>
                <span className="text-slate-500">Authorized Wholesale Licensee</span>
              </div>

              <div className="mt-8 pt-1 border-t border-slate-400 w-44 text-center">
                <span className="block font-semibold text-slate-800 text-[10px]">Authorized Signatory</span>
                <span className="text-slate-500 text-[8px]">Registered Pharmacist / Qualified Person</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
