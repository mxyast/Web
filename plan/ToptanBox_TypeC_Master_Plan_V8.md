# ToptanBox & TypeC - Master Proje Planı (V8)
## (Katalog, SEO, GEO ve Stok Koruma Entegreli)

Bu döküman, projenin başından itibaren belirlenen tüm stratejik, teknik ve görsel kararların birleşimidir.

---

## 1. MARKA VE VİZYON
### **TypeC (B2C)**
- **typec.com.tr** referanslı, minimalist, hızlı ve son kullanıcı odaklı perakende platformu.
- **Katalog:** Ürün sayfalarında "Teknik Broşür/Katalog İndir" butonu ile dijital pazarlama desteği.

### **ToptanBox (B2B)**
- Bayi odaklı, koli bazlı satış yapan, profesyonel yönetim arayüzü.
- **Katalog:** Dinamik, PDF formatında indirilebilir, SKU ve koli bazlı fiyat listesi sunan ana fonksiyon.

---

## 2. TEKNİK MİMARİ VE STOK YÖNETİMİ
- **Next.js (App Router):** SEO ve GEO optimizasyonu için en üst düzey performans. Monorepo yapısı (Turborepo) kullanılacak.
- **Dinamik Stok Rezervasyonu:** Admin panelinden TypeC için % bazlı stok kilitleme (B2B alımlarının perakende stoklarını bitirmemesi için).
- **Tekil Backend (API Routes):** Ayrı bir backend projesi (NestJS/Go) yerine tüm API'ler Next.js App Router içinde geliştirilecek. Paylaşımlı paketler (packages/database vb.) üzerinden tek veritabanı (PostgreSQL) yönetimi sağlanacak.

---

## 3. SEO, GEO VE KATALOG STRATEJİSİ
- **SEO:** Schema.org ürün yapıları ve teknik tabloların Google tarafından indekslenmesi.
- **GEO:** Yerel para birimi, dil desteği ve lokasyon bazlı CDN hızı.
- **Dinamik Katalog:** Adminin seçtiği ürünlerle anlık PDF katalog üretme (Fiyatlı/Fiyatsız seçenekleriyle).

---

## 4. UI/UX VE SAYFA YAPILARI (MİOJİ STİLİ)
- **Header:** TypeC'de sepet odaklı; ToptanBox'ta cari ve katalog odaklı.
- **Ürün Kartı:** Varyasyon seçimi, teknik ikonlar ve stok durum rozetleri.
- **Mobil:** "Önce Mobil" felsefesiyle sabit alt menü ve hızlı checkout.

---

## 5. API VE VERİ YOLLARI
- `/api/products`: Ürün listesi (is_b2c / is_b2b korumalı).
- `POST /api/catalog/generate`: Tek merkezden role-based pdf katalog üretim yolu.
- `PATCH /api/admin/stock-reserve`: % bazlı stok kontrolü.
- `GET /api/b2b/cart-discount`: Kademeli sepet indirimi (10k/25k/50k) hesaplama.

---
*Bu döküman projenin ana rehberidir. Bir sonraki aşama: Ödeme ve Kargo Entegrasyonları.*
