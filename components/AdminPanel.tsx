import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Package, 
  Truck, 
  CreditCard, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  Search, 
  Users, 
  Layers, 
  Phone, 
  Building2,
  Calendar,
  Save,
  X
} from 'lucide-react';
import { Medicine, RetailerProfile, WholesaleOrder, WholesaleCompanyInfo, OrderStatus, PaymentStatus, MedicineCategory, DrugSchedule } from '../types';

interface AdminPanelProps {
  medicines: Medicine[];
  orders: WholesaleOrder[];
  retailers: RetailerProfile[];
  company: WholesaleCompanyInfo;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  onAssignLogistics: (orderId: string, driverName: string, driverPhone: string, vehicleNo: string) => void;
  onAddMedicine: (newMed: Medicine) => void;
  onUpdateMedicine: (med: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
  onApproveRetailer: (id: string, creditLimit: number) => void;
  onRejectRetailer: (id: string) => void;
  onViewInvoice: (order: WholesaleOrder) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  medicines,
  orders,
  retailers,
  company,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onAssignLogistics,
  onAddMedicine,
  onUpdateMedicine,
  onDeleteMedicine,
  onApproveRetailer,
  onRejectRetailer,
  onViewInvoice,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'inventory' | 'retailers' | 'reports'>('orders');
  
  // Inventory state
  const [searchMed, setSearchMed] = useState('');
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);

  // New Medicine Form State
  const [newMedName, setNewMedName] = useState('');
  const [newMedCompany, setNewMedCompany] = useState('');
  const [newMedSalt, setNewMedSalt] = useState('');
  const [newMedCategory, setNewMedCategory] = useState<MedicineCategory>('Allopathic Rx');
  const [newMedPack, setNewMedPack] = useState('10 x 10 Tablets');
  const [newMedMrp, setNewMedMrp] = useState(1200);
  const [newMedPtr, setNewMedPtr] = useState(850);
  const [newMedStock, setNewMedStock] = useState(50);
  const [newMedBatch, setNewMedBatch] = useState('BN-' + Math.floor(1000 + Math.random() * 9000));
  const [newMedExpiry, setNewMedExpiry] = useState('12/2027');
  const [newMedSchedule, setNewMedSchedule] = useState<DrugSchedule>('Schedule H');
  const [newMedScheme, setNewMedScheme] = useState('10+1 Free');
  const [newMedGst, setNewMedGst] = useState(12);

  // Logistics quick modal
  const [logisticsOrderId, setLogisticsOrderId] = useState<string | null>(null);
  const [driverName, setDriverName] = useState('Dilip Behera');
  const [driverPhone, setDriverPhone] = useState('+91 94379 81234');
  const [vehicleNo, setVehicleNo] = useState('OD-16-E-4819 (Bolero Maxi Truck)');

