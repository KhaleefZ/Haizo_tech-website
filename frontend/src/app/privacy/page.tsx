import React from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata = {
  title: "Privacy Policy | HaizoTech",
  description: "Privacy Policy for HaizoTech services and applications.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col gap-16 pb-20 pt-32 min-h-screen">
      <section className="container mx-auto px-6 max-w-4xl">
        <AnimatedSection>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">Privacy Policy</h1>
          <p className="text-gray-400 mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="prose prose-invert prose-blue max-w-none space-y-8 text-gray-300">
            <p className="text-lg leading-relaxed">
              At HaizoTech, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">1. Collection of Your Information</h2>
            <p className="leading-relaxed">
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400 marker:text-blue-500">
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">2. Use of Your Information</h2>
            <p className="leading-relaxed">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400 marker:text-blue-500">
              <li>Create and manage your account.</li>
              <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
              <li>Email you regarding your account or order.</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
              <li>Increase the efficiency and operation of the Site.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">3. Disclosure of Your Information</h2>
            <p className="leading-relaxed">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400 marker:text-blue-500">
              <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
              <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">4. Security of Your Information</h2>
            <p className="leading-relaxed">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">5. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <address className="not-italic text-gray-400 bg-white/[0.02] border border-white/10 p-6 rounded-xl mt-4 inline-block">
              <strong>HaizoTech</strong><br />
              3A, Udyam Nagar, Podanur<br />
              Coimbatore, Tamil Nadu - 641023<br />
              Email: info@haizotech.com<br />
              Phone: +91 8807341655
            </address>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
