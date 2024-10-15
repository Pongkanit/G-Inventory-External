/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: "/home",
                destination: "/",
                permanent: true, // Set to false if the redirect is temporary
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "drive.google.com",
            },
            {
                protocol: "https",
                hostname: "ik.imagekit.io",
            },
        ],
    },
};

module.exports = nextConfig;
