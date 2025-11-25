import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'i5-mx.walmartimages.com',
      },
      {
        protocol: 'https',
        hostname: 'www.cityclub.com.mx',
      },
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com.mx',
      },
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
      }
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
