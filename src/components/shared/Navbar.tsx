"use client";
import React from "react";
import { ModeToggle } from "./ToogleTheme";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="relative w-full">
      <nav className="flex justify-between items-center w-full p-5">
        {/* <Avatar
          className="mr-4"
          onClick={() => {
            router.replace("/");
          }}
          style={{ cursor: "pointer" }}
        >
          <AvatarImage src="/logo.png" />
          <AvatarFallback>LM</AvatarFallback>
        </Avatar> */}
        <Link className="mr-4" href="/">
          <Image src="/logo.png" height={75} width={75} alt={""} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Lyon Marquage Service</h1>
        <div className="flex ml-auto">
          <div className="mr-4">
            <ModeToggle />
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-px bg-gray-200" />
      </nav>
    </div>
  );
};

export default Navbar;
