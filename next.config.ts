import type { NextConfig } from "next";
import path from "path";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.transparenttextures.com",
        pathname: "/**",
      },
    ],
  },
  outputFileTracingRoot: path.resolve(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  async redirects() {
    return [
      {
        source: "/register",
        destination: "/sign-up",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/sign-up",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/contact-us",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/faqs",
        permanent: true,
      },
      {
        source: "/community",
        destination: "/community-hub",
        permanent: true,
      },
      {
        source: "/shadowing",
        destination: "/overview",
        permanent: false,
      },
      {
        source: "/checkout",
        destination: "/mentorship",
        permanent: false,
      },
      {
        source: "/payment-bridge",
        destination: "/overview",
        permanent: false,
      }
    ];
  },

  // NOTE: The /api/backend rewrite was removed. All backend API requests are now
  // handled by the catch-all route at /api/backend/[...path]/route.ts which
  // properly injects Channel-ID, Channel-Secret, and Authorization headers.

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://cdn.vercel-insights.com https://*.posthog.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://*.cloudinary.com https://lh3.googleusercontent.com https://*.googleusercontent.com",
              "connect-src 'self' https://api.dentispark.com https://*.posthog.com https://accounts.google.com https://sentry.io",
              "frame-src 'self' https://accounts.google.com",
              "frame-ancestors 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname);

    return config;
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  org: "dentispark", // Replace with your Sentry organization
  project: "dentispark-web", // Replace with your Sentry project

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
});
