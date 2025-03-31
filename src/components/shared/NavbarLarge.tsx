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
// import { menuCatalogue } from "@/constants/catalogue";
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

const NavbarLarge = () => {
  // États pour gérer l'ouverture/fermeture des menus
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [prestationsOpen, setPrestationsOpen] = useState(false);

  return (
    <div className="hidden lg:flex lg:justify-start w-full px-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 transition-transform duration-300 hover:scale-110"
          >
            <div className="relative w-14 h-14 m-2">
              <Image
                src="/logo_svg.svg"
                fill
                alt="Logo Lyon Marquage Service"
                className="object-contain"
                priority
              />
            </div>
            <h1
              className={`${robotoMono.className} text-3xl font-bold text-blue-600 mb-2 text-shadow`}
            >
              Lyon
            </h1>
            <h1
              className={`${robotoMono.className} text-2xl font-semibold text-red-600 tracking-wide text-shadow`}
            >
              Marquage
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Menu Catalogue avec DropdownMenu */}
          {/*
          <DropdownMenu open={catalogueOpen} onOpenChange={setCatalogueOpen}>
            <DropdownMenuTrigger asChild>
              <button className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-xl font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50">
                Catalogue
                <ChevronDown
                  className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-screen max-h-[70vh] overflow-y-auto" align="start">
              <div className="max-w-screen-2xl mx-auto p-2">
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-3">
                    <h3 className="mb-3 text-lg font-semibold border-b pb-2">Produits</h3>
                    <div className="grid grid-cols-3 gap-1">
                      {menuCatalogue[0].items
                        .filter(
                          (item, index, self) =>
                            index === self.findIndex((i) => i.title === item.title)
                        )
                        .map((item) => (
                          <MenuLink
                            key={item.title}
                            href={item.href}
                            title={item.title}
                            onSelect={() => setCatalogueOpen(false)}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <h3 className="mb-3 text-lg font-semibold border-b pb-2">Marques</h3>
                    <div className="grid grid-cols-1 gap-1">
                      {menuCatalogue[1].items.map((item) => (
                        <MenuLink
                          key={item.title}
                          href={item.href}
                          title={item.title}
                          onSelect={() => setCatalogueOpen(false)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        */}
          {/* Menu Prestations avec DropdownMenu */}
          <DropdownMenu open={prestationsOpen} onOpenChange={setPrestationsOpen}>
            <DropdownMenuTrigger asChild>
              <button className="group inline-flex h-12 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-xl font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50">
                Prestations
                <ChevronDown
                  className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4 w-[400px]" align="start">
              {menuItems.map((menu) => (
                <MenuLink
                  key={menu.title}
                  href={menu.href}
                  title={menu.title}
                  onSelect={() => setPrestationsOpen(false)}
                />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Liens directs */}
          <Link
            href="/objets-publicitaires"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-xl font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Objets Publicitaires
          </Link>
          <Link
            href="/imprimerie"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-xl font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Imprimerie
          </Link>
          <Link
            href="/enseignes"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-xl font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Enseigne Signalétique
          </Link>
          <Link
            href="/contact"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-xl font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Contact
          </Link>

          <div className="ml-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarLarge;
