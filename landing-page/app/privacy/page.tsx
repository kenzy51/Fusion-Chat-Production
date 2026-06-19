import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data & Security Policy",
  description: "Learn how Fusion AI protects your clinical data. We utilize AES-256 encryption, HIPAA-ready frameworks, and secure ElevenLabs infrastructure.",
  robots: {
    index: false, 
    follow: true,
  },
  openGraph: {
    title: "Security & Privacy | Fusion AI",
    description: "Our commitment to neural voice security and data integrity.",
    url: "https://www.fusionaiagency.com/privacy-policy",
  },
};
export default function PrivacyPolicy() {
  return (
    <main className="bg-[#09090b] min-h-screen pt-32 pb-24 px-6 selection:bg-[#d4ff33] selection:text-black">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <span className="text-[#d4ff33] font-mono text-xs uppercase tracking-widest">Compliance & Safety</span>
          <h1 className="text-white text-5xl font-bold mt-4 tracking-tighter">Data & Security <span className="text-zinc-500">Policy</span></h1>
        </div>

        <div className="grid gap-8">
          {/* Section 1 */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl group hover:border-white/20 transition-colors">
            <div className="flex items-start gap-4">
              <span className="text-[#d4ff33] font-mono text-lg">01</span>
              <div>
                <h2 className="text-white text-xl font-semibold mb-4">Neural Voice Security</h2>
                <p className="text-zinc-400 leading-relaxed max-w-2xl">
                  Fusion AI utilizes <span className="text-white">ElevenLabs&apos; encrypted infrastructure</span> for voice
                  cloning. Audio samples used for training are processed in a secure
                  environment and are only accessible by the Practice owner. We never share your voice models with third-party datasets.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl group hover:border-white/20 transition-colors">
            <div className="flex items-start gap-4">
              <span className="text-[#d4ff33] font-mono text-lg">02</span>
              <div>
                <h2 className="text-white text-xl font-semibold mb-4">Call Recording & Transcripts</h2>
                <p className="text-zinc-400 leading-relaxed max-w-2xl">
                  In accordance with <span className="text-white">New York one-party consent laws</span>, Fusion AI provides
                  recording and transcription services. Transcripts are generated via
                  deep-learning models and stored using <span className="text-[#d4ff33]">AES-256 encryption</span>. Data is purged according to your practice&apos;s retention policy.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl group hover:border-white/20 transition-colors">
            <div className="flex items-start gap-4">
              <span className="text-[#d4ff33] font-mono text-lg">03</span>
              <div>
                <h2 className="text-white text-xl font-semibold mb-4">HIPAA-Ready Framework</h2>
                <p className="text-zinc-400 leading-relaxed max-w-2xl">
                  Our technical stack—including <span className="text-white">Groq, Deepgram, and SendGrid</span>—is
                  architected with data privacy as a priority. We implement strict
                  access controls (IAM) to ensure patient summaries and contact details are handled with industrial-grade security.
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-20 pt-8 border-t border-white/5 text-zinc-600 text-sm font-mono uppercase tracking-tighter">
          Last Updated: May 2026 // Fusion AI Technical Operations
        </footer>
      </div>
    </main>
  );
}