/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return {
        fallback: [
            {
                source: '/:path*',
                destination: `http://localhost:3003/:path*`,
            },
        ],
    };
  },
}

module.exports = nextConfig
