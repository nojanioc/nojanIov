const fs = require("fs");
const path = require("path");

const isPrd = process.env.NODE_ENV === "production";
const env = isPrd ? ".env.prd" : ".env.local";

const envFile = fs.readFileSync(path.resolve(process.cwd(), env), "utf8");
const envVars = envFile.split("\n").reduce((acc, line) => {
  const [key, value] = line.split("=");
  acc[key] = value;
  return acc;
}, {});

const nextConfig = {
  api: {
    bodyParser: true,
  },
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx"],
  env: {
    ...envVars,
  },
  images: {
    domains: ["www.youtube.com"],
  },
  videos: {
    domains: ["www.youtube.com"],
  },
  experimental: {
    esmExternals: "loose", // <-- add this
    serverComponentsExternalPackages: ["mongoose"], // <-- and this
  },
};

module.exports = nextConfig;
