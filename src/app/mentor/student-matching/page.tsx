"use client";

export default function StudentMatchingPage() {
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-black-800 text-2xl font-semibold">Student Matching</h1>
                <p className="text-gray-500 mt-1 text-sm">Review and connect with students seeking mentorship.</p>
            </div>
            <div className="border-greys-200 rounded-xl border bg-white p-8 text-center">
                <p className="text-gray-500">Student matches will appear here.</p>
            </div>
        </div>
    );
}
