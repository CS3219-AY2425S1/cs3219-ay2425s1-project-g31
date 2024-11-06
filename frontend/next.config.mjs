/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: true,
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.devtool = 'source-map'
        }
        return config
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'png.pngtree.com',
                port: '',
            },
        ],
    },
}

export default nextConfig
