interface Window {
  gtag: (
    command: "config" | "event" | "js" | "set",
    targetId: string,
    config?: Record<string, any> | Date
  ) => void;
  dataLayer: any[];
}

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, any> | Date
    ) => void;
    dataLayer: any[];
  }
}

// Exporter un type vide pour que TypeScript traite ce fichier comme un module
export {};
