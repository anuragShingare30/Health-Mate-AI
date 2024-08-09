"use client";
import React from "react";
import  {TypewriterEffectSmooth}  from "./ui/typewriter-effect";
function ChatHeading() {
  const words = [
    {
      text: "Chat|", 
    },
    {
      text: "Explore|",
    },
    {
      text: "Learn|",
    },
    {
      text: "with|", 
    },
    {
      text: "AI HealthCare Assistant.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center content-start  ">
      <p className="  text-xs sm:text-xl  ">
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words}/>
    </div>
  );
}

export {ChatHeading};
