/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Neural Systems Insights",
  description: "Deep dives into AI voice agents, automation, and the future of dental practice tech.",
  openGraph: {
    title: "Neural Systems Insights | Fusion AI Blog",
    description: "Expert insights on scaling clinics and businesses with high-performance AI.",
  }
};

export default async function BlogIndex() {
  const posts = await client.fetch(groq`*[_type == "post"] | order(publishedAt desc) {
    title,
    description,
    "slug": slug.current,
    publishedAt,
    "mainImage": mainImage.asset->url
  }`);

  return (
    <main className="min-h-screen bg-[#09090b] pt-32 pb-24 px-6 selection:bg-[#d4ff33] selection:text-black">
      <div className="max-w-7xl mx-auto">
        
        <div className="max-w-3xl mb-16 md:mb-24">
          <span className="text-[#d4ff33] font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
            Intelligence Archive
          </span>
          <h1 className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
            Neural Systems <br />
            <span className="text-zinc-600">Insights</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl font-light leading-relaxed">
            Technical briefings on the integration of autonomous voice agents and neural infrastructure within high-growth clinical environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post: any, i: number) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className={`group relative flex flex-col rounded-[2.5rem] bg-white/[0.02] border border-white/10 overflow-hidden transition-all duration-500 hover:border-[#d4ff33]/40 hover:bg-white/[0.04] ${
                i === 0 ? "md:col-span-2 lg:col-span-2" : "" 
              }`}
            >
              <div className={`relative w-full overflow-hidden ${
                i === 0 ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-video"
              }`}>
                {post.mainImage ? (
                  <img 
                    src={post.mainImage} 
                    alt={post.title}
                    className="object-cover w-full h-full transition-all duration-700 scale-105 group-hover:scale-100"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <span className="text-zinc-800 font-mono text-xs italic">No Signal // Fusion AI</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/20 to-transparent opacity-80" />
              </div>

              <div className="p-8 md:p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[#d4ff33] font-mono text-[10px] uppercase tracking-widest">
                    {i === 0 ? "Featured Report" : "Briefing"}
                  </span>
                  <div className="h-px w-4 bg-zinc-800" />
                  <time className="text-zinc-600 font-mono text-[10px]">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '05.2026'}
                  </time>
                </div>

                <h2 className={`font-bold text-white group-hover:text-[#d4ff33] transition-colors tracking-tight mb-4 ${
                  i === 0 ? "text-3xl md:text-5xl" : "text-2xl"
                }`}>
                  {post.title}
                </h2>

                <p className="text-zinc-500 text-sm md:text-base leading-relaxed line-clamp-2 font-light mb-8">
                  {post.description || "Access the full technical documentation on this neural deployment."}
                </p>

                <div className="mt-auto flex items-center gap-2 text-white font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                  Read Full Report <span className="text-[#d4ff33]">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-32 text-center border-t border-white/5 pt-20">
          <h3 className="text-white text-2xl font-bold mb-4 tracking-tighter">Stay Synchronized.</h3>
          <p className="text-zinc-500 text-sm mb-8">New intelligence reports are broadcasted bi-weekly.</p>
          <Link href="/contact" className="text-[#d4ff33] font-mono text-xs uppercase tracking-widest hover:text-white transition-colors">
            Connect for Deployment →
          </Link>
        </div>
      </div>
    </main>
  );
}