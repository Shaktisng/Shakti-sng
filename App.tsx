/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { 
  COMPANY_INFO, 
  INITIAL_MEDICINES, 
  INITIAL_ORDERS, 
  INITIAL_RETAILERS 
} from './data/initialData';
import { 
  Medicine, 
  WholesaleOrder, 
  RetailerProfile, 
  CartItem, 
  MedicineCategory, 
  OrderStatus, 
  PaymentStatus 
} from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MedicineCatalogue } from './components/MedicineCatalogue';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InvoiceModal } from './components/InvoiceModal';
import { OrdersView } from './components/OrdersView';
import { RetailerAuthModal } from './components/RetailerAuthModal';
import { AdminPanel } from './components/AdminPanel';
import { ComplianceView } from './components/ComplianceView';
import { SchemesView } from './components/SchemesView';
import { 
  MessageSquare, 
  PhoneCall, 
  ShieldCheck, 
  ShoppingBag, 
  Check, 
  ArrowUp,
  Building,
  HeartHandshake
} from 'lucide-react';

const CATEGORIES: MedicineCategory[] = [
  'Allopathic Rx',
  'Antibiotics & Anti-Infectives',
  'Cardiac & Diabetic',
  'Gastro & Pain Relief',
  'Generic Medicines',
  'Surgicals & Disposables',
  'OTC & Wellness',
  'Critical Care & Injections'
];

