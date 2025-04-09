"use client";
import Link from "next/link";
import React, { useState } from "react";
import { ModeToggle } from "./ToogleTheme";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { menuItems } from "@/constants/prestation";
import { robotoMono } from "@/app/fonts";
import { cn } from "@/lib/utils";

// Re-use the MenuLink component from NavbarLarge for consistency
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
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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

const NavbarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prestationsOpen, setPrestationsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between p-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-12 h-12">
            <Image
              src="/images/static/logo.svg"
              fill
              alt="Logo Lyon Marquage Service"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className={`${robotoMono.className} text-xl font-bold text-blue-600 text-shadow`}>
              Lyon
            </h1>
            <h1
              className={`${robotoMono.className} text-lg font-semibold text-red-600 tracking-wide text-shadow`}
            >
              Marquage
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-accent"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 p-4 mt-2 bg-background z-50 shadow-lg border-t">
          <div className="flex flex-col space-y-3">
            {/* Prestations dropdown */}
            <div className="space-y-2">
              <button
                onClick={() => setPrestationsOpen(!prestationsOpen)}
                className="flex items-center justify-between w-full p-3 text-left rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <span className="text-xl font-medium">Prestations</span>
                <ChevronDown
                  className={`relative transition duration-300 ${
                    prestationsOpen ? "rotate-180" : ""
                  } h-4 w-4`}
                  aria-hidden="true"
                />
              </button>

              {prestationsOpen && (
                <div className="pl-4 space-y-1">
                  {menuItems.map((menu) => (
                    <MenuLink
                      key={menu.title}
                      href={menu.href}
                      title={menu.title}
                      onSelect={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Direct links matching NavbarLarge */}
            <Link
              href="/objets-publicitaires"
              className="block p-3 text-xl font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Objets Publicitaires
            </Link>

            <Link
              href="/imprimerie"
              className="block p-3 text-xl font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Imprimerie
            </Link>

            <Link
              href="/enseignes"
              className="block p-3 text-xl font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Enseigne Signalétique
            </Link>

            <Link
              href="/contact"
              className="block p-3 text-xl font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarMobile;
