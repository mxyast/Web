"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, ArrowRight } from "lucide-react";



export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      details: "0850 123 45 67",
      subtext: "Hafta içi 09:00 - 18:00 arası",
      link: "tel:08501234567"
    },
    {
      icon: Mail,
      title: "E-Posta",
      details: "destek@typec.com.tr",
      subtext: "7/24 bize yazabilirsiniz",
      link: "mailto:destek@typec.com.tr"
    },
    {
      icon: MapPin,
      title: "Merkez Ofis",
      details: "Teknoloji Vadisi, İnovasyon Cd. No:42",
      subtext: "Şişli, İstanbul",
      link: "#"
    },
    {
      icon: Clock,
      title: "Çalışma Saatleri",
      details: "Pazartesi - Cuma: 09:00 - 18:00",
      subtext: "Cumartesi: 10:00 - 14:00",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-100 via-gray-50 to-white"></div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#E31E24] animate-pulse"></span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#1A1A1A]">Müşteri Hizmetleri</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#1A1A1A] tracking-tighter mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Bizimle İletişime <span className="text-[#E31E24]">Geçin</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Sorularınız, önerileriniz veya destek talepleriniz için uzman ekibimiz her zaman yanınızda. Size yardımcı olmaktan mutluluk duyarız.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-2xl font-black text-[#1A1A1A] mb-8" style={{ fontFamily: 'var(--font-heading)' }}>Mesaj Gönderin</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Adınız Soyadınız</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm font-bold text-[#1A1A1A] outline-none ring-1 ring-transparent focus:ring-[#1A1A1A] transition-all placeholder:text-gray-400 placeholder:font-medium"
                      placeholder="Örn: Ahmet Yılmaz"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-widest">E-Posta Adresiniz</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm font-bold text-[#1A1A1A] outline-none ring-1 ring-transparent focus:ring-[#1A1A1A] transition-all placeholder:text-gray-400 placeholder:font-medium"
                      placeholder="Örn: ahmet@ornek.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Konu</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm font-bold text-[#1A1A1A] outline-none ring-1 ring-transparent focus:ring-[#1A1A1A] transition-all placeholder:text-gray-400 placeholder:font-medium"
                    placeholder="Mesajınızın konusu"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mesajınız</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm font-bold text-[#1A1A1A] outline-none ring-1 ring-transparent focus:ring-[#1A1A1A] transition-all placeholder:text-gray-400 placeholder:font-medium resize-none"
                    placeholder="Size nasıl yardımcı olabiliriz?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                    isSubmitted 
                      ? "bg-green-500 text-white" 
                      : "bg-[#1A1A1A] hover:bg-[#E31E24] text-white disabled:opacity-70"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isSubmitted ? (
                    <>Mesajınız İletildi!</>
                  ) : (
                    <>Gönder <Send className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {contactInfo.map((info, idx) => (
                <a 
                  key={idx} 
                  href={info.link}
                  className="group flex gap-6 p-6 rounded-[2rem] bg-gray-50 hover:bg-black transition-colors duration-300 border border-gray-100 hover:border-black"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-[#E31E24] flex items-center justify-center text-[#1A1A1A] group-hover:text-white transition-colors duration-300 shrink-0 shadow-sm">
                    <info.icon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 group-hover:text-white/60 uppercase tracking-widest mb-1 transition-colors">{info.title}</h3>
                    <p className="text-base font-black text-[#1A1A1A] group-hover:text-white mb-1 transition-colors">{info.details}</p>
                    <p className="text-sm font-medium text-gray-500 group-hover:text-white/70 transition-colors">{info.subtext}</p>
                  </div>
                </a>
              ))}
            </div>

          </motion.div>

        </div>

        {/* Full Width Map Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 lg:mt-24"
        >
          <div className="rounded-[2rem] overflow-hidden h-[300px] md:h-[400px] lg:h-[500px] bg-gray-100 relative group border border-gray-100">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500 z-10 pointer-events-none" />
            {/* Note: In a real app, you would use Google Maps or Mapbox here */}
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <MapPin className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-base font-bold text-gray-500">Harita Yükleniyor...</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
