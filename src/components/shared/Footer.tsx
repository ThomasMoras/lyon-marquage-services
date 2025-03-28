"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  MessageCircleIcon,
} from "lucide-react";
import CookieConsentDialog from "@/components/cookie/CookieConsentDialog";
import Image from "next/image";

const Footer = () => {
  const [showCookieDialog, setShowCookieDialog] = useState(false);

  // Fonction pour charger les paramètres de cookies actuels
  const loadCookieSettings = () => {
    if (typeof window === "undefined") {
      return {
        necessary: true,
        preferences: false,
        analytics: false,
        marketing: false,
      };
    }

    try {
      const cookieConsent = document.cookie
        .split("; ")
        .find((row) => row.startsWith("cookie_consent="));

      if (cookieConsent) {
        const consentValue = cookieConsent.split("=")[1];
        return JSON.parse(decodeURIComponent(consentValue));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres de cookies:", error);
    }

    return {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    };
  };

  return (
    <>
      <footer className="bg-sky-950 text-white py-16">
        <div className="container mx-auto px-6">
          {/* Section supérieure */}
          <div className="flex flex-col md:flex-row justify-between mb-12">
            {/* Partie gauche - À propos */}
            <div className="mb-8 md:mb-0 md:w-1/3">
              <div className="flex items-center mb-6">
                <div className="relative h-14 w-14 mr-3 bg-white rounded-full overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <Image
                    src="/logo_svg.svg"
                    fill
                    alt="Logo Lyon Marquage Service"
                    className="p-1"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Lyon Marquage</h2>
                </div>
              </div>
              <p className="mb-6 text-gray-300 italic">
                Lyon Marquage exerce ses activités de broderie, d&apos;impression et de sérigraphie
                sur textile dans la région de Lyon depuis 9 ans. Nous sommes à l&apos;écoute de nos
                clients et disposons d&apos;une large gamme de produits et de supports.
              </p>
            </div>

            {/* Partie droite - Informations de contact */}
            <div className="flex flex-col md:flex-row gap-20 md:w-2/3 md:justify-end">
              {/* Coordonnées */}
              <div>
                <h3 className="text-lg font-semibold mb-3 border-b border-sky-400 pb-2 inline-block">
                  Nous contacter
                </h3>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-sky-400 mr-2 mt-1 flex-shrink-0" />
                    <p>
                      89 Rue du Dauphiné
                      <br />
                      69800 Saint-Priest (France)
                    </p>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-sky-400 mr-2 flex-shrink-0" />
                    <a href="tel:0951522880" className="hover:text-sky-300 transition-colors">
                      09 51 52 28 80
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MailIcon className="h-5 w-5 text-sky-400 mr-2 flex-shrink-0" />
                    <a
                      href="mailto:info@lyonmarquage.fr"
                      className="hover:text-sky-300 transition-colors"
                    >
                      info@lyonmarquage.fr
                    </a>
                  </div>
                </div>
              </div>

              {/* Horaires */}
              <div>
                <h3 className="text-lg font-semibold mb-3 border-b border-sky-400 pb-2 inline-block">
                  Heures d&apos;ouverture
                </h3>
                <div className="space-y-1 mt-4">
                  <div className="flex items-start">
                    <ClockIcon className="h-5 w-5 text-sky-400 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p>Lundi - Vendredi</p>
                      <p>9h00 - 18h00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accès rapide */}
              <div>
                <h3 className="text-lg font-semibold mb-3 border-b border-sky-400 pb-2 inline-block">
                  Accès rapide
                </h3>
                <ul className="space-y-1 mt-4">
                  <li>
                    <Link href="/presentation" className="hover:text-sky-300 transition-colors">
                      À propos de nous
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-sky-300 transition-colors">
                      Devis gratuit
                    </Link>
                  </li>
                  <li>
                    <Link href="/catalogue" className="hover:text-sky-300 transition-colors">
                      Catalogue
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/objets-publicitaires"
                      className="hover:text-sky-300 transition-colors"
                    >
                      Objets publicitaires
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-sky-300 transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section des réseaux sociaux et bouton de discussion */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-sky-900 pt-8">
            <div className="flex space-x-4 mb-6 md:mb-0">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="bg-sky-900 p-2 rounded-full hover:bg-sky-700 transition-colors"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="bg-sky-900 p-2 rounded-full hover:bg-sky-700 transition-colors"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="bg-sky-900 p-2 rounded-full hover:bg-sky-700 transition-colors"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>

            <div className="flex items-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 border border-sky-400 rounded-md hover:bg-sky-800 transition-colors"
              >
                <MessageCircleIcon className="h-5 w-5 mr-2" />
                Discutons de votre projet
              </Link>
            </div>
          </div>

          {/* Section cookies et copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-sky-900 pt-6 mt-6">
            <div className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Lyon Marquage. Tous droits réservés.
            </div>

            <div className="flex gap-4 text-sm text-gray-300 mt-4 md:mt-0">
              <Link href="/politique-cookies" className="hover:text-sky-300 transition-colors">
                Politique de cookies
              </Link>
              <button
                onClick={() => setShowCookieDialog(true)}
                className="hover:text-sky-300 transition-colors cursor-pointer"
              >
                Gérer les cookies
              </button>
            </div>
          </div>
        </div>
      </footer>

      {showCookieDialog && (
        <CookieConsentDialog
          initialSettings={loadCookieSettings()}
          onSave={(settings) => {
            // Convertir settings en string pour le stockage
            const consentValue = JSON.stringify(settings);

            // Créer un cookie qui expire dans 6 mois
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 6);

            // Stockage du consentement
            document.cookie = `cookie_consent=${encodeURIComponent(
              consentValue
            )};expires=${expiryDate.toUTCString()};path=/;SameSite=Lax`;

            setShowCookieDialog(false);
          }}
          onClose={() => setShowCookieDialog(false)}
        />
      )}
    </>
  );
};

export default Footer;
