import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  FileCheck, 
  Upload, 
  ShieldCheck, 
  CheckCircle, 
  User, 
  Phone, 
  MapPin, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { RetailerProfile } from '../types';

interface RetailerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRetailer: RetailerProfile | null;
  availableRetailers: RetailerProfile[];
  onSelectRetailer: (retailer: RetailerProfile) => void;
  onRegisterRetailer: (newRetailer: RetailerProfile) => void;
}

export const RetailerAuthModal: React.FC<RetailerAuthModalProps> = ({
  isOpen,
  onClose,
  currentRetailer,
  availableRetailers,
  onSelectRetailer,
  onRegisterRetailer,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'LOGIN_DEMO' | 'REGISTER'>('LOGIN_DEMO');

  // Registration Form State
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [pharmacistName, setPharmacistName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [city, setCity] = useState('Sundargarh');
  const [district, setDistrict] = useState('Sundargarh');
  const [state, setState] = useState('Odisha');
  const [pincode, setPincode] = useState('770001');
  const [dl20B, setDl20B] = useState('');
  const [dl21B, setDl21B] = useState('');
  const [dlValidTill, setDlValidTill] = useState('31/12/2028');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [uploadedDlName, setUploadedDlName] = useState('');
  const [uploadedGstName, setUploadedGstName] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSimulateUpload = (type: 'dl' | 'gst') => {
    if (type === 'dl') {
      setUploadedDlName(`${shopName.replace(/\s+/g, '_') || 'Chemist'}_Form20_21_DrugLicence.pdf`);
    } else {
      setUploadedGstName(`${shopName.replace(/\s+/g, '_') || 'Chemist'}_GST_Certificate_REG06.pdf`);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shopName || !ownerName || !mobile || !dl20B) {
      alert('Please fill in mandatory fields (Shop Name, Owner Name, Mobile, and Drug Licence Number).');
      return;
    }

    const newProfile: RetailerProfile = {
      id: `ret-${Date.now()}`,
      shopName,
      ownerName,
      registeredPharmacistName: pharmacistName || `${ownerName} (Registered Pharmacist)`,
      mobile,
      email: email || `${shopName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      shopAddress,
      city,
      district,
      state,
      pincode,
      dl20B: dl20B.toUpperCase(),
      dl21B: dl21B ? dl21B.toUpperCase() : dl20B.toUpperCase().replace('20', '21'),
      dlValidTill,
      gstin: gstin ? gstin.toUpperCase() : `21${pan ? pan.toUpperCase() : 'AAAAA0000A'}1Z5`,
      pan: pan ? pan.toUpperCase() : 'ABCDE1234F',
      status: 'PENDING_VERIFICATION', // Admin verification required
      creditLimit: 50000,
      creditUsed: 0,
      creditDaysAllowed: 7,
      documentsUploaded: {
        dlCopyName: uploadedDlName || 'Drug_Licence_Scanned_Copy.pdf',
        gstCopyName: uploadedGstName || 'GST_Registration_Certificate.pdf',
      },
      registeredAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    onRegisterRetailer(newProfile);
    setRegisteredSuccess(true);
    setTimeout(() => {
      setRegisteredSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Chemist Portal: Login / Registration</h2>
              <p className="text-xs text-slate-300">
                Verified B2B access for retail medical stores & chemists holding Drug Licences
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('LOGIN_DEMO')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'LOGIN_DEMO'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Switch / Select Registered Chemist Account
          </button>
          <button
            onClick={() => setActiveTab('REGISTER')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'REGISTER'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Register New Medical Store (Form 20/21)
          </button>
        </div>

        {/* Tab 1: Select Demo Account */}
        {activeTab === 'LOGIN_DEMO' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
              <p className="font-bold flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pre-Configured Medical Stores</span>
              </p>
              <p className="text-emerald-800 text-[11px]">
                Click on any verified chemist below to simulate ordering as that store, or register a new store using the tab above.
              </p>
            </div>

            <div className="space-y-3">
              {availableRetailers.map((ret) => {
                const isSelected = currentRetailer?.id === ret.id;

                return (
                  <div
                    key={ret.id}
                    onClick={() => {
                      onSelectRetailer(ret);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span>{ret.shopName}</span>
                          {ret.status === 'APPROVED' ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                              Verified DL
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                              Pending Review
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {ret.shopAddress}, {ret.city}, {ret.district} - {ret.pincode}
                        </p>
                      </div>

                      {isSelected && (
                        <span className="bg-emerald-600 text-white p-1 rounded-full text-xs">
                          <CheckCircle className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Owner / Chemist:</span>
                        <strong className="text-slate-800">{ret.ownerName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">DL Form 20B:</span>
                        <span className="font-mono font-medium text-slate-800">{ret.dl20B}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">GSTIN:</span>
                        <span className="font-mono font-medium text-slate-800">{ret.gstin}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Credit Terms:</span>
                        <span className="font-bold text-indigo-700">₹{ret.creditLimit.toLocaleString('en-IN')} ({ret.creditDaysAllowed}d)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Register New Chemist */}
        {activeTab === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {registeredSuccess && (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <span>Medical Store Registered Successfully! Submitted to Admin for KYC approval.</span>
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
              <span className="font-bold text-slate-800 block mb-0.5">Mandatory Compliance Notice:</span>
              Wholesale medicine supply in India is restricted to licensed retailers under the Drugs and Cosmetics Act, 1940. Valid retail Drug Licence Form 20 & 21 is mandatory.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medical Shop / Chemist Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shree Ram Medical Hall"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Owner / Proprietor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Mishra"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Registered Pharmacist Name & Reg No.</label>
                <input
                  type="text"
                  placeholder="e.g. Anil Kumar Nayak (Reg: OR-PH-8102)"
                  value={pharmacistName}
                  onChange={(e) => setPharmacistName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number (for WhatsApp POs) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98610 12345"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Complete Shop Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shop No 4, Daily Market, Near Bus Stand"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City / Town *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District / Pincode *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-2/3 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Drug Licences */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Retail Drug Licence Form 20 / 20B *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OD-SUN-20-992144"
                  value={dl20B}
                  onChange={(e) => setDl20B(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Retail Drug Licence Form 21 / 21B</label>
                <input
                  type="text"
                  placeholder="e.g. OD-SUN-21-992145"
                  value={dl21B}
                  onChange={(e) => setDl21B(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">GST Number (GSTIN - 15 digits)</label>
                <input
                  type="text"
                  placeholder="e.g. 21ABCDE1234F1Z8"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PAN Number</label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono uppercase"
                />
              </div>
            </div>

            {/* Document Upload Simulation */}
            <div className="pt-2 border-t border-slate-200">
              <span className="block font-bold text-xs text-slate-800 mb-2">
                Upload Scanned Drug Licence & GST Certificate (PDF/JPG):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:bg-slate-50 transition-colors">
                  <FileCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <span className="font-semibold block text-slate-700">Form 20/21 Drug Licence</span>
                  {uploadedDlName ? (
                    <span className="text-[11px] text-emerald-700 font-mono block mt-1 font-bold">
                      ✓ {uploadedDlName}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload('dl')}
                      className="mt-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-bold"
                    >
                      + Attach Licence Document
                    </button>
                  )}
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:bg-slate-50 transition-colors">
                  <Upload className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                  <span className="font-semibold block text-slate-700">GST Registration Copy</span>
                  {uploadedGstName ? (
                    <span className="text-[11px] text-sky-700 font-mono block mt-1 font-bold">
                      ✓ {uploadedGstName}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload('gst')}
                      className="mt-1 text-[11px] text-sky-700 hover:text-sky-800 font-bold"
                    >
                      + Attach GST Document
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Submit Chemist Registration for Wholesale Approval</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
