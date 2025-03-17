"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";
import { menuCatalogue } from "@/constants/catalogue";
import { menuItems } from "@/constants/prestation";
import { ModeToggle } from "./ToogleTheme";
import { robotoMono } from "@/app/fonts";

const ListItem = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { href?: string }
>(({ className, title, children, href, ...props }, ref) => {
  const content = (
    <div
      ref={ref}
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      <div className="text-base font-medium leading-none">{title}</div>
      {children && (
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
      )}
    </div>
  );

  return <div>{href ? <Link href={href}>{content}</Link> : content}</div>;
});
ListItem.displayName = "ListItem";

const NavbarLarge = () => {
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
          <NavigationMenu contentWidth="fullscreen">
            <NavigationMenuList className="text-xl">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-xl">Catalogue</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-screen max-h-[70vh] overflow-y-auto">
                    <div className="max-w-screen-2xl mx-auto p-2">
                      {/* Grid pour mettre Produits et Marques côte à côte */}
                      <div className="grid grid-cols-4 gap-2">
                        {/* Colonne Produits (3/4) */}
                        <div className="col-span-3">
                          <h3 className="mb-3 text-lg font-semibold border-b pb-2">Produits</h3>
                          <div className="grid grid-cols-3 gap-1">
                            {/* Filtrer les doublons */}
                            {menuCatalogue[0].items
                              .filter(
                                (item, index, self) =>
                                  index === self.findIndex((i) => i.title === item.title)
                              )
                              .map((item) => (
                                <ListItem key={item.title} title={item.title} href={item.href} />
                              ))}
                          </div>
                        </div>

                        {/* Colonne Marques (1/4) */}
                        <div className="col-span-1">
                          <h3 className="mb-3 text-lg font-semibold border-b pb-2">Marques</h3>
                          <div className="grid grid-cols-1 gap-1">
                            {menuCatalogue[1].items.map((item) => (
                              <ListItem key={item.title} title={item.title} href={item.href} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Prestations Menu */}
          <NavigationMenu contentWidth="default">
            <NavigationMenuList className="text-xl">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-xl">Préstations</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[400px] md:w-[400px] lg:w-[400px]">
                    {menuItems.map((menu) => (
                      <Link key={menu.title} href={menu.href} prefetch>
                        <ListItem title={menu.title}></ListItem>
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Direct Links */}
          <NavigationMenu>
            <NavigationMenuList className="text-xl">
              <NavigationMenuItem>
                <Link
                  href="/objets-publicitaires"
                  className={cn(navigationMenuTriggerStyle(), "text-xl")}
                >
                  Objets Publicitaires
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu>
            <NavigationMenuList className="text-xl">
              <NavigationMenuItem>
                <Link href="/contact" className={cn(navigationMenuTriggerStyle(), "text-xl")}>
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarLarge;
