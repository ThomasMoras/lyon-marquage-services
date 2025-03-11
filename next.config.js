// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "media.europeancatalog.com", // Ajoutez le domaine de l'API TopTex
      "cdn.toptex.com", // Potentiellement un autre domaine pour les images
      "api.toptex.io", // Le domaine principal de l'API au cas où
    ],
    // Vous pouvez également utiliser remotePatterns pour plus de contrôle
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'media.europeancatalog.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
  // Autres configurations existantes...
};

module.exports = nextConfig;
