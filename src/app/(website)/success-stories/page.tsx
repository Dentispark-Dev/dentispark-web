"use client";

import { SuccessStories } from "@/src/features/(dashboard)/community-hub/components/success-stories";
import { mockSuccessStories } from "@/src/features/(dashboard)/community-hub/constants";

export default function SuccessStoriesPage() {
    return (
        <main className="min-h-screen pt-20">
            <div className="container mx-auto px-4">
                <SuccessStories stories={mockSuccessStories} />
            </div>
        </main>
    );
}
