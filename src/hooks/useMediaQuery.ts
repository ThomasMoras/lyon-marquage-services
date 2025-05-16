import { useState, useEffect } from "react";

/**
 * Custom hook for responsive design using media queries
 * @param query The media query to match against (e.g., "(max-width: 768px)")
 * @returns Boolean indicating whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Define update function
    const updateMatches = () => {
      setMatches(media.matches);
    };

    // Add listener
    media.addEventListener("change", updateMatches);

    // Clean up
    return () => {
      media.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
