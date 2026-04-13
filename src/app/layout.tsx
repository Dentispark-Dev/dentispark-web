import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/src/lib/react-query";
import { Toaster } from "sonner";
import { ModalProvider } from "@/src/components/ui/modal-provider";
import { AuthProvider } from "@/src/providers/auth-provider";
import { FieldProvider } from "@/src/providers/field-provider";
import { I18nProvider } from "@/src/providers/i18n-provider";
import { robotoSlab, bricolage, jakarta } from "@/src/lib/font";
import { cn } from "@/src/lib/utils";
import { PostHogProvider } from "@/src/providers/posthog-provider";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { CookieConsent } from "@/src/components/molecules/cookie-consent";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dentispark.com"),
  title: {
    default: "Dentispark – Dental School Guidance & Mentorship",
    template: "%s | Dentispark",
  },
  description:
    "Get expert guidance and mentorship for dental school applications. Access tools, resources, and 1:1 support to achieve your dental career goals.",
  keywords: ["dental school", "dentistry mentorship", "UCAT", "MMI prep", "personal statement", "dental applications", "UK dentistry"],
  authors: [{ name: "Dentispark Team" }],
  creator: "Dentispark",
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
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.dentispark.com",
    siteName: "Dentispark",
    title: "Dentispark – The #1 Platform for Dental School Success",
    description: "Free expert mentorship, elite clinical guidance, and AI-driven outcomes for the next generation of dental professionals.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dentispark – Dental School Guidance & Mentorship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dentispark – The #1 Platform for Dental School Success",
    description: "Free expert mentorship, elite clinical guidance, and AI-driven outcomes for the next generation of dental professionals.",
    images: ["/images/og-image.png"],
    creator: "@dentispark",
  },
  alternates: {
    canonical: "https://www.dentispark.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning className={cn(jakarta.className, jakarta.variable, robotoSlab.variable, bricolage.variable)}>
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
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
            <Toaster richColors />
            <CookieConsent />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
