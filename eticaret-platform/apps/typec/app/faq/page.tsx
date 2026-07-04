"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Siparişimi nasıl takip edebilirim?",
      answer: "Siparişlerinizi üye girişi yaptıktan sonra profilinizdeki 'Siparişlerim' bölümünden takip edebilirsiniz. Ürün kargoya verildiğinde tarafınıza SMS ve e-posta ile kargo takip numarası iletilecektir."
    },
    {
      question: "Hangi kargo firmaları ile çalışıyorsunuz?",
      answer: "Yurtiçi Kargo ve MNG Kargo ile anlaşmamız bulunmaktadır. Siparişinizi tamamlarken dilediğiniz kargo firmasını seçebilirsiniz."
    },
    {
      question: "İade süresi kaç gündür ve iadeyi nasıl yaparım?",
      answer: "Siparişinizi teslim aldığınız tarihten itibaren 14 gün içerisinde orijinal ambalajı bozulmamış ve kullanılmamış olmak şartıyla iade edebilirsiniz. İade işlemini başlatmak için sipariş geçmişinizden iade talebi oluşturup anlaşmalı kargo kodumuz ile ücretsiz gönderebilirsiniz."
    },
    {
      question: "Ürünlerinizin garanti süresi ne kadardır?",
      answer: "Sitemizde satışa sunulan tüm Baseus ve diğer premium markalı ürünlerimiz 2 yıl distribütör garantisi kapsamındadır. Kutu içerisinden çıkan garanti belgesini saklamanız gerekmektedir."
    },
    {
      question: "Kapıda ödeme seçeneğiniz var mı?",
      answer: "Güvenlik ve temassız teslimat standartları gereği kapıda ödeme seçeneğimiz bulunmamaktadır. Alışverişlerinizde tüm banka kartlarını ve kredi kartlarını 12 aya varan taksit seçenekleriyle güvenle kullanabilirsiniz."
    },
    {
      question: "Aynı gün kargo imkanı hangi saatler için geçerlidir?",
      answer: "Hafta içi saat 16:00'a kadar verilen siparişler aynı gün kargoya teslim edilmektedir. Hafta sonu verilen siparişler ise takip eden ilk iş günü olan pazartesi günü kargolanır."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-32">
        <div className="container mx-auto px-4 max-w-3xl">
          
          <div className="text-center max-w-xl mx-auto space-y-6 mb-16">
            <span className="text-[#E31E24] font-bold text-[10px] tracking-[0.4em] uppercase">MÜŞTERİ DESTEK</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-black leading-none">
              SIKÇA SORULAN SORULAR
            </h1>
            <p className="text-gray-400 font-medium text-sm leading-relaxed">
              Alışveriş, kargo, iade ve garanti süreçleriyle ilgili en çok merak edilen soruları sizler için derledik.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-[#FBFBFB] border border-gray-100 rounded-3xl overflow-hidden transition-all duration-300 hover:border-gray-200"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left font-bold text-slate-800 transition-colors hover:text-black focus:outline-none"
                  >
                    <span className="text-sm md:text-base leading-snug max-w-[85%]">{faq.question}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-400 transition-transform ${isOpen ? "rotate-180 bg-slate-900 text-white border-slate-900" : ""}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-60 border-t border-gray-100/50 p-6 md:p-8 bg-white" : "max-h-0"
                    }`}
                  >
                    <p className="text-xs md:text-sm font-semibold text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </>
  );
}
