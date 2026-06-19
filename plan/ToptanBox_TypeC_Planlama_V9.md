# ToptanBox & TypeC - Ödeme ve Kargo Mimarisi (V9)

Bu döküman, finansal işlemlerin ve lojistik operasyonların teknik işleyişini kapsar.

---

## 1. Ödeme Kanalları (Payment Methods)

### A. TypeC (B2C)
- **Sanal POS:** iyzico / Param API (Taksitli satış desteği ve zorunlu 3D Secure entegrasyonu).
- **Dijital Cüzdanlar:** Apple Pay / Google Pay (Gelecek planı).
- **Hızlı Ödeme:** Kayıtlı kart ile tek tıkla ödeme (PCI-DSS uyumlu).

### B. ToptanBox (B2B)
- **Cari Yönetimi:** Bayi özel limiti ve borç takibi.
- **Havale/EFT:** Dekont yükleme ve admin onay akışı.
- **Banka Entegrasyonu:** DBS (Doğrudan Borçlandırma) ile otomatik tahsilat.

---

## 2. Lojistik ve Teslimat Altyapısı

### A. Otomasyon
- **Otomatik Barkod:** Sipariş "Hazırlanıyor" durumuna geçtiğinde kargo etiketi PDF olarak üretilir.
- **Anlık Takip:** Webhook'lar aracılığıyla kargo durumunun (Dağıtımda, Teslim Edildi) anlık güncellenmesi.

### B. Kargo Kuralları
- **B2C Kuralları:** Belirli tutar üzeri ücretsiz kargo, adrese teslim.
- **B2B Kuralları:** Ambar gönderimi seçeneği, palet bazlı desi hesaplama, "Karşı Ödemeli" gönderim opsiyonu.

---

## 3. İade ve İptal Yönetimi (RMA)
- **Hatalı Ürün:** Elektronik ürünlerde teknik servis onaylı iade süreci.
- **Otomatik İade:** İptal edilen siparişin tutarının API üzerinden karta geri yüklenmesi.

---
*Döküman Versiyonu: 9.0 (Payment & Logistics)*
