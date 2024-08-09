"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import Link from "next/link";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function HeroHighlightDemo() {
    return (
        <div className="flex items-center flex-col">

            <HeroHighlight className='flex flex-col items-center'>
                <motion.h1
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: [20, -5, 0],
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.4, 0.0, 0.2, 1],
                    }}
                    className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold  dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
                >
                    <Highlight className="text-neutral-700 dark:text-white">
                        Welcome to Health Mate AI
                    </Highlight>
                    Start Chatting with our GenAI HealthCare Assistant
                </motion.h1>
                <Link href='/Chat'>
                <div className="mt-12">
                    <HoverBorderGradient>
                        <h1>Get Started</h1>
                    </HoverBorderGradient>
                </div>
            </Link>
            </HeroHighlight>
            
        </div>

    );
}
