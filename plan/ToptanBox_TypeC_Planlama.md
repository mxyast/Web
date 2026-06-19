# ToptanBox & TypeC Elektronik E-Ticaret Ekosistemi Planlaması

Bu döküman, **ToptanBox** (B2B) ve **TypeC** (B2C) platformlarının ortak bir altyapı üzerinde nasıl kurgulanacağını, tasarım dillerini ve teknik gereksinimlerini özetler.

---

## 1. Marka Kimliği ve Vizyon

### **TypeC (Perakende - B2C)**
- **İsim Analizi:** Modern bağlantı standardından (USB Type-C) ilham alan, hızlı, evrensel ve yeni nesil bir isim.
- **Hedef Kitle:** Son kullanıcılar, teknoloji meraklıları.
- **Tasarım Referansı:** [typec.com.tr](https://typec.com.tr/) (Minimalist, ürün odaklı, ferah).
- **Renk Paleti:** Beyaz, Açık Gri ve Teknoloji vurgusu için Neon Mavi/Mor detaylar.

### **ToptanBox (Toptan - B2B)**
- **İsim Analizi:** "Box" (Kutu/Koli) vurgusuyla toplu satışı ve lojistik hacmi simgeler.
- **Hedef Kitle:** Bayiler, alt satıcılar, kurumsal firmalar.
- **Tasarım Yaklaşımı:** Profesyonel, verimlilik odaklı ve hızlı işlem yapılabilir arayüz.
- **Renk Paleti:** Koyu Lacivert (Güven) ve Turuncu (Enerji/Hareket).

---

## 2. Tasarım Stratejisi (typec Esintili)

| Özellik | TypeC (B2C) | ToptanBox (B2B) |
| :--- | :--- | :--- |
| **Ana Sayfa** | Kampanya bannerları, trend ürünler. | Stok duyuruları, hızlı sipariş listesi. |
| **Ürün Sayfası** | Büyük görseller, kullanıcı yorumları. | Teknik spekler, koli içi adet, kademeli fiyat. |
| **Fiyatlandırma** | KDV Dahil, tekil fiyat. | KDV Hariç, bayi grubuna özel iskonto. |
| **Arama Yazılımı** | Akıllı tahmin (Ürün ismi/kategori). | SKU kodu veya barkod ile hızlı arama. |

---

## 3. Teknik Mimari (Single Source of Truth)

Projenin kalbi, her iki arayüzü de besleyen merkezi bir yönetim sistemidir.

- **Veritabanı:** PostgreSQL veya MySQL (İlişkisel yapı).
- **Backend:** Node.js (NestJS) veya Python (Django).
- **Frontend:** Next.js (SEO ve performans avantajı).
- **Ortak Payda:**
    - **Merkezi Stok:** TypeC'den satılan ürün, ToptanBox'taki toplam stoktan anlık düşer.
    - **Ürün Yönetimi:** Admin panelinden bir ürünün hangi sitede görüneceği (is_retail / is_wholesale) tek tıkla seçilir.

---

## 4. Elektronik Sektörüne Özel Fonksiyonlar

1. **Varyasyon Yönetimi:** Bir kablonun 1m, 2m, 3m versiyonlarının typec tarzında akıcı seçimi.
2. **Teknik Tablolar:** Elektronik ürünlerdeki voltaj, amper, malzeme kalitesi gibi verilerin karşılaştırılabilir yapıda sunulması.
3. **B2B Onay Mekanizması:** ToptanBox fiyatlarının sadece onaylı bayiler tarafından görülmesi.
4. **Hızlı Sipariş:** ToptanBox kullanıcıları için Excel (CSV) ile toplu ürün yükleme özelliği.

---

## 5. Yol Haritası (Sonraki Adımlar)

- [ ] Veritabanı şemasının (Tablo yapılarının) detaylandırılması.
- [ ] UI/UX prototiplerinin (typec tarzında) hazırlanması.
- [ ] API uç noktalarının (Endpoints) belirlenmesi.
- [ ] Ödeme sistemleri (İyzico/Lokal Banka API) entegrasyon planı.

---
*Döküman Oluşturulma Tarihi: 2024*
