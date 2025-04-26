"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  items: FAQItem[];
  className?: string;
  sectionKeywords?: string;
}

export default function FAQ({
  title = "Questions fréquentes",
  items,
  className = "",
  sectionKeywords = "",
}: FAQProps) {
  // État pour stocker l'URL de la page
  const [pageUrl, setPageUrl] = useState<string>("");

  // Effet pour récupérer l'URL actuelle côté client
  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  // Préparer les données pour le schema.org FAQPage
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "id": item.id,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer.replace(/<[^>]*>?/gm, ""), // Supprimer les balises HTML pour le schema
      },
    })),
    "url": pageUrl,
    "keywords": sectionKeywords || title,
  };

  return (
    <section className={`py-16 px-6 bg-gray-50 ${className}`} id="faq-section">
      <div className="max-w-4xl mx-auto">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}

        <Accordion type="single" collapsible className="w-full">
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              itemScope
              itemType="https://schema.org/Question"
            >
              <AccordionTrigger className="text-xl font-semibold text-left" itemProp="name">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <div itemProp="text" className="text-gray-700">
                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Schéma JSON-LD pour le SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </section>
  );
}
