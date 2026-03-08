"use client";

import Container from "@/src/components/layouts/container";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-20">
            <Container className="py-16">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-gray max-w-none">
                    <p>Your privacy is important to us. This policy explains how we handle your data.</p>
                    <h2 className="text-2xl font-semibold mt-6 mb-4">1. Data Collection</h2>
                    <p>We collect information you provide directly to us when using our services.</p>
                    <p className="mt-4 text-gray-500 italic">Remaining sections are being updated...</p>
                </div>
            </Container>
        </main>
    );
}
