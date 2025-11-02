"use client";

import { motion } from "framer-motion";

const values = [
  "Permissionless",
  "Immutable",
  "Borderless",
  "Secure",
  "Transparent",
];

export function BitcoinValuesMarquee() {
  // Calculate the total width needed for smooth animation
  const valueString = values.join(" . ") + " . ";
  
  return (
    <div className="relative overflow-hidden py-8">
      {/* Left fade overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 md:w-64 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
      
      {/* Right fade overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 md:w-64 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />
      
      {/* Seamless infinite scroll */}
      <div className="flex">
        <motion.div
          className="flex gap-8 whitespace-nowrap font-space-grotesk"
          animate={{
            x: [0, -2000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {/* Repeat values enough times for seamless loop */}
          {[...Array(10)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex gap-8 items-center">
              {values.map((value, index) => (
                <span
                  key={`${groupIndex}-${index}`}
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${
                    value === "Permissionless" || value === "Borderless" || value === "Transparent"
                      ? "text-[#0e622f]"
                      : "text-white"
                  }`}
                >
                  {value}
                  <span className="text-white ml-4 sm:ml-6">.</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
