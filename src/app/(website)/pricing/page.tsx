"use client";

import { Footer } from "@/src/components/layouts/footer";
import { Navbar } from "@/src/components/layouts/navbar";
import PricingComparison from "@/src/features/payments/components/pricing-comparison";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Spacer for navbar padding */}
      <div className="h-20 lg:h-32" />
      
      <PricingComparison />
      
      <Footer />
    </main>
  );
}
