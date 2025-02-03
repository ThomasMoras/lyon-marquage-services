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
import React from "react";
import { ModeToggle } from "./ToogleTheme";
import Image from "next/image";
import { menuItems } from "@/constants";
import { cn } from "@/lib/utils";

const ListItem = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <div
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-base font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </div>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

const NavbarLarge = () => {
  return (
    <div className="hidden lg:grid lg:grid-cols-3 lg:items-center">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/logoSvg.svg"
            height={75}
            width={75}
            alt="Logo"
            // style={{ width: "auto", height: "auto" }}
          />
          <h1 className="text-3xl font-bold">Lyon Marquage Service</h1>
        </Link>
      </div>

      <div className="flex justify-center text-center">
        <NavigationMenu>
          <NavigationMenuList className="text-base">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base">
                Catalogue & Partenaires
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[1.15fr_1fr]">
                  <li className="row-span-3">
                    <Link
                      className="flex h-full w-full gap-4 select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/presentation"
                    >
                      <div className="text-xl font-medium">Lyon Marquage Service</div>
                      <p className="text-base leading-tight text-muted-foreground">
                        Qui somme nous ?
                      </p>
                    </Link>
                  </li>
                  <Link href="/catalogue" prefetch>
                    <ListItem title="Catalogue">Nos catalogues</ListItem>
                  </Link>
                  <Link href="/enseignes" prefetch>
                    <ListItem title="Enseignes">Enseignes publicitaires</ListItem>
                  </Link>
                  <Link href="/partenaires" prefetch>
                    <ListItem title="Partenaires">Nos partenaires</ListItem>
                  </Link>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base">Nos préstations</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[400px]">
                  {menuItems.map((menu) => (
                    <Link key={menu.title} href={menu.href} prefetch>
                      <ListItem title={menu.title}>{/* {menu.description} */}</ListItem>
                    </Link>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" className={cn(navigationMenuTriggerStyle(), "text-base")}>
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center justify-end gap-4">
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavbarLarge;
