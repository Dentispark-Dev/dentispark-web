"use client";

import { Footer } from "@/src/components/layouts/footer";
import Header from "@/src/components/layouts/header";
import PricingComparison from "@/src/features/payments/components/pricing-comparison";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Spacer for navbar padding */}
      <div className="h-20 lg:h-32" />
      
      <PricingComparison />
      
      <Footer />
    </main>
  );
}
