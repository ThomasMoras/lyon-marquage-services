"use client";
import React from "react";
import NavbarMobile from "./NavbarMobile";
import NavbarLarge from "./NarbarLarge";

const Navbar = () => {
  return (
    <div className="relative w-full">
      <nav className="w-full p-5">
        <NavbarLarge />
        <NavbarMobile />
      </nav>
      <div className="absolute bottom-0 w-full h-px bg-gray-200" />
    </div>
  );
};

export default Navbar;
