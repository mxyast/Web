# ToptanBox & TypeC - Admin Paneli ve Gelişmiş Katalog Yönetimi (V10)

Bu döküman, sistemin yönetim merkezini ve özellikle filtreleme odaklı dinamik katalog üretim mekanizmasını kapsar.

---

## 1. Gelişmiş Katalog Oluşturucu (Advanced Catalog Engine)

Admin panelinde yer alan bu modül, hem B2B hem de B2C kanalları için saniyeler içinde özelleştirilmiş dökümanlar üretir.

### A. Filtreleme Kriterleri
Katalog oluşturulmadan önce admin aşağıdaki parametrelerle içeriği daraltabilir:
- **Marka Filtresi:** Sadece belirli markaların (Örn: Baseus, Ugreen, Kendi Markanız) ürünlerini seçme.
- **Kategori Filtresi:** Sadece "Şarj Cihazları" veya "HDMI Dönüştürücüler" gibi spesifik gruplar.
- **Stok Durumu:** Sadece stokta olanları dahil et veya "Yakında Gelecek" olanları işaretle.
- **Teknik Özellik:** Belirli bir güce (Örn: 100W üstü) veya teknolojiye (Örn: GaN) göre süzme.

### B. Katalog Çıktı Seçenekleri
- **Toptan Formatı:** SKU, Barkod, Koli İçi Adet, Bayi Fiyatı (Opsiyonel: KDV Hariç).
- **Perakende Formatı:** Ürün Açıklaması, Öne Çıkan Özellikler, Perakende Satış Fiyatı (KDV Dahil).
- **Dosya Tipi:** PDF (Paylaşım için), Excel (Bayi siparişi için), CSV (Diğer platformlara yükleme için).

---

## 2. Merkezi Yönetim Paneli (Admin Dashboard)

### A. Satış ve Stok Kontrolü
- **Cross-Platform Analiz:** TypeC ve ToptanBox satış verilerinin tek ekranda karşılaştırılması.
- **Smart Stock Shield Modülü:** TypeC için saklı tutulan % oranının ürün bazlı veya kategori bazlı toplu güncellenmesi.

### B. Bayi ve Kullanıcı Yönetimi
- **Onay Kuyruğu:** ToptanBox'a yeni başvuran işletmelerin evrak kontrolü ve aktivasyonu.
- **Fiyat Listesi Atama:** Admin panelinden bayilere özel toptan fiyat listelerinden (Liste A, Liste B, Liste C, Liste D) birinin atanması.
- **Kademeli İndirim Yönetimi:** Sepet tutarına göre otomatik uygulanacak toptan indirim eşiklerinin (10k->%3, 25k->%7 vb.) ayarlanması.

---

## 3. İçerik ve Kampanya Yönetimi (CMS)

- **typec Stili Banner Yönetimi:** Her iki sitenin ana sayfa slider ve kampanya alanlarının sürükle-bırak yöntemiyle güncellenmesi.
- **SEO Panel:** Ürün bazlı Meta Başlık, Açıklama ve Anahtar Kelime yönetimi.

---
*Döküman Versiyonu: 10.0 (Admin & Advanced Catalog)*
