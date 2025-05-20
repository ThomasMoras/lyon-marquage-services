"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SchemaOrg from "@/components/shared/SchemaOrg";
import { SEOMetadata } from "@/components/shared/SEOMetadata";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { IoIosHome } from "react-icons/io";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FaClockRotateLeft } from "react-icons/fa6";
import Image from "next/image";
import { SectionType } from "@prisma/client";
import Link from "next/link";
import { homeFAQItems } from "@/constants/faqData";
import FAQ from "@/components/shared/FAQ";
import EditableCarousel from "@/components/shared/Carousel/EditableCarousel";

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
      {/* Composants SEO */}
      <SEOMetadata pageSection={SectionType.HOME} />

      {/* Section Hero avec le carousel éditable */}
      <section className="h-screen w-full">
        <EditableCarousel pageSection={SectionType.HOME} isAdmin={isAdmin} />
      </section>

      {/* Section d'introduction optimisée pour le SEO */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Marquage Textile et Objets Publicitaires à Lyon
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Bienvenue chez <strong>Lyon Marquage</strong>, votre expert en{" "}
            <strong>sérigraphie</strong>, <strong>flocage textile</strong> et{" "}
            <strong>marquage publicitaire</strong> à Lyon. Nous proposons des solutions
            personnalisées de qualité pour les entreprises, associations et particuliers.
          </p>
          <p className="text-lg text-gray-700">
            Notre atelier situé à Saint-Priest réalise tous vos projets de{" "}
            <strong>personnalisation de t-shirts</strong> et textiles avec des techniques variées
            adaptées à vos besoins.
          </p>
        </div>
      </section>

      {/* Nos prestations */}
      <section id="start" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">NOS PRESTATIONS</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Découvrez nos différentes techniques de marquage pour donner vie à vos projets
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Sérigraphie */}
            <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-200 hover:shadow-md transition-shadow">
              <div className="relative w-24 h-24 flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-105 shadow-xl rounded-full bg-white overflow-hidden">
                <Image
                  src="/images/static/serigraphie_icon.png"
                  fill
                  alt="Sérigraphie Logo"
                  className="object-contain translate-y-1"
                  priority
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Sérigraphie sur textile</h3>
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
            <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-200 hover:shadow-md transition-shadow">
              <div className="relative w-24 h-24 flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-105 shadow-xl rounded-full bg-white overflow-hidden">
                <Image
                  src="/images/static/embroidery_icon.png"
                  fill
                  alt="Broderie Logo"
                  className="object-contain"
                  priority
                />
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
            <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-200 hover:shadow-md transition-shadow">
              <div className="relative w-24 h-24 flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-105 shadow-xl rounded-full bg-white overflow-hidden">
                <Image
                  src="/images/static/flocage_icon.png"
                  fill
                  alt="Flocage Logo"
                  className="object-contain"
                  priority
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Flocage textile</h3>
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

            {/* Impression - centré sous Broderie */}
            <div className="md:col-start-2 md:col-span-1 lg:col-start-2 lg:col-span-1 flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-200 hover:shadow-md transition-shadow">
              <div className="relative w-24 h-24 flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-105 shadow-xl rounded-full bg-white overflow-hidden">
                <Image
                  src="/images/static/impression_icon.jpg"
                  fill
                  alt="Impression Logo"
                  className="object-contain translate-y-1"
                  priority
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Impression textile</h3>
              <p className="text-gray-600 text-center mb-4">
                Idéal pour les designs détaillés et les petites séries
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
      <section id="avantages" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">NOS AVANTAGES</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Pourquoi choisir Lyon Marquage pour vos projets de personnalisation ?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Prix avantageux */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <RiMoneyEuroCircleLine className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Prix avantageux</h3>
              <p className="text-gray-600 text-center">
                Des tarifs dégressifs adaptés aux grandes et petites quantités
              </p>
            </div>

            {/* Délais rapides */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <FaClockRotateLeft className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Délais rapides</h3>
              <p className="text-gray-600 text-center">
                Production express possible pour vos projets urgents
              </p>
            </div>

            {/* Pour tous */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <BsFillPersonVcardFill className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Particuliers & Pro</h3>
              <p className="text-gray-600 text-center">
                Des solutions adaptées à tous types de clients et de projets
              </p>
            </div>

            {/* Production locale */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
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
      <section id="produits" className="py-20 px-6 bg-white">
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
                  src="images/static/vetement.jpg"
                  alt="Vêtements personnalisés"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold mb-2">Personnalisation de t-shirts</h3>
                <p className="text-gray-600 mb-4">
                  T-shirts, polos, sweats, casquettes et bien plus encore pour vos équipes ou
                  événements
                </p>
                <a href="/imprimerie" className="text-sky-600 hover:text-sky-700 font-semibold">
                  Découvrir →
                </a>
              </div>
            </div>

            {/* Objets publicitaires */}
            <div className="rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02] duration-300">
              <div className="h-64 bg-gray-200">
                <img
                  src="/images/static/objet_publictaire.jpg"
                  alt="Objets publicitaires"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold mb-2">Marquage publicitaire</h3>
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
                  src="images/static/signalitic.jpg"
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

      <FAQ
        title="Questions fréquentes"
        items={homeFAQItems}
        sectionKeywords="marquage saint priest, marquage textile lyon, sérigraphie, flocage textile, personnalisation de tee-shirt, impression textile, marquage publicitaire"
      />

      {/* CTA */}
      <section className="py-20 px-6 bg-sky-700/90 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">PRÊT À DONNER VIE À VOTRE PROJET ?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Contactez-nous dès aujourd&apos;hui pour un devis gratuit et personnalisé ou pour en
            savoir plus sur nos services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-md transition-colors duration-300"
            >
              DEMANDER UN DEVIS
            </Link>
          </div>
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
                src="/images/static/fruit_of_loom_logo.png"
                alt="Fruit of the Loom"
                className="max-w-full max-h-full"
              />
            </div>

            {/* Logo 2 */}
            <div className="w-32 h-16 bg-white p-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <img
                src="/images/static/gildan_logo.jpg"
                alt="Gildan"
                className="max-w-full max-h-full"
              />
            </div>

            {/* Logo 3 */}
            <div className="w-32 h-16 bg-white p-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <img
                src="/images/static/russell_logo.png"
                alt="Russell"
                className="max-w-full max-h-full"
              />
            </div>

            {/* Logo 4 */}
            <div className="w-32 h-16 bg-white p-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <img
                src="/images/static/kariban_logo.jpg"
                alt="Kariban"
                className="max-w-full max-h-full"
              />
            </div>

            {/* Logo 5 */}
            <div className="w-32 h-16 bg-white p-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <img
                src="/images/static/beechfield_logo.png"
                alt="Beechfield"
                className="max-w-full max-h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Schéma pour le SEO */}
      <SchemaOrg type={SectionType.HOME} />
    </div>
  );
}
