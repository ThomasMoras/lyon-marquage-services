/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.europeancatalog.com",
      },
      {
        protocol: "https",
        hostname: "cdn.toptex.com",
      },
      {
        protocol: "https",
        hostname: "api.toptex.io",
      },
      {
        protocol: "https",
        hostname: "idpdoknycqsflntwtsjo.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      // Redirection des anciennes URLs vers les nouvelles
      {
        source: "/prestations/impression-textile",
        destination: "/prestations/impression",
        permanent: true,
      },
      {
        source: "/prestations/impression-transfert",
        destination: "/prestations/impression",
        permanent: true,
      },
      {
        source: "/flocage/sport",
        destination: "/prestations/flocage",
        permanent: true,
      },
      {
        source: "/flocage",
        destination: "/prestations/flocage",
        permanent: true,
      },
      {
        source: "/presentation",
        destination: "/",
        permanent: true,
      },
      {
        source: "/broderie",
        destination: "/prestations/broderie",
        permanent: true,
      },

      // Redirections pour les pages de mots-clés vers les pages principales
      // Sérigraphie et variantes
      {
        source: "/services/serigraphie",
        destination: "/prestations/serigraphie",
        permanent: true,
      },
      {
        source: "/services/serigraphie-publicitaire",
        destination: "/prestations/serigraphie",
        permanent: true,
      },
      {
        source: "/services/serigraphie-tee-shirt",
        destination: "/prestations/serigraphie",
        permanent: true,
      },
      {
        source: "/services/transfert-serigraphique",
        destination: "/prestations/serigraphie",
        permanent: true,
      },

      // Flocage et marquage textile
      {
        source: "/services/flocage-textile",
        destination: "/prestations/flocage",
        permanent: true,
      },
      {
        source: "/services/marquage-textile",
        destination: "/",
        permanent: true,
      },

      // Impression textile
      {
        source: "/services/impression-textile",
        destination: "/prestations/impression",
        permanent: true,
      },
      {
        source: "/services/impression-sur-tee-shirt",
        destination: "/prestations/impression",
        permanent: true,
      },
      {
        source: "/services/impression-directe",
        destination: "/prestations/impression",
        permanent: true,
      },

      // Broderie
      {
        source: "/services/broderie-personnalisee",
        destination: "/prestations/broderie",
        permanent: true,
      },

      // Objets publicitaires et signalétique
      {
        source: "/services/kakemono",
        destination: "/objets-publicitaires",
        permanent: true,
      },
      {
        source: "/services/marquage-publicitaire",
        destination: "/objets-publicitaires",
        permanent: true,
      },
      {
        source: "/services/personnalisation-tee-shirt",
        destination: "/imprimerie",
        permanent: true,
      },
      {
        source: "/services/totem",
        destination: "/enseignes",
        permanent: true,
      },

      // Marquage véhicule et signalétique
      {
        source: "/services/marquage-vehicule",
        destination: "/enseignes",
        permanent: true,
      },
      {
        source: "/services/marquage-industriel",
        destination: "/enseignes",
        permanent: true,
      },
      {
        source: "/services/lettrage-adhesif",
        destination: "/enseignes",
        permanent: true,
      },
      {
        source: "/services/lettrage-publicitaire",
        destination: "/enseignes",
        permanent: true,
      },
      {
        source: "/services/habillage-facade",
        destination: "/enseignes",
        permanent: true,
      },
      {
        source: "/services/banderole",
        destination: "/enseignes",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
