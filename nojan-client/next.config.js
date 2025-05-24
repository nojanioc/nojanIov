const nextConfig = {
  api: {
    bodyParser: true,
  },
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx"],
  env: {
    BASE_URL: process.env.BASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AUTH_PROVIDER_KEY: process.env.AUTH_PROVIDER_KEY,
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
