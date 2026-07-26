import type { NextConfig } from "next";
import { assertProductionEnvironmentPolicy } from "./src/config/production-environment";

assertProductionEnvironmentPolicy();

const DEFAULT_MEDIA_PUBLIC_BASE_URL =
  "https://res.cloudinary.com/talent-match/image/upload";

const mediaPublicBaseUrl =
  process.env.NEXT_PUBLIC_MEDIA_PUBLIC_BASE_URL?.trim() ||
  DEFAULT_MEDIA_PUBLIC_BASE_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [new URL(`${mediaPublicBaseUrl.replace(/\/+$/, "")}/**`)],
  },
};

export default nextConfig;
