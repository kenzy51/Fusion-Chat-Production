import Link from "next/link";

const tiers = [
  {
    name: "Sandbox Free",
    price: "0",
    setup: "Requires Business Email Verification",
    description:
      "Test autonomous conversational logic natively within your staging ecosystem.",
    features: [
      "1 Dynamic Chatbot Node",
      "Manual Intent Routing Logs",
      "Standard Vector Document Chunking",
      "14-Day Message Thread Retention",
      "Verification Required To Deploy Live",
    ],
    cta: "Verify & Initialize",
    popular: false,
  },
  {
    name: "Fusion Chat Pro",
    price: "20",
    setup: "Zero Implementation Fee",
    description:
      "Complete multi-tenant chatbot infrastructure to cleanly automate lead qualification 24/7.",
    features: [
      "Unlimited Live Chat Conversations",
      "Native Calendar Orchestration Sync",
      "Custom UI Theme Customizer",
      "Bi-directional REST API & Webhooks",
      "Instant 100ms Ingestion Pipelines",
      "Centralized Multi-Tenant Dashboard",
    ],
    cta: "Launch Chat Pro",
    popular: true,
  },
  {
    name: "Voice & Chat Elite",
    price: "249",
    setup: "Bespoke Multi-Node Deployment",
    description:
      "The complete conversion pipeline bundling real-time chat widgets and low-latency voice AI agents.",
    features: [
      "Everything in Fusion Chat Pro",
      "Low-Latency Neural Voice Agents",
      "Custom Voice Library (ElevenLabs Sync)",
      "Bespoke CRM & Internal Software Integrations",
      "Automated SMS & Email Re-engagement",
      "Priority API Gateway Routing",
    ],
    cta: "Deploy Voice & Chat Systems",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section className="bg-[#09090b] py-24 px-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#d4ff33]/20 to-transparent" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-[#d4ff33] font-mono tracking-widest uppercase text-[10px] mb-4">
            System Investment
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6">
            Transparent. <span className="text-zinc-500">Scalable.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto font-light">
            Flat-rate operational structures engineered to convert visitors into booked pipeline assets. No hidden metrics.
          </p>
        </div>

        {/* 3-Tier Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 min-h-[620px] ${
                tier.popular
                  ? "bg-white/[0.03] border-[#d4ff33] shadow-[0_0_50px_rgba(212,255,51,0.05)] md:scale-105 z-10"
                  : "bg-white/[0.01] border-white/10 hover:border-white/20"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-10 bg-[#d4ff33] text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {tier.name}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed h-12">
                  {tier.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white tracking-tighter">
                    ${tier.price}
                  </span>
                  <span className="text-zinc-500 font-mono text-sm">/mo</span>
                </div>
                <p className="text-[#d4ff33] text-[9px] font-mono mt-4 uppercase tracking-widest h-8">
                  {tier.setup}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow border-t border-white/5 pt-6">
                {tier.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-xs md:text-sm text-zinc-400 group"
                  >
                    <span className="text-[#d4ff33] text-lg leading-none mt-0.5">•</span>
                    <span className="group-hover:text-zinc-200 transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/contact" className="w-full mt-auto">
                <button
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                    tier.popular
                      ? "bg-[#d4ff33] text-black hover:shadow-[0_0_30px_rgba(212,255,51,0.3)] hover:scale-[1.02] cursor-pointer"
                      : "bg-white/5 text-white border border-white/10 hover:bg-white/10 cursor-pointer"
                  }`}
                >
                  {tier.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Global Pipeline Footer Note */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#d4ff33]/10 flex items-center justify-center">
              <span className="text-[#d4ff33] text-[10px] font-mono">OS</span>
            </div>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
              Multi-tenant isolated sandbox databases secure all vector embeddings.
            </p>
          </div>
          <p className="text-zinc-600 text-[10px] font-mono italic">
            v4.0 // Fusion Chat Engine
          </p>
        </div>
      </div>
    </section>
  );
}