import createBundleAnlyzer from "@next/bundle-analyzer";
import merge from "lodash/merge.js";
import TurboConfig from "./next.turbo.config.mjs";

const enabledAnalyzer = process.env.ANALYZE === "true";

const withBundleAnalyzer = createBundleAnlyzer({
  enabled: enabledAnalyzer,
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [{ hostname: "*", protocol: "https" }],
  },
};

export default withBundleAnalyzer(merge(nextConfig, TurboConfig));
