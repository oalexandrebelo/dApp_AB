/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    reactStrictMode: true,

    // Turbopack config (Next.js 16 requirement)
    turbopack: {},

    // Webpack configuration
    webpack: (config, { isServer }) => {
        // Optimize bundle size
        if (!isServer) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // Vendor chunk for node_modules
                        vendor: {
                            name: 'vendor',
                            chunks: 'all',
                            test: /node_modules/,
                            priority: 20,
                        },
                        // Common chunk for shared code
                        common: {
                            name: 'common',
                            minChunks: 2,
                            chunks: 'all',
                            priority: 10,
                            reuseExistingChunk: true,
                            enforce: true,
                        },
                        // CCTP chunk (lazy loaded)
                        cctp: {
                            name: 'cctp',
                            test: /[\\/]lib[\\/]cctp[\\/]/,
                            chunks: 'all',
                            priority: 30,
                        },
                        // Bridge utilities chunk
                        bridge: {
                            name: 'bridge',
                            test: /[\\/]lib[\\/]bridge[\\/]/,
                            chunks: 'all',
                            priority: 25,
                        },
                    },
                },
            };
        }

        // Fix for React Native dependencies in web build
        config.resolve.fallback = {
            ...(config.resolve.fallback || {}),
            '@react-native-async-storage/async-storage': false,
        };

        return config;
    },

    // Image optimization
    images: {
        domains: [],
        formats: ['image/avif', 'image/webp'],
    },

    // Experimental features
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    },
};

module.exports = withBundleAnalyzer(withPWA(nextConfig));
