import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Cog, FileCode2, Layers, Shield, Cpu, Activity, Server, Smartphone, Globe, Network, Database } from "lucide-react";

const serviceContent: Record<string, any> = {
  "custom-software": {
    title: "Custom Software Development",
    tagline: "We architect and deploy robust, enterprise-grade custom software that solves real business bottlenecks and drives operational scale.",
    methodology: "We don't just write code; we engineer solutions. When tackling custom software, we ensure that the underlying infrastructure is as beautiful as the UI. From perfectly normalized databases to robust CI/CD pipelines, we focus on long-term maintainability.",
    points: [
      "Thorough Code Reviews & Quality Assurance",
      "Zero Vendor Lock-in (100% Code Ownership)",
      "Optimized for High Concurrency",
      "Automated Testing Suites"
    ],
    techFrontend: ["React", "Next.js", "Vue.js", "TypeScript"],
    techBackend: ["Node.js", "NestJS", "PostgreSQL", "Redis", "Docker"],
    icons: [
      { icon: <Cog className="text-blue-400 mb-4" size={32} />, title: "Technical Discovery", desc: "Deep-dive into business logic, entity relationships, and architecture planning." },
      { icon: <Layers className="text-purple-400 mb-4" size={32} />, title: "Agile Execution", desc: "Iterative sprint deliveries ensuring continuous feedback loops." },
      { icon: <Shield className="text-green-400 mb-4" size={32} />, title: "Scale & Security", desc: "Production-ready infrastructure with 24/7 SLA monitoring." }
    ]
  },
  "web-mobile": {
    title: "Web & Mobile Application Development",
    tagline: "Creating intuitive, blazing-fast web and native mobile applications tailored for exceptional user engagement and retention.",
    methodology: "Our approach to web and mobile development centers on performance and user experience. We build progressive web apps (PWAs) and native mobile solutions that feel fluid, responsive, and reliable across all devices and network conditions.",
    points: [
      "Pixel-perfect UI/UX Implementation",
      "Cross-platform Native Development",
      "Offline-first Architectures",
      "Core Web Vitals Optimization"
    ],
    techFrontend: ["React Native", "Flutter", "Next.js", "Tailwind CSS", "Framer Motion"],
    techBackend: ["GraphQL", "REST APIs", "Firebase", "Supabase"],
    icons: [
      { icon: <Smartphone className="text-blue-400 mb-4" size={32} />, title: "Mobile First", desc: "Designing touch-optimized interfaces for iOS and Android platforms." },
      { icon: <Globe className="text-purple-400 mb-4" size={32} />, title: "Web Performance", desc: "Sub-second load times utilizing edge computing and advanced caching." },
      { icon: <Activity className="text-green-400 mb-4" size={32} />, title: "Analytics & Tracking", desc: "Integrated telemetry to monitor user behavior and app health." }
    ]
  },
  "ai-systems": {
    title: "AI & Intelligent Systems",
    tagline: "Leveraging state-of-the-art artificial intelligence to automate complex processes, unlock data insights, and build adaptive agentic systems.",
    methodology: "AI isn't just an API call. We build comprehensive AI pipelines. From Retrieval-Augmented Generation (RAG) systems that understand your proprietary data to multi-agent orchestrations that execute complex workflows autonomously.",
    points: [
      "Custom LLM Fine-tuning & Deployment",
      "Secure RAG Pipelines with Vector Databases",
      "Multi-Agent Workflow Orchestration",
      "Predictive Analytics & Machine Learning"
    ],
    techFrontend: ["React", "WebSockets for Real-time Streaming"],
    techBackend: ["Python", "LangChain", "Pinecone/Milvus", "OpenAI/Anthropic APIs", "PyTorch"],
    icons: [
      { icon: <Cpu className="text-blue-400 mb-4" size={32} />, title: "Model Orchestration", desc: "Routing queries to the most efficient models dynamically." },
      { icon: <Database className="text-purple-400 mb-4" size={32} />, title: "Vector Search", desc: "Semantic search capabilities over millions of internal documents." },
      { icon: <Shield className="text-green-400 mb-4" size={32} />, title: "Data Privacy", desc: "Ensuring sensitive PII never leaks into public LLM training sets." }
    ]
  },
  "network-solutions": {
    title: "Network Services & IT Solutions",
    tagline: "Designing and implementing robust network infrastructure, cloud strategies, and scalable IT architectures for the modern enterprise.",
    methodology: "We treat infrastructure as code. Our network and IT solutions focus on high availability, zero-trust security models, and seamless scalability. We migrate legacy systems to the cloud without downtime and ensure your operations are resilient against outages.",
    points: [
      "Zero-Trust Network Architectures",
      "Cloud Migration (AWS, GCP, Azure)",
      "Disaster Recovery & Redundancy Planning",
      "24/7 Infrastructure Monitoring"
    ],
    techFrontend: ["Grafana", "Kibana (Dashboards)"],
    techBackend: ["Kubernetes", "Terraform", "AWS VPC", "Cloudflare", "Linux"],
    icons: [
      { icon: <Network className="text-blue-400 mb-4" size={32} />, title: "Cloud Architecture", desc: "Multi-AZ and Multi-Region deployments for fault tolerance." },
      { icon: <Server className="text-purple-400 mb-4" size={32} />, title: "Infrastructure as Code", desc: "Reproducible environments using Terraform and Ansible." },
      { icon: <Shield className="text-green-400 mb-4" size={32} />, title: "Cybersecurity", desc: "Vulnerability scanning, DDoS protection, and secure VPNs." }
    ]
  }
};

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const content = serviceContent[slug] || {
    title: slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
    tagline: "Delivering exceptional technical solutions to scale your business operations.",
    methodology: "We apply rigorous engineering principles to ensure high performance and maintainability.",
    points: ["Quality Assurance", "Code Ownership", "Scalability", "Testing"],
    techFrontend: ["React", "Next.js"],
    techBackend: ["Node.js", "PostgreSQL"],
    icons: [
      { icon: <Cog className="text-blue-400 mb-4" size={32} />, title: "Strategy", desc: "Planning and architecture." },
      { icon: <Layers className="text-purple-400 mb-4" size={32} />, title: "Execution", desc: "Development and delivery." },
      { icon: <Shield className="text-green-400 mb-4" size={32} />, title: "Support", desc: "Maintenance and scale." }
    ]
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <AnimatedSection className="mb-12">
        <Link href="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
          <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" /> Back to Services
        </Link>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="max-w-4xl mx-auto mb-16">
        <GlassCard className="p-10 md:p-16 text-center border-t-2 border-blue-500/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gradient relative z-10">{content.title}</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light leading-relaxed relative z-10">
            {content.tagline}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-left relative z-10">
            {content.icons.map((item: any, i: number) => (
              <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-colors">
                {item.icon}
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-20">
        <AnimatedSection delay={0.2}>
          <h2 className="text-3xl font-bold mb-6">Our Methodology</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            {content.methodology}
          </p>
          <ul className="space-y-4">
            {content.points.map((item: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="text-blue-500 shrink-0" size={20} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <GlassCard className="p-8 h-full bg-gradient-to-b from-white/5 to-transparent border-t border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileCode2 className="text-purple-400" /> Technology Stack
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Frontend & UI</h4>
                <div className="flex flex-wrap gap-2">
                  {content.techFrontend.map((tech: string) => (
                    <span key={tech} className="px-3 py-1 bg-white/5 rounded border border-white/10 text-sm text-gray-300">{tech}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Backend & Infrastructure</h4>
                <div className="flex flex-wrap gap-2">
                  {content.techBackend.map((tech: string) => (
                    <span key={tech} className="px-3 py-1 bg-white/5 rounded border border-white/10 text-sm text-gray-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>

      {/* Service CTA */}
      <AnimatedSection delay={0.4} className="max-w-4xl mx-auto mb-20">
        <GlassCard className="p-10 md:p-16 text-center border-t-2 border-blue-500/50 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 relative z-10">Ready to get started?</h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto relative z-10">
            Let&apos;s discuss how our {content.title.toLowerCase()} capabilities can solve your technical challenges.
          </p>
          <Link
            href={`/contact?service=${slug}`}
            className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)] relative z-10"
          >
            Discuss Your Project
          </Link>
        </GlassCard>
      </AnimatedSection>
    </div>
  );
}
