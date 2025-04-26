"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ModeToggle } from "./ToogleTheme";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { menuItems } from "@/constants/prestation";
import { robotoMono } from "@/app/fonts";
import { cn } from "@/lib/utils";

// Re-use the MenuLink component for consistency
const MenuLink = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    onSelect?: () => void;
    children?: React.ReactNode;
  }
>(({ className, title, children, onSelect, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-200",
        "hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 dark:hover:from-blue-900/30 dark:hover:to-red-900/30",
        "hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-sm",
        "border-l-2 border-transparent hover:border-l-2 hover:border-blue-500",
        className
      )}
      onClick={onSelect}
      {...props}
    >
      <div className="text-base font-medium leading-none">{title}</div>
      {children && (
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
      )}
    </a>
  );
});
MenuLink.displayName = "MenuLink";

const NavbarMobile = ({ isScrolled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prestationsOpen, setPrestationsOpen] = useState(false);

  // Ferme le menu si l'utilisateur scrolle
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => {
        setIsOpen(false);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Header bar with logo and menu button */}
      <div className="bg-gradient-to-r from-blue-50 to-red-50 dark:from-blue-950/40 dark:to-red-950/40">
        <div
          className={`flex items-center justify-between ${isScrolled ? "p-2" : "p-3"} transition-all duration-200 max-w-[1440px] mx-auto`}
        >
          <Link href="/" className="flex items-center gap-2">
            <div
              className={`relative transition-all duration-200 ${isScrolled ? "w-8 h-8" : "w-10 h-10"}`}
            >
              <Image
                src="/images/static/logo.svg"
                fill
                alt="Logo Lyon Marquage Service"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-end">
              <h1
                className={`${robotoMono.className} text-xl font-bold text-blue-600 dark:text-blue-400 text-shadow-sm`}
              >
                Lyon
              </h1>
              <span className="mx-1 text-gray-400">|</span>
              <h1
                className={`${robotoMono.className} text-lg font-semibold text-red-600 dark:text-red-400 tracking-wide text-shadow-sm`}
              >
                Marquage
              </h1>
            </div>
          </Link>

          <div className="flex items-center">
            <Link
              href="/contact"
              className="mr-3 px-3 py-1.5 text-sm rounded-md text-white font-medium
                bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700
                shadow-sm hover:shadow transition-all duration-200"
            >
              Contact
            </Link>
            <ModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 ml-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X size={24} className="text-red-600 dark:text-red-400" />
              ) : (
                <Menu size={24} className="text-blue-600 dark:text-blue-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 bg-white dark:bg-gray-900 z-50 shadow-lg border-t border-blue-100 dark:border-blue-900 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800 max-w-[1440px] mx-auto">
            {/* Prestations dropdown */}
            <div className="py-1">
              <button
                onClick={() => setPrestationsOpen(!prestationsOpen)}
                className="flex items-center justify-between w-full p-4 text-left text-gray-700 dark:text-gray-200
                  hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-900/40
                  hover:text-blue-700 dark:hover:text-blue-300"
              >
                <span className="text-lg font-medium">Services de Marquage</span>
                <ChevronDown
                  className={`transition duration-300 ${
                    prestationsOpen ? "rotate-180" : ""
                  } h-5 w-5 text-blue-500`}
                  aria-hidden="true"
                />
              </button>

              {prestationsOpen && (
                <div className="bg-gray-50 dark:bg-gray-800/50">
                  {menuItems.map((menu) => (
                    <MenuLink
                      key={menu.title}
                      href={menu.href}
                      title={menu.title}
                      onSelect={() => {
                        setPrestationsOpen(false);
                        setIsOpen(false);
                      }}
                      className="border-l-2 border-l-blue-300 dark:border-l-blue-700 ml-2"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Direct links with alternating styles */}
            <Link
              href="/objets-publicitaires"
              className="block p-4 text-lg font-medium text-gray-700 dark:text-gray-200
                hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-900/40
                hover:text-red-700 dark:hover:text-red-300 border-l-4 border-transparent hover:border-l-4 hover:border-red-500"
              onClick={() => setIsOpen(false)}
            >
              Objets Publicitaires
            </Link>

            <Link
              href="/imprimerie"
              className="block p-4 text-lg font-medium text-gray-700 dark:text-gray-200
                hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-900/40
                hover:text-blue-700 dark:hover:text-blue-300 border-l-4 border-transparent hover:border-l-4 hover:border-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Impression
            </Link>

            <Link
              href="/enseignes"
              className="block p-4 text-lg font-medium text-gray-700 dark:text-gray-200
                hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-900/40
                hover:text-red-700 dark:hover:text-red-300 border-l-4 border-transparent hover:border-l-4 hover:border-red-500"
              onClick={() => setIsOpen(false)}
            >
              Enseignes
            </Link>

            {/* Footer information */}
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Lyon Marquage Service</span>
              <span className="text-sm text-gray-500">☎ 04.XX.XX.XX.XX</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarMobile;
