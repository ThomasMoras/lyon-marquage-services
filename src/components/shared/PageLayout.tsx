"use client";
import { useEffect, useState } from "react";
import { SectionContainer } from "@/components/shared/editable/EditableSectionCard";
import EditableCarousel from "@/components/shared/editable/EditableCarousel";
import { Section } from "@/types";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { SectionType } from "@prisma/client";

interface PageLayoutProps {
  pageSection: SectionType;
}

export function PageLayout({ pageSection }: PageLayoutProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const { status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

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

  const handleSaveSection = async (updatedSection: Section) => {
    try {
      // Format the section for the API
      const sectionToUpdate = {
        id: updatedSection.id,
        title: updatedSection.title || "",
        description: updatedSection.description || "",
        imageUrl: updatedSection.imageUrl || "",
        imageLeft: updatedSection.imageLeft || false,
        type: pageSection, // Ajout du type pour s'assurer qu'il est conservé
        order: updatedSection.order,
      };

      const response = await fetch("/api/section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionToUpdate),
      });

      if (!response.ok) throw new Error("Failed to update section");

      // Update the section in the local state
      setSections((currentSections) =>
        currentSections.map((section) =>
          section.id === updatedSection.id ? updatedSection : section
        )
      );

      toast({
        title: "Success",
        description: "Section updated successfully",
      });
    } catch (error) {
      console.error("Error updating section:", error);
      toast({
        title: "Error",
        description: "Failed to save section. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSection = async (id: string) => {
    try {
      const response = await fetch(`/api/section/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete section");

      // Remove the section from the local state
      setSections((currentSections) => currentSections.filter((section) => section.id !== id));

      toast({
        title: "Success",
        description: "Section deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting section:", error);
      toast({
        title: "Error",
        description: "Failed to delete section. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddSection = async () => {
    try {
      // Find max order to put new section at the end
      const maxOrder =
        sections.length > 0 ? Math.max(...sections.map((section) => section.order || 0)) : -1;

      // Create a new section with default values
      const newSection = {
        title: "New Section Title",
        description: "Add your description here",
        imageUrl: "/api/placeholder/400/400",
        imageLeft: false,
        type: pageSection,
        order: maxOrder + 1, // Add at the end
      };

      const response = await fetch("/api/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSection),
      });

      if (!response.ok) throw new Error("Failed to create section");

      const createdSection = await response.json();

      // Add the new section to the local state
      setSections((currentSections) => [...currentSections, createdSection]);

      toast({
        title: "Success",
        description: "New section created successfully",
      });
    } catch (error) {
      console.error("Error adding section:", error);
      toast({
        title: "Error",
        description: "Failed to add new section. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col">
      <section className="h-screen w-full">
        <EditableCarousel pageSection={pageSection} isAdmin={isAdmin} />
      </section>

      <section id={`start-${pageSection}`.toLocaleLowerCase()} className="container mx-auto py-16">
        <SectionContainer
          sections={sections}
          onSave={handleSaveSection}
          onDelete={handleDeleteSection}
          onAdd={handleAddSection}
          pageSection={pageSection}
          isAdmin={isAdmin}
        />
      </section>
    </div>
  );
}