export const App: React.FC = () => {
  // Master Data State
  const [company, setCompany] = useState(COMPANY_INFO);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [orders, setOrders] = useState<WholesaleOrder[]>(INITIAL_ORDERS);
  const [retailers, setRetailers] = useState<RetailerProfile[]>(INITIAL_RETAILERS);
  
  // Current active logged in chemist (defaults to Maa Tarini Chemist for instant exploration)
  const [currentRetailer, setCurrentRetailer] = useState<RetailerProfile | null>(INITIAL_RETAILERS[0]);
  
  // Navigation & View state
  const [activeView, setActiveView] = useState<'catalogue' | 'orders' | 'schemes' | 'admin' | 'compliance'>('catalogue');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<WholesaleOrder | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart Quantities map for catalogue display
  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    cart.forEach(item => {
      map[item.medicine.id] = item.quantity;
    });
    return map;
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.itemTotal, 0);
  }, [cart]);

  // Cart Operations
  const handleAddToCart = (medicine: Medicine, quantity: number) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.medicine.id === medicine.id);
      
      // Calculate scheme bonus goods
      let freeUnits = 0;
      if (medicine.schemeBonusEvery && medicine.schemeBonusUnits) {
        freeUnits = Math.floor(quantity / medicine.schemeBonusEvery) * medicine.schemeBonusUnits;
      }

      const itemTotal = quantity * medicine.ptr;
      const gstAmount = itemTotal * (medicine.gstRate / 100);

      const newItem: CartItem = {
        medicine,
        quantity,
        freeUnits,
        itemTotal,
        gstAmount
      };

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newItem;
        return updated;
      } else {
        return [...prev, newItem];
      }
    });

    showToast(`Added ${quantity} packs of ${medicine.name} to wholesale cart`);
  };

  const handleUpdateCartQuantity = (medicineId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(medicineId);
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.medicine.id === medicineId) {
        let freeUnits = 0;
        if (item.medicine.schemeBonusEvery && item.medicine.schemeBonusUnits) {
          freeUnits = Math.floor(newQty / item.medicine.schemeBonusEvery) * item.medicine.schemeBonusUnits;
        }
        const itemTotal = newQty * item.medicine.ptr;
        const gstAmount = itemTotal * (item.medicine.gstRate / 100);
        return {
          ...item,
          quantity: newQty,
          freeUnits,
          itemTotal,
          gstAmount
        };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (medicineId: string) => {
    setCart(prev => prev.filter(item => item.medicine.id !== medicineId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Place Order Success
  const handleOrderSuccess = (newOrder: WholesaleOrder) => {
    // 1. Add order to list
    setOrders(prev => [newOrder, ...prev]);

    // 2. Reduce stock from medicines
    setMedicines(prev => prev.map(med => {
      const orderedItem = newOrder.items.find(i => i.medicine.id === med.id);
      if (orderedItem) {
        const totalPacksDeducted = orderedItem.quantity + orderedItem.freeUnits;
        const remaining = Math.max(0, med.stockQuantity - totalPacksDeducted);
        return {
          ...med,
          stockQuantity: remaining,
          inStock: remaining > 0,
          isLowStock: remaining < 25
        };
      }
      return med;
    }));

    // 3. Update retailer credit if credit was used
    if (newOrder.paymentMethod === 'CREDIT' && currentRetailer) {
      setRetailers(prev => prev.map(r => {
        if (r.id === currentRetailer.id) {
          return {
            ...r,
            creditUsed: r.creditUsed + newOrder.totalAmount
          };
        }
        return r;
      }));
    }

    // 4. Clear cart & close modal
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);

    // 5. Open invoice modal immediately for printing
    setActiveInvoiceOrder(newOrder);
    showToast(`Order ${newOrder.orderNumber} placed successfully!`);
  };

  // Re-Order Handler (copies items from an order to cart)
  const handleReorder = (order: WholesaleOrder) => {
    order.items.forEach(item => {
      handleAddToCart(item.medicine, item.quantity);
    });
    setIsCartOpen(true);
    showToast(`Re-ordered ${order.items.length} formulations from ${order.orderNumber}`);
  };

  // Admin Actions
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
    showToast(`Order status updated to ${status}`);
  };

  const handleUpdatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: status } : o));
    showToast(`Payment status updated to ${status}`);
  };

  const handleAssignLogistics = (orderId: string, driverName: string, driverPhone: string, vehicleNo: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: 'DISPATCHED',
          trackingInfo: {
            ...o.trackingInfo,
            driverName,
            driverPhone,
            vehicleNo,
            dispatchedAt: new Date().toLocaleTimeString(),
          }
        };
      }
      return o;
    }));
    showToast(`Assigned dispatch van to order`);
  };

  const handleAddMedicine = (newMed: Medicine) => {
    setMedicines(prev => [newMed, ...prev]);
    showToast(`Added ${newMed.name} to wholesale inventory`);
  };

  const handleUpdateMedicine = (med: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === med.id ? med : m));
    showToast(`Stock updated for ${med.name}`);
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
    showToast(`Formulation removed from inventory`);
  };

  const handleApproveRetailer = (id: string, creditLimit: number) => {
    setRetailers(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'APPROVED',
          creditLimit
        };
      }
      return r;
    }));
    showToast(`Retailer Drug Licence verified & Approved!`);
  };

  const handleRejectRetailer = (id: string) => {
    setRetailers(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    showToast(`Retailer application rejected`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-bounce border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        company={company}
        currentRetailer={currentRetailer}
        cartCount={cartCount}
        cartTotal={cartTotal}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />

      {/* Chemist Status Bar (Notice if viewing as Chemist) */}
      {!isAdminMode && currentRetailer && (
        <div className="bg-emerald-50/80 border-b border-emerald-200/80 px-4 py-2 text-xs text-emerald-950 no-print">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold flex items-center gap-1 text-emerald-800">
                <Building className="w-3.5 h-3.5" />
                <span>Ordering as:</span>
              </span>
              <strong className="text-slate-900">{currentRetailer.shopName}</strong>
              <span className="text-slate-500 font-mono text-[11px]">
                (DL 20B: {currentRetailer.dl20B} &bull; GSTIN: {currentRetailer.gstin})
              </span>
              <span className="bg-emerald-200/70 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {currentRetailer.status}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-slate-600">
                Available Credit: <strong className="text-indigo-800">₹{(currentRetailer.creditLimit - currentRetailer.creditUsed).toLocaleString('en-IN')}</strong> ({currentRetailer.creditDaysAllowed}d)
              </span>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
              >
                Switch Medical Store
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Main View Rendering */}
      <main className="flex-1">
        {isAdminMode ? (
          <AdminPanel
            medicines={medicines}
            orders={orders}
            retailers={retailers}
            company={company}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            onAssignLogistics={handleAssignLogistics}
            onAddMedicine={handleAddMedicine}
            onUpdateMedicine={handleUpdateMedicine}
            onDeleteMedicine={handleDeleteMedicine}
            onApproveRetailer={handleApproveRetailer}
            onRejectRetailer={handleRejectRetailer}
            onViewInvoice={(ord) => setActiveInvoiceOrder(ord)}
          />
        ) : (
          <>
            {activeView === 'catalogue' && (
              <>
                <HeroBanner
                  company={company}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categories={CATEGORIES}
                  totalMedicinesCount={medicines.length}
                  onExploreSchemes={() => setActiveView('schemes')}
                />
                <MedicineCatalogue
                  medicines={medicines}
                  onAddToCart={handleAddToCart}
                  cartQuantities={cartQuantities}
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                />
              </>
            )}

            {activeView === 'schemes' && (
              <SchemesView
                medicines={medicines}
                onAddToCart={(med, qty) => {
                  handleAddToCart(med, qty);
                  setIsCartOpen(true);
                }}
                onExploreAll={() => setActiveView('catalogue')}
              />
            )}

            {activeView === 'orders' && (
              <OrdersView
                orders={orders}
                onViewInvoice={(ord) => setActiveInvoiceOrder(ord)}
                onReorder={handleReorder}
                onExploreCatalogue={() => setActiveView('catalogue')}
              />
            )}

            {activeView === 'compliance' && (
              <ComplianceView
                company={company}
                onOpenRegister={() => setIsAuthModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        currentRetailer={currentRetailer}
        company={company}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Checkout Modal */}
      {currentRetailer && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          currentRetailer={currentRetailer}
          company={company}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* GST Tax Invoice & Delivery Challan Modal */}
      <InvoiceModal
        order={activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
        company={company}
      />

      {/* Chemist Auth & Drug Licence Registration Modal */}
      <RetailerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentRetailer={currentRetailer}
        availableRetailers={retailers}
        onSelectRetailer={(ret) => {
          setCurrentRetailer(ret);
          showToast(`Logged in as ${ret.shopName}`);
        }}
        onRegisterRetailer={(newRet) => {
          setRetailers(prev => [newRet, ...prev]);
          setCurrentRetailer(newRet);
          showToast(`Medical Store registered & submitted for verification`);
        }}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <div className="fixed bottom-6 left-6 z-40 no-print">
        <a
          href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Shakti%20Pharma%2C%20I%20am%20a%20licensed%20chemist%20and%20want%20to%20place%20a%20wholesale%20medicine%20order.`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-xl flex items-center gap-2 group transition-transform hover:scale-105"
          title="Direct WhatsApp Order Assistance"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold whitespace-nowrap pr-1">
            WhatsApp Order: {company.whatsapp}
          </span>
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 sm:px-6 mt-16 border-t border-slate-800 no-print text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                Rx
              </div>
              <h3 className="font-bold text-white text-base">{company.name}</h3>
            </div>
            <p className="text-slate-400 leading-relaxed mb-3">
              Authorized wholesale distributor of pharmaceutical formulations, biologicals, and medical surgicals for licensed chemists in Sundargarh and Western Odisha.
            </p>
            <div className="text-[11px] text-emerald-400 font-mono">
              DL 20B: {company.dl20B} &bull; DL 21B: {company.dl21B}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Delivery Routes & Logistics</h4>
            <ul className="space-y-1.5 text-slate-400">
              {company.deliveryZones.map((z, idx) => (
                <li key={idx}>&bull; {z}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Drug Authority Compliance</h4>
            <p className="text-slate-400 leading-relaxed mb-2">
              All supplies comply with the Drugs and Cosmetics Act, 1940 & CDSCO norms. Sale is strictly against verified retail licences and official GST invoices.
            </p>
            <div className="text-[11px] text-slate-300">
              GSTIN: <strong className="font-mono text-white">{company.gstin}</strong>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Distributor Warehouse</h4>
            <address className="not-italic text-slate-400 space-y-1">
              <div>{company.address}</div>
              <div>{company.city}, {company.district}</div>
              <div>{company.state} - {company.pincode}</div>
              <div className="pt-2 text-white font-semibold">Phone: {company.phone}</div>
              <div>WhatsApp: <a href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Shakti%20Pharma%2C%20I%20want%20to%20inquire%20about%20wholesale%20medicines.`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-medium">{company.whatsapp}</a></div>
              <div>Email: {company.email}</div>
            </address>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {company.name}. All Rights Reserved. Form 20B/21B Wholesale Licensee.
          </div>
          <div className="flex gap-4">
            <button onClick={() => { setActiveView('compliance'); setIsAdminMode(false); }} className="hover:text-slate-300">
              CDSCO & Drug Rules
            </button>
            <button onClick={() => { setActiveView('schemes'); setIsAdminMode(false); }} className="hover:text-slate-300">
              Wholesale Schemes
            </button>
            <button onClick={() => { setIsAdminMode(true); setActiveView('admin'); }} className="hover:text-emerald-400 font-semibold">
              Admin Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
