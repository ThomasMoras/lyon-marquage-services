// components/shared/FAQ.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  items: FAQItem[];
  className?: string;
}

export default function FAQ({ title = "Questions fréquentes", items, className = "" }: FAQProps) {
  return (
    <section className={`py-16 px-6 bg-gray-50 ${className}`}>
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
    </section>
  );
}
