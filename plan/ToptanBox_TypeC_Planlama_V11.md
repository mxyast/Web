# ToptanBox & TypeC - Teknik Şartname ve Veritabanı Mimarisi (V11)

Bu döküman, yazılım ekibi için veritabanı ilişkilerini ve sistemin stok koruma mantığını standardize eder.

---

## 1. Veritabanı (Database) Şeması

Elektronik ürünlerin varyasyonlu yapısı için normalize edilmiş SQL yapısı:

### A. Ürün ve Varyant Tabloları
- **Categories:** `id, name, slug, parent_id`
- **Brands:** `id, name, logo_url`
- **Products:** `id, brand_id, category_id, name, slug, description`
- **Variants:** `id, product_id, sku, barcode, color, length, power_output`
- **Attributes:** `id, variant_id, key (e.g., "Watt"), value (e.g., "100W")`

### B. Stok ve Kanal Yönetimi
- **Inventory:**
    - `variant_id`: Varyant anahtarı (PK).
    - `total_stock`: Fiziksel toplam stok.
    - `b2c_reserve_ratio`: TypeC için ayrılan yüzde (Örn: 20).
    - `reserved_qty`: Sipariş verilmiş ama henüz kargolanmamış miktar.

### C. Fiyatlandırma
- **Prices:**
    - `variant_id`: Varyant anahtarı (PK).
    - `retail_price`: B2C son kullanıcı fiyatı.
    - `list_a`: Toptan liste A fiyatı.
    - `list_b`: Toptan liste B fiyatı.
    - `list_c`: Toptan liste C fiyatı.
    - `list_d`: Toptan liste D fiyatı.
    - `currency`: TRY, USD vb.
    - `tax_rate`: KDV oranı.
    - `min_b2b_order_qty`: ToptanBox için minimum alım sınırı.

---

## 2. Sistem Mantığı (Business Logic)

### A. Dinamik Stok Gösterimi
ToptanBox üzerinde bir ürünün stok adedi şu formülle hesaplanır:
`B2B_Available = Total_Stock - Reserved_Qty - (Total_Stock * (b2c_reserve_ratio / 100))`

### B. Katalog Oluşturma Mantığı
1. Admin panelinden marka, kategori veya ürün bazlı filtreler gönderilir.
2. API, ilgili varyantları ve teknik özellikleri çeker.
3. PDF oluşturucu (Puppeteer/PDFKit), seçilen şablona göre (B2B veya B2C) verileri yerleştirir.

---

## 3. API Güvenliği
- **JWT Auth:** Bayi ve Admin girişleri için güvenli token sistemi.
- **Role Control:** Sadece adminlerin stok rezervasyon oranlarını değiştirebilmesi.

---
*Döküman Versiyonu: 11.0 (Technical & Database)*
