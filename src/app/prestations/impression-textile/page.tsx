import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ImpressionTextile = () => {
  const features = [
    {
      title: "Qualité Premium",
      description:
        "Nos techniques de broderie professionnelle garantissent un rendu exceptionnel sur tous vos textiles.",
    },
    {
      title: "Sur-mesure",
      description:
        "Personnalisation complète selon vos besoins spécifiques et votre identité visuelle.",
    },
    {
      title: "Délais Rapides",
      description: "Production et livraison rapides pour répondre à vos contraintes de temps.",
    },
  ];

  const products = [
    {
      title: "T-shirts",
      description: "Broderie sur t-shirts professionnels",
      image: "/api/placeholder/400/300",
    },
    {
      title: "Polos",
      description: "Élégance et style pour votre entreprise",
      image: "/api/placeholder/400/300",
    },
    {
      title: "Vêtements de travail",
      description: "Robuste et professionnel",
      image: "/api/placeholder/400/300",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gray-900 text-white">
        <img
          src="/api/placeholder/1920/600"
          alt="Broderie textile"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            Broderie Textile Professionnelle
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl">
            Donnez vie à vos projets avec notre expertise en broderie textile
          </p>
          <Button className="mt-8 text-lg px-8 py-6" variant="outline">
            Demander un devis
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi choisir notre service de broderie ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Solutions de Broderie</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="outline" className="text-white border-white">
                      En savoir plus
                    </Button>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mt-4 mb-2">{product.title}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à démarrer votre projet ?</h2>
          <p className="text-xl mb-8">
            Contactez-nous dès aujourd'hui pour discuter de vos besoins en broderie textile
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-white border-white">
              Demander un devis
            </Button>
            <Button className="bg-white text-gray-900 hover:bg-gray-100">Nous contacter</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImpressionTextile;
