# ToptanBox & TypeC - Teknik Planlama ve Veritabanı Mimarisi (V2)

Bu döküman, projenin veri iskeletini ve yönetim mantığını kapsar.

---

## 1. Veritabanı Şeması (Database Schema)

Merkezi yönetim için ilişkisel bir model kullanılacaktır.

### A. Ürün ve Varyant Yapısı (Products & Variants)
* **`products`:** Genel ürün tanımı (Marka, Model Adı, Genel Açıklama).
* **`product_variants`:** SKU, Barkod, Renk, Boyut, Teknik Özellikler (Amper, Watt vb.).
* **`site_visibility`:** Hangi varyantın hangi platformda (TypeC veya ToptanBox) aktif olduğu bilgisi.

### B. Fiyatlandırma ve Stok (Pricing & Stock)
* **`prices`:** * `variant_id` (PK)
    * `retail_price` (TypeC / B2C Fiyatı - KDV Dahil)
    * `list_a` (ToptanBox Liste A Fiyatı)
    * `list_b` (ToptanBox Liste B Fiyatı)
    * `list_c` (ToptanBox Liste C Fiyatı)
    * `list_d` (ToptanBox Liste D Fiyatı)
    * `compare_price` (İndirimli gösterim için eski fiyat)
    * `tax_rate` (KDV oranı)
* **`stocks` (inventory):** * `variant_id`
    * `physical_quantity` (Fiziksel toplam stok)
    * `b2c_reserve_ratio` (TypeC için ayrılan % oran)
    * `reserved_quantity` (Rezerve sipariş stoku)
    * `min_order_limit` (ToptanBox için minimum alım sınırı)

### C. Kullanıcı ve Yetkilendirme (Users & Auth)
* **`users`:** E-posta, Şifre, Rol (Müşteri, Bayi, Admin).
* **`b2b_profiles`:** Bayi adı, Vergi dairesi/no, Cari bakiye, Bayi Grubu (Platin, Altın, Gümüş).
* **`price_list`:** Bayiye atanan fiyat listesi ('list_a', 'list_b', 'list_c', 'list_d'). Admin panelinden atanır.

### D. Kademeli Sepet İndirimi
* **`cart_discount_tiers`:** ToptanBox sepet tutarına göre otomatik indirim. (Örn: 10.000 TL → %3, 25.000 TL → %7, 50.000 TL → %10)

---

## 2. Platform Bazlı Mantık

| İşlev | TypeC (B2C) | ToptanBox (B2B) |
| :--- | :--- | :--- |
| **Giriş Şartı** | Üye olmadan gezilebilir. | Sadece onaylı üyeler fiyat görür. |
| **Stok Mantığı** | "Son 3 ürün" gibi uyarılar. | "Koli İçi Adet" ve "Hemen Teslim" bilgisi. |
| **Ödeme** | Kredi Kartı / Havale. | Cari Hesap / DBS / Çek / Kredi Kartı. |

---

## 3. Veri Akış Senaryosu

1. **Giriş:** Admin paneline yeni bir "GaN Şarj Adaptörü" girilir.
2. **Atama:** Ürün is_b2c ve is_b2b flagleri ayarlanır. Retail: 899 TL, Liste A: 450 TL, Liste B: 420 TL olarak set edilir.
3. **Senkronizasyon:** TypeC'den bir son kullanıcı ürünü aldığında, ToptanBox stok verisi (fiziksel - rezerve) otomatik güncellenir.
4. **B2B Sipariş Akışı:** Bayi sipariş verir -> `pending_approval` -> Admin onaylar -> `approved` -> Ödeme yapılır -> `processing`.

---
*Döküman Versiyonu: 2.0*
