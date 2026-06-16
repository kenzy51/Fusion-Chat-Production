
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neural Infrastructure & Services",
  description:
    "Explore our suite of AI solutions: Neural Voice Identity, Intelligent Scheduling, and Cinematic Content Production engineered for dental growth.",
  keywords: [
    "Neural Voice Identity",
    "AI Medical Scheduling",
    "ElevenLabs Dental Integration",
    "Clinical Videography NYC",
    "Dental Ad Agency NYC",
    "AI Patient Summarization",
  ],
  openGraph: {
    title: "Neural Infrastructure | Fusion AI Agency",
    description: "Advanced AI automation for modern practices. Bridge the gap between leads and appointments.",
    url: "https://www.fusionaiagency.com/services",
    images: [
      {
        url: "/services-og.png", // Recommended: a custom image showing your service grid
        width: 1200,
        height: 630,
        alt: "Fusion AI Service Infrastructure",
      },
    ],
  },
};

export default function ServicesPage() {
  const services = [
    {
      title: "Neural Voice Identity",
      status: "Operational",
      desc: "Instant voice cloning that mirrors your practice's best staff. Sub-500ms response times for seamless, human-like patient interaction.",
      features: [
        "One-Click ElevenLabs Integration",
        "Emotional Tone Mapping",
        "Custom Brand Vocabulary",
      ],
    },
    {
      title: "Intelligent Scheduling",
      status: "Operational",
      desc: "Zero-touch appointment booking that syncs directly with your practice management software and Google Calendar.",
      features: [
        "Real-time Availability Check",
        "Conflict Resolution",
        "Instant Booking Confirmation",
      ],
    },
    {
      title: "Call Analytics & Insight",
      status: "Live",
      desc: "Full transparency into every interaction. Our engine generates high-fidelity recordings and AI-powered transcripts for every call.",
      features: [
        "Automated Call Recording",
        "Sentiment Analysis",
        "Searchable Transcripts",
      ],
    },
    {
      title: "AI-Powered Summarization",
      status: "Live",
      desc: "Stop reading through logs. Get a concise 1-sentence summary of every patient interaction delivered to your dashboard instantly.",
      features: [
        "Executive Call Summaries",
        "Patient Intent Detection",
        "Action Item Extraction",
      ],
    },
    {
      title: "Precision Email Campaigns",
      status: "Operational",
      desc: "Automated follow-ups triggered by call outcomes. If a patient drops off, Fusion AI initiates a custom re-engagement sequence.",
      features: [
        "Outcome-Based Triggers",
        "SendGrid Email Automation",
        "Personalized Patient Journeys",
      ],
    },
    {
      title: "Growth Dashboard",
      status: "Beta",
      desc: "A centralized hub to monitor call volume, booking conversion rates, and patient acquisition costs in real-time.",
      features: [
        "Live Performance Metrics",
        "Call History Archiving",
        "ROI Tracking",
      ],
    },
    {
      title: "Precision Paid Acquisition",
      status: "Operational",
      desc: "High-intent Meta and Google Search campaigns engineered for dental growth. We architect automated lead flows that feed directly into our neural voice infrastructure.",
      features: [
        "Local NYC Geo-Targeting",
        "Intent-Based Search Arbitrage",
        "ROAS-Focused Optimization",
      ],
    },
    {
      title: "Cinematic Content Production",
      status: "Live in NYC",
      desc: "We produce high-end clinical films designed specifically for your ad creative. We capture professional excellence to build immediate patient trust.",
      features: [
        "4K Clinical Videography",
        "Professional Lighting & Audio",
        "Premium Practice Branding",
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
          Advanced AI automation for modern practices. We bridge the gap between
          inbound leads and confirmed appointments.
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
