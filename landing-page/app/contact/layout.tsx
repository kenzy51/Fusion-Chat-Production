import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Strategy Call",
  description: "Secure market exclusivity for your practice. Apply for a Neural Core deployment.",
  openGraph: {
    title: "Partner with Fusion AI | Market Exclusivity",
    description: "Ready to automate? Request a strategy call for our Neural Voice and Growth Engine solutions.",
    url: "https://www.getfusionchat.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}