import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";
import { ArrowRight, Code, Globe, Network, Cpu, CheckCircle2 } from "lucide-react";

const services = [
  {
    title: "Custom Software Development",
    slug: "custom-software",
    description: "End-to-end development of bespoke software solutions designed to streamline operations, enhance productivity, and drive digital transformation.",
    icon: <Code size={48} className="text-blue-400 mb-6" />,
    challenges: "Businesses often struggle with off-the-shelf software that forces them to adapt their unique workflows to rigid tools, leading to inefficiencies and data silos.",
    approach: "We build tailored software from the ground up. Our engineers dive deep into your operational bottlenecks and architect a bespoke system that fits your exact needs like a glove, using modern, scalable tech stacks.",
    benefits: ["100% IP Ownership", "No Vendor Lock-in", "Perfectly aligned with your workflows", "Scalable microservices architecture"]
  },
  {
    title: "Web & Mobile Application Development",
    slug: "web-mobile",
    description: "Creating intuitive, fast-loading web and mobile applications with cutting-edge technologies for exceptional user experiences.",
    icon: <Globe size={48} className="text-purple-400 mb-6" />,
    challenges: "Slow, unresponsive, and poorly designed applications lead to high user churn rates and lost revenue in today's competitive digital landscape.",
    approach: "We utilize React, Next.js, and React Native to build cross-platform experiences that feel native. We prioritize Core Web Vitals, instantaneous load times, and fluid animations for maximum engagement.",
    benefits: ["Sub-second page loads", "Cross-platform consistency", "High conversion UI/UX", "SEO-optimized architectures"]
  },
  {
    title: "AI Systems & Integrations",
    slug: "ai-systems",
    description: "Leveraging artificial intelligence capabilities including RAG pipelines, multi-agent orchestration, and LLM integrations.",
    icon: <Cpu size={48} className="text-indigo-400 mb-6" />,
    challenges: "Organizations possess massive amounts of unstructured data but lack the automated reasoning required to extract actionable insights or automate complex tasks.",
    approach: "We don't just 'wrap APIs'. We engineer sophisticated Retrieval-Augmented Generation (RAG) pipelines and multi-agent systems that securely integrate with your internal databases to automate reasoning workflows.",
    benefits: ["Automated complex reasoning", "Secure on-premise AI deployments", "Drastic reduction in manual overhead", "Data-driven predictive modeling"]
  },
  {
    title: "Network Services & IT Solutions",
    slug: "network-solutions",
    description: "Designing and implementing robust network infrastructure, cloud strategies, and scalable IT architectures.",
    icon: <Network size={48} className="text-green-400 mb-6" />,
    challenges: "Fragile infrastructure leads to costly downtime, security vulnerabilities, and an inability to scale rapidly during traffic spikes.",
    approach: "We architect Zero-Trust networks and resilient cloud infrastructures using Kubernetes and Infrastructure-as-Code (IaC). We ensure your systems are highly available, secure, and infinitely scalable.",
    benefits: ["99.99% Uptime guarantees", "Zero-Trust security posture", "Automated CI/CD pipelines", "Disaster recovery & redundancy"]
  }
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <AnimatedSection className="text-center mb-32 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Our Services</h1>
        <p className="text-xl text-gray-400">
          We combine deep technical expertise with a product mindset to deliver services that power business growth and operational efficiency.
        </p>
      </AnimatedSection>

      <div className="flex flex-col gap-40 pb-20">
        {services.map((service, idx) => (
          <div key={service.slug} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-24 items-center`}>
            
            {/* Left Content (Title & Description) */}
            <div className="w-full lg:w-5/12">
              <AnimatedSection delay={0.1} variant={idx % 2 !== 0 ? "slideLeft" : "slideRight"}>
                {service.icon}
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{service.title}</h2>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                  {service.description}
                </p>
                
                <Link 
                  href={`/contact?service=${service.slug}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/50 text-white rounded-full font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] group"
                >
                  Discuss this service <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </AnimatedSection>
            </div>

            {/* Right Content (Details Cards) */}
            <div className="w-full lg:w-7/12 space-y-6">
              <AnimatedSection delay={0.2} variant="fadeUp">
                <GlassCard className="p-8 md:p-10 border-l-4 border-l-red-500/50 hover:border-red-500 transition-colors">
                  <h4 className="text-xl font-bold text-white mb-3">The Challenge</h4>
                  <p className="text-gray-400 leading-relaxed text-lg">{service.challenges}</p>
                </GlassCard>
              </AnimatedSection>

              <AnimatedSection delay={0.3} variant="fadeUp">
                <GlassCard className="p-8 md:p-10 border-l-4 border-l-blue-500/50 hover:border-blue-500 transition-colors">
                  <h4 className="text-xl font-bold text-white mb-3">Our Approach</h4>
                  <p className="text-gray-400 leading-relaxed text-lg">{service.approach}</p>
                </GlassCard>
              </AnimatedSection>

              <AnimatedSection delay={0.4} variant="fadeUp">
                <GlassCard className="p-8 md:p-10 border-l-4 border-l-green-500/50 hover:border-green-500 transition-colors">
                  <h4 className="text-xl font-bold text-white mb-5">Key Benefits</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle2 size={22} className="text-green-400 shrink-0 mt-0.5" />
                        <span className="font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </AnimatedSection>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
