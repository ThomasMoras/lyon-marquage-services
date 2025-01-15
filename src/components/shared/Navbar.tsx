"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import { ModeToggle } from "./ToogleTheme";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { menuItems } from "@/constants";

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };
  return (
    <div className="relative w-full">
      <nav className="w-full p-5">
        <div className="hidden lg:grid lg:grid-cols-3 lg:items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4">
              <Image src="/logo.png" height={75} width={75} alt="Logo" />
              <h1 className="text-2xl font-bold text-gray-800">Lyon Marquage Service</h1>
            </Link>
          </div>

          <div className="flex justify-center text-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Catalogue & Partenaires</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[1.15fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full gap-4 select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/presentation"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="text-lg font-medium">Lyon Marquage Service</div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Qui somme nous ?
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <Link href="/catalogue" prefetch>
                        <ListItem href="/catalogue" title="Catalogue">
                          Nos catalogues
                        </ListItem>
                      </Link>
                      <Link href="/enseignes" prefetch>
                        <ListItem href="/enseignes" title="Enseignes">
                          Enseignes publicitaires
                        </ListItem>
                      </Link>
                      <Link href="/partenaires" prefetch>
                        <ListItem href="/partenaires" title="Partenaires">
                          Nos partenaires
                        </ListItem>
                      </Link>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Nos préstations</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[400px]">
                      {menuItems.map((menu) => (
                        <Link key={menu.title} href={menu.href} prefetch legacyBehavior>
                          <ListItem key={menu.title} title={menu.title} href={menu.href}>
                            {/* {menu.description} */}
                          </ListItem>
                        </Link>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/contact"
                    prefetch={true}
                    onClick={() => setIsOpen(false)}
                    className="block"
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center justify-end gap-4">
            <ModeToggle />
          </div>
        </div>

        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Image src="/logo.png" height={50} width={50} alt="Logo" className="w-12 h-12" />
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Lyon Marquage Service</h1>
            </div>

            <div className="flex items-center gap-2">
              <ModeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="absolute left-0 right-0 p-4 mt-2 bg-white shadow-lg">
              <div className="flex flex-col space-y-4">
                {/* Catalogue & Partenaires */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleSection("catalogue")}
                    className="flex items-center justify-between w-full p-3 text-left rounded-md hover:bg-gray-100"
                  >
                    <span className="font-medium">Catalogue & Partenaires</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        openSection === "catalogue" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSection === "catalogue" && (
                    <div className="space-y-3 pl-4 mt-2">
                      <div className="bg-gradient-to-b from-muted/50 to-muted p-4 rounded-md">
                        <Link href="/" className="block">
                          <div className="text-lg font-medium">Lyon Marquage Service</div>
                          <p className="text-sm text-muted-foreground mt-2">Qui somme nous ?</p>
                        </Link>
                      </div>

                      <Link href="/catalogue" className="block">
                        <div className="p-3 hover:bg-accent rounded-md">
                          <div className="text-sm font-medium">Catalogue</div>
                          <p className="text-sm text-muted-foreground">Nos catalogues</p>
                        </div>
                      </Link>

                      <Link href="/enseignes" className="block">
                        <div className="p-3 hover:bg-accent rounded-md">
                          <div className="text-sm font-medium">Enseignes</div>
                          <p className="text-sm text-muted-foreground">Enseignes publicitaires</p>
                        </div>
                      </Link>

                      <Link href="/partenaires" className="block">
                        <div className="p-3 hover:bg-accent rounded-md">
                          <div className="text-sm font-medium">Partenaires</div>
                          <p className="text-sm text-muted-foreground">Nos partenaires</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Nos préstations */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleSection("prestations")}
                    className="flex items-center justify-between w-full p-3 text-left rounded-md hover:bg-gray-100"
                  >
                    <span className="font-medium">Nos préstations</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        openSection === "prestations" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSection === "prestations" && (
                    <div className="grid grid-cols-2 gap-2 pl-4 mt-2">
                      {menuItems.map((menu) => (
                        <Link key={menu.title} href={menu.href}>
                          <div className="p-3 hover:bg-accent rounded-md">
                            <div className="text-sm font-medium">{menu.title}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact */}
                <Link
                  href="/contact"
                  className="block p-3 text-center font-medium hover:bg-accent rounded-md"
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="absolute bottom-0 w-full h-px bg-gray-200" />
    </div>
  );
};

export default Navbar;
