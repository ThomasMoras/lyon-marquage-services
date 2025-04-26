"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { menuItems } from "@/constants/prestation";
import { ModeToggle } from "./ToogleTheme";
import { robotoMono } from "@/app/fonts";
import { ChevronDown } from "lucide-react";

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

const NavbarLarge = ({ isScrolled = false }) => {
  const [prestationsOpen, setPrestationsOpen] = useState(false);

  return (
    <div className="hidden md:block w-full bg-gradient-to-r from-blue-50 to-red-50 dark:from-blue-950/40 dark:to-red-950/40">
      <div className="max-w-[1620px] mx-auto px-4 lg:px-6">
        <div
          className={`flex items-center justify-between ${isScrolled ? "h-14" : "h-16"} transition-all duration-200`}
        >
          {/* Logo Section */}
          <div className="flex items-center flex-wrap md:flex-nowrap">
            <Link
              href="/"
              className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
            >
              <div
                className={`relative transition-all duration-200 ${isScrolled ? "w-10 h-10" : "w-12 h-12"}`}
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
                  className={`${robotoMono.className} text-2xl font-bold text-blue-600 dark:text-blue-400 text-shadow-sm`}
                >
                  Lyon
                </h1>
                <h1
                  className={`${robotoMono.className} text-xl ml-3 font-semibold text-red-600 dark:text-red-400 tracking-wide text-shadow-sm`}
                >
                  Marquage
                </h1>
              </div>
            </Link>

            {/* Main Navigation Items */}
            <div className="flex items-center flex-wrap justify-start space-x-1 md:space-x-2 lg:space-x-3 md:ml-4 lg:ml-6 2xl:ml-10 mt-0">
              {/* Services de Marquage Dropdown */}
              <DropdownMenu open={prestationsOpen} onOpenChange={setPrestationsOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="nav-item group inline-flex h-10 items-center justify-center rounded-md bg-transparent px-2 md:px-3 py-2 text-xs md:text-sm font-medium transition-all duration-200
                    border-b-2 border-transparent hover:border-b-2 hover:border-blue-600
                    text-gray-700 dark:text-gray-200
                    hover:bg-blue-100/80 dark:hover:bg-blue-800/30 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Services
                    <span className="hidden lg:inline ml-1">de Marquage</span>
                    <ChevronDown
                      className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
                      aria-hidden="true"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="p-2 w-[300px] md:w-[400px] lg:w-[450px] bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900 shadow-lg rounded-md"
                  align="start"
                >
                  <div className="grid gap-1">
                    {menuItems.map((menu) => (
                      <MenuLink
                        key={menu.title}
                        href={menu.href}
                        title={menu.title}
                        onSelect={() => setPrestationsOpen(false)}
                      />
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Direct Links with consistent styling */}
              <Link
                href="/objets-publicitaires"
                className="nav-item h-10 inline-flex items-center justify-center rounded-md bg-transparent px-2 md:px-3 py-2 text-xs md:text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent hover:border-b-2 hover:border-red-600
                  text-gray-700 dark:text-gray-200
                  hover:bg-red-100/80 dark:hover:bg-red-800/30 hover:text-red-700 dark:hover:text-red-300 whitespace-nowrap"
              >
                Objets Publicitaires
              </Link>

              <Link
                href="/imprimerie"
                className="nav-item h-10 inline-flex items-center justify-center rounded-md bg-transparent px-2 md:px-3 py-2 text-xs md:text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent hover:border-b-2 hover:border-blue-600
                  text-gray-700 dark:text-gray-200
                  hover:bg-blue-100/80 dark:hover:bg-blue-800/30 hover:text-blue-700 dark:hover:text-blue-300 whitespace-nowrap"
              >
                Impression & Personnalisation
              </Link>

              <Link
                href="/enseignes"
                className="nav-item h-10 inline-flex items-center justify-center rounded-md bg-transparent px-2 md:px-3 py-2 text-xs md:text-sm font-medium transition-all duration-200
                  border-b-2 border-transparent hover:border-b-2 hover:border-red-600
                  text-gray-700 dark:text-gray-200
                  hover:bg-red-100/80 dark:hover:bg-red-800/30 hover:text-red-700 dark:hover:text-red-300 whitespace-nowrap"
              >
                Enseignes & Véhicules
              </Link>
            </div>
          </div>

          {/* Right aligned elements */}
          <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-6 ml-auto">
            {/* Contact button with special styling */}
            <Link
              href="/contact"
              className="inline-flex h-9 md:h-10 items-center justify-center rounded-md px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium
                bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700
                text-white shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
            >
              <span className="block md:hidden">Contact</span>
              <span className="hidden md:block">Devis & Contact</span>
            </Link>

            <div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarLarge;
