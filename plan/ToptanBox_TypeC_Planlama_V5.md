# ToptanBox & TypeC - Kullanıcı Akışları ve Stok Koruma Stratejisi (V5)

Bu döküman, operasyonel süreçleri ve Admin panelindeki dinamik stok yönetim kurallarını kapsar.

---

## 1. Akıllı Stok Koruma Mekanizması (Admin Paneli)

Admin panelinde ürün kanal belirleme aşamasında, her iki platformun (TypeC ve ToptanBox) aynı anda seçilmesi durumunda devreye girecek "Stok Rezervasyon" özelliği:

* **Fonksiyon:** `Retail Reserved Percentage (RRP)`
* **Mantık:** Admin, bir ürün için TypeC (B2C) kanalına özel bir yüzde (%) girer. 
* **Uygulama:** 
    - Toplam Fiziksel Stok: 1000 Adet
    - TypeC Koruma Oranı: %20 (200 Adet ayrılır)
    - Rezerve Sipariş Stoku: 0
    - **Sonuç:** ToptanBox (B2B) üzerinden tek seferde veya toplamda en fazla 800 adet (`Total_Stock - Reserved_Qty - (Total_Stock * ratio/100)`) sipariş geçilebilir. Kalan 200 adet sadece TypeC müşterileri için "saklı" tutulur. B2C'den satılan ürünler öncelikle ayrılan 200'lük havuzdan düşer.
* **Amaç:** Toptan alımların perakende satış kanalındaki ürün varlığını (ve dolayısıyla SEO/trafik değerini) aniden bitirmesini engellemek.

---

## 2. Kullanıcı Yolculukları (User Journeys)

### A. Admin (Yönetici) Akışı
1. **Ürün Kartı Oluşturma:** Ürün teknik verileri girilir.
2. **Kanal & Stok Ayarı:** - TypeC: Aktif (Fiyat: 149 TL)
    - ToptanBox: Aktif (Fiyat: 45 TL, Min Alım: 50)
    - **Stok Koruma:** %15 (B2C için saklı tutulan miktar).
3. **Onay:** Ürün her iki sitede farklı kurallarla yayına alınır.

### B. TypeC (Son Kullanıcı) Akışı
1. **Keşif:** Google veya sosyal medya üzerinden typec tarzı landing page'e iniş.
2. **Sepet:** Teknik tablo incelemesi sonrası hızlı sepet ekleme.
3. **Checkout:** iyzico/Kartlı ödeme ile 1-2 adımda sipariş tamamlama.

### C. ToptanBox (Bayi) Akışı
1. **B2B Login:** Sadece onaylı bayiler giriş yapar ve iskonto görür.
2. **Bulk Order:** "Hızlı Sipariş" tablosundan 100 adet kablo ekleme.
3. **Limit Kontrol:** Eğer talep edilen miktar, "Stok Koruma" sınırı dışındaysa sistem bayiye "Maksimum X adet alabilirsiniz" uyarısı verir.

---

## 3. Operasyonel Bildirimler

* **Kritik Stok Uyarısı:** Saklı tutulan % miktarının altına düşüldüğünde admin panelinde "B2C Stoğu Kritik" uyarısı çıkar.
* **B2B Talep Formu:** Stok koruma nedeniyle ürün alamayan bayi için "Talep Et" butonu ile admin ile iletişime geçme imkanı.

---
*Döküman Versiyonu: 5.0 (User Journey & Stock Protection)*
