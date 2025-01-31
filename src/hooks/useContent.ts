import { useState, useEffect } from "react";

interface ContentItem {
  value: string;
  type: string;
  version: number;
}

interface ContentState {
  [key: string]: ContentItem;
}

export function useContent(section: string) {
  const [content, setContent] = useState<ContentState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [section]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/content?section=${section}`);
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (key: string, value: string): Promise<void> => {
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          value,
          section,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update content");
      }

      const updatedContent = await response.json();

      // Mettre à jour le state local
      setContent((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: updatedContent.value,
          version: updatedContent.version,
        },
      }));
    } catch (error) {
      console.error("Error updating content:", error);
      throw error; // Propager l'erreur pour la gestion dans EditableField
    }
  };

  return {
    content,
    loading,
    updateContent,
  };
}
