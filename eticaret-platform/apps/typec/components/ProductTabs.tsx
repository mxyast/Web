"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface Attribute {
  id: string;
  key: string;
  value: string;
  unit?: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
  user: {
    name: string;
  };
}

interface ProductTabsProps {
  attributes: Attribute[];
  description: string;
  reviews?: Review[];
}

export function ProductTabs({ attributes, description, reviews = [] }: ProductTabsProps) {
  const tabs = ["Ürün Açıklaması", "Kutu İçeriği", `Kullanıcı Yorumları (${reviews.length})`];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="flex items-center justify-center gap-12 border-b border-gray-100 mb-20 overflow-x-auto no-scrollbar">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === i ? "text-black" : "text-gray-400 hover:text-black"}`}
          >
            {tab}
            {activeTab === i && <span className="absolute bottom-0 left-0 w-full h-1 bg-typec-red rounded-full" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 prose prose-lg prose-black max-w-none">
          {activeTab === 0 && (
            <div>
              <h3 className="text-3xl font-black tracking-tight mb-8">Ürün Hakkında</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-8 whitespace-pre-line">
                {description}
              </p>
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <h3 className="text-2xl font-black tracking-tight mb-6">Detaylı Kutu İçeriği</h3>
              <p className="text-gray-500 font-medium">Bu bölümde cihazın kutu içeriğini inceleyebilirsiniz.</p>
            </div>
          )}
          {activeTab === 2 && (
            <div className="space-y-10">
              <h3 className="text-2xl font-black tracking-tight mb-6">Müşteri Yorumları</h3>
              {reviews.length > 0 ? (
                <div className="space-y-8 divider-y divider-gray-100">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-8 border-b border-gray-100 last:border-0">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-sm text-black">{review.user.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {new Date(review.createdAt).toLocaleDateString("tr-TR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= review.rating ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400 font-medium">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100 h-fit">
          <h4 className="text-lg font-black tracking-tight mb-8">Kutu İçeriği</h4>
          <div className="space-y-4">
            {attributes.map((attr) => (
              <div key={attr.id} className="flex flex-col py-3 border-b border-gray-200/50 last:border-0">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{attr.key}</span>
                <span className="text-sm font-black text-black">
                  {attr.value} {attr.unit || ""}
                </span>
              </div>
            ))}
            {!attributes.length && (
              <p className="text-xs text-gray-400 font-medium italic">Bu ürün için henüz kutu içeriği bilgisi girilmemiş.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
