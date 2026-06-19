# ToptanBox & TypeC - Kapsamlı Yayına Alma Listesi (V13)

Bu döküman, projenin canlıya alınmadan önceki son kontrol noktalarını (Quality Assurance) en ince detayına kadar sunar.

---

## 1. Teknik ve Performans Optimizasyonu
- [ ] **Lighthouse Denetimi:** Mobil ve Masaüstü için Performans, Erişilebilirlik ve SEO skorlarının 90+ olması.
- [ ] **Görsel Optimizasyonu:** Tüm banner ve ürün görsellerinin WebP/Avif formatına dönüştürülmesi ve "Lazy Loading" (Yavaş Yükleme) özelliğinin kontrolü.
- [ ] **Sunucu Güvenliği:** Firewall (WAF) kurulumu, SSL sertifikası (A+ Grade) ve Rate Limiting (API saldırı koruması) konfigürasyonu.
- [ ] **Hata Loglama:** Sentry veya benzeri bir araçla çalışma anındaki hataların (Runtime errors) takibi.

---

## 2. SEO, GEO ve Sosyal Medya
- [ ] **URL Yapısı:** Tüm linklerin SEO uyumlu (Slug) ve hiyerarşik olması.
- [ ] **Sitemap & Robots:** Dinamik sitemap.xml üretimi ve arama motorları için robots.txt kurallarının tanımlanması.
- [ ] **Meta Veriler:** Ürün bazlı dinamik Meta Title, Description ve Social OpenGraph (OG) etiketleri.
- [ ] **GEO-Location:** Kullanıcının konumuna göre otomatik dil veya para birimi önerisi (varsa) kontrolü.

---

## 3. Sistem Fonksiyonları ve Stok Koruma
- [ ] **Smart Stock Shield:** Admin panelinden belirlenen % yüzdesinin, ToptanBox stok miktarından anlık düşüldüğünün doğrulanması.
- [ ] **Dinamik Katalog Motoru:** Marka ve kategori filtresi uygulandıktan sonra PDF çıktısının tasarımı ve verileri koruyarak üretilmesi.
- [ ] **Kanal Geçişleri:** Bir ürünün sadece "TypeC" seçildiğinde "ToptanBox" aramasında çıkmadığının testi.

---

## 4. B2B ve B2C Kullanıcı Deneyimi
- [ ] **Bayi Onay Akışı:** Yeni bayi kaydı sonrası Admin'e giden bildirim ve Admin onayından sonra bayiye giden "Hoş Geldiniz" maili.
- [ ] **Ödeme Entegrasyonları:** iyzico gerçek kart testi ve B2B tarafında Havale/EFT dekont yükleme sürecinin işleyişi.
- [ ] **Responsive Testler:** iPhone, Android, iPad ve farklı ekran çözünürlüklerinde typec tarzı tasarımın kusursuz görünmesi.

---
*Döküman Versiyonu: 13.0 (Launch Checklist)*
