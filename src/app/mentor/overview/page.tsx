"use client";

export default function MentorOverviewPage() {
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-black-800 text-2xl font-semibold">Mentor Overview</h1>
                <p className="text-gray-500 mt-1 text-sm">Welcome back! Here&apos;s your dashboard summary.</p>
            </div>
            <div className="border-greys-200 rounded-xl border bg-white p-8 text-center">
                <p className="text-gray-500">Your mentor stats and upcoming sessions will appear here.</p>
            </div>
        </div>
    );
}
