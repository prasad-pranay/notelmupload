
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.15,
        },
    },
};

const revealUp = {
    hidden: {
        opacity: 0,
        y: 35,
        filter: "blur(8px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const C = {
    bg: '#0C0F10',
    surface: '#111618',
    elevated: '#161D1F',
    border: '#1E2628',
    borderSoft: '#252E30',
    accent: '#C6A44E',
    accentMuted: '#9A7B38',
    text: '#E8ECE4',
    secondary: '#94A09A',
    muted: '#5A6864',
};

export default function CTASection() {

    return (<section
        className="py-24 md:py-40 px-6 md:px-10 relative overflow-hidden bg-gradient-to-b from-[#111618] to-[#0C0F10]"
    >


        <motion.div
            className="relative z-10 max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
        >
            {/* Heading */}
            <motion.h2
                variants={revealUp}
                className="font-bold mb-6 leading-tight"
                style={{
                    fontSize: "clamp(3rem, 6vw, 4.5rem)",
                    letterSpacing: "-0.04em",
                    color: C.text,
                }}
            >
                <span className="block overflow-hidden pb-1">
                    <motion.span
                        className="inline-block"
                        variants={revealUp}
                    >
                        Stop rereading.
                    </motion.span>
                </span>

                <span className="block overflow-hidden pb-2">
                    <motion.span
                        className="inline-block"
                        variants={revealUp}
                        style={{ color: C.accent }}
                    >
                        Start remembering.
                    </motion.span>
                </span>
            </motion.h2>

            {/* Description */}
            <motion.p
                variants={revealUp}
                className="text-sm font-light md:text-xl leading-relaxed mb-12"
                style={{
                    color: C.secondary,
                    maxWidth: "560px",
                    margin: "0 auto 3rem",
                }}
            >
                Join thousands of students who study smarter with NoteLM.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
                variants={containerVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
                <motion.div variants={revealUp}>
                    <Link
                        to="/register"
                        className="no-underline px-8 py-4 rounded-xl text-lg font-bold inline-flex items-center gap-2"
                        style={{
                            backgroundColor: C.accent,
                            color: "#0C0F10",
                            letterSpacing: "-0.01em",
                            boxShadow: `0 0 0px ${C.accent}00`,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#D4B568";
                            e.currentTarget.style.boxShadow = `0 12px 32px ${C.accent}35`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = C.accent;
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        Get started free
                        <motion.span
                            className="inline-flex"
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronRight size={18} />
                        </motion.span>
                    </Link>
                </motion.div>

                <motion.div variants={revealUp} >
                    <Link
                        to="/login"
                        className="no-underline px-8 py-4 rounded-xl text-lg font-medium inline-flex items-center gap-2 transition-all duration-300"
                        style={{
                            color: C.secondary,
                            border: `1px solid ${C.border}`,
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
                        Sign in
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    </section>);
}

