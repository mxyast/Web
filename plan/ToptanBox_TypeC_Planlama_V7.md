# ToptanBox & TypeC - API Endpoints ve Katalog Yönetimi (V7)

Bu döküman, sistemin veri iletişim yollarını ve dinamik katalog oluşturma özelliklerini kapsar.

---

## 1. Katalog Yönetimi ve Dijital Katalog (New Feature)

Elektronik sektöründe bayiler için güncel bir PDF/Dijital katalog hayati önem taşır.

* **Dinamik Katalog Oluşturucu:** Admin panelinde seçilen ürünlerden anlık "Fiyat Listesi" veya "Ürün Kataloğu" (PDF) oluşturma butonu.
* **Katalog Türleri:**
    - **TypeC Kataloğu:** Son kullanıcı fiyatları ve lifestyle görseller içeren şık tasarım.
    - **ToptanBox Bayi Kataloğu:** SKU kodları, koli adetleri ve teknik speklerin ön planda olduğu liste formatı.
* **Erişim:** ToptanBox Dashboard üzerinden bayilerin en güncel kataloğu tek tıkla indirebilmesi.

---

## 2. Temel API Endpoints (Backend Yol Haritası)

Backend servisinin (NestJS/Node.js) sunacağı temel endpoint'ler:

### A. Ürün ve Katalog API
- `GET /api/products`: Filtrelere göre ürün listeleme (Site bazlı ve is_b2c/is_b2b korumalı).
- `GET /api/products/:slug`: Ürün detay verisi (Teknik tablo dahil).
- `POST /api/catalog/generate`: Filtre parametrelerine göre dinamik PDF kataloğu oluştur (Role-based erişim).

### B. Stok ve Rezervasyon API
- `GET /api/stock/:variantId`: Anlık stok durumu.
- `PATCH /api/admin/stock-reserve`: TypeC için % bazlı stok kilitleme (Admin yetkisiyle).

### C. B2B (Bayi) API
- `POST /api/auth/login`: Bayi girişi ve JWT token üretimi (NextAuth).
- `GET /api/b2b/profile`: Bayi cari bilgileri, borç/alacak ve atanmış fiyat listesi (A/B/C/D).
- `GET /api/b2b/prices/:variantId`: Bayinin atanmış listesine göre fiyat getirme.
- `GET /api/b2b/cart-discount`: Sepet tutarına göre kademeli (10k/25k/50k) indirim hesaplama.
- `POST /api/b2b/bulk-order`: Excel/CSV formatında toplu sipariş alımı.

---

## 3. SEO ve Performans Odaklı Endpoint Kuralları

- **Cache-Control:** Fiyat ve stok dışındaki ürün verileri için 1 saatlik cache.
- **Image Proxy:** API üzerinden dönen görsel linklerinin otomatik olarak cihaz boyutuna göre optimize edilmesi.
- **Metadata API:** Her sayfa için dinamik SEO başlıklarını ve sosyal medya (OpenGraph) kartlarını dönen servis.

---
*Döküman Versiyonu: 7.0 (API & Catalog)*
