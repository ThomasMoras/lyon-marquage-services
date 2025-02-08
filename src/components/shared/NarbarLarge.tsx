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
    <div className="hidden lg:grid lg:grid-cols-3 lg:items-center">
      {/* Logo Section */}
      <div className="flex items-center gap-4 ml-8">
        <Link href="/" className="flex items-center gap-4">
          <div className="relative w-16 h-16 m-2">
            <Image
              src="/logo_svg.svg"
              fill
              alt="Logo Lyon Marquage Service"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">Lyon Marquage Service</h1>
        </Link>
      </div>

      {/* Navigation Section */}
      <div className="flex justify-center text-center">
        <NavigationMenu>
          <NavigationMenuList className="text-xl">
            {/* Catalogue Menu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xl">Catalogue</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[800px] gap-3 p-4 md:grid-cols-2">
                  {menuCatalogue.map((section) => (
                    <div key={section.category}>
                      <h3 className="mb-2 text-lg font-semibold">{section.category}</h3>
                      <ul className="grid gap-1">
                        {section.items.map((item) => (
                          <ListItem key={item.title} title={item.title} href={item.href} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Services Menu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xl">Nos prestations</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[600px] md:w-[400px] md:grid-cols-1 lg:w-[300px]">
                  {menuItems.map((menu) => (
                    <Link key={menu.title} href={menu.href} prefetch>
                      <ListItem title={menu.title}></ListItem>
                    </Link>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Contact Link */}
            <NavigationMenuItem>
              <Link href="/contact" className={cn(navigationMenuTriggerStyle(), "text-xl")}>
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>

          <div className="ml-4">
            <ModeToggle />
          </div>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default NavbarLarge;
