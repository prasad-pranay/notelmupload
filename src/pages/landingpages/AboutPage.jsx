
import React, { useRef, useState } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useMotionValueEvent,
} from "framer-motion";

// Each heading line has its own scroll animation
function TitleLine({ text, index, progress }) {
    const start = index / 4;
    const end = (index + 1) / 4;

    const fill = useTransform(
        progress,
        [start, end],
        [0, 100]
    );

    return (
        <div className="relative w-fit ml-auto overflow-hidden">
            {/* Outline */}
            <h2
                className="font-bold uppercase text-right leading-[0.88]
          tracking-[-0.065em] text-[clamp(3.5rem,8.5vw,9rem)]"
                style={{
                    WebkitTextStroke: index == 3 ? "1.5px #C6A44E" : "1.5px rgba(255,255,255,0.9)",
                    color: "transparent",
                }}
            >
                {text}
            </h2>

            {/* Vertical fill from bottom */}
            <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{
                    clipPath: useTransform(
                        fill,
                        (v) => `inset(${100 - v}% 0 0 0)`
                    ),
                }}
            >
                <h2
                    className="font-bold uppercase text-right leading-[0.88]
            tracking-[-0.065em] text-[clamp(3.5rem,8.5vw,9rem)]
            "
                    style={{ color: index == 3 ? "#C6A44E" : "#fff" }}
                >
                    {text}
                </h2>
            </motion.div>
        </div>
    );
}

export default function About({
    slides = [],
}) {
    const sectionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const lines = [
        "Ask",
        "Document",
        "not the",
        "Internet!",
    ];

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    // Determine which line is currently being filled
    useMotionValueEvent(
        scrollYProgress,
        "change",
        (value) => {
            const index = Math.min(
                3,
                Math.floor(value * 4)
            );

            setActiveIndex(index);
        }
    );

    const currentSlide = slides[activeIndex];

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative h-[400vh] bg-gradient-to-b from-[#0C0F10] to-[#0B0B0B] text-white pt-40"
        >
            <div className="sticky top-0 h-screen overflow-hidden">

                <div className="relative h-full w-full grid md:grid-cols-2 items-center px-[5vw]">

                    {/* LEFT SIDE - GIF AND CONTENT */}
                    <div className="relative flex items-center
            justify-start md:h-full">

                        <AnimatePresence mode="wait">
                            {currentSlide && (
                                <motion.div
                                    key={activeIndex}
                                    initial={{
                                        opacity: 0,
                                        x: -70,
                                        filter: "blur(12px)",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        filter: "blur(0px)",
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: -55,
                                        filter: "blur(10px)",
                                    }}
                                    transition={{
                                        duration: 0.65,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="w-full max-w-[460px]"
                                >

                                    {/* GIF */}
                                    <div className="relative w-full
                    aspect-[5/4] overflow-hidden
                    rounded-2xl bg-[#222]">

                                        {currentSlide.gif && (
                                            <img
                                                src={currentSlide.gif}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        )}

                                        <div className="absolute inset-0
                      bg-gradient-to-t from-black/30
                      to-transparent pointer-events-none" />

                                        <span className="absolute bottom-4 left-5
                      text-xs tracking-[0.2em] uppercase
                      text-white/70">
                                            0{activeIndex + 1} / 04
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <div className="mt-8">

                                        <p className="text-xs uppercase 
                      tracking-[0.25em] text-white/40 mb-4">
                                            {currentSlide.eyebrow}
                                        </p>

                                        <h3 className="text-3xl md:text-4xl
                      font-semibold tracking-tight mb-4">
                                            {currentSlide.heading}
                                        </h3>

                                        <p className="text-base md:text-sm font-light hidden md:block
                      leading-relaxed text-white/50
                      max-w-md">
                                            {currentSlide.description}
                                        </p>

                                        {/* CTA buttons */}
                                        <div className="flex flex-wrap hidden md:block
                      gap-3 mt-8">

                                            {currentSlide.buttons?.map(
                                                (button, i) => (
                                                    <a
                                                        key={i}
                                                        href={button.href}
                                                        className={
                                                            i === 0
                                                                ? "px-6 py-3 mr-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/80 transition-colors"
                                                                : "px-6 py-3 rounded-sm border border-white/20 text-white text-sm hover:bg-white/10 transition-colors"
                                                        }
                                                    >
                                                        {button.label}
                                                    </a>
                                                )
                                            )}

                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                    {/* RIGHT SIDE - HEADING */}
                    <div className="flex flex-col items-end
            justify-center w-full">

                        <div className="flex flex-col items-end
              w-full">

                            {lines.map((line, index) => (
                                <TitleLine
                                    key={index}
                                    text={line}
                                    index={index}
                                    progress={scrollYProgress}
                                />
                            ))}

                        </div>

                        {/* Small scroll indicator */}
                        <div className="flex items-center gap-3
              mt-12 text-white/30">

                            <span className="text-[10px] font-light
                uppercase tracking-[0.25em]">
                                Scroll Down
                            </span>

                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                }}
                                className="text-lg"
                            >
                                ↓
                            </motion.div>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
