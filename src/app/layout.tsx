import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/src/lib/react-query";
import { Toaster } from "sonner";
import genralSans from "@/src/lib/font";
import { ModalProvider } from "@/src/components/ui/modal-provider";
import { AuthProvider } from "@/src/providers/auth-provider";
import { FieldProvider } from "@/src/providers/field-provider";
import { DentiBuddy } from "@/src/features/ai-assistant/components/DentiBuddy";
import { GDPRBanner } from "@/src/components/common/gdpr-banner";
import { NotificationPrompt } from "@/src/features/automation/components/notification-prompt";
import { I18nProvider } from "@/src/providers/i18n-provider";
import { robotoSlab, bricolage, jakarta } from "@/src/lib/font";
import { cn } from "@/src/lib/utils";
import { PostHogProvider } from "@/src/providers/posthog-provider";

export const metadata: Metadata = {
  title: "Dentispark - Dental School Guidance & Mentorship",
  description:
    "Get expert guidance and mentorship for dental school applications. Access tools, resources, and 1:1 support to achieve your dental career goals.",
  icons: {
    icon: [
      {
        url: "/favicon.png",
        type: "image/png",
        sizes: "any",
      },
      {
        url: "/favicon.ico",
        sizes: "16x16",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={cn(jakarta.className, jakarta.variable, robotoSlab.variable, bricolage.variable)}>
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
        {/* Performance Monitoring */}
        <script async src="https://cdn.vercel-insights.com/v1/speed-insights.js"></script>
      </head>
      <body suppressHydrationWarning={true}>
        <PostHogProvider>
          <ReactQueryProvider>
            <I18nProvider>
              <AuthProvider>
                <FieldProvider>
                  {children}
                </FieldProvider>
              </AuthProvider>
            </I18nProvider>
          </ReactQueryProvider>
          <ModalProvider />
          {/* Components hidden at user request - can be toggled on later */}
          {/* <DentiBuddy /> */}
          <Toaster richColors />
          <GDPRBanner />
          {/* <NotificationPrompt /> */}
        </PostHogProvider>
      </body>
    </html>
  );
}
