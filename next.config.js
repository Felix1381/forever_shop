/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'www.foreverliving.com', 'favpng.com', 'fr.forever-all.com', 'www.aloe-vera-beaute.ch', 'zen-aloe.com', 'img.youtube.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.foreverliving.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.foreverliving.com',
      },
      {
        protocol: 'https',
        hostname: 'fr.forever-all.com',
      },
      {
        protocol: 'https',
        hostname: 'www.aloe-vera-beaute.ch',
      },
      {
        protocol: 'https',
        hostname: 'zen-aloe.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
}

module.exports = nextConfig
