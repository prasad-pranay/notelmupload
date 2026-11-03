
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { Link } from "react-router-dom";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    FileText,
    Upload,
    ChevronRight,
    Star,
    MessageCircle,
    ShieldCheck,
    Layers,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────

const C = {
    bg: "#0C0F10",
    surface: "#111618",
    elevated: "#161D1F",
    border: "#1E2628",
    borderSoft: "#252E30",
    accent: "#C6A44E",
    text: "#E8ECE4",
    secondary: "#94A09A",
    muted: "#5A6864",
};

const EASE = [0.16, 1, 0.3, 1];

// ─────────────────────────────────────────────────────────────
// ANIMATED CHARACTER REVEAL
// ─────────────────────────────────────────────────────────────

function RevealText({
    text,
    delay = 0,
    stagger = 0.045,
    className = "",
    style = {},
    mirrored = false,
    absolute = true
}) {
    const containerRef = useRef(null);
    const sourceRefs = useRef([]);
    const targetRefs = useRef([]);

    const shouldReduce = useReducedMotion();

    const characters = Array.from(text);
    const sourceCharacters = mirrored
        ? [...characters].reverse()
        : characters;

    useLayoutEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        const source = sourceRefs.current;
        const target = targetRefs.current;

        if (
            source.length !== characters.length ||
            target.length !== characters.length ||
            source.some((el) => !el) ||
            target.some((el) => !el)
        ) {
            return;
        }

        const containerRect = container.getBoundingClientRect();

        // Measure original positions before changing layout.
        const initialPositions = source.map((el) => {
            const rect = el.getBoundingClientRect();

            return {
                x: rect.left - containerRect.left,
                y: rect.top - containerRect.top,
            };
        });

        // Calculate each character's destination.
        const finalPositions = source.map((_, index) => {
            const targetIndex = mirrored
                ? characters.length - 1 - index
                : index;

            const rect = target[targetIndex].getBoundingClientRect();

            return {
                x: rect.left - containerRect.left,
                y: rect.top - containerRect.top,
            };
        });

        // Convert the source characters into independently
        // positioned elements.
        source.forEach((el, index) => {
            // el.style.position = "absolute";
            el.style.left = `${initialPositions[index].x}px`;
            el.style.top = `${initialPositions[index].y}px`;
            el.style.visibility = "visible";
        });

        if (shouldReduce) {
            source.forEach((el, index) => {
                el.style.left = `${finalPositions[index].x}px`;
                el.style.top = `${finalPositions[index].y}px`;
                el.style.opacity = "1";
                el.style.transform = "none";
            });

            return;
        }

        let cancelled = false;
        let startTimer;
        const timers = [];
        const animations = [];

        // Wait for the browser to paint the initial layout.
        startTimer = setTimeout(() => {
            if (cancelled) return;

            source.forEach((el, index) => {
                const destination = finalPositions[index];

                const timer = setTimeout(() => {
                    if (cancelled) return;

                    const isMoving = mirrored;

                    const animation = el.animate(
                        [
                            {
                                left: `${initialPositions[index].x}px`,
                                top: `${initialPositions[index].y}px`,
                                opacity: 0,
                                filter: "blur(5px)",
                                transform: isMoving
                                    ? "rotateY(65deg) rotateX(35deg) scale(0.85)"
                                    : "translateY(18px) rotateX(25deg)",
                            },
                            {
                                left: `${destination.x}px`,
                                top: `${destination.y}px`,
                                opacity: 1,
                                filter: "blur(0px)",
                                transform: isMoving
                                    ? "rotateY(-8deg) rotateX(-5deg) scale(1.04)"
                                    : "translateY(-2px) rotateX(-3deg)",
                                offset: 0.82,
                            },
                            {
                                left: `${destination.x}px`,
                                top: `${destination.y}px`,
                                opacity: 1,
                                filter: "blur(0px)",
                                transform: "none",
                            },
                        ],
                        {
                            duration: isMoving ? 950 : 750,
                            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                            fill: "forwards",
                        }
                    );

                    animations.push(animation);
                }, index * stagger * 1000);

                timers.push(timer);
            });
        }, delay);

        return () => {
            cancelled = true;

            clearTimeout(startTimer);
            timers.forEach(clearTimeout);

            animations.forEach((animation) => animation.cancel());

            source.forEach((el) => {
                el.getAnimations().forEach((animation) => animation.cancel());
            });
        };
    }, [text, delay, stagger, mirrored, shouldReduce]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                ...style,
                position: absolute ? "absolute" : "static",
                perspective: "900px",
                whiteSpace: "pre",
            }}
            aria-label={text}
        >
            {/* Invisible text maintains the final layout. */}
            <span aria-hidden="true" className="invisible">
                {characters.map((char, index) => (
                    <span
                        key={`target-${index}`}
                        ref={(el) => {
                            targetRefs.current[index] = el;
                        }}

                    >
                        {char}
                    </span>
                ))}
            </span>

            {/* Independently animated characters. */}
            <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    whiteSpace: "pre",
                    pointerEvents: "none",
                }}
            >
                {sourceCharacters.map((char, index) => (
                    <span
                        key={`source-${index}`}
                        ref={(el) => {
                            sourceRefs.current[index] = el;
                        }}
                        style={{
                            display: "inline-block",
                            visibility: "hidden",
                            opacity: 0,
                            transformOrigin: "50% 100%",
                            willChange: "left, top, transform, opacity, filter",
                        }}
                    >
                        {char}
                    </span>
                ))}
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// HERO HEADLINE
// ─────────────────────────────────────────────────────────────

