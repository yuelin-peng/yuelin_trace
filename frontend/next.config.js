/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['grpc-web'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    NEXT_PUBLIC_OSS_BUCKET: process.env.NEXT_PUBLIC_OSS_BUCKET || '',
    NEXT_PUBLIC_OSS_REGION: process.env.NEXT_PUBLIC_OSS_REGION || 'oss-cn-hangzhou',
  },
};

module.exports = nextConfig;