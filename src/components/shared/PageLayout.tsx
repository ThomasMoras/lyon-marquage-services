"use client";
import { useEffect, useState } from "react";
import { EditableSectionCard } from "@/components/shared/EditableSectionCard";
import EditableCarousel from "@/components/shared/EditableCarousel";

interface PageLayoutProps {
  pageType: "home" | "broderie";
}

export function PageLayout({ pageType }: PageLayoutProps) {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch(`/api/section?type=${pageType}`)
      .then((res) => res.json())
      .then(setSections);
  }, [pageType]);

  return (
    <div className="flex flex-col">
      <section className="h-screen w-full">
        <EditableCarousel section={pageType} />
      </section>

      <section className="container mx-auto py-16">
        <div className="space-y-16">
          {sections.map((section) => (
            <EditableSectionCard
              key={section.id}
              section={section}
              onSave={async (updated) => {
                await fetch("/api/section", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updated),
                });
              }}
            />
          ))}
        </div>
      </section>

      {/* <ContentSection section={pageType} /> */}
    </div>
  );
}
