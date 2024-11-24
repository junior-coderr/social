/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com", // For GitHub avatars
      "lh3.googleusercontent.com", // For Google avatars
      "api.dicebear.com", // For your avatar API
      // Add any other domains you need
    ],
  },
};

module.exports = nextConfig;
