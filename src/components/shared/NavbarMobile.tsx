"use client";
import Link from "next/link";
import React, { useState } from "react";
import { ModeToggle } from "./ToogleTheme";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { menuItems } from "@/constants/prestation";

const NavbarMobile = () => {
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
    <div className="lg:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/logo.png"
              height={50}
              width={50}
              alt="Logo"
              className="w-12 h-12"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Lyon Marquage Service</h1>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-100">
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
                    <Link href="/presentation" className="block">
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
  );
};

export default NavbarMobile;
