/* eslint-disable react/jsx-no-comment-textnodes */
import { Metadata, ResolvingMetadata } from 'next';
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import CodeBlock from "./components/CodeBlock"; // Dynamic copying engine broken out below

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const post = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      title,
      description,
      "ogImage": mainImage.asset->url
    }`,
    { slug }
  );

  if (!post) return { title: "Instance Not Found" };

  return {
    title: `${post.title} | Fusion AI Intelligence`,
    description: post.description || `Systems breakdown: ${post.title} by Fusion AI.`,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.ogImage ? [{ url: post.ogImage }] : [],
      type: "article",
    },
  };
}

// 2. STYLED PARSING MAP FOR NEURAL RICH-TEXT OUTBOUNDS
const makeCustomComponents = (): PortableTextComponents => ({
  types: {
    code: ({ value }) => (
      <CodeBlock 
        codeString={value.code || ""} 
        language={value.language || "typescript"} 
      />
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-16 mb-6 uppercase font-mono border-l-2 border-[#d4ff33] pl-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 mt-10 mb-4 font-mono">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-zinc-400 font-light leading-relaxed mb-6 text-base md:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l border-[#d4ff33]/40 pl-6 italic text-zinc-300 my-10 bg-zinc-950/40 py-4 rounded-r-2xl border-y border-r border-zinc-900">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 my-6 space-y-3 text-zinc-400 font-light text-base md:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 my-6 space-y-3 text-zinc-400 font-light text-base md:text-lg">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="marker:text-[#d4ff33]">{children}</li>,
    number: ({ children }) => <li className="marker:text-[#d4ff33] marker:font-mono">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-white shadow-sm">{children}</strong>,
    link: ({ children, value }) => {
      const isExternal = !value.href.startsWith("/");
      return (
        <a
          href={value.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[#d4ff33] hover:text-white underline underline-offset-4 decoration-[#d4ff33]/30 transition-colors font-medium"
        >
          {children}
        </a>
      );
    },
  },
});

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  // 3. SECURE DECOUPLED DATA STRUCT FETCH
  const post = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      title,
      publishedAt,
      description,
      body,
      "mainImage": mainImage.asset->url,
      "alt": mainImage.alt,
      "readTime": select(
        round(string::length(pt::text(body)) / 5 / 200) <= 1 => "1 min read",
        string(round(string::length(pt::text(body)) / 5 / 200)) + " min read"
      ),
      // Pulling relational fields from your independent author documents
      author->{
        name,
        role,
        bio,
        "avatar": image.asset->url
      }
    }`,
    { slug }
  );

  if (!post) notFound();

  const components = makeCustomComponents();

  // Structured Data Injection Blueprint for Google AI SGE Core Placement
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author?.name || "Kanat Nazarov",
      "url": "https://www.kanatnazarov.com/developer"
    }
  };

  return (
    <>
      <Script
        id="structured-sge-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-[#09090b] pt-32 pb-24 px-4 sm:px-6 selection:bg-[#d4ff33] selection:text-black relative">
        {/* Subtle geometric structural grid overlay lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f12_1px,transparent_1px),linear-gradient(to_bottom,#0f0f12_1px,transparent_1px)] bg-[size:6rem_6rem] pointer-events-none z-0 opacity-60" />

        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Back Navigation Terminal Header */}
          <Link 
            href="/blog" 
            className="group inline-flex items-center gap-2 text-zinc-500 hover:text-[#d4ff33] transition-colors mb-12 font-mono text-xs uppercase tracking-widest"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> // return_to_logs
          </Link>

          {/* Dynamic Metric Metadata Blocks */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            <span className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold">
              Active Stream
            </span>
            <span className="text-zinc-800">•</span>
            <time>
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              }) : 'Live Execution'}
            </time>
            <span className="text-zinc-800">•</span>
            <span className="text-zinc-300">{post.readTime}</span>
          </div>

          {/* Title Area */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.95] uppercase">
            {post.title}
          </h1>
          
          <p className="text-lg sm:text-xl text-zinc-400 mb-16 leading-relaxed max-w-4xl font-light">
            {post.description}
          </p>

          {post.mainImage && (
            <div className="relative w-full aspect-[21/9] mb-20 rounded-2xl overflow-hidden border border-zinc-900 group">
              <img 
                src={post.mainImage} 
                alt={post.alt || post.title} 
                className="object-cover w-full h-full opacity-80  group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-40" />
            </div>
          )}

          {/* Core Structured Content Field Block */}
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert max-w-none">
              <PortableText value={post.body} components={components} />
            </div>

            {post.author && (
              <div className="mt-24 p-6 sm:p-8 rounded-2xl bg-zinc-950/40 border border-zinc-900 relative overflow-hidden backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-start gap-6 group hover:border-zinc-800/80 transition-colors duration-300">
                <div className="absolute top-0 right-0 p-3 font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
                  Auth_Node // 01
                </div>

                {post.author.avatar ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-800 shrink-0 relative bg-zinc-900">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 font-mono font-bold shrink-0">
                    KN
                  </div>
                )}

                <div className="text-center sm:text-left space-y-2">
                  <div>
                    <h4 className="text-white font-mono font-bold text-base tracking-tight uppercase">
                      {post.author.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#d4ff33] uppercase tracking-wider font-semibold mt-0.5">
                      {post.author.role}
                    </p>
                  </div>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed">
                    {post.author.bio}
                  </p>
                  
                  {/* Dynamic Cross-Link Conversion Anchor */}
                  <div className="pt-2">
                    <a 
                      href="https://www.kanatnazarov.com/developer" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-mono text-zinc-500 hover:text-white transition-colors duration-200"
                    >
                      Verify Engineering Profile ↗
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Conversion Module */}
            <div className="mt-24 p-px bg-gradient-to-br from-zinc-800 to-transparent rounded-2xl">
              <div className="bg-[#0b0b0d] p-10 sm:p-12 rounded-[15px] text-center relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#d4ff33] opacity-[0.02] blur-[100px]" />
                
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tighter uppercase font-mono">
                  Initialize <span className="text-[#d4ff33]">Neural Infrastructure</span>
                </h3>
                <p className="text-zinc-500 mb-8 max-w-sm mx-auto text-sm font-light leading-relaxed">
                  Join premier organizations implementing autonomous logic layers to capture scaling operations.
                </p>
                
                <Link href="/contact">
                  <button className="group relative bg-zinc-900 border border-zinc-800 text-white px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:border-[#d4ff33] transition-all duration-300">
                    <span className="relative z-10 text-zinc-300 group-hover:text-black transition-colors duration-300">Initialize_Call</span>
                    <div className="absolute inset-0 bg-[#d4ff33] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 rounded-[11px]" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}