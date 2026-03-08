"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PopularResourcesPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/overview" className="flex items-center gap-1 hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4" />
                    Overview
                </Link>
                <span>/</span>
                <span className="text-gray-900">Popular Resources</span>
            </div>

            <div className="mb-6">
                <h1 className="text-black-800 text-2xl font-semibold">Popular Resources</h1>
                <p className="text-gray-500 mt-1 text-sm">Explore all popular resources recommended for you.</p>
            </div>

            <div className="border-greys-200 rounded-xl border bg-white p-8 text-center">
                <p className="text-gray-500">Resources will appear here.</p>
            </div>
        </motion.div>
    );
}
