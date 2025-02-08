"use client";

import { useState, useEffect } from "react";
import NavbarLarge from "./NarbarLarge";
import NavbarMobile from "./NavbarMobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="" />
      <div
        className={`fixed top-0 left-0 right-0 w-full bg-background z-50 transition-all duration-200 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <NavbarLarge />
        <NavbarMobile />
      </div>
    </>
  );
};

export default Navbar;
