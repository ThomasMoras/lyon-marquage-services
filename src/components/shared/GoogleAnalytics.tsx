"use client";

import Script from "next/script";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function GoogleAnalyticsTracker({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lorsque la route change, envoyer une nouvelle vue de page à Google Analytics
    const url = pathname + searchParams.toString();
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return null;
}

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_location: window.location.href,
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      {/* Wrapper le composant qui utilise useSearchParams dans un Suspense */}
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
      </Suspense>
    </>
  );
}
