/* eslint-disable @typescript-eslint/no-explicit-any */
import { AISapience } from "./components/AiSapience";
import { CaseStudy } from "./components/CaseStudy";
import { Comparison } from "./components/Comparison";
import { FeaturesGrid } from "./components/FeaturesGrid";
import Hero from "./components/Hero";
import { LiveProcess } from "./components/Lifelog";
import Pricing from "./components/Pricing";
import { VoiceLab } from "./components/VoiceLab";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturesGrid />
      <Comparison />
      <LiveProcess />
      <VoiceLab />
      <CaseStudy />
      <Pricing />
      <AISapience />
      {/* <CreativeEdge /> */}
    </div>
  );
}