function HeroHeadline() {
    return (
        <div className="absolute inset-0 pointer-events-none select-none md:block hidden">

            {/* YOUR */}
            <div className="absolute left-0 bottom-0 -translate-x-[100%] translate-y-[-15%] -rotate-90">

                <RevealText
                    text="Your"
                    delay={600}
                    stagger={0.07}
                    className="
                    translate-y-[-100%]
                font-bold leading-none
                text-5xl sm:text-7xl lg:text-9xl
                "
                    style={{ color: C.text }}
                />
            </div>

            {/* DOCUMENTS */}
            <RevealText
                text="documents"
                delay={1000}
                stagger={0.045}
                className="
                    left-0 top-0
                    -translate-y-[105%]
                    font-bold leading-none
                    tracking-[-0.055em]
                    text-4xl sm:text-6xl lg:text-9xl
                "
                style={{ color: C.text }}
            />

            {/* FINALLY */}
            <div className="absolute right-0 top-0 rotate-90">

                <RevealText
                    text="finally"
                    delay={1800}
                    stagger={0.06}
                    className="
                    translate-y-[-100%]
                    font-bold leading-none
                    text-5xl sm:text-7xl lg:text-9xl
                "
                    style={{ color: C.text }}
                />
            </div>

            {/* UNDERSTOOD */}
            <RevealText
                text=".dootsrednu"
                mirrored={true}
                delay={2500}
                stagger={0.045}
                className="
                    right-0 bottom-0
                    translate-y-[100%]
                    font-bold leading-none
                    tracking-[-0.055em]
                    text-4xl sm:text-6xl lg:text-9xl
                "
                style={{ color: C.accent }}
            />
        </div>
    );
}

function BottomCard({ Icon, title, description }) {
    return (
        <div className="group flex flex-1 items-start gap-3 px-5 py-10
                    border-r border-black/10 last:border-r-0
                    transition-all duration-300 hover:bg-black/[0.025]">

            <Icon size={30} strokeWidth={1} className="text-[#a77b13] group-hover:scale-120 transition duration-200" />

            <div className="min-w-0">
                <p className="text-sm font-normal tracking-tight text-[#fff]">
                    {title}
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-wider leading-relaxed text-white/60">
                    {description}
                </p>
            </div>
        </div>
    );
}


// ─────────────────────────────────────────────────────────────
// MAIN HERO SECTION
// ─────────────────────────────────────────────────────────────

