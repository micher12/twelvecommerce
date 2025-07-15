import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images:{
        remotePatterns: [
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                pathname: "/v0/b/**"
            }
        ]
    },
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev','192.168.18.2'],
};

export default nextConfig;
