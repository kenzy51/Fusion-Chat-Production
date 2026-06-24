import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.getfusionchat.com"),
  title: "Neural Infrastructure & Intelligent Chat Modules",
  description:
    "Explore our suite of conversational AI modules: Sandbox Free instances, Pro Chatbot layers, and low-latency Voice Elite pipelines built for high-ticket acquisition.",
  keywords: [
    "Fusion Chat AI Services",
    "AI Business Scheduling Widget",
    "Autonomous Lead Qualification",
    "High-Ticket B2B Chat Architecture",
    "Multi-Tenant Chatbot Pipeline",
    "ElevenLabs Voice AI Integration",
  ],
  openGraph: {
    title: "Neural Infrastructure | Fusion Chat AI",
    description: "Advanced data-driven automation pipelines for premium brands. Bridge the gap between digital web visitors and confirmed calendar bookings.",
    url: "https://www.getfusionchat.com/services",
    images: [
      {
        url: "/services-og.png", 
        width: 1200,
        height: 630,
        alt: "Fusion Chat AI Service Infrastructure",
      },
    ],
  },
};

export default function ServicesPage() {
  const services = [
    {
      title: "Autonomous Chat Concierge",
      status: "Pro / Elite",
      desc: "High-performance embeddable text agents that mirror your brand's voice. Operates with sub-100ms API response times for instant user qualification and lead capturing.",
      features: [
        "Lightweight JS Snippet Embed",
        "Context Memory Injection",
        "Custom Theme UI Architecture",
      ],
    },
    {
      title: "Low-Latency Voice Nodes",
      status: "Elite Exclusive",
      desc: "Advanced neural voice clones that handle outbound routing, phone inbound scheduling, and support desk tasks natively with sub-500ms conversation pipelines.",
      features: [
        "ElevenLabs Engine Sync",
        "Emotional Tone Calibration",
        "Custom Phone Number Mapping",
      ],
    },
    {
      title: "Intelligent Scheduling",
      status: "Pro / Elite",
      desc: "Zero-touch booking engines that link your chat interface directly with your internal calendar systems (Cal.com, Calendly) or private company booking databases.",
      features: [
        "Real-time Availability Check",
        "Automated Calendar Sync",
        "Instant Booking Validation",
      ],
    },
    {
      title: "Sandbox Staging Instances",
      status: "Free Tier",
      desc: "Isolated staging environments designed for engineers to test vector chunking logic and context matching before running production deployments.",
      features: [
        "Corporate Email Validation",
        "14-Day Session Cache",
        "Standard Core Vector Sync",
      ],
    },
    {
      title: "Chat Analytics & Tracking",
      status: "Live",
      desc: "Full pipeline transparency. Every dialogue thread is instantly archived with structured event payloads to log visitor intent parameters.",
      features: [
        "Real-Time Interaction Logs",
        "Intent Trajectory Mapping",
        "Searchable Transcript Arrays",
      ],
    },
    {
      title: "AI-Powered Summarization",
      status: "Live",
      desc: "Stop parsing raw message strings. Receive an operational one-sentence summary of every customer interaction pushed straight to your dashboard.",
      features: [
        "Executive Intent Digests",
        "Action Item Extraction",
        "Automatic Lead Grading",
      ],
    },
    {
      title: "Precision Re-engagement",
      status: "Operational",
      desc: "Automated event-driven sequences triggered by user choices. If a high-value lead drops off before finishing a booking, the system fires target fallbacks.",
      features: [
        "Drop-off Hook Triggers",
        "Webhook/API Event Pipelines",
        "Personalized State Maps",
      ],
    },
    {
      title: "Ecosystem Integration Services",
      status: "Live",
      desc: "Bespoke system architecture bridging your frontend scripts with your backend controllers. Custom tailored code engines designed to map seamlessly into complex systems.",
      features: [
        "NestJS Backend Extensions",
        "MongoDB Data Schema Sync",
        "Enterprise API Bridging",
      ],
    },
  ];

  return (
    <main className="bg-[#09090b] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-6">
          Neural Infrastructure
        </h1>
        <p className="text-zinc-400 text-xl max-w-2xl mb-16">
          Advanced conversational automation layers. We bridge the gap between
          digital traffic, voice lines, and locked-in calendar consultations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-[#d4ff33]/50 transition-all flex flex-col"
            >
              <span className="text-[#d4ff33] font-mono text-[10px] uppercase tracking-[0.2em]">
                {s.status}
              </span>
              <h3 className="text-2xl font-bold text-white mt-4 mb-4">
                {s.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed flex-grow mb-8">
                {s.desc}
              </p>
              <ul className="space-y-2 border-t border-white/5 pt-6">
                {s.features.map((f, j) => (
                  <li
                    key={j}
                    className="text-[12px] text-zinc-500 flex items-center gap-2"
                  >
                    <span className="text-[#d4ff33]/50">•</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}