export default function HeroSection() {
    const shouldReduce = useReducedMotion();

    return (
        <section
            id="hero"
            className="
                relative min-h-screen w-full
                overflow-hidden flex flex-col
            "
            style={{ backgroundColor: C.bg }}
        >
            {/* floaters */}
            <div>
                {/* youtube */}
                <svg className="absolute size-20 stroke-white opacity-10 top-15 -rotate-30 left-20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M43.112 14.394a5 5 0 0 0-3.533-3.533c-2.314-.894-24.732-1.332-31.236.025A5 5 0 0 0 4.81 14.42c-1.045 4.583-1.124 14.491.026 19.177a5 5 0 0 0 3.533 3.533c4.583 1.055 26.371 1.203 31.236 0a5 5 0 0 0 3.533-3.533c1.114-4.993 1.193-14.287-.026-19.203" />
                        <path d="M30.567 23.995 20.12 18.004v11.982Z" />
                    </g>
                </svg>
                {/* document */}
                <svg className="absolute size-20 stroke-white opacity-10 top-15 rotate-30 right-20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path
                            d="M42.5 11.672V7.5a2 2 0 0 0-2-2H32"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M33 42.5h7.5a2 2 0 0 0 2-2v-6.084"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M5.5 36.416V40.5a2 2 0 0 0 2 2h9.688"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M17.188 5.5H7.5a2 2 0 0 0-2 2v5.172"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M43.278 15.347 22.832 3.541a1.75 1.75 0 0 0-2.389.64l-15.3 26.508a1.75 1.75 0 0 0 .64 2.39l20.445 11.806a1.75 1.75 0 0 0 2.39-.64l15.301-26.508a1.75 1.75 0 0 0-.64-2.39"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="m34.251 19.178-13.52-7.919"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="m36.006 24.592-17.233-9.95"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M34.022 28.045 16.79 18.094"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                </svg>
                {/* url */}
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="1" className="absolute size-20 stroke-white opacity-10 top-100 -rotate-120 left-20" fill="none"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M39.93 55.72a24.86 24.86 0 1 1 16.93-23.57 37 37 0 0 1-.73 6" /><path d="M37.86 51.1A47 47 0 0 1 32 56.7M32 7a34.14 34.14 0 0 1 11.57 23 34 34 0 0 1 .09 4.85M32 7a34.1 34.1 0 0 0-11.69 25.46c0 16.2 7.28 21 11.66 24.24m-21.6-36.8h43.38M32 6.99V56.7M11.05 45.48h25.99M7.14 32.46l49.72-.61M53.57 57 58 52.56l-8-8 4.55-2.91a.38.38 0 0 0-.12-.7l-15.29-3.58a.39.39 0 0 0-.46.46L42 53.41a.39.39 0 0 0 .71.13L45.57 49Z" /></svg>
                {/* pdf */}
                <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="absolute size-20 stroke-white opacity-10 top-100 rotate-100 right-20">
                    <path
                        d="M7.45 5.5a2 2 0 0 0-1.95 2v33.1a2 2 0 0 0 2 2h33.1a2 2 0 0 0 2-2V7.45a2 2 0 0 0-2-1.95Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M20.09 30V18h2a6 6 0 0 1 6 6 6 6 0 0 1-6 6Zm12.39-11.96h5.98m-5.98 5.98h3.9m-3.9-5.98V30M9.54 30V18h4a4 4 0 0 1 0 8h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <HeroOrbit />
            <div
                className="
                    relative z-10 w-full
                    md:min-h-screen flex flex-col
                    items-center
                    px-5 py-20 md:py-32
                "
            >
                {/* NOTEBOOK AND HEADLINE */}
                <motion.div
                    initial={
                        shouldReduce
                            ? false
                            : {
                                opacity: 0,
                                y: 28,
                                scale: 0.985,
                            }
                    }
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    transition={{
                        duration: 1,
                        delay: 0.15,
                        ease: EASE,
                    }}
                    className="
                        relative 
                    "
                >
                    <div className="flex flex-col md:hidden mb-10">

                        <RevealText
                            text="Your"
                            delay={600}
                            stagger={0.07}
                            className="
                font-bold leading-none
                text-5xl sm:text-7xl lg:text-9xl
                "
                            absolute={false}
                            style={{ color: C.text }}
                        />

                        {/* DOCUMENTS */}
                        <RevealText
                            text="documents"
                            delay={1000}
                            stagger={0.045}
                            className="
                    font-bold leading-none
                    tracking-[-0.055em]
                    text-5xl sm:text-6xl lg:text-9xl
                "absolute={false}
                            style={{ color: C.text }}
                        />

                        {/* FINALLY */}

                        <RevealText
                            text="finally"
                            delay={1800}
                            stagger={0.06}
                            className="
                    font-bold leading-none
                    text-5xl sm:text-7xl lg:text-9xl
                "absolute={false}
                            style={{ color: C.text }}
                        />

                        {/* UNDERSTOOD */}
                        <RevealText
                            text=".dootsrednu"
                            mirrored={true}
                            delay={2500}
                            stagger={0.045}
                            className="
                    font-bold leading-none
                    tracking-[-0.055em]
                    text-5xl sm:text-6xl lg:text-9xl
                "absolute={false}
                            style={{ color: C.accent }}
                        />

                    </div>
                    {/* Subtle floating animation */}
                    <motion.div
                        initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="md:max-w-xl w-full"
                    >
                        <div className={shouldReduce ? "" : "notebook-float"}>
                            <NotebookMock />
                        </div>
                    </motion.div>

                    {/* Animated headline */}
                    <HeroHeadline />
                </motion.div>

            </div>



            <div className="flex flex-wrap justify-center gap-10 overflow-hidden">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4, duration: 1 }} >

                    <Link
                        to="/register"
                        className="
                                group no-underline
                                px-6 py-3 rounded-sm
                                text-sm font-bold
                                inline-flex items-center gap-2
                                transition-all duration-300
                            "
                        style={{
                            backgroundColor: C.accent,
                            color: C.bg,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#D4B568";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                                `0 8px 24px ${C.accent}30`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = C.accent;
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        Start for free
                        <ChevronRight
                            size={16}
                            className="
                        transition-transform duration-300
                        group-hover:translate-x-1
                        "
                        />
                    </Link>
                </motion.div>

                {/* <a
                    href="#how-it-works"
                    onClick={(e) => {
                        e.preventDefault();
                        document
                            .querySelector("#how-it-works")
                            ?.scrollIntoView({
                                behavior: "smooth",
                            });
                    }}
                    className="hidden md:block
                                no-underline px-6 py-3
                                rounded-sm text-sm font-light
                                transition-all duration-300
                            "
                    style={{
                        color: C.secondary,
                        borderColor: C.border,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = C.borderSoft;
                        e.currentTarget.style.color = C.text;
                        e.currentTarget.style.backgroundColor = C.surface;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.color = C.secondary;
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                >
                    Explore More About it
                </a> */}
            </div>

            <div className="grid grid-cols-2 md:flex items-center w-full mt-10 bg-[#0C0F10] z-[100]">
                <BottomCard
                    Icon={MessageCircle}
                    title="Ask Questions"
                    description="Get answers immediately"
                />
                <div className="hidden md:block w-px h-20 mx-10 bg-white/10" />
                <BottomCard
                    Icon={Star}
                    title="Summarize"
                    description="Understand faster"
                />
                <div className="hidden md:block w-px h-20 mx-10 bg-white/10" />
                <BottomCard
                    Icon={Layers}
                    title="Generate flashcards"
                    description="Revise smarter"
                />
                <div className="hidden md:block w-px h-20 mx-10 bg-white/10" />
                <BottomCard
                    Icon={ShieldCheck}
                    title="Create quizzes"
                    description="Test your knowledge"
                />
            </div>
            {/* <p className="text-center font-light text-[9px] uppercase opacity-70 my-10">& Many More</p> */}


        </section>
    );
}
function HeroOrbit() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
            <div className="border opacity-10 rounded-full h-[100vw] w-[100vw] mx-auto" />
        </div>
    );
}
// ─────────────────────────────────────────────────────────────
// NOTEBOOK MOCKUP
// ─────────────────────────────────────────────────────────────

