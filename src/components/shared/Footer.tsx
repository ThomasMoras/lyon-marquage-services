"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import CookieConsentDialog from "@/components/cookie/CookieConsentDialog";
import Image from "next/image";
import { GrContact } from "react-icons/gr";
import { PiCursorClick } from "react-icons/pi";
import { robotoMono } from "@/app/fonts";

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

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-gradient-to-b from-sky-900 to-sky-950 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section supérieure avec logo et description */}
          <div className="flex flex-col md:flex-row justify-between mb-12">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <div className="flex items-center mb-6">
                <div className="relative h-16 w-16 mr-3 bg-white rounded-full overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-lg">
                  <Image
                    src="/images/static/logo.svg"
                    fill
                    alt="Logo Lyon Marquage Service"
                    className="p-1"
                    priority
                  />
                </div>
                <div className="inline-flex">
                  <span>
                    <h2 className={`${robotoMono.className} text-3xl font-bold text-shadow inline`}>
                      Lyon Marquage
                    </h2>
                  </span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md italic text-base">
                Lyon Marquage exerce ses activités de broderie, d&apos;impression et de sérigraphie
                sur textile dans la région de Lyon depuis 9 ans. Nous sommes à l&apos;écoute de nos
                clients et disposons d&apos;une large gamme de produits et de supports.
              </p>

              {/* Réseaux sociaux */}
              <div className="mt-6">
                <p className="text-sm font-medium mb-3 text-sky-300 text-center">Suivez-nous</p>
                <div className="flex space-x-4 justify-center">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-sky-800 p-2 rounded-full hover:bg-sky-600 transition-all duration-300 hover:scale-110 shadow-md"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-sky-800 p-2 rounded-full hover:bg-sky-600 transition-all duration-300 hover:scale-110 shadow-md"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-sky-800 p-2 rounded-full hover:bg-sky-600 transition-all duration-300 hover:scale-110 shadow-md"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Grille de liens et informations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:w-2/3">
              {/* Nous contacter */}
              <div>
                <h3 className="text-lg font-semibold mb-4 relative">
                  <span className="border-b-2 inline-flex border-sky-400 pb-1">
                    <GrContact className="h-5 w-5 text-sky-400 mr-3 mt-1 flex-shrink-0" />
                    Nous contacter
                  </span>
                </h3>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start group">
                    <MapPin className="h-5 w-5 text-sky-400 mr-3 mt-1 flex-shrink-0 group-hover:text-sky-300 transition-colors" />
                    <p className="group-hover:text-sky-200 transition-colors">
                      89 Rue du Dauphiné
                      <br />
                      69800 Saint-Priest (France)
                    </p>
                  </div>
                  <div className="flex items-center group">
                    <Phone className="h-5 w-5 text-sky-400 mr-3 flex-shrink-0 group-hover:text-sky-300 transition-colors" />
                    <a href="tel:0951522880" className="hover:text-sky-300 transition-colors">
                      09 51 52 28 80
                    </a>
                  </div>
                  <div className="flex items-center group">
                    <Mail className="h-5 w-5 text-sky-400 mr-3 flex-shrink-0 group-hover:text-sky-300 transition-colors" />
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
                <h3 className="text-lg font-semibold mb-4 relative">
                  <span className="border-b-2 inline-flex border-sky-400 pb-1">
                    <Clock className="h-5 w-5 text-sky-400 mr-3 mt-1 flex-shrink-0" />
                    Heures d&apos;ouverture
                  </span>
                </h3>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start">
                    <div className="space-y-3">
                      <div className="bg-sky-900/30 p-3 rounded-lg hover:bg-sky-800/30 transition-colors">
                        <p className="font-medium text-sky-200">Lundi à Jeudi</p>
                        <ul className="space-y-1 text-sm mt-1 text-gray-300">
                          <li>Matin : Fermé (sauf livraison)</li>
                          <li>
                            Après-midi : <span className="font-semibold text-white">14h - 18h</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-sky-900/30 p-3 rounded-lg hover:bg-sky-800/30 transition-colors">
                        <p className="font-medium text-sky-200">Vendredi</p>
                        <ul className="space-y-1 text-sm mt-1 text-gray-300">
                          <li>
                            Matin : <span className="font-semibold text-white">9h - 12h</span>
                          </li>
                          <li>Après-midi : Fermé</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accès rapide */}
              <div>
                <h3 className="text-lg font-semibold mb-4 relative">
                  <span className="border-b-2 inline-flex border-sky-400 pb-1">
                    <PiCursorClick className="h-5 w-5 text-sky-400 mr-3 mt-1 flex-shrink-0 rotate-90" />
                    Accès rapide
                  </span>
                </h3>
                <ul className="space-y-2 mt-4">
                  <li className="group">
                    <Link
                      href="/presentation"
                      className="flex items-center hover:text-sky-300 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 text-sky-400 group-hover:translate-x-1 transition-transform" />
                      À propos de nous
                    </Link>
                  </li>
                  <li className="group">
                    <Link
                      href="/contact"
                      className="flex items-center hover:text-sky-300 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 text-sky-400 group-hover:translate-x-1 transition-transform" />
                      Devis gratuit
                    </Link>
                  </li>
                  <li className="group">
                    <Link
                      href="/catalogue"
                      className="flex items-center hover:text-sky-300 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 text-sky-400 group-hover:translate-x-1 transition-transform" />
                      Catalogue
                    </Link>
                  </li>
                  <li className="group">
                    <Link
                      href="/objets-publicitaires"
                      className="flex items-center hover:text-sky-300 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 text-sky-400 group-hover:translate-x-1 transition-transform" />
                      Objets publicitaires
                    </Link>
                  </li>
                  <li className="group">
                    <Link
                      href="/contact"
                      className="flex items-center hover:text-sky-300 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 text-sky-400 group-hover:translate-x-1 transition-transform" />
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section inférieure - Droits et cookies */}
          <div className="pt-8 mt-8 border-t border-sky-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © {currentYear} Lyon Marquage. Tous droits réservés.
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <Link href="/mentions-legales" className="hover:text-sky-300 transition-colors">
                  Mentions légales
                </Link>
                <Link
                  href="/politique-confidentialite"
                  className="hover:text-sky-300 transition-colors"
                >
                  Politique de confidentialité
                </Link>
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
