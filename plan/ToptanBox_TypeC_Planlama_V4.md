# ToptanBox & TypeC - Teknoloji Stack ve Sistem Mimarisi (V4)

Bu döküman, projenin teknik altyapısını, kullanılacak yazılım dillerini ve Headless mimari yapısını kapsar.

---

## 1. Yazılım Teknoloji Yığını (Tech Stack)

Hız, SEO ve ölçeklenebilirlik odaklı modern araçlar:

### **A. Frontend (Arayüz)**
- **Framework:** **Next.js (React)**
    - *Neden:* Server-Side Rendering (SSR) ile üstün SEO performansı ve sayfa yükleme hızı.
- **Styling:** **Tailwind CSS**
    - *Neden:* typec tarzı temiz ve responsive tasarımları en düşük dosya boyutuyla kodlama imkanı.
- **State Management:** **TanStack Query (React Query)**
    - *Neden:* Sunucu verilerini önbelleğe alarak siteler arası stok bilgisini anlık ve hızlı yönetme.

### **B. Backend (Sunucu & API)**
- **Dil/Framework:** **Next.js (App Router) API Routes & Server Actions**
    - *Neden:* Ayrı bir backend projesine (NestJS/Go) gerek kalmadan monorepo içinde hem UI hem de API servislerinin tek çatı altında (Node.js) yönetilmesi.
- **Mimari:** **Monorepo / API-First**
    - *Neden:* Tek bir veritabanı (Prisma ORM) üzerinden TypeC, ToptanBox ve Admin paneline Next.js API endpoint'leri ile veri sağlamak. İş mantığı paylaşımlı paketlerde (packages/shared) tutulur.

### **C. Veritabanı ve Cache**
- **Ana Veritabanı:** **PostgreSQL**
    - *Neden:* Ürün varyantları ve bayi ilişkileri için güçlü ilişkisel veri yapısı.
- **Caching:** **Redis**
    - *Neden:* Stok bilgilerini ve fiyat listelerini milisaniyeler içinde servis etmek.

---

## 2. Sistem Mimarisi ve Entegrasyonlar

### **A. Monorepo Yapı Şeması**
[Merkezi Veritabanı] <--> [Prisma ORM]
                               |
        -----------------------------------------------
        |                      |                      |
    [TypeC Web]          [ToptanBox Web]        [Admin Panel]
    (Next.js App)        (Next.js App)          (Next.js App)

### **B. Entegrasyon Planı**
1. **Ödeme Geçitleri:** iyzico / Param (TypeC için) & Banka API / DBS (ToptanBox için).
2. **Kargo Entegrasyonu:** Yurtiçi/Aras/MNG API bağlantıları.
3. **ERP Entegrasyonu:** (Opsiyonel) Mikro, Logo veya Paraşüt ile stok senkronizasyonu.

---

## 3. Güvenlik ve Performans

- **SSL & WAF:** Cloudflare üzerinden DDoS koruması ve güvenlik duvarı.
- **B2B Güvenliği:** ToptanBox fiyat API'larına sadece geçerli JWT (JSON Web Token) ve Bayi Rolü ile erişim.
- **Image Optimization:** Next.js Image bileşeni ile görsellerin otomatik WebP formatına çevrilmesi.

---
*Döküman Versiyonu: 4.0 (Tech Stack & Architecture)*
