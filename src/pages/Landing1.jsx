import About from "./landingpages/AboutPage";
import ScrollTitle from "./landingpages/AboutPage";
import CTASection from "./landingpages/CtaPage";
import FAQSection from "./landingpages/FaqPage";
import HeroSection from "./landingpages/Hero";
import QuizExperience from "./landingpages/QuizPage";


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import AnalyticsSection from "./landingpages/Analytics";
import SmoothScroll from "./landingpages/SmoothScroll";
import { useLenis } from "lenis/react";

function Footer() {
    const [time, setTime] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formattedTime = time.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    const formattedDate = time.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="bg-[#0C0F10] border-t border-[#1E2628] pt-16 md:pt-24 px-6 md:px-10">
            <div className="max-w-[1600px] mx-auto">

                {/* Top row */}
                <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">

                    <div>
                        <p className="text-[#D4B568] text-xs tracking-[0.25em] uppercase mb-4">
                            Learn differently.
                        </p>

                        <p className="text-[#E9E7DF] text-3xl md:text-5xl font-semibold tracking-tight">
                            Your knowledge,
                            <br />
                            <span className="text-[#777F7E]">made memorable.</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-12 md:gap-20">
                        <div className="flex flex-col gap-4">
                            <p className="text-[#777F7E] text-xs uppercase tracking-[0.2em]">
                                Explore
                            </p>
                            <Link to="/" className="text-[#E9E7DF] hover:text-[#D4B568] transition-colors no-underline">
                                Home
                            </Link>
                            <Link to="/#features" className="text-[#E9E7DF] hover:text-[#D4B568] transition-colors no-underline">
                                Features
                            </Link>
                            <Link to="/#faq" className="text-[#E9E7DF] hover:text-[#D4B568] transition-colors no-underline">
                                FAQ
                            </Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="text-[#777F7E] text-xs uppercase tracking-[0.2em]">
                                Account
                            </p>
                            <Link to="/register" className="text-[#E9E7DF] hover:text-[#D4B568] transition-colors no-underline">
                                Get started
                            </Link>
                            <Link to="/login" className="text-[#E9E7DF] hover:text-[#D4B568] transition-colors no-underline">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Huge brand name */}
                <div className="relative border-b border-[#1E2628] overflow-hidden">
                    <p
                        className="font-bold uppercase text-center leading-[0.8] tracking-[-0.075em] select-none"
                        style={{
                            fontSize: "clamp(5rem, 19vw, 19rem)",
                            color: "#E9E7DF",
                        }}
                    >
                        NoteLM
                    </p>
                </div>

                {/* Bottom row */}
                <div className="py-7 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                    <p className="text-sm text-[#777F7E]">
                        © 2026 <span className="text-[#E9E7DF]">Pranay Prasad</span>.
                        All rights reserved.
                    </p>

                    {/* Live clock */}
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4B568] opacity-50" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4B568]" />
                        </span>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <time
                                className="text-[#E9E7DF] text-sm font-mono tabular-nums"
                                dateTime={time.toISOString()}
                            >
                                {formattedTime}
                            </time>
                            <span className="hidden sm:block text-[#343C3D]">/</span>
                            <span className="text-[#777F7E] text-xs">
                                {formattedDate}
                            </span>
                        </div>
                    </div>

                    {/* Back to top */}
                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-2 text-sm text-[#777F7E] hover:text-[#D4B568] transition-colors"
                    >
                        Back to top
                        <span className="w-8 h-8 rounded-full border border-[#343C3D] flex items-center justify-center group-hover:border-[#D4B568] group-hover:-translate-y-1 transition-all duration-300">
                            <ArrowUp size={15} />
                        </span>
                    </button>
                </div>
            </div>
        </footer>
    );
}
function Header() {

    const lenis = useLenis();

    const scrollToSection = (id) => {
        lenis?.scrollTo(`#${id}`, {
            offset: -80, // Account for sticky header
            duration: 1.5,
        });
    };
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { name: "Features", href: "about" },
        { name: "Quizzes", href: "quiz" },
        { name: "FAQ's", href: "faq" },
    ];

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="stick top-0 z-[1000] w-full bg-[#0C0F10]/95 backdrop-blur-xl borderb border-[#1E2628]">
            <div className="px-5 md:px-10 py-4 md:py-5 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="flex gap-2 items-center no-underline shrink-0"
                >
                    <img
                        src="/icon.png"
                        alt="NoteLM"
                        className="h-9 md:h-10 w-auto"
                    />
                    <p className="font-bold text-lg uppercase tracking-tight text-[#E9E7DF]">
                        NoteLM
                    </p>
                </Link>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center ml-auto">

                    <nav className="flex items-center gap-7 lg:gap-10">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.href)}
                                className="relative no-underline uppercase text-xs font-semibold tracking-wider text-[#A3AAA7] hover:text-[#D4B568] transition-colors duration-300 group"
                            >
                                {link.name}

                                <span className="absolute -bottom-2 left-0 w-0 h-px bg-[#D4B568] group-hover:w-full transition-all duration-300" />
                            </button>
                        ))}
                    </nav>

                    <div className="w-px h-5 bg-[#343C3D] mx-7 lg:mx-10" />

                    <Link
                        to="/register"
                        className="group no-underline bg-[#C6A44E] hover:bg-[#D4B568] px-5 py-3 rounded-sm text-xs uppercase font-bold text-black tracking-wider transition-all duration-300 inline-flex items-center gap-2"
                    >
                        Get Started
                        <ArrowUpRight
                            size={15}
                            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={menuOpen}
                    className="md:hidden w-10 h-10 flex items-center justify-center rounded-sm border border-[#343C3D] text-[#E9E7DF] hover:border-[#C6A44E] transition-colors"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={menuOpen ? "close" : "menu"}
                            initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                            transition={{ duration: 0.2 }}
                        >
                            {menuOpen ? <X size={21} /> : <Menu size={21} />}
                        </motion.span>
                    </AnimatePresence>
                </button>
            </div>

            {/* Mobile navigation */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                            opacity: { duration: 0.2 },
                        }}
                        className="md:hidden overflow-hidden border-t border-[#1E2628]"
                    >
                        <nav className="px-5 py-5 flex flex-col">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.07 }}
                                >
                                    <Link
                                        to={link.href}
                                        onClick={closeMenu}
                                        className="flex items-center justify-between py-4 border-b border-[#1E2628] no-underline uppercase text-sm font-semibold tracking-wider text-[#E9E7DF] hover:text-[#D4B568] transition-colors"
                                    >
                                        {link.name}
                                        <ArrowUpRight size={16} className="text-[#777F7E]" />
                                    </Link>
                                </motion.div>
                            ))}

                            <Link
                                to="/register"
                                onClick={closeMenu}
                                className="mt-6 w-full flex items-center justify-center gap-2 bg-[#C6A44E] hover:bg-[#D4B568] px-5 py-4 rounded-sm text-xs uppercase font-bold tracking-wider text-black no-underline transition-colors"
                            >
                                Get Started
                                <ArrowUpRight size={16} />
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}


