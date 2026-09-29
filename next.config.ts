import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "persona-portraits.osirisbalonga.workers.dev",
        pathname: "/portraits/v1/**",
      },
    ],
  },
};

const withMDX = createMDX({});
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withMDX(nextConfig));