  // Quick stats
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'PENDING').length;
  const lowStockCount = medicines.filter(m => m.stockQuantity < 30).length;
  const pendingRetailersCount = retailers.filter(r => r.status === 'PENDING_VERIFICATION').length;

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName || !newMedCompany || !newMedSalt) return;

    const med: Medicine = {
      id: `med-${Date.now()}`,
      name: newMedName,
      company: newMedCompany,
      saltComposition: newMedSalt,
      category: newMedCategory,
      packSize: newMedPack,
      unitsPerPack: 10,
      mrp: Number(newMedMrp),
      ptr: Number(newMedPtr),
      pts: Number(newMedPtr) * 0.9,
      stockQuantity: Number(newMedStock),
      minOrderQty: 1,
      batchNumber: newMedBatch,
      expiryDate: newMedExpiry,
      schedule: newMedSchedule,
      hsnCode: '30049099',
      gstRate: Number(newMedGst),
      scheme: newMedScheme || undefined,
      schemeBonusEvery: newMedScheme.includes('10+1') ? 10 : (newMedScheme.includes('20+2') ? 20 : undefined),
      schemeBonusUnits: newMedScheme.includes('10+1') ? 1 : (newMedScheme.includes('20+2') ? 2 : undefined),
      inStock: Number(newMedStock) > 0,
      isLowStock: Number(newMedStock) < 25,
    };

    onAddMedicine(med);
    setShowAddMedModal(false);
    // Reset
    setNewMedName('');
    setNewMedCompany('');
    setNewMedSalt('');
  };

  const filteredMedicines = medicines.filter(m => {
    if (!searchMed.trim()) return true;
    const q = searchMed.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.saltComposition.toLowerCase().includes(q) || m.batchNumber.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Admin Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Wholesale Distributor Admin
              </span>
              <span className="text-slate-400 text-xs">
                {company.name} &bull; Sundargarh, Odisha
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Distributor Control & Invoicing Center
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Manage incoming retail POs, stock quantities, CDSCO/Drug Licence verifications, and delivery vans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddMedModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Medicine</span>
            </button>
          </div>
        </div>

        {/* 4 Top KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Wholesale Billed</span>
            <div className="text-xl font-extrabold text-white mt-1">
              ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Across {orders.length} Invoices</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold block">Pending Dispatch</span>
            <div className="text-xl font-extrabold text-amber-400 mt-1">
              {pendingOrdersCount} Order{pendingOrdersCount === 1 ? '' : 's'}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Requires packing & transit</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold block">Low-Stock Formulations</span>
            <div className={`text-xl font-extrabold mt-1 ${lowStockCount > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {lowStockCount} Items
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Below 30 packs threshold</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold block">Pending Chemist KYC</span>
            <div className="text-xl font-extrabold text-sky-400 mt-1">
              {pendingRetailersCount} Medical Store{pendingRetailersCount === 1 ? '' : 's'}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Awaiting Drug Licence check</span>
          </div>
        </div>
      </div>

      {/* Admin Subtabs Bar */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold overflow-x-auto shadow-2xs">
        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeAdminTab === 'orders'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-600" />
          <span>Orders Management ({orders.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('inventory')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeAdminTab === 'inventory'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Stock & Medicines ({medicines.length})</span>
          {lowStockCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {lowStockCount} Low
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('retailers')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeAdminTab === 'retailers'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Retail Chemist KYC ({retailers.length})</span>
          {pendingRetailersCount > 0 && (
            <span className="bg-sky-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingRetailersCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('reports')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeAdminTab === 'reports'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Sales & Licences</span>
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">All Incoming Purchase Orders:</span>
            <span className="text-slate-500">Click actions to advance order stage or change payment status.</span>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{order.orderNumber}</span>
                      <span className="text-xs text-slate-500 font-medium">({order.orderDate})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.orderStatus === 'DELIVERED' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : order.orderStatus === 'DISPATCHED' 
                          ? 'bg-sky-100 text-sky-800' 
                          : order.orderStatus === 'PACKED'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 mt-1">
                      Chemist: <strong className="text-slate-900">{order.retailer.shopName}</strong> &bull; Owner: {order.retailer.ownerName} &bull; Ph: {order.retailer.mobile}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewInvoice(order)}
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Print Tax Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                  {order.items.map((item) => (
                    <div key={item.medicine.id} className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between">
                      <span className="font-medium text-slate-800 truncate mr-2">{item.medicine.name}</span>
                      <span className="font-bold text-slate-900 whitespace-nowrap">
                        {item.quantity} pk {item.freeUnits > 0 ? `(+${item.freeUnits} Free)` : ''}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status progression bar & Payment update */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-600">Advance Order Status:</span>
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'CONFIRMED')}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                        order.orderStatus === 'CONFIRMED' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'PACKED')}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                        order.orderStatus === 'PACKED' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Pack
                    </button>
                    <button
                      onClick={() => {
                        setLogisticsOrderId(order.id);
                        onUpdateOrderStatus(order.id, 'DISPATCHED');
                      }}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                        order.orderStatus === 'DISPATCHED' ? 'bg-sky-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Dispatch (Van)
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'DELIVERED')}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                        order.orderStatus === 'DELIVERED' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Mark Delivered
                    </button>
                  </div>

                  {/* Payment Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-600">Payment:</span>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => onUpdatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-xs text-slate-800"
                    >
                      <option value="PAID">PAID (Settled)</option>
                      <option value="PENDING">PENDING</option>
                      <option value="CREDIT_APPROVED">CREDIT (7/15 Days)</option>
                    </select>

                    <span className="font-extrabold text-sm text-emerald-800 ml-2">
                      ₹{order.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Inventory & Stock Management */}
      {activeAdminTab === 'inventory' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 space-y-6 shadow-xs">
          
          {/* Search bar & quick filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search stock by formulation name, salt or batch..."
                value={searchMed}
                onChange={(e) => setSearchMed(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowAddMedModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Formulation</span>
            </button>
          </div>

          {/* Stock Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white text-left font-bold">
                  <th className="p-3">Medicine & Salt</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Batch & Expiry</th>
                  <th className="p-3 text-right">MRP (₹)</th>
                  <th className="p-3 text-right">PTR (₹)</th>
                  <th className="p-3 text-center">Available Stock</th>
                  <th className="p-3 text-center">Scheme</th>
                  <th className="p-3 text-center">Schedule</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredMedicines.map((med) => (
                  <tr key={med.id} className={med.stockQuantity < 30 ? 'bg-rose-50/40' : 'hover:bg-slate-50'}>
                    <td className="p-3 font-semibold text-slate-900">
                      <div>{med.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{med.saltComposition}</div>
                    </td>
                    <td className="p-3 text-slate-600">{med.company}</td>
                    <td className="p-3">
                      <span className="font-mono font-bold text-slate-800">{med.batchNumber}</span>
                      <span className="block text-[10px] text-slate-500">Exp: {med.expiryDate}</span>
                    </td>
                    <td className="p-3 text-right font-medium text-slate-500">₹{med.mrp.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-slate-900">₹{med.ptr.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            const updated = Math.max(0, med.stockQuantity - 10);
                            onUpdateMedicine({ ...med, stockQuantity: updated, inStock: updated > 0, isLowStock: updated < 30 });
                          }}
                          className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-bold"
                          title="-10 packs"
                        >
                          -10
                        </button>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                          med.stockQuantity < 30 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {med.stockQuantity}
                        </span>
                        <button
                          onClick={() => {
                            const updated = med.stockQuantity + 20;
                            onUpdateMedicine({ ...med, stockQuantity: updated, inStock: true, isLowStock: updated < 30 });
                          }}
                          className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-bold"
                          title="+20 packs"
                        >
                          +20
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-amber-800">
                      {med.scheme || '-'}
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {med.schedule}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteMedicine(med.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete formulation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Retailer KYC Approvals */}
      {activeAdminTab === 'retailers' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">Retail Chemist Drug Licence & KYC Verification:</span>
            <span className="text-slate-500">Under CDSCO Rules, wholesale supply requires verified Form 20/21 retail licences.</span>
          </div>

          <div className="space-y-4">
            {retailers.map((ret) => (
              <div 
                key={ret.id}
                className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <span>{ret.shopName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ret.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ret.status === 'PENDING_VERIFICATION'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {ret.status}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {ret.shopAddress}, {ret.city}, {ret.district} - {ret.pincode}, {ret.state}
                    </p>
                  </div>

                  {/* Actions for pending status */}
                  {ret.status === 'PENDING_VERIFICATION' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApproveRetailer(ret.id, 50000)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Chemist (Grant ₹50k Credit)</span>
                      </button>
                      <button
                        onClick={() => onRejectRetailer(ret.id)}
                        className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Owner / Chemist:</span>
                    <strong className="text-slate-800">{ret.ownerName}</strong>
                    <span className="block text-slate-500 text-[10px]">Mob: {ret.mobile}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Retail Drug Licence 20 & 21:</span>
                    <strong className="font-mono text-slate-900 block">{ret.dl20B}</strong>
                    <span className="font-mono text-slate-600 text-[10px] block">{ret.dl21B}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">GSTIN / PAN:</span>
                    <strong className="font-mono text-slate-900 block">{ret.gstin}</strong>
                    <span className="font-mono text-slate-600 text-[10px] block">PAN: {ret.pan}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Credit Terms:</span>
                    <strong className="text-indigo-700 block">₹{ret.creditLimit.toLocaleString('en-IN')} ({ret.creditDaysAllowed} Days)</strong>
                    <span className="text-slate-500 text-[10px] block">Utilized: ₹{ret.creditUsed.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Uploaded Documents Verification */}
                <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                  <span className="font-semibold text-slate-700">Uploaded Certificates:</span>
                  {ret.documentsUploaded?.dlCopyName && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-mono">
                      <FileText className="w-3 h-3 text-emerald-600" />
                      <span>{ret.documentsUploaded.dlCopyName}</span>
                    </span>
                  )}
                  {ret.documentsUploaded?.gstCopyName && (
                    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded text-[11px] font-mono">
                      <FileText className="w-3 h-3 text-sky-600" />
                      <span>{ret.documentsUploaded.gstCopyName}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Sales & Licences Summary */}
      {activeAdminTab === 'reports' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 space-y-6 shadow-xs text-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Wholesale Licence Details */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Distributor Wholesale Licences & Registrations</span>
              </h3>

              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Wholesale Licence Form 20B (Allopathic):</span>
                  <strong className="font-mono text-slate-900">{company.dl20B}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Wholesale Licence Form 21B (Biologicals):</span>
                  <strong className="font-mono text-slate-900">{company.dl21B}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Wholesale Licence Form 21C (Homeopathic):</span>
                  <strong className="font-mono text-slate-900">{company.dl21C}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>GSTIN Registration (Odisha):</span>
                  <strong className="font-mono text-slate-900">{company.gstin}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Registered Distributor PAN:</span>
                  <strong className="font-mono text-slate-900">{company.pan}</strong>
                </div>
              </div>
            </div>

            {/* Delivery Routes */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600" />
                <span>Active Wholesale Logistics Routes</span>
              </h3>

              <div className="space-y-2">
                {company.deliveryZones.map((zone, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="font-semibold text-slate-800">{zone}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 text-[10px] px-2 py-0.5 rounded-full">
                      Daily Tempo Route
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Medicine Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-6 border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Add New Formulation to Wholesale Stock</h3>
              <button onClick={() => setShowAddMedModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMedicine} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Calpol 500 Tablets"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Salt / Molecule Composition *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol IP 500 mg"
                    value={newMedSalt}
                    onChange={(e) => setNewMedSalt(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manufacturer Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GSK"
                    value={newMedCompany}
                    onChange={(e) => setNewMedCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pack Size *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15 Tablets / Strip (Pack of 20)"
                    value={newMedPack}
                    onChange={(e) => setNewMedPack(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newMedMrp}
                    onChange={(e) => setNewMedMrp(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wholesale PTR (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newMedPtr}
                    onChange={(e) => setNewMedPtr(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={newMedBatch}
                    onChange={(e) => setNewMedBatch(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date (MM/YYYY) *</label>
                  <input
                    type="text"
                    required
                    value={newMedExpiry}
                    onChange={(e) => setNewMedExpiry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Stock (Packs) *</label>
                  <input
                    type="number"
                    required
                    value={newMedStock}
                    onChange={(e) => setNewMedStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wholesale Scheme</label>
                  <input
                    type="text"
                    placeholder="e.g. 10+1 Free"
                    value={newMedScheme}
                    onChange={(e) => setNewMedScheme(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Schedule</label>
                  <select
                    value={newMedSchedule}
                    onChange={(e) => setNewMedSchedule(e.target.value as DrugSchedule)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Schedule H">Schedule H (Rx)</option>
                    <option value="Schedule H1">Schedule H1 (High Alert)</option>
                    <option value="OTC">OTC</option>
                    <option value="Schedule X">Schedule X</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST Rate %</label>
                  <select
                    value={newMedGst}
                    onChange={(e) => setNewMedGst(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="5">5% (Life-saving / Injections)</option>
                    <option value="12">12% (Standard Formulations)</option>
                    <option value="18">18% (Surgicals & Gloves)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Wholesale Inventory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
