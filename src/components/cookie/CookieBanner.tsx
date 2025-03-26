"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CookieConsentDialog from "@/components/cookie/CookieConsentDialog";

interface CookieSettings {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait son choix de cookies
    // Uniquement exécuté côté client
    if (typeof window !== "undefined") {
      const hasConsent = document.cookie
        .split("; ")
        .some((row) => row.startsWith("cookie_consent="));

      // Si pas de consentement, afficher la bannière
      if (!hasConsent) {
        // Petit délai pour ne pas afficher immédiatement au chargement
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Fonction pour accepter tous les cookies
  const acceptAllCookies = () => {
    const settings = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    };
    saveCookieSettings(settings);
    setShowBanner(false);
  };

  // Fonction pour accepter uniquement les cookies nécessaires
  const acceptNecessaryCookies = () => {
    const settings = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    };
    saveCookieSettings(settings);
    setShowBanner(false);
  };

  // Sauvegarder les paramètres de cookies
  const saveCookieSettings = (settings: CookieSettings) => {
    setCookieSettings(settings);

    // Convertir settings en string pour le stockage
    const consentValue = JSON.stringify(settings);

    // Créer un cookie qui expire dans 6 mois
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 6);

    // Stockage du consentement
    document.cookie = `cookie_consent=${encodeURIComponent(
      consentValue
    )};expires=${expiryDate.toUTCString()};path=/;SameSite=Lax`;

    // Appliquer les paramètres aux services correspondants
    if (settings.preferences) {
      // Si vous avez besoin d'activer des fonctionnalités liées aux préférences
      // Par exemple, stocker le thème sélectionné
    }

    if (settings.analytics) {
      // Si vous avez Google Analytics ou un autre outil d'analyse
      // Exemple: window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    }

    if (settings.marketing) {
      // Si vous avez des outils marketing
      // Exemple: window.gtag?.('consent', 'update', { ad_storage: 'granted' });
    }
  };

  // Ouvrir la boîte de dialogue des préférences de cookies
  const openPreferences = () => {
    setShowDialog(true);
    setShowBanner(false);
  };

  // Gérer la sauvegarde des préférences depuis la boîte de dialogue
  const handleSavePreferences = (settings: CookieSettings) => {
    saveCookieSettings(settings);
    setShowDialog(false);
  };

  // Ne rien afficher si ni la bannière ni la boîte de dialogue ne sont visibles
  if (!showBanner && !showDialog) {
    return null;
  }

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 md:p-6 z-50">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm md:text-base mb-2">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site. Ces
                  cookies nous permettent d'améliorer le contenu et les fonctionnalités du site.
                </p>
                <p className="text-xs text-gray-500">
                  <Link href="/politique-cookies" className="underline hover:text-primary">
                    En savoir plus sur notre politique de cookies
                  </Link>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm" onClick={openPreferences}>
                  Personnaliser
                </Button>
                <Button variant="outline" size="sm" onClick={acceptNecessaryCookies}>
                  Uniquement nécessaires
                </Button>
                <Button size="sm" onClick={acceptAllCookies}>
                  Accepter tous
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDialog && (
        <CookieConsentDialog
          initialSettings={cookieSettings}
          onSave={handleSavePreferences}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  );
}
