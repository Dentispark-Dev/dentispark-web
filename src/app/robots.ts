import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about-us", "/services", "/mentors", "/scholarships", "/become-a-mentor", "/contact-us", "/pricing", "/sign-up", "/login"],
        disallow: ["/admin", "/api", "/overview", "/profile", "/messages", "/ai-hub"],
      },
    ],
    sitemap: "https://www.dentispark.com/sitemap.xml",
  };
}
