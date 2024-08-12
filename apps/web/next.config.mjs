/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.mypinata.cloud',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
        port: '',
      },
    ],
  },
}

export default nextConfig
