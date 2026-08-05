/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/media",
        destination: "/film",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
