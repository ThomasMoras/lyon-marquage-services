"use client";
import { useEffect, useState } from "react";
import { EditableSectionCard } from "@/components/shared/EditableSectionCard";
import EditableCarousel from "@/components/shared/EditableCarousel";
import { PageSectionProps, Section } from "@/types";
import { useSession } from "next-auth/react";

export function PageLayout({ pageSection }: PageSectionProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch(`/api/section?type=${pageSection}`)
      .then((res) => res.json())
      .then(setSections);
  }, [pageSection]);

  useEffect(() => {
    if (status === "authenticated") {
      console.log("is connected as admin");
      setIsAdmin(true);
    }
  }, [status]);

  return (
    <div className="flex flex-col">
      <section className="h-screen w-full">
        <EditableCarousel pageSection={pageSection} isAdmin={isAdmin} />
      </section>

      <section id={"start-" + pageSection} className="container mx-auto py-16">
        <div className="space-y-16">
          {sections.map((section) => (
            <EditableSectionCard
              pageSection={pageSection}
              key={section.id}
              section={section}
              isAdmin={isAdmin}
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
