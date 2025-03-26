"use client";

import { useState } from "react";
import Link from "next/link";
import CookieConsentDialog from "@/components/cookie/CookieConsentDialog";

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
      <footer className="footer">
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
          <div>All rights reserved &copy; Lyon marquage services {new Date().getFullYear()}</div>

          <div className="flex gap-4 text-sm">
            <Link href="/politique-cookies" className="hover:underline">
              Politique de cookies
            </Link>
            <button
              onClick={() => setShowCookieDialog(true)}
              className="hover:underline cursor-pointer"
            >
              Gérer les cookies
            </button>
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
