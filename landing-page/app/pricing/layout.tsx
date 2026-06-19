import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Structure | Scaling with Precision",
  description:
    "Transparent pricing for high-performance AI voice agents and full-stack patient acquisition. Choose between Neural Core automation or our comprehensive Growth Engine.",
  keywords: [
    "AI Agency Pricing",
    "Dental Marketing ROI",
    "Neural Core Cost",
    "AI Voice Agent Subscription",
    "Patient Acquisition Cost NYC",
  ],
  openGraph: {
    title: "Pricing | Fusion AI Agency",
    description: "Scale your practice with precision. Essential neural automation and full-stack growth engines for NYC practices.",
    url: "https://www.fusionaiagency.com/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}