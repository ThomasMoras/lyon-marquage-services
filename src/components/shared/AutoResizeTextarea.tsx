"use client";

import React, { useRef, useEffect, ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "@/lib/utils";

// This extends HTMLTextAreaElement props (standard textarea props)
export interface AutoResizeTextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  minHeight?: number;
}

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  ({ className, minHeight = 100, ...props }, forwardedRef) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Function to adjust height
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";

      // Set the height to scrollHeight or minHeight, whichever is greater
      const newHeight = Math.max(textarea.scrollHeight, minHeight);
      textarea.style.height = `${newHeight}px`;
    };

    // Set up resize observer to handle initial render and window resizes
    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Initial height adjustment
      adjustHeight();

      // Use ResizeObserver to detect changes that might affect layout
      const resizeObserver = new ResizeObserver(() => {
        adjustHeight();
      });

      resizeObserver.observe(textarea);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Adjust height when value changes
    useEffect(() => {
      adjustHeight();
    }, [props.value]);

    // Set ref using both forwarded ref and internal ref
    const setRef = (element: HTMLTextAreaElement) => {
      textareaRef.current = element;

      // Handle forwarded ref
      if (typeof forwardedRef === "function") {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    };

    return (
      <textarea
        ref={setRef}
        className={cn(
          "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "overflow-hidden",
          className
        )}
        style={{
          resize: "none",
          minHeight: `${minHeight}px`,
        }}
        onChange={(e) => {
          // Call the original onChange
          if (props.onChange) {
            props.onChange(e);
          }
          // Adjust height after the change
          setTimeout(adjustHeight, 0);
        }}
        {...props}
      />
    );
  }
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";
