import React from "react";

import Image from "next/image";
import { cn } from "@/app/lib/cn";
import { fregeist, geist } from "@/app/lib/font";
import { TypeAnimation } from "react-type-animation";
import { ArrowDownIcon, DotIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context";

const Hero = () => {
  const { setIsOpen } = useAppContext();
  return (
    <div id="/" className="relative bg-[rgba(18, 20, 21, 0)] container w-full">
      <div className="flex flex-col justfy-center space-y-6 relative z-[1000]">
        <div className="h-10 lg:h-24"></div>
        <div className="flex text-center gap-x-2 text-gray-400 items-center mx-auto w-fit bg-light bg-gray-400/10 px-6 py-2 rounded-full border-gray-700">
          Trendy design <DotIcon /> Fast delivery <DotIcon /> Incremental
          workflow
        </div>
        <p
          className={cn(
            geist.className,
            "text-center leading-[100%] bg-gradient-to-br from-gray-50 to-gray-400 bg-clip-text text-transparent  text-[39px] md:text-[60px] lg:text-[80px]  font-bold",
          )}
        >
          Your customizable <br />
          perfect websites
        </p>
        <p className="text-lg md:text-2xl text-center text-gray-400 font-regular">
          Modern design, tailored graphics, clean architecture,
          <br className="hidden md:block" /> fast delivery, friendly budget,
          expert support.
        </p>
        <div className="h-0"></div>
        <Button
          size={"lg"}
          onClick={() => setIsOpen(true)}
          className="mx-auto w-fit text-xl h-12 px-12 flex group gap-x-2"
        >
          <span className="group-hover:rotate-180 duration-300 text-gray-500">
            +
          </span>
          Become a client
        </Button>
      </div>

      {/* <Link */}
      {/*   href="#services" */}
      {/*   className="z-10 left-[4%] bottom-[10%] absolute flex items-center justify-center border-white bg-transparent border-4 p-4 shadow-xl rounded-full h-16 w-16" */}
      {/* > */}
      {/*   <div className="relative bg-white rounded-full p-2"> */}
      {/*     <ArrowDownIcon className="h-8 w-8" /> */}
      {/*     <span className="animate-ping absolute inset-0 inline-flex h-full w-full rounded-full bg-white opacity-75"></span> */}
      {/*   </div> */}
      {/* </Link> */}
      <Image
        className="absolute left-1/2 -translate-x-1/2"
        src="/hero.png"
        width={600}
        height={0}
        alt=""
      />
    </div>
  );
};

export default Hero;
