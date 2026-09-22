import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  FileText, 
  RotateCcw, 
  Phone, 
  MapPin, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { WholesaleOrder, OrderStatus } from '../types';

interface OrdersViewProps {
  orders: WholesaleOrder[];
  onViewInvoice: (order: WholesaleOrder) => void;
  onReorder: (order: WholesaleOrder) => void;
  onExploreCatalogue: () => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'PENDING', label: 'Order Received', desc: 'PO submitted for verification' },
  { status: 'CONFIRMED', label: 'Confirmed', desc: 'Stock allocation verified' },
  { status: 'PACKED', label: 'Packed', desc: 'Batch & cold-chain verified' },
  { status: 'DISPATCHED', label: 'Dispatched', desc: 'Out on delivery vehicle' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Delivered to medical store' },
];

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onViewInvoice,
  onReorder,
  onExploreCatalogue,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | OrderStatus>('ALL');

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'ALL') return true;
    return order.orderStatus === selectedFilter;
  });

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'PACKED': return 2;
      case 'DISPATCHED': return 3;
      case 'DELIVERED': return 4;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Wholesale Orders & Invoices
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track live dispatch status, download Form 20B/21B GST invoices, and re-order supplies in one click.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setSelectedFilter('DISPATCHED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'DISPATCHED'
                ? 'bg-sky-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            In Transit / Dispatched
          </button>
          <button
            onClick={() => setSelectedFilter('DELIVERED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'DELIVERED'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setSelectedFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'PENDING'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pending Review
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No orders found</h3>
          <p className="text-xs text-slate-500 mb-4">
            You don't have any orders matching the current filter.
          </p>
          <button
            onClick={onExploreCatalogue}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            Explore Medicine Catalogue
          </button>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => {
          const currentStepIndex = getStepIndex(order.orderStatus);

          return (
            <div 
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden"
              id={`order-card-${order.orderNumber}`}
            >
              {/* Order Card Header */}
              <div className="bg-slate-50/80 p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Purchase Order Ref:
                    </span>
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {order.orderNumber}
                    </span>
                  </div>

                  <span className="h-6 w-px bg-slate-200 hidden sm:inline" />

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Order Placed Date:
                    </span>
                    <span className="text-xs font-medium text-slate-700">
                      {order.orderDate}
                    </span>
                  </div>

                  <span className="h-6 w-px bg-slate-200 hidden sm:inline" />

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Chemist Shop:
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {order.retailer.shopName}
                    </span>
                  </div>
                </div>

                {/* Right side buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewInvoice(order)}
                    className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View / Print GST Invoice</span>
                  </button>
                  <button
                    onClick={() => onReorder(order)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Order All</span>
                  </button>
                </div>
              </div>

              {/* Live Order Tracker Step Bar */}
              <div className="p-4 sm:p-6 border-b border-slate-100 bg-white">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Live Dispatch & Delivery Progression:</span>
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    order.orderStatus === 'DELIVERED' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : order.orderStatus === 'DISPATCHED' 
                      ? 'bg-sky-100 text-sky-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    Status: {order.orderStatus}
                  </span>
                </div>

                {/* 5-Step Visual Progress Bar */}
                <div className="grid grid-cols-5 gap-2 pt-3">
                  {STATUS_STEPS.map((step, idx) => {
                    const isPassed = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div key={step.status} className="relative text-center">
                        <div className={`h-1.5 w-full rounded-full mb-2 transition-all ${
                          isPassed ? 'bg-emerald-600' : 'bg-slate-200'
                        }`} />
                        <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-1 ${
                          isCurrent
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-400 border border-slate-300'
                        }`}>
                          {isPassed ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <div className={`text-[11px] font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </div>
                        <div className="text-[10px] text-slate-400 hidden sm:block">
                          {step.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vehicle & Dispatch Route Callout if In Transit */}
                {order.trackingInfo && (order.orderStatus === 'DISPATCHED' || order.orderStatus === 'DELIVERED') && (
                  <div className="mt-4 bg-sky-50/70 border border-sky-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-sky-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          Route: {order.trackingInfo.route || 'Sundargarh Chemist Route'}
                        </div>
                        <div className="text-slate-600 text-[11px]">
                          Vehicle: <strong className="font-mono text-slate-800">{order.trackingInfo.vehicleNo || 'OD-16-E-4819'}</strong> &bull; Driver: {order.trackingInfo.driverName || 'Dilip Behera'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      {order.trackingInfo.driverPhone && (
                        <a 
                          href={`tel:${order.trackingInfo.driverPhone}`}
                          className="bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-sky-600" />
                          <span>Call Driver ({order.trackingInfo.driverPhone})</span>
                        </a>
                      )}
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Estimated Arrival:</span>
                        <strong className="text-slate-900">{order.trackingInfo.estimatedDelivery || 'Today'}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Items List & Summary */}
              <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/40">
                <div className="lg:col-span-8 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Billed Products ({order.items.length} Formulations):
                  </span>
                  
                  <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
                    {order.items.map((item) => (
                      <div key={item.medicine.id} className="p-2.5 px-3 flex justify-between items-center gap-2">
                        <div>
                          <div className="font-bold text-slate-900">{item.medicine.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {item.medicine.company} &bull; Batch: <span className="font-mono">{item.medicine.batchNumber}</span> (Exp: {item.medicine.expiryDate})
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-bold text-slate-800">{item.quantity} Packs</span>
                            {item.freeUnits > 0 && (
                              <span className="block text-[10px] text-amber-700 font-bold">
                                +{item.freeUnits} Free Bonus
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-slate-900 w-20 text-right">
                            ₹{item.itemTotal.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Summary */}
                <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block pb-1 border-b border-slate-100">
                      Payment & Invoice Summary:
                    </span>

                    <div className="mt-2 space-y-1.5 text-slate-600">
                      <div className="flex justify-between">
                        <span>Payment Mode:</span>
                        <strong className="text-slate-900">{order.paymentMethod}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Status:</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          {order.paymentStatus}
                        </span>
                      </div>
                      {order.paymentReference && (
                        <div className="flex justify-between">
                          <span>Ref / UTR:</span>
                          <span className="font-mono text-[10px] text-slate-700 truncate max-w-[120px]">
                            {order.paymentReference}
                          </span>
                        </div>
                      )}
                      {order.schemeSavingsValue > 0 && (
                        <div className="flex justify-between text-amber-800 font-semibold">
                          <span>Scheme Savings:</span>
                          <span>₹{order.schemeSavingsValue.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900">
                    <span className="text-xs">Invoice Total:</span>
                    <span className="text-base font-extrabold text-emerald-800">
                      ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
