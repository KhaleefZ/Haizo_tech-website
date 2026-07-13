"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", phone: "", message: "" });
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }
  }, [searchParams]);

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "", phone: "", message: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format (7-20 digits)";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5001/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
        setErrors({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setIsSuccess(false), 5001);
      } else {
        console.error('Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error dynamically as user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <AnimatedSection className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Let's Build the Future</h1>
        <p className="text-xl text-gray-400">
          Ready to scale your business with intelligent software solutions? Get in touch with our engineering team today.
        </p>
      </AnimatedSection>

      <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
        {/* Contact Info */}
        <AnimatedSection delay={0.1} className="lg:col-span-2 space-y-8">
          <GlassCard className="p-8 h-full flex flex-col justify-center items-center">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Contact Information</h3>
            
            <div className="space-y-8 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                    <Mail className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email Us</h4>
                    <a href="mailto:info@haizotech.com" className="text-gray-400 hover:text-blue-400 transition-colors text-sm md:text-base break-all">
                      info@haizotech.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                    <Phone className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Call Us</h4>
                    <a href="tel:+918807341655" className="text-gray-400 hover:text-purple-400 transition-colors text-sm md:text-base">
                      +91 8807341655
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
                  <MapPin className="text-green-400" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Location</h4>
                  <p className="text-gray-400">
                    3A, Udyam Nagar, Podanur,<br />
                    Coimbatore, Tamil Nadu - 641023
                  </p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-8 mt-8 border-t border-white/10 flex flex-col items-center">
                <h4 className="text-white font-medium mb-4 text-center">Connect with us</h4>
                <div className="flex justify-center gap-4">
                  <a href="https://www.linkedin.com/company/haizotech" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <a href="https://www.instagram.com/haizotech" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white transition-all shadow-[0_0_10px_rgba(236,72,153,0.2)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="https://api.whatsapp.com/send/?phone=918807341655&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </a>
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Contact Form */}
        <AnimatedSection delay={0.2} className="lg:col-span-3">
          <GlassCard className="p-8 md:p-12 relative overflow-hidden">
            {/* Background glowing orb specific to the form */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
            
            <h3 className="text-2xl font-bold text-white mb-8 relative z-10">Send us a Message</h3>
            
            {isSuccess ? (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
                  <Send className="text-green-400 ml-1" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-300">We'll get back to you within 24 hours.</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all ${
                      errors.name ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }`}
                    placeholder="John Doe"
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.span 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-400 block"
                      >
                        {errors.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all ${
                      errors.email ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }`}
                    placeholder="john@company.com"
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.span 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-400 block"
                      >
                        {errors.email}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-300">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all ${
                      errors.phone ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.span 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-400 block"
                      >
                        {errors.phone}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="service" className="text-sm font-medium text-gray-300">Service Needed</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="custom-software">Custom Software Development</option>
                    <option value="web-mobile">Web & Mobile Apps</option>
                    <option value="ai-systems">AI & Intelligent Systems</option>
                    <option value="network">Network Solutions</option>
                    <option value="other">Other / Consultation</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-300">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all resize-none ${
                    errors.message ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                  placeholder="Tell us about your project requirements..."
                />
                <AnimatePresence>
                  {errors.message && (
                    <motion.span 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-400 block"
                    >
                      {errors.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>
            </form>
          </GlassCard>
        </AnimatedSection>
      </div>
    </div>
  );
}
