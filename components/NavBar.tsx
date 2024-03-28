"use client"

import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import Logo from "./Logo";
import { motion } from "framer-motion";


const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-light w-full px-32 py-8 font-medium flex items-center justify-between dark:text-light relative z-10 lg:px-16 md:px-12 sm:px-8">
      

      <div className="w-full flex justify-between items-center ">
        <nav className="flex items-center justify-center">
          <Link href="/" className="mr-4 relative group">
            Home
            <span className=" h-[1px] inline-block  bg-dark  absolute left-0 -bottom-0.5
                  group-hover:w-full transition-[width] ease duration-300 dark:bg-light">
              &nbsp;
          </span>
          </Link>
          <Link href="/" className="mr-4 relative group">
            Products
            <span className=" h-[1px] inline-block  bg-dark  absolute left-0 -bottom-0.5
                  group-hover:w-full transition-[width] ease duration-300 dark:bg-light">
              &nbsp;
          </span>
          </Link>
          <Link href="/" className="mr-4 relative group">
            Chat
            <span className=" h-[1px] inline-block  bg-dark  absolute left-0 -bottom-0.5
                  group-hover:w-full transition-[width] ease duration-300 dark:bg-light">
              &nbsp;
          </span>
          </Link>
        </nav>

        <nav className="flex items-center justify-center flex-wrap">
          Hello
        </nav>
      </div>

      

      <div className="absolute left-[50%] top-2 translate-x-[-50%]">
        <Logo />
      </div>
    </header>
  );
};

export default NavBar;
