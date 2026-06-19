"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Users, ShoppingCart, Package, Search, Plus, Trash2, ArrowLeft, 
  MapPin, CreditCard, Receipt, FileText, ChevronRight, Check, Sparkles, Box
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../../components/Header";
import { Toast } from "../../../components/Toast";
import { 
  searchDealersAction, 
  searchB2BProductsAction, 
  getB2BDiscountTiersAction, 
  createB2BOrderAction,
  getDealerLastOrdersAction,
  AddressInput
} from "../actions";

interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  sku: string;
  color?: string | null;
  sizeLength?: string | null;
  unitPrice: number;
  quantity: number;
  taxRate: number;
  b2bAvailableStock: number;
  priceObj?: any;
}

export default function NewOrderPage() {
  const router = useRouter();

  // State Management
  const [dealerQuery, setDealerQuery] = useState("");
  const [dealers, setDealers] = useState<any[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<any | null>(null);
  const [isDealerSearching, setIsDealerSearching] = useState(false);
  const [showDealerDropdown, setShowDealerDropdown] = useState(false);

  const [productQuery, setProductQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isProductSearching, setIsProductSearching] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountTiers, setDiscountTiers] = useState<any[]>([]);

  // Address State
  const [billingAddressId, setBillingAddressId] = useState("");
  const [shippingAddressId, setShippingAddressId] = useState("");
  
  const [newBillingAddress, setNewBillingAddress] = useState<AddressInput>({
    title: "Yeni Fatura Adresi",
    fullName: "",
    phone: "",
    city: "",
    district: "",
    addressLine: "",
    zipCode: ""
  });

  const [newShippingAddress, setNewShippingAddress] = useState<AddressInput>({
    title: "Yeni Teslimat Adresi",
    fullName: "",
    phone: "",
    city: "",
    district: "",
    addressLine: "",
    zipCode: ""
  });

  const [showNewBillingForm, setShowNewBillingForm] = useState(false);
  const [showNewShippingForm, setShowNewShippingForm] = useState(false);

  // Order Details State
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFER" | "CARI_HESAP">("TRANSFER");
  const [orderStatus, setOrderStatus] = useState<"PENDING" | "PAID">("PENDING");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [lastOrders, setLastOrders] = useState<any[]>([]);

  const dealerRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  // Load Discount Tiers on mount
  useEffect(() => {
    getB2BDiscountTiersAction().then((tiers) => {
      setDiscountTiers(tiers);
    });
  }, []);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dealerRef.current && !dealerRef.current.contains(event.target as Node)) {
        setShowDealerDropdown(false);
      }
      if (productRef.current && !productRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Dealers
  useEffect(() => {
    if (dealerQuery.length < 2) {
      setDealers([]);
      setShowDealerDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsDealerSearching(true);
      try {
        const res = await searchDealersAction(dealerQuery);
        setDealers(res);
        setShowDealerDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDealerSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [dealerQuery]);

  // Search Products
  useEffect(() => {
    if (productQuery.length < 2) {
      setProducts([]);
      setShowProductDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsProductSearching(true);
      try {
        const res = await searchB2BProductsAction(productQuery);
        setProducts(res);
        setShowProductDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProductSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [productQuery]);

  // Update Cart prices when selected dealer changes (and price list changes)
  useEffect(() => {
    if (!selectedDealer) {
      setCart([]);
      setBillingAddressId("");
      setShippingAddressId("");
      setLastOrders([]);
      return;
    }

    // Set default addresses from dealer's profile
    const defaultBilling = selectedDealer.addresses.find((a: any) => a.type === "BILLING" && a.isDefault);
    const defaultShipping = selectedDealer.addresses.find((a: any) => a.type === "SHIPPING" && a.isDefault);
    
    const firstBilling = selectedDealer.addresses.find((a: any) => a.type === "BILLING");
    const firstShipping = selectedDealer.addresses.find((a: any) => a.type === "SHIPPING");

    setBillingAddressId(defaultBilling?.id || firstBilling?.id || "new");
    setShippingAddressId(defaultShipping?.id || firstShipping?.id || "new");

    setShowNewBillingForm(selectedDealer.addresses.filter((a: any) => a.type === "BILLING").length === 0);
    setShowNewShippingForm(selectedDealer.addresses.filter((a: any) => a.type === "SHIPPING").length === 0);

    // Load dealer's last 10 orders
    getDealerLastOrdersAction(selectedDealer.id)
      .then((orders) => setLastOrders(orders))
      .catch((err) => console.error(err));
  }, [selectedDealer]);

  // Helper to extract dealer price
  const getVariantPriceForDealer = (priceObj: any) => {
    if (!priceObj) return 0;
    const list = selectedDealer?.b2bProfile?.priceList || "LIST_A";
    switch (list) {
      case "LIST_A": return Number(priceObj.listA);
      case "LIST_B": return Number(priceObj.listB);
      case "LIST_C": return Number(priceObj.listC);
      case "LIST_D": return Number(priceObj.listD);
      default: return Number(priceObj.listA);
    }
  };

  // Helper to render side-by-side pricing lists for comparison
  const renderPriceComparison = (priceObj: any) => {
    if (!priceObj) return null;
    const currentList = selectedDealer?.b2bProfile?.priceList || "LIST_A";
    const tiers = [
      { key: "RETAIL", label: "Perakende", val: Number(priceObj.retailPrice) },
      { key: "LIST_A", label: "A", val: Number(priceObj.listA) },
      { key: "LIST_B", label: "B", val: Number(priceObj.listB) },
      { key: "LIST_C", label: "C", val: Number(priceObj.listC) },
      { key: "LIST_D", label: "D", val: Number(priceObj.listD) }
    ];

    return (
      <div className="flex flex-wrap gap-1 mt-1.5">
        {tiers.map((t) => {
          const isActive = currentList === t.key || (t.key === "RETAIL" && !selectedDealer);
          return (
            <div
              key={t.key}
              className={`inline-flex items-center px-1.5 py-0.5 rounded-[6px] text-[9px] font-black uppercase tracking-wider border transition-all ${
                isActive
                  ? "bg-orange-500 text-white border-orange-500 font-extrabold shadow-sm shadow-orange-500/10"
                  : "bg-gray-50 text-slate-400 border-gray-100"
              }`}
              title={`${t.label} Fiyat Grubu`}
            >
              {t.label}: {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(t.val)}
            </div>
          );
        })}
      </div>
    );
  };

  // Add Item to Cart
  const handleAddVariantToCart = (product: any, variant: any) => {
    if (!selectedDealer) {
      setToast({ type: "error", message: "Lütfen önce bir bayi seçin." });
      return;
    }

    const exists = cart.find(item => item.variantId === variant.id);
    if (exists) {
      if (exists.quantity >= variant.b2bAvailableStock) {
        setToast({ type: "error", message: `Yetersiz stok. Satılabilir maksimum stok: ${variant.b2bAvailableStock}` });
        return;
      }
      setCart(cart.map(item => 
        item.variantId === variant.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (variant.b2bAvailableStock <= 0) {
        setToast({ type: "error", message: "Bu ürünün satılabilir B2B stoku tükenmiştir." });
        return;
      }

      const unitPrice = getVariantPriceForDealer(variant.price);
      const taxRate = variant.price ? Number(variant.price.taxRate) : 20.00;

      const newItem: CartItem = {
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        sku: variant.sku,
        color: variant.color,
        sizeLength: variant.sizeLength,
        unitPrice,
        quantity: variant.price ? Math.max(1, variant.price.minB2BOrderQty) : 1,
        taxRate,
        b2bAvailableStock: variant.b2bAvailableStock,
        priceObj: variant.price
      };

      setCart([...cart, newItem]);
    }

    setProductQuery("");
    setShowProductDropdown(false);
    setToast({ type: "success", message: `${product.name} sepete eklendi.` });
  };

  // Remove Item
  const handleRemoveItem = (variantId: string) => {
    setCart(cart.filter(item => item.variantId !== variantId));
  };

  // Update Qty
  const handleUpdateQuantity = (variantId: string, qty: number) => {
    const item = cart.find(i => i.variantId === variantId);
    if (!item) return;

    if (qty > item.b2bAvailableStock) {
      setToast({ type: "error", message: `En fazla ${item.b2bAvailableStock} adet sipariş edebilirsiniz.` });
      return;
    }

    if (qty < 1) return;

    setCart(cart.map(i => i.variantId === variantId ? { ...i, quantity: qty } : i));
  };

  // Calculations
  const rawSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  // Dynamic B2B Discount Tier logic
  const activeDiscountTier = [...discountTiers]
    .sort((a, b) => b.minAmount - a.minAmount)
    .find(tier => rawSubtotal >= Number(tier.minAmount));

  const discountPercent = activeDiscountTier ? Number(activeDiscountTier.discountPercent) : 0;
  const discountAmount = rawSubtotal * (discountPercent / 100);
  const netSubtotal = rawSubtotal - discountAmount;

  // Calculate tax on net subtotal
  const taxAmount = cart.reduce((sum, item) => {
    // Proportional tax based on item subtotal portion
    const itemSubtotal = item.unitPrice * item.quantity;
    const itemDiscount = itemSubtotal * (discountPercent / 100);
    const itemNetSubtotal = itemSubtotal - itemDiscount;
    return sum + (itemNetSubtotal * (item.taxRate / 100));
  }, 0);

  const totalAmount = netSubtotal + taxAmount;

  // Handle Order submit
  const handleSubmitOrder = async () => {
    if (!selectedDealer) {
      setToast({ type: "error", message: "Lütfen bir bayi seçin." });
      return;
    }
    if (cart.length === 0) {
      setToast({ type: "error", message: "Sepetiniz boş. Lütfen en az bir ürün ekleyin." });
      return;
    }

    if (billingAddressId === "new") {
      if (!newBillingAddress.fullName || !newBillingAddress.phone || !newBillingAddress.city || !newBillingAddress.district || !newBillingAddress.addressLine) {
        setToast({ type: "error", message: "Lütfen yeni fatura adresi bilgilerini eksiksiz doldurun." });
        return;
      }
    }

    if (shippingAddressId === "new") {
      if (!newShippingAddress.fullName || !newShippingAddress.phone || !newShippingAddress.city || !newShippingAddress.district || !newShippingAddress.addressLine) {
        setToast({ type: "error", message: "Lütfen yeni teslimat adresi bilgilerini eksiksiz doldurun." });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        userId: selectedDealer.id,
        status: orderStatus,
        subtotal: netSubtotal,
        discountAmount,
        discountTier: activeDiscountTier ? activeDiscountTier.label : undefined,
        totalAmount,
        billingAddressId,
        shippingAddressId,
        newBillingAddress: billingAddressId === "new" ? newBillingAddress : undefined,
        newShippingAddress: shippingAddressId === "new" ? newShippingAddress : undefined,
        notes,
        items: cart.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
          taxAmount: (item.unitPrice * item.quantity * (1 - discountPercent / 100)) * (item.taxRate / 100)
        })),
        payment: {
          method: paymentMethod,
          amount: totalAmount,
          status: orderStatus === "PAID" ? "APPROVED" : "PENDING"
        }
      };

      const res = await createB2BOrderAction(orderPayload);
      if (res.success) {
        setToast({ type: "success", message: "Bayi siparişi başarıyla oluşturuldu!" });
        setTimeout(() => {
          router.push("/orders");
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setToast({ type: "error", message: err.message || "Sipariş oluşturulurken bir hata oluştu." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/orders" className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <h1 className="text-xl font-black tracking-tight">ToptanBox Manuel Sipariş Girişi</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-orange-100 flex items-center gap-1">
            <Box className="w-3 h-3" /> ToptanBox B2B
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 bg-[var(--color-admin-bg)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
          
          {/* LEFT AREA: Form Fields */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* STEP 1: Dealer (Bayi) Selection */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">Bayi Seçimi</h2>
                  <p className="text-xs text-gray-400">Siparişin kaydedileceği B2B bayisini arayın ve seçin.</p>
                </div>
              </div>

              {/* Dealer Search Field */}
              <div ref={dealerRef} className="relative">
                {!selectedDealer ? (
                  <div className="relative">
                    <Search className="absolute left-5 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Bayi adı, firma adı veya e-posta adresi yazın..."
                      className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-5 py-3.5 text-sm transition-all focus:bg-white focus:border-orange-500 focus:shadow-xl focus:shadow-orange-500/5 outline-none placeholder:text-gray-400 font-medium"
                      value={dealerQuery}
                      onChange={(e) => setDealerQuery(e.target.value)}
                    />
                    {isDealerSearching && (
                      <div className="absolute right-5 top-4 text-xs font-bold text-orange-500 animate-pulse">
                        Aranıyor...
                      </div>
                    )}

                    {/* Autocomplete Dropdown */}
                    <AnimatePresence>
                      {showDealerDropdown && dealers.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-3xl border border-gray-100 shadow-2xl z-20 max-h-72 overflow-y-auto divide-y divide-gray-50 p-2"
                        >
                          {dealers.map((dealer) => (
                            <button
                              key={dealer.id}
                              className="w-full text-left px-5 py-3 hover:bg-orange-50/50 rounded-2xl flex items-center justify-between transition-colors group"
                              onClick={() => {
                                setSelectedDealer(dealer);
                                setDealerQuery("");
                                setShowDealerDropdown(false);
                              }}
                            >
                              <div>
                                <p className="font-bold text-sm text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">
                                  {dealer.b2bProfile?.companyName || dealer.name}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-1">
                                  Yetkili: {dealer.name} | E-posta: {dealer.email}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-orange-50 text-orange-600 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-orange-100">
                                  {dealer.b2bProfile?.priceList || "LIST_A"}
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Selected Dealer Display Card
                  <div className="space-y-6">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-6 rounded-3xl bg-orange-50/40 border border-orange-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                      <div>
                        <span className="bg-orange-100 text-orange-700 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-orange-200/50 mb-2.5 inline-block">
                          Aktif B2B Bayi
                        </span>
                        <h3 className="font-black text-lg text-slate-800 leading-tight">
                          {selectedDealer.b2bProfile?.companyName || selectedDealer.name}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-xs font-bold text-slate-500">
                          <p>Yetkili: <span className="text-slate-800">{selectedDealer.name}</span></p>
                          <p>E-posta: <span className="text-slate-800">{selectedDealer.email}</span></p>
                          <p>Fiyat Grubu: <span className="text-orange-600 font-extrabold">{selectedDealer.b2bProfile?.priceList || "LIST_A"}</span></p>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto border-orange-100/50">
                        <div className="text-xs font-bold text-slate-500">
                          Cari Bakiye:{" "}
                          <span className="text-slate-800 font-black">
                            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(selectedDealer.b2bProfile?.balance || 0))}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-500">
                          Cari Limit:{" "}
                          <span className="text-green-600 font-black">
                            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(selectedDealer.b2bProfile?.creditLimit || 0))}
                          </span>
                        </div>
                        <button
                          className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline mt-2 flex items-center gap-1"
                          onClick={() => setSelectedDealer(null)}
                        >
                          Bayi Değiştir
                        </button>
                      </div>
                    </motion.div>

                    {/* Son 10 Sipariş Listesi */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-3xl border border-gray-100 bg-gray-50/20"
                    >
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-orange-500" /> Bayinin Son 10 Siparişi
                      </h4>
                      {lastOrders.length === 0 ? (
                        <p className="text-xs font-bold text-slate-400">Bayiye ait geçmiş sipariş bulunamadı.</p>
                      ) : (
                        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 border-b border-gray-100 font-black uppercase tracking-wider text-slate-500">
                              <tr>
                                <th className="px-4 py-2.5">Sipariş No</th>
                                <th className="px-4 py-2.5">Tarih</th>
                                <th className="px-4 py-2.5">Ürünler</th>
                                <th className="px-4 py-2.5">Tutar</th>
                                <th className="px-4 py-2.5">Durum</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-bold text-slate-700">
                              {lastOrders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-gray-50/40 transition-colors">
                                  <td className="px-4 py-3 font-black text-slate-900">#{order.id.slice(-6).toUpperCase()}</td>
                                  <td className="px-4 py-3 text-slate-400">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</td>
                                  <td className="px-4 py-3 text-slate-500">
                                    {order.items.map((i: any) => `${i.variant.product.name} (${i.quantity} Adet)`).join(", ").slice(0, 45)}
                                    {order.items.map((i: any) => `${i.variant.product.name} (${i.quantity} Adet)`).join(", ").length > 45 && "..."}
                                  </td>
                                  <td className="px-4 py-3 font-extrabold">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(order.totalAmount))}</td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                      order.status === "DELIVERED" ? "bg-green-50 text-green-600 border-green-100" :
                                      order.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-100" :
                                      order.status === "PAID" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                      "bg-gray-50 text-gray-500 border-gray-100"
                                    }`}>
                                      {order.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2: Product & Variant Search */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">Ürün Arama & Ekleme</h2>
                  <p className="text-xs text-gray-400">Bayinin fiyat listesine göre toptan sepetine eklenecek varyantı arayın.</p>
                </div>
              </div>

              {/* Product Search Field */}
              <div ref={productRef} className="relative">
                <div className="relative">
                  <Search className="absolute left-5 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    disabled={!selectedDealer}
                    placeholder={selectedDealer ? "Ürün adı veya SKU kodunu yazın..." : "Lütfen önce bayi seçin..."}
                    className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-5 py-3.5 text-sm transition-all focus:bg-white focus:border-orange-500 focus:shadow-xl focus:shadow-orange-500/5 outline-none placeholder:text-gray-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                  />
                  {isProductSearching && (
                    <div className="absolute right-5 top-4 text-xs font-bold text-orange-500 animate-pulse">
                      Aranıyor...
                    </div>
                  )}

                  {/* Autocomplete Dropdown */}
                  <AnimatePresence>
                    {showProductDropdown && products.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-3xl border border-gray-100 shadow-2xl z-20 max-h-80 overflow-y-auto divide-y divide-gray-50 p-2"
                      >
                        {products.map((product) =>
                          product.variants.map((variant: any) => {
                            const dealerPrice = getVariantPriceForDealer(variant.price);
                            return (
                              <button
                                key={variant.id}
                                className="w-full text-left px-5 py-3 hover:bg-orange-50/50 rounded-2xl flex items-center justify-between transition-colors group"
                                onClick={() => handleAddVariantToCart(product, variant)}
                              >
                                <div>
                                  <p className="font-bold text-sm text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">
                                    {product.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                                    SKU: {variant.sku} 
                                    {variant.color && ` | Renk: ${variant.color}`} 
                                    {variant.sizeLength && ` | Boy: ${variant.sizeLength}`}
                                  </p>
                                  {renderPriceComparison(variant.price)}
                                </div>
                                <div className="text-right flex items-center gap-6">
                                  <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">B2B Net Stok</p>
                                    <p className={`text-xs font-extrabold ${variant.b2bAvailableStock < 10 ? 'text-red-500' : 'text-slate-800'}`}>
                                      {variant.b2bAvailableStock} Adet
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-orange-500 font-bold uppercase">Birim Fiyat ({selectedDealer?.b2bProfile?.priceList})</p>
                                    <p className="text-sm font-black text-slate-900">
                                      {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(dealerPrice)}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* STEP 3: Cart List (Sipariş Sepeti) */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight">Sipariş Sepeti</h2>
                    <p className="text-xs text-gray-400">Bayi için oluşturulan toptan alım sepeti.</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full uppercase tracking-widest">
                  {cart.length} Kalem Ürün
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div
                      key={item.variantId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-slate-300">
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 leading-snug">{item.name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 leading-none">
                            SKU: {item.sku} 
                            {item.color && ` | Renk: ${item.color}`} 
                            {item.sizeLength && ` | Boy: ${item.sizeLength}`}
                          </p>
                          {renderPriceComparison(item.priceObj)}
                        </div>
                      </div>

                      {/* Line Item Actions and Price Adjuster */}
                      <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                        {/* Unit Price */}
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1.5">Birim Fiyat</p>
                          <p className="text-sm font-black text-slate-800">
                            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(item.unitPrice)}
                          </p>
                        </div>

                        {/* Qty Selector */}
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-2">Adet</p>
                          <div className="flex items-center bg-gray-50 rounded-xl px-2 py-1">
                            <button
                              type="button"
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-200/50 rounded-lg text-slate-600 transition-colors"
                              onClick={() => handleUpdateQuantity(item.variantId, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="w-10 text-center bg-transparent border-0 outline-none text-xs font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.variantId, parseInt(e.target.value) || 1)}
                            />
                            <button
                              type="button"
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-200/50 rounded-lg text-slate-600 transition-colors"
                              onClick={() => handleUpdateQuantity(item.variantId, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1.5">KDV Hariç Toplam</p>
                          <p className="text-sm font-black text-slate-900">
                            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(item.unitPrice * item.quantity)}
                          </p>
                        </div>

                        {/* Delete Action */}
                        <button
                          type="button"
                          className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all"
                          onClick={() => handleRemoveItem(item.variantId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {cart.length === 0 && (
                  <div className="p-20 text-center flex flex-col items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-sm font-bold text-slate-400">Toptan sepetiniz şu an boş.</p>
                    <p className="text-xs text-slate-400 mt-1">Lütfen yukarıdaki panelden sepetinize ürün ekleyin.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT AREA: Summary & Action Panel (Sticky) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* B2B addresses Selector */}
            {selectedDealer && (
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" /> Teslimat & Fatura Adresleri
                </h3>

                {/* Billing Address Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Fatura Adresi</label>
                  <select
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-orange-500 transition-all"
                    value={billingAddressId}
                    onChange={(e) => {
                      setBillingAddressId(e.target.value);
                      setShowNewBillingForm(e.target.value === "new");
                    }}
                  >
                    {selectedDealer.addresses
                      .filter((a: any) => a.type === "BILLING")
                      .map((addr: any) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.title} ({addr.fullName})
                        </option>
                      ))}
                    <option value="new">+ Yeni Fatura Adresi Tanımla</option>
                  </select>
                </div>

                {/* New Billing Address Form */}
                <AnimatePresence>
                  {showNewBillingForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 bg-gray-50/50 p-5 rounded-3xl border border-dashed border-gray-200 overflow-hidden text-xs font-bold"
                    >
                      <p className="text-[10px] font-black uppercase text-orange-600 mb-2">Yeni Fatura Adresi Tanımla</p>
                      <input
                        type="text"
                        placeholder="Ad Soyad veya Şirket Adı"
                        className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                        value={newBillingAddress.fullName}
                        onChange={(e) => setNewBillingAddress({ ...newBillingAddress, fullName: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Telefon Numarası"
                        className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                        value={newBillingAddress.phone}
                        onChange={(e) => setNewBillingAddress({ ...newBillingAddress, phone: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Şehir"
                          className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                          value={newBillingAddress.city}
                          onChange={(e) => setNewBillingAddress({ ...newBillingAddress, city: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="İlçe"
                          className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                          value={newBillingAddress.district}
                          onChange={(e) => setNewBillingAddress({ ...newBillingAddress, district: e.target.value })}
                        />
                      </div>
                      <textarea
                        placeholder="Açık Adres Satırı..."
                        rows={2}
                        className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-orange-500 resize-none font-medium"
                        value={newBillingAddress.addressLine}
                        onChange={(e) => setNewBillingAddress({ ...newBillingAddress, addressLine: e.target.value })}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shipping Address Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Teslimat Adresi</label>
                  <select
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-orange-500 transition-all"
                    value={shippingAddressId}
                    onChange={(e) => {
                      setShippingAddressId(e.target.value);
                      setShowNewShippingForm(e.target.value === "new");
                    }}
                  >
                    {selectedDealer.addresses
                      .filter((a: any) => a.type === "SHIPPING")
                      .map((addr: any) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.title} ({addr.fullName})
                        </option>
                      ))}
                    <option value="new">+ Yeni Teslimat Adresi Tanımla</option>
                  </select>
                </div>

                {/* New Shipping Address Form */}
                <AnimatePresence>
                  {showNewShippingForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 bg-gray-50/50 p-5 rounded-3xl border border-dashed border-gray-200 overflow-hidden text-xs font-bold"
                    >
                      <p className="text-[10px] font-black uppercase text-orange-600 mb-2">Yeni Teslimat Adresi Tanımla</p>
                      <input
                        type="text"
                        placeholder="Alıcı Ad Soyad"
                        className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                        value={newShippingAddress.fullName}
                        onChange={(e) => setNewShippingAddress({ ...newShippingAddress, fullName: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Alıcı Telefon Numarası"
                        className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                        value={newShippingAddress.phone}
                        onChange={(e) => setNewShippingAddress({ ...newShippingAddress, phone: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Şehir"
                          className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                          value={newShippingAddress.city}
                          onChange={(e) => setNewShippingAddress({ ...newShippingAddress, city: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="İlçe"
                          className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                          value={newShippingAddress.district}
                          onChange={(e) => setNewShippingAddress({ ...newShippingAddress, district: e.target.value })}
                        />
                      </div>
                      <textarea
                        placeholder="Alıcı Açık Adres Satırı..."
                        rows={2}
                        className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-orange-500 resize-none font-medium"
                        value={newShippingAddress.addressLine}
                        onChange={(e) => setNewShippingAddress({ ...newShippingAddress, addressLine: e.target.value })}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* B2B Settings Panel */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-500" /> Sipariş & Ödeme Ayarları
              </h3>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Ödeme Yöntemi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`py-3 px-4 rounded-2xl border text-xs font-black transition-all ${
                      paymentMethod === "TRANSFER"
                        ? "border-orange-500 bg-orange-50/50 text-orange-600"
                        : "border-gray-100 hover:bg-gray-50 text-slate-500"
                    }`}
                    onClick={() => setPaymentMethod("TRANSFER")}
                  >
                    Havale / EFT
                  </button>
                  <button
                    type="button"
                    disabled={!selectedDealer}
                    className={`py-3 px-4 rounded-2xl border text-xs font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      paymentMethod === "CARI_HESAP"
                        ? "border-orange-500 bg-orange-50/50 text-orange-600"
                        : "border-gray-100 hover:bg-gray-50 text-slate-500"
                    }`}
                    onClick={() => setPaymentMethod("CARI_HESAP")}
                  >
                    Cari Hesap
                  </button>
                </div>
              </div>

              {/* Order Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Sipariş Durumu</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`py-3 px-4 rounded-2xl border text-xs font-black transition-all ${
                      orderStatus === "PENDING"
                        ? "border-orange-500 bg-orange-50/50 text-orange-600"
                        : "border-gray-100 hover:bg-gray-50 text-slate-500"
                    }`}
                    onClick={() => setOrderStatus("PENDING")}
                  >
                    Onay Bekliyor
                  </button>
                  <button
                    type="button"
                    className={`py-3 px-4 rounded-2xl border text-xs font-black transition-all ${
                      orderStatus === "PAID"
                        ? "border-orange-500 bg-orange-50/50 text-orange-600"
                        : "border-gray-100 hover:bg-gray-50 text-slate-500"
                    }`}
                    onClick={() => setOrderStatus("PAID")}
                  >
                    Ödeme Onaylandı
                  </button>
                </div>
              </div>

              {/* Order Notes */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Sipariş Notu</label>
                <textarea
                  placeholder="Sipariş notu ekleyin..."
                  rows={2}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-orange-500 transition-all resize-none font-medium placeholder:text-gray-400"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Sticky Financial Summary */}
            <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 p-8 text-white space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Receipt className="w-4 h-4" /> Özet Finansal Tablo
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Ara Toplam (KDV Hariç)</span>
                  <span className="font-bold">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(rawSubtotal)}</span>
                </div>

                {/* Discount Tier display */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> {activeDiscountTier?.label} (%{discountPercent})
                    </span>
                    <span>-{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-white/40">Toplam KDV (%20)</span>
                  <span className="font-bold text-white/80">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(taxAmount)}</span>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                  <span className="text-base font-black">Genel Toplam</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-orange-500 block leading-none">
                      {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(totalAmount)}
                    </span>
                    <span className="text-[9px] font-black uppercase text-white/40 tracking-wider mt-1.5 block">KDV Dahil</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || !selectedDealer || cart.length === 0}
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer"
                onClick={handleSubmitOrder}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Bayi Siparişini Oluştur
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification Container */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
