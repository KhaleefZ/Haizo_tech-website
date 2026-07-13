"use client";

import Link from "next/link";
import Logo from "./Logo";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import MagneticButton from "./MagneticButton";

export default function Footer() {
  const pathname = usePathname();
  const isContactPage = pathname === "/contact";
  const serviceSlug = pathname.startsWith("/services/") ? pathname.split("/").pop() : "";
  const contactHref = serviceSlug ? `/contact?service=${serviceSlug}` : "/contact";

  return (
    <footer className="relative z-10 mt-4">
      {/* Global Pre-Footer CTA */}
      {!isContactPage && (
        <div className="container mx-auto px-6 md:px-12 mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">
            Ready to build something exceptional?
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
            Let's discuss how HaizoTech can accelerate your technical roadmap and scale your infrastructure.
          </p>
          <MagneticButton>
            <Link 
              href={contactHref} 
              className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            >
              Discuss your project <ArrowRight size={20} />
            </Link>
          </MagneticButton>
        </div>
      )}

      <div className="bg-black/50 border-t border-white/10 pt-16 pb-8">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-white group mb-4">
                <Logo className="w-10 h-10 group-hover:scale-110 transition-transform" />
                <span>Haizo<span className="text-blue-500">Tech</span></span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                A premier service-based agency delivering custom software development, AI solutions, and robust IT networks.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/services/custom-software" className="hover:text-blue-400 transition-colors">Custom Software</Link></li>
                <li><Link href="/services/ai-systems" className="hover:text-blue-400 transition-colors">AI & Intelligent Systems</Link></li>
                <li><Link href="/services/web-mobile" className="hover:text-blue-400 transition-colors">Web & Mobile Apps</Link></li>
                <li><Link href="/services/network-solutions" className="hover:text-blue-400 transition-colors">Network Solutions</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/work" className="hover:text-blue-400 transition-colors">Portfolio</Link></li>
                <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>info@haizotech.com</li>
                <li>+91 8807341655</li>
                <li>3A, Udyam Nagar, Podanur, Coimbatore, Tamil Nadu - 641023</li>
              </ul>
              <h4 className="text-white font-semibold mt-8 mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/company/haizotech" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://www.instagram.com/haizotech" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://api.whatsapp.com/send/?phone=918807341655&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} HaizoTech. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
