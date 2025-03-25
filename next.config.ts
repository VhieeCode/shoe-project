import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yureghataownvaqgdlbf.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/items-images/**",
      },
    ],
  },
};

export default nextConfig;
