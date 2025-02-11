"use client";
import { useEffect, useState } from "react";
import { EditableSectionCard } from "@/components/shared/EditableSectionCard";
import EditableCarousel from "@/components/shared/EditableCarousel";

export function PageLayout({ pageSection }: PageSections) {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch(`/api/section?type=${pageSection}`)
      .then((res) => res.json())
      .then(setSections);
  }, [pageSection]);

  return (
    <div className="flex flex-col">
      <section className="h-screen w-full">
        <EditableCarousel pageSection={pageSection} />
      </section>

      <section id={"start-" + pageSection} className="container mx-auto py-16">
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
    </div>
  );
}
