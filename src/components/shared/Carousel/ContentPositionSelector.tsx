import React from "react";
import { ContentPosition } from "@/types";

interface ContentPositionSelectorProps {
  value: ContentPosition;
  onChange: (position: ContentPosition) => void;
}

export const ContentPositionSelector = ({ value, onChange }: ContentPositionSelectorProps) => {
  const showLabels = false;
  const positions: { key: ContentPosition; label: string; visualPosition: string }[] = [
    {
      key: "top-left",
      label: "Haut Gauche",
      visualPosition: "top-2 left-2", // Visual position in the mini preview
    },
    {
      key: "top-right",
      label: "Haut Droite",
      visualPosition: "top-2 right-2", // Visual position in the mini preview
    },
    {
      key: "center",
      label: "Centre",
      visualPosition: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", // Visual position in the mini preview
    },
    {
      key: "bottom-left",
      label: "Bas Gauche",
      visualPosition: "bottom-2 left-2", // Visual position in the mini preview
    },
    {
      key: "bottom-right",
      label: "Bas Droite",
      visualPosition: "bottom-2 right-2", // Visual position in the mini preview
    },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Position du contenu
      </label>

      {/* Visual Grid Selector */}
      <div className="relative w-48 h-32 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 mx-auto">
        {/* Background pattern to represent the slide */}
        <div className="absolute inset-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded opacity-30"></div>

        {/* Position buttons */}
        {positions.map((pos) => (
          <button
            key={pos.key}
            onClick={() => onChange(pos.key)}
            className={`
              absolute w-6 h-6 rounded-full border-2 transition-all duration-200
              ${pos.visualPosition}
              ${
                value === pos.key
                  ? "bg-blue-600 border-blue-600 scale-125 shadow-lg"
                  : "bg-white dark:bg-gray-700 border-gray-400 dark:border-gray-500 hover:border-blue-400 hover:scale-110"
              }
            `}
            title={pos.label}
          >
            {value === pos.key && (
              <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            )}
          </button>
        ))}
      </div>

      {/* Text labels for accessibility */}
      {showLabels && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          {positions.map((pos) => (
            <button
              key={`label-${pos.key}`}
              onClick={() => onChange(pos.key)}
              className={`
              p-2 rounded text-center transition-colors duration-200
              ${
                value === pos.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }
            `}
            >
              {pos.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
