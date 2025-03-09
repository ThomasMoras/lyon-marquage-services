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
import { DropdownMenuSeparator } from "../ui/dropdown-menu";

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

  return <li>{href ? <Link href={href}>{content}</Link> : content}</li>;
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
          {/* Catalogue Menu */}
          <NavigationMenu>
            <NavigationMenuList className="text-xl">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-xl">Catalogue</NavigationMenuTrigger>
                <NavigationMenuContent className="data-[side=bottom]:animate-slideUpAndFade">
                  <div className="grid w-[1000px] gap-6 p-4 md:grid-cols-2 text-center">
                    {menuCatalogue.map((c) => (
                      <div key={c.category}>
                        <h3 className="mb-2 text-lg font-semibold">{c.category}</h3>
                        <DropdownMenuSeparator />
                        {c.category === "Produits" ? (
                          <div className="grid grid-cols-2 gap-x-6">
                            <ul className="grid gap-1">
                              {c.items.slice(0, Math.ceil(c.items.length / 2)).map((item) => (
                                <ListItem key={item.title} title={item.title} href={item.href} />
                              ))}
                            </ul>
                            <ul className="grid gap-1">
                              {c.items.slice(Math.ceil(c.items.length / 2)).map((item) => (
                                <ListItem key={item.title} title={item.title} href={item.href} />
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <ul className="grid gap-1">
                            {c.items.map((item) => (
                              <ListItem key={item.title} title={item.title} href={item.href} />
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Prestations Menu */}
          <NavigationMenu>
            <NavigationMenuList className="text-xl">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-xl">Préstations</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[600px] md:w-[400px] md:grid-cols-1 lg:w-[300px] text-center">
                    {menuItems.map((menu) => (
                      <Link key={menu.title} href={menu.href} prefetch>
                        <ListItem title={menu.title}></ListItem>
                      </Link>
                    ))}
                  </ul>
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