function NotebookMock() {
    const files = [
        { name: "Cell Biology.pdf", active: true },
        { name: "Chemistry.pdf", active: false },
        { name: "Genetics.txt", active: false },
    ];

    return (
        <div
            className="w-full rounded-xl overflow-hidden"
            style={{
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
                fontFamily: "Inter, sans-serif",
            }}
        >
            {/* Browser chrome */}
            <div
                className="
                    flex items-center gap-2
                    px-4 py-3 border-b
                "
                style={{
                    backgroundColor: C.elevated,
                    borderColor: C.border,
                }}
            >
                <div className="flex gap-1.5">
                    <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "#FF5F57" }}
                    />
                    <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "#FEBC2E" }}
                    />
                    <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "#28C840" }}
                    />
                </div>

                <div
                    className="
                        flex-1 mx-4 px-3 py-1
                        rounded-md text-xs text-center
                    "
                    style={{
                        backgroundColor: C.surface,
                        color: C.muted,
                        border: `1px solid ${C.border}`,
                    }}
                >
                    app.notelm.com/notebook
                </div>
            </div>

            {/* Mobile preview */}
            <div
                className="md:hidden p-4"
                style={{ minHeight: 210 }}
            >
                <div
                    className="
                        text-[10px] font-semibold
                        uppercase tracking-widest mb-2
                    "
                    style={{ color: C.muted }}
                >
                    Notebook Preview
                </div>

                <div
                    className="
                        text-sm font-bold leading-tight mb-2
                    "
                    style={{
                        color: C.text,
                        letterSpacing: "-0.02em",
                    }}
                >
                    Cell Biology
                </div>

                <div
                    className="
                        text-[11px] leading-relaxed mb-3
                    "
                    style={{ color: C.secondary }}
                >
                    <p>
                        The cell is the basic structural and
                        functional unit of all living organisms...
                    </p>

                    <p className="mt-2">
                        <span
                            className="px-1 rounded"
                            style={{
                                backgroundColor: `${C.accent}22`,
                                color: C.accent,
                            }}
                        >
                            Mitochondria
                        </span>{" "}
                        produce ATP through cellular respiration.
                    </p>
                </div>

                <div
                    className="text-[10px] px-3 py-2 rounded-lg"
                    style={{
                        backgroundColor: `${C.accent}15`,
                        color: C.text,
                        border: `1px solid ${C.accent}30`,
                    }}
                >
                    <span
                        className="font-semibold"
                        style={{ color: C.accent }}
                    >
                        AI:
                    </span>{" "}
                    Mitochondria produce ATP through cellular
                    respiration — the cell's energy currency.{" "}
                    <span style={{ color: C.accent }}>↗ p.4</span>
                </div>
            </div>

            {/* Desktop 3-panel layout */}
            <div
                className="
                    hidden md:grid
                    grid-cols-[160px_minmax(0,1fr)_160px]
                "
                style={{ minHeight: 300 }}
            >
                {/* Sources panel */}
                <div
                    className="p-3 flex flex-col gap-2 min-w-0"
                    style={{ borderRight: `1px solid ${C.border}` }}
                >
                    <div
                        className="
                            text-[10px] font-semibold
                            uppercase tracking-widest mb-1
                        "
                        style={{ color: C.muted }}
                    >
                        Sources
                    </div>

                    {files.map((file) => (
                        <div
                            key={file.name}
                            className="
                                flex items-center gap-1.5
                                px-2 py-1.5 rounded-md
                                text-[11px] truncate
                            "
                            style={{
                                backgroundColor: file.active
                                    ? C.elevated
                                    : "transparent",
                                color: file.active
                                    ? C.text
                                    : C.muted,
                                border: file.active
                                    ? `1px solid ${C.borderSoft}`
                                    : "1px solid transparent",
                            }}
                        >
                            <FileText
                                size={11}
                                style={{
                                    color: C.accent,
                                    flexShrink: 0,
                                }}
                            />
                            <span className="truncate">
                                {file.name}
                            </span>
                        </div>
                    ))}

                    <button
                        className="
                            mt-2 flex items-center gap-1
                            text-[10px] font-medium
                            px-2 py-1.5 rounded-md w-full
                        "
                        style={{
                            backgroundColor: C.elevated,
                            color: C.accent,
                            border: `1px solid ${C.border}`,
                        }}
                    >
                        <Upload size={10} />
                        Upload
                    </button>
                </div>

                {/* Reader panel */}
                <div
                    className="p-4 flex flex-col gap-2 min-w-0"
                    style={{ borderRight: `1px solid ${C.border}` }}
                >
                    <div
                        className="
                            text-[10px] font-semibold
                            uppercase tracking-widest mb-1
                        "
                        style={{ color: C.muted }}
                    >
                        Reader
                    </div>

                    <div
                        className="
                            text-sm font-bold
                            leading-tight mb-1
                        "
                        style={{
                            color: C.text,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Cell Biology
                    </div>

                    <div
                        className="
                            text-[11px] leading-relaxed
                            space-y-2
                        "
                        style={{ color: C.secondary }}
                    >
                        <p>
                            The cell is the basic structural and
                            functional unit of all living organisms.
                            Each cell carries out essential life
                            processes...
                        </p>

                        <p>
                            <span
                                className="px-1 rounded"
                                style={{
                                    backgroundColor: `${C.accent}22`,
                                    color: C.accent,
                                }}
                            >
                                Mitochondria
                            </span>{" "}
                            are organelles responsible for energy
                            production via ATP synthesis through
                            cellular respiration.
                        </p>

                        <p>
                            The plasma membrane regulates the
                            transport of substances in and out
                            of the cell, maintaining homeostasis.
                        </p>
                    </div>

                    {/* Page indicator */}
                    <div className="mt-auto flex justify-between items-center">
                        <span
                            className="text-[10px]"
                            style={{ color: C.muted }}
                        >
                            Page 4 of 31
                        </span>

                        <div
                            className="
                                h-1 rounded-full flex-1
                                mx-3 overflow-hidden
                            "
                            style={{ backgroundColor: C.border }}
                        >
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: "13%",
                                    backgroundColor: C.accent,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Chat panel */}
                <div className="p-3 flex flex-col gap-2 min-w-0">
                    <div
                        className="
                            text-[10px] font-semibold
                            uppercase tracking-widest mb-1
                        "
                        style={{ color: C.muted }}
                    >
                        AI Chat
                    </div>

                    <div className="space-y-2">
                        <div
                            className="
                                text-[10px] px-2 py-1.5
                                rounded-lg rounded-tl-sm
                            "
                            style={{
                                backgroundColor: C.elevated,
                                color: C.secondary,
                                border: `1px solid ${C.border}`,
                            }}
                        >
                            What does mitochondria do?
                        </div>

                        <div
                            className="
                                text-[10px] px-2 py-1.5
                                rounded-lg rounded-tr-sm
                                leading-relaxed
                            "
                            style={{
                                backgroundColor: `${C.accent}15`,
                                color: C.text,
                                border: `1px solid ${C.accent}30`,
                            }}
                        >
                            Mitochondria produce ATP through
                            cellular respiration — the cell's
                            energy currency.{" "}
                            <span style={{ color: C.accent }}>
                                ↗ p.4
                            </span>
                        </div>

                        <div
                            className="
                                text-[10px] px-2 py-1.5
                                rounded-lg rounded-tl-sm
                            "
                            style={{
                                backgroundColor: C.elevated,
                                color: C.secondary,
                                border: `1px solid ${C.border}`,
                            }}
                        >
                            How many types of cells exist?
                        </div>
                    </div>

                    <div
                        className="
                            mt-auto flex items-center gap-1
                            px-2 py-1.5 rounded-lg text-[10px]
                        "
                        style={{
                            backgroundColor: C.elevated,
                            color: C.muted,
                            border: `1px solid ${C.border}`,
                        }}
                    >
                        <span className="flex-1">
                            Ask anything…
                        </span>

                        <div
                            className="
                                w-4 h-4 rounded
                                flex items-center justify-center
                            "
                            style={{ backgroundColor: C.accent }}
                        >
                            <ChevronRight
                                size={9}
                                color={C.bg}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
