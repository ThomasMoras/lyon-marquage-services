export const CAROUSEL_CONTENT = {
  // Max width for corner positioned content
  MAX_WIDTH: "max-w-xs md:max-w-sm lg:max-w-md",

  // Spacing between content elements (same for all positions)
  SPACING: "space-y-8 md:space-y-10 lg:space-y-12",

  // Padding for content containers (Not used for nom)
  PADDING: "px-3 py-4 md:px-4 md:py-6 lg:px-6 lg:py-12",
} as const;

export const CAROUSEL_TYPOGRAPHY = {
  // Same title size for all positions
  TITLE: "text-3xl lg:text-5xl text-center",

  // Same description size for all positions
  DESCRIPTION: "text-xl md:text-2xl text-center",

  // Same divider size for all positions
  DIVIDER: "h-1 w-16 md:w-20 lg:w-24",
} as const;
