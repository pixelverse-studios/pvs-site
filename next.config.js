/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/pixelverse-studios/image/upload/**'
      }
    ]
  }
};

module.exports = nextConfig;
