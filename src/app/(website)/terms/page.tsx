"use client";

import Container from "@/src/components/layouts/container";

export default function TermsPage() {
    return (
        <main className="min-h-screen pt-20">
            <Container className="py-16">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose prose-gray max-w-none">
                    <p>Please read these terms carefully before using DentiSpark.</p>
                    <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
                    <p>By accessing DentiSpark, you agree to be bound by these Terms of Service.</p>
                    <p className="mt-4 text-gray-500 italic">Remaining sections are being updated...</p>
                </div>
            </Container>
        </main>
    );
}
