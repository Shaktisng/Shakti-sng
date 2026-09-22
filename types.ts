export type MedicineCategory = 
  | 'Allopathic Rx'
  | 'Antibiotics & Anti-Infectives'
  | 'Cardiac & Diabetic'
  | 'Gastro & Pain Relief'
  | 'Generic Medicines'
  | 'Surgicals & Disposables'
  | 'OTC & Wellness'
  | 'Critical Care & Injections';

export type DrugSchedule = 'Schedule H' | 'Schedule H1' | 'Schedule X' | 'Schedule G' | 'OTC';

export interface Medicine {
  id: string;
  name: string;
  saltComposition: string;
  company: string;
  category: MedicineCategory;
  packSize: string; // e.g., "10 x 10 Tablets", "100ml Bottle", "Box of 10 Vials"
  unitsPerPack: number;
  mrp: number; // Maximum Retail Price
  ptr: number; // Price to Retailer (wholesale buying price)
  pts: number; // Price to Stockist (cost)
  stockQuantity: number; // Available packs in warehouse
  minOrderQty: number; // Minimum order quantity
  batchNumber: string;
  expiryDate: string; // MM/YYYY
  schedule: DrugSchedule;
  hsnCode: string; // e.g. "30049099"
  gstRate: number; // 5, 12, or 18%
  scheme?: string; // e.g., "10+1 Free", "20+2 Free", "Flat 5% Extra"
  schemeBonusEvery?: number; // e.g. 10 -> get 1 free
  schemeBonusUnits?: number; // e.g. 1
  inStock: boolean;
  isLowStock?: boolean;
  nearExpiry?: boolean;
}

export type RetailerStatus = 'APPROVED' | 'PENDING_VERIFICATION' | 'REJECTED';

export interface RetailerProfile {
  id: string;
  shopName: string;
  ownerName: string;
  registeredPharmacistName?: string;
  mobile: string;
  email: string;
  shopAddress: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  dl20B: string; // Form 20B (Allopathic retail licence)
  dl21B: string; // Form 21B (Biologicals/Special products)
  dlValidTill: string;
  gstin: string; // 15-digit GST Number
  pan: string;
  status: RetailerStatus;
  creditLimit: number;
  creditUsed: number;
  creditDaysAllowed: number; // 7, 15, or 30 days
  documentsUploaded: {
    dlCopyName?: string;
    gstCopyName?: string;
    pharmacistCertificate?: string;
  };
  registeredAt: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number; // packs ordered
  freeUnits: number; // calculated from scheme
  itemTotal: number; // qty * ptr
  gstAmount: number;
}

export type PaymentMethod = 'UPI' | 'NEFT' | 'CREDIT' | 'COD';
export type PaymentStatus = 'PAID' | 'PENDING' | 'CREDIT_APPROVED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PACKED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';

export interface WholesaleOrder {
  id: string;
  orderNumber: string; // e.g. "SPW-2026-0842"
  orderDate: string;
  retailer: RetailerProfile;
  items: CartItem[];
  subtotal: number; // PTR * Qty
  schemeFreeUnitsTotal: number;
  schemeSavingsValue: number;
  cashDiscountApplied: boolean;
  cashDiscountAmount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string; // UTR or Cheque no
  orderStatus: OrderStatus;
  poNumber?: string; // Retailer Purchase Order No
  notes?: string;
  deliveryAddress: string;
  trackingInfo: {
    dispatchedAt?: string;
    deliveredAt?: string;
    driverName?: string;
    driverPhone?: string;
    vehicleNo?: string;
    route?: string;
    estimatedDelivery?: string;
  };
}

export interface WholesaleCompanyInfo {
  name: string;
  tagline: string;
  dl20B: string;
  dl21B: string;
  dl21C: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  bankDetails: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    upiId: string;
  };
  deliveryZones: string[];
  minOrderFreeDelivery: number;
  defaultDeliveryFee: number;
  cashDiscountPercent: number;
}