// <header className="py-5 bg-[#0C0F10] px-5 flex w-full items-center sticy top-0 z-[1000]">
//     {/* logo */}
//     <div className="flex gap-2 items-center">
//         <img src="/icon.png" alt="" className="h-10" />
//         <p className="font-bold text-lg uppercase">Notelm</p>
//     </div>
//     {/* right sides */}
//     <div className="flex items-center ml-auto">
//         {/* nav links */}
//         <div className="flex items-center gap-10">
//             <p className="uppercase text-xs font-semibold tracking-wider">Features</p>
//             <p className="uppercase text-xs font-semibold tracking-wider">How it works</p>
//             <p className="uppercase text-xs font-semibold tracking-wider">FAQ's</p>
//         </div>
//         <div className="w-px bg-white h-2 mx-10" />
//         <button className="bg-[#C6A44E] px-5 py-3 rounded-sm text-xs uppercase font-bold text-black tracking-wider">Get Started</button>
//     </div>
// </header>
export default function Landing1() {
    return (
        <SmoothScroll>
            <Header />
            <HeroSection />
            <About slides={slides} />
            <QuizExperience onAskFurther={async (data) => { }} />
            <AnalyticsSection />
            <CTASection />
            <FAQSection />
            <Footer />
        </SmoothScroll>
    )
}




