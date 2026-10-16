// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: 'res.cloudinary.com' },
//       { protocol: 'https', hostname: 'images.pexels.com' },
//       { protocol: 'https', hostname: 'images.unsplash.com' },
//        { protocol: 'https', hostname: 'placehold.co' },
//       { protocol: 'https', hostname: 'via.placeholder.com' },
//     ],
//     unoptimized: true,
//   },
//     // ✅ FIX: Allow quality 75 and 82
//     qualities: [75, 82],

//   async rewrites() {
//     const backendUrl = process.env.BACKEND_URL;
//     if (!backendUrl) return [];

//     // ✅ Strip trailing slash
//     const cleanBackendUrl = backendUrl.replace(/\/$/, '');

//     return [
//       {
//         source: '/api/:path*',
//         destination: `${cleanBackendUrl}/api/:path*`,
//       },
//     ];
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],

    // ✅ FIX: qualities belongs INSIDE the images object
    qualities: [75, 82],

    formats: ['image/avif', 'image/webp'],

    // ⚠️ Removed `unoptimized: true` — see note below
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) return [];

    const cleanBackendUrl = backendUrl.replace(/\/$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${cleanBackendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;