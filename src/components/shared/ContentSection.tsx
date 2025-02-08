"use client";
import { useContent } from "../../hooks/useContent";
// import { useSession } from "next-auth/react";
import EditableField from "./EditableField";

interface ContentSectionProps {
  section: string;
}

export function ContentSection({ section }: ContentSectionProps) {
  const { content, loading, updateContent } = useContent(section);
  //   const { data: session } = useSession();
  //   const isAdmin = session?.user?.role === "ADMIN";
  const isAdmin = true;

  if (loading) {
    return <div>Chargement...</div>;
  }

  const handleSave = async (key: string, value: string): Promise<void> => {
    try {
      await updateContent(key, value);
    } catch (error) {
      // L'erreur sera gérée par le composant EditableField
      throw error;
    }
  };

  return (
    <div className="flex flex-row">
      <EditableField
        initialValue={content["title"]?.value ?? "empty title"}
        fieldName="title"
        onSave={handleSave}
        isAdmin={isAdmin}
      />

      <EditableField
        initialValue={content["description"]?.value ?? "empty description"}
        fieldName="description"
        type="textarea"
        onSave={handleSave}
        isAdmin={isAdmin}
      />
    </div>
  );
}
