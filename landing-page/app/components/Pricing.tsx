import Link from "next/link";

const tiers = [
  {
    name: "Neural Core",
    price: "299",
    setup: "Zero Implementation Fee",
    description:
      "Full autonomous infrastructure. The most convenient way to handle inbound growth and scheduling.",
    features: [
      "Fully Trainable Neural Agent",
      "Advanced Logic & Personality Tuning",
      "Google Calendar Appointment Sync",
      "Custom Voice Library (ElevenLabs)",
      "Centralized Ops Dashboard",
      "Automated Email Follow-ups",
      "Searchable Call Recordings & Transcripts",
      "Unlimited Concurrent Conversations",
      "Call Forwarding",
    ],
    cta: "Initialize Neural Core",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    setup: "Bespoke Deployment",
    description:
      "For NYC organizations requiring multi-node infrastructure and custom API integrations.",
    features: [
      "Everything in Neural Core",
      "Multi-Location Routing Logic",
      "On-Site Cinematic Content Shoots",
      "Custom API & CRM Development",
      "Dedicated Technical Account Lead",
      "HIPAA/Security Compliance Audits",
      "Priority NYC On-Site Support",
    ],
    cta: "Request Consultation",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section className="bg-[#09090b] py-24 px-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#d4ff33]/20 to-transparent" />
      
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-[#d4ff33] font-mono tracking-widest uppercase text-[10px] mb-4">
            System Investment
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6">
            Transparent. <span className="text-zinc-500">Autonomous.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto font-light">
            One flat rate for complete neural infrastructure. 
            No implementation fees, just pure growth.
          </p>
        </div>

        {/* Simplified Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 ${
                tier.popular
                  ? "bg-white/[0.03] border-[#d4ff33] shadow-[0_0_50px_rgba(212,255,51,0.05)]"
                  : "bg-white/[0.01] border-white/10 hover:border-white/20"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-10 bg-[#d4ff33] text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Active Deployment
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white mb-3">
                  {tier.name}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed h-12">
                  {tier.description}
                </p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold text-white tracking-tighter">
                    {tier.price === "Custom" ? "Custom" : `$${tier.price}`}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-zinc-500 font-mono text-sm">/mo</span>
                  )}
                </div>
                <p className="text-[#d4ff33] text-[10px] font-mono mt-4 uppercase tracking-widest">
                  {tier.setup}
                </p>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {tier.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-sm text-zinc-400 group"
                  >
                    <span className="text-[#d4ff33] text-lg leading-none mt-0.5">•</span>
                    <span className="group-hover:text-zinc-200 transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/contact" className="w-full">
                <button
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${
                    tier.popular
                      ? "bg-[#d4ff33] text-black hover:shadow-[0_0_30px_rgba(212,255,51,0.3)] hover:scale-[1.02]"
                      : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {tier.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* NYC Locality Note */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl bg-white/[0.02] border border-white/5 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#d4ff33]/10 flex items-center justify-center">
              <span className="text-[#d4ff33] text-xs font-mono">NY</span>
            </div>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
              Physical Nodes & On-Site Production available in NYC Metro
            </p>
          </div>
          <p className="text-zinc-600 text-[10px] font-mono italic">
            v3.2 // Neural Core OS
          </p>
        </div>
      </div>
    </section>
  );
}