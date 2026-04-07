"use client";

import { Suspense } from "react";
import { NewsletterForm, NewsletterHistory, SMTPSettings } from "@/src/features/(dashboard)/admin/components";
import { Loader2, Mail, History, Send, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export default function AdminNewsletterPage() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-jakarta flex items-center gap-3">
                        <Mail className="h-8 w-8 text-primary-600" />
                        Newsletter Management
                    </h1>
                    <p className="text-gray-500 mt-1">Compose updates and configure delivery settings (Zoho, SMTP, API).</p>
                </div>
            </div>

            <Tabs defaultValue="compose" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[500px] mb-6">
                    <TabsTrigger value="compose" className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Compose
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        Sent History
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        SMTP Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="compose" className="space-y-4">
                    <Suspense fallback={
                        <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                        </div>
                    }>
                        <NewsletterForm />
                    </Suspense>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <Suspense fallback={
                        <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                        </div>
                    }>
                        <NewsletterHistory />
                    </Suspense>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Suspense fallback={
                        <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                        </div>
                    }>
                        <SMTPSettings />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}
