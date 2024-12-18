/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "res.cloudinary.com",
                pathname: "/dxezkqczp/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/dxezkqczp/**",
            },
        ],
    },
    // ... any other existing config
};

module.exports = nextConfig;
