import React from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata = {
  title: "Terms of Service | HaizoTech",
  description: "Terms of Service for HaizoTech services and applications.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col gap-16 pb-20 pt-32 min-h-screen">
      <section className="container mx-auto px-6 max-w-4xl">
        <AnimatedSection>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">Terms of Service</h1>
          <p className="text-gray-400 mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="prose prose-invert prose-blue max-w-none space-y-8 text-gray-300">
            <p className="text-lg leading-relaxed">
              Welcome to HaizoTech. These Terms of Service ("Terms") govern your use of our website and the services provided by HaizoTech. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing our website and utilizing our services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">2. Description of Services</h2>
            <p className="leading-relaxed">
              HaizoTech provides custom software development, web and mobile application development, AI integrations, and network solutions. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time, including the availability of any feature, database, or content.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">3. User Obligations</h2>
            <p className="leading-relaxed">
              As a user of our services, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400 marker:text-blue-500">
              <li>Provide accurate, current, and complete information when engaging our services.</li>
              <li>Maintain the security of your account and passwords.</li>
              <li>Notify us immediately of any unauthorized use of your account or any other breach of security.</li>
              <li>Use our services only for lawful purposes and in accordance with these Terms.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">4. Intellectual Property Rights</h2>
            <p className="leading-relaxed">
              Unless otherwise explicitly agreed upon in a separate Master Services Agreement (MSA), all content, features, and functionality of our website—including but not limited to text, graphics, logos, and software—are owned by HaizoTech and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">5. Limitation of Liability</h2>
            <p className="leading-relaxed">
              In no event shall HaizoTech, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">6. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-white/10 pb-2">7. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms, please contact us:
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
