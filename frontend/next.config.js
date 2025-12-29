/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'your-vercel-app.vercel.app'], // Add your Vercel app domain here
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL ? 
          `${process.env.NEXT_PUBLIC_API_URL}/:path*` : 
          'http://localhost:5000/api/:path*',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  // Configure the build output directory to 'dist' to match Vercel's configuration
  distDir: 'dist',
  // Enable static exports for static site generation
  output: 'export',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
};

module.exports = nextConfig;
