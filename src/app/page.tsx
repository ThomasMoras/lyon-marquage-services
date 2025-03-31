"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SchemaOrg from "@/components/shared/SchemaOrg";
import EditableCarousel from "@/components/shared/editable/EditableCarousel";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { IoIosHome } from "react-icons/io";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FaClockRotateLeft } from "react-icons/fa6";

export default function Home() {
  const { status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      console.log("is connected as admin");
      setIsAdmin(true);
    }
  }, [status]);

  return (
    <div className="flex flex-col w-full">
      {/* Section Hero avec le carousel éditable */}
      <section className="h-screen w-full">
        <EditableCarousel pageSection="home" isAdmin={isAdmin} />
      </section>

      {/* Nos prestations */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">NOS PRESTATIONS</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Découvrez nos différentes techniques de marquage pour donner vie à vos projets
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sérigraphie */}
            <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 5h10v2h2V3H5v4h2V5zm12 8V9h-2v2H7V9H5v4h2v-2h10v2h2zm-2 4H7v-2H5v4h14v-4h-2v2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Sérigraphie</h3>
              <p className="text-gray-600 text-center mb-4">
                Idéale pour les grandes quantités avec un rendu qualitatif et durable
              </p>
              <a
                href="/prestations/serigraphie"
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                En savoir plus →
              </a>
            </div>

            {/* Broderie */}
            <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.5 9.5c.3-.8.8-1.5 1.5-1.9V9h1V7.1c1.9.9 3 2.9 3 5 0 1.9-1 3.7-2.5 4.5L10 15.4v1.1l2.5 1.2c2-1 3.5-3.2 3.5-5.7 0-2.5-1.4-4.7-3.5-5.7L10 7.5V6.4l2.5-1.2c2.9 1.4 5 4.3 5 7.8 0 3.4-2.1 6.4-5 7.8L10 19.5v-1.1l2.5-1.2c2-1 3.5-3.2 3.5-5.7 0-2.1-1.1-4.1-3-5V9h-1v1.1c-.7.4-1.2 1.1-1.5 1.9h1.1c.2-.4.5-.8.9-1v2.7c-.9.2-1.6.8-2 1.5v-1c.3-.4.7-.6 1-.7v-2.7c-.3.1-.6.3-.8.5H9.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Broderie</h3>
              <p className="text-gray-600 text-center mb-4">
                Un rendu premium et élégant pour vos vêtements corporate et sportifs
              </p>
              <a
                href="/prestations/broderie"
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                En savoir plus →
              </a>
            </div>

            {/* Flocage */}
            <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h4v4H7V7zm0 6h10v4H7v-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Flocage</h3>
              <p className="text-gray-600 text-center mb-4">
                Parfait pour les noms, numéros et logos sur textiles sportifs
              </p>
              <a
                href="/prestations/flocage"
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                En savoir plus →
              </a>
            </div>

            {/* Impression */}
            <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h4v4H7V7zm0 6h10v4H7v-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Impression</h3>
              <p className="text-gray-600 text-center mb-4">
                Parfait pour les noms, numéros et logos sur textiles sportifs
              </p>
              <a
                href="/prestations/impression"
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                En savoir plus →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">NOS AVANTAGES</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Pourquoi choisir Lyon Marquage pour vos projets de personnalisation ?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Prix avantageux */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <RiMoneyEuroCircleLine className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Prix avantageux</h3>
              <p className="text-gray-600 text-center">
                Des tarifs dégressifs adaptés aux grandes et petites quantités
              </p>
            </div>

            {/* Délais rapides */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <FaClockRotateLeft className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Délais rapides</h3>
              <p className="text-gray-600 text-center">
                Production express possible pour vos projets urgents
              </p>
            </div>

            {/* Pour tous */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <BsFillPersonVcardFill className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Particuliers & Pro</h3>
              <p className="text-gray-600 text-center">
                Des solutions adaptées à tous types de clients et de projets
              </p>
            </div>

            {/* Production locale */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <IoIosHome className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Production locale</h3>
              <p className="text-gray-600 text-center">
                Fabriqué à Lyon, suivi personnalisé de votre projet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diversité de produits */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">DIVERSITÉ DE PRODUITS</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Un large choix d&apos;articles personnalisables pour tous vos besoins
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vêtements */}
            <div className="rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02] duration-300">
              <div className="h-64 bg-gray-200">
                <img
                  src="/api/placeholder/600/400"
                  alt="Vêtements personnalisés"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold mb-2">Vêtements</h3>
                <p className="text-gray-600 mb-4">
                  T-shirts, polos, sweats, casquettes et bien plus encore pour vos équipes ou
                  événements
                </p>
                <a
                  href="/catalogue/tshirt"
                  className="text-sky-600 hover:text-sky-700 font-semibold"
                >
                  Découvrir →
                </a>
              </div>
            </div>

            {/* Objets publicitaires */}
            <div className="rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02] duration-300">
              <div className="h-64 bg-gray-200">
                <img
                  src="/api/placeholder/600/400"
                  alt="Objets publicitaires"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold mb-2">Objets publicitaires</h3>
                <p className="text-gray-600 mb-4">
                  Goodies, cadeaux d&apos;entreprise, objets promotionnels pour valoriser votre
                  marque
                </p>
                <a
                  href="/objets-publicitaires"
                  className="text-sky-600 hover:text-sky-700 font-semibold"
                >
                  Découvrir →
                </a>
              </div>
            </div>

            {/* Signalétique */}
            <div className="rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02] duration-300">
              <div className="h-64 bg-gray-200">
                <img
                  src="/api/placeholder/600/400"
                  alt="Signalétique et impression"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold mb-2">Signalétique & Impression</h3>
                <p className="text-gray-600 mb-4">
                  Enseignes, panneaux, cartes de visite et supports de communication imprimés
                </p>
                <a href="/enseignes" className="text-sky-600 hover:text-sky-700 font-semibold">
                  Découvrir →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-sky-700/90 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">PRÊT À DONNER VIE À VOTRE PROJET ?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Contactez-nous dès aujourd&apos;hui pour un devis gratuit et personnalisé ou pour en
            savoir plus sur nos services
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-md transition-colors duration-300"
            >
              DEMANDER UN DEVIS
            </a>
            <a
              href="/catalogue"
              className="px-8 py-4 bg-transparent hover:bg-white/10 border-2 border-white text-white font-bold rounded-md transition-colors duration-300"
            >
              EXPLORER NOS PRODUITS
            </a>
          </div> */}
        </div>
      </section>

      {/* Partenaires/Marques */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">NOS MARQUES PARTENAIRES</h2>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {/* Logo 1 */}
            <div className="w-32 h-16 bg-white p-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <img
                src="/fruit_of_loom_logo.png"
                alt="Fruit of the Loom"
                className="max-w-full max-h-full"
              />
            </div>

            {/* Logo 2 */}
            <div className="w-32 h-16 bg-white p-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <img src="/gildan_logo.jpg" alt="Gildan" className="max-w-full max-h-full" />
            </div>

            {/* Logo 3 */}
            <div className="w-32 h-16 bg-white p-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <img src="/russell_logo.png" alt="Russell" className="max-w-full max-h-full" />
            </div>

            {/* Logo 4 */}
            <div className="w-32 h-16 bg-white p-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <img src="/kariban_logo.jpg" alt="Kariban" className="max-w-full max-h-full" />
            </div>

            {/* Logo 5 */}
            <div className="w-32 h-16 bg-white p-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <img src="/beechfield_logo.png" alt="Beechfield" className="max-w-full max-h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Schéma pour le SEO */}
      <SchemaOrg type="home" />
    </div>
  );
}