const slides = [
    {
        gif: "/gifs/ask.gif",
        eyebrow: "01 — Ask naturally",
        heading: "Just ask.",
        description:
            "Ask questions in your own words. No complicated searches, no digging through folders.",
        buttons: [
            { label: "Explore questions", href: "#questions" },
            { label: "Learn more", href: "#features" },
        ],
    },
    {
        gif: "/gifs/document.gif",
        eyebrow: "02 — Your documents",
        heading: "Your knowledge, connected.",
        description:
            "Bring your documents together and turn scattered information into something you can actually understand.",
        buttons: [
            { label: "Explore documents", href: "#documents" },
        ],
    },
    {
        gif: "/gifs/answer.gif",
        eyebrow: "03 — Understand deeply",
        heading: "Answers with context.",
        description:
            "Get answers grounded in your own documents, with the context and references that matter.",
        buttons: [
            { label: "See how it works", href: "#how-it-works" },
        ],
    },
    {
        gif: "/gifs/internet.gif",
        eyebrow: "04 — Beyond searching",
        heading: "Less searching. More understanding.",
        description:
            "Stop jumping between tabs. Spend your time understanding information instead of hunting for it.",
        buttons: [
            { label: "Get started", href: "#start" },
        ],
    },
];


















// function MirrorReveal({
//     text = "understood.",
//     className = "",
//     style = {},
//     delay = 0.4,
//     stagger = 0.055,
// }) {
//     const [started, setStarted] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setStarted(true);
//         }, delay * 1000);

//         return () => clearTimeout(timer);
//     }, [delay]);

//     const characters = [...text];
//     const reversedCharacters = [...characters].reverse();

//     return (
//         <p
//             aria-label={text}
//             className={className}
//             style={style}
//         >
//             <span aria-hidden="true" className="inline-flex">
//                 {characters.map((char, index) => {
//                     const reverseIndex = characters.length - 1 - index;
//                     const initialChar = reversedCharacters[index];

//                     // Swap characters from the outside toward the center.
//                     const swapOrder = Math.min(index, reverseIndex);

//                     return (
//                         <span
//                             key={`${index}-${char}`}
//                             className="relative inline-grid"
//                             style={{ verticalAlign: "top" }}
//                         >
//                             {/* Initial reversed character */}
//                             <motion.span
//                                 className="col-start-1 row-start-1 inline-block"
//                                 initial={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                                 animate={
//                                     started
//                                         ? {
//                                             opacity: 0,
//                                             y: -10,
//                                             filter: "blur(4px)",
//                                         }
//                                         : {}
//                                 }
//                                 transition={{
//                                     delay: swapOrder * stagger,
//                                     duration: 0.28,
//                                     ease: [0.4, 0, 1, 1],
//                                 }}
//                             >
//                                 {initialChar === " " ? "\u00A0" : initialChar}
//                             </motion.span>

//                             {/* Final character */}
//                             <motion.span
//                                 className="col-start-1 row-start-1 inline-block"
//                                 initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
//                                 animate={
//                                     started
//                                         ? {
//                                             opacity: 1,
//                                             y: 0,
//                                             filter: "blur(0px)",
//                                         }
//                                         : {}
//                                 }
//                                 transition={{
//                                     delay: swapOrder * stagger + 0.12,
//                                     duration: 0.42,
//                                     ease: [0.22, 1, 0.36, 1],
//                                 }}
//                             >
//                                 {char === " " ? "\u00A0" : char}
//                             </motion.span>
//                         </span>
//                     );
//                 })}
//             </span>
//         </p>
//     );
// }