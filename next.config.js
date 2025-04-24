/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.europeancatalog.com",
      },
      {
        protocol: "https",
        hostname: "cdn.toptex.com",
      },
      {
        protocol: "https",
        hostname: "api.toptex.io",
      },
      {
        protocol: "https",
        hostname: "idpdoknycqsflntwtsjo.supabase.co",
      },
    ],
  },
};

export default nextConfig;
