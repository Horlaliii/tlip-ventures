import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components (`cacheComponents` / `partialPrefetching`) stay off: on the
  // Workers runtime Next.js warns it "cannot guarantee" them and requests hang.
  // Revisit when @opennextjs/cloudflare supports them.
  images: {
    // All product images come from Cloudinary; see lib/cloudinary-loader.ts.
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// Lets `next dev` use Cloudflare bindings (env vars, secrets) from wrangler.jsonc.
import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
