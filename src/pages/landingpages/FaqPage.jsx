
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
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

const faqs = [
    {
        question: "What is NoteLM?",
        answer:
            "NoteLM is an AI-powered study platform that transforms your documents into interactive quizzes. Upload your study material and turn passive reading into active learning."
    },
    {
        question: "How does NoteLM generate quizzes?",
        answer:
            "Simply upload your document and choose your preferred question types, difficulty level, and number of questions. NoteLM analyzes your content and creates a quiz based on the material."
    },
    {
        question: "What file formats are supported?",
        answer:
            "You can upload supported study documents such as PDFs and other compatible document formats. Your content is processed to identify important concepts and generate relevant questions."
    },
    {
        question: "Can I choose the difficulty and question types?",
        answer:
            "Absolutely. You can choose between Easy, Medium, Hard, or Mixed difficulty. You can also select question formats such as multiple choice, true or false, and short answer."
    },
    {
        question: "Can I retake a quiz?",
        answer:
            "Yes! You can revisit your quizzes and attempt them again to reinforce what you've learned. Repeated practice helps you identify weak areas and improve your understanding."
    },
    {
        question: "Can I explore quizzes created by others?",
        answer:
            "Yes. NoteLM includes a community quiz library where you can discover and explore quizzes shared by other learners."
    },
    {
        question: "Is NoteLM free to use?",
        answer:
            "You can get started for free. Create an account to explore the platform and its available study features."
    },
];

function FAQSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section
            id="faq"
            className="relative overflow-hidden px-6 py-24 md:px-10 md:py-36"
            style={{ backgroundColor: C.bg }}
        >
            {/* Background glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: "600px",
                    height: "600px",
                    top: "10%",
                    right: "-300px",
                    background: `radial-gradient(circle, ${C.accent}0B 0%, transparent 70%)`,
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-16 md:mb-20"
                >
                    <p
                        className="text-xs font-semibold tracking-[0.25em] uppercase mb-5"
                        style={{ color: C.accent }}
                    >
                        Got questions?
                    </p>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h2
                            className="font-bold leading-[1.05]"
                            style={{
                                color: C.text,
                                fontSize: "clamp(2.7rem, 6vw, 5rem)",
                                letterSpacing: "-0.055em",
                            }}
                        >
                            Things you
                            <br />
                            <span style={{ color: C.accent }}>might wonder.</span>
                        </h2>

                        <p
                            className="text-base md:text-base font-light leading-relaxed max-w-sm"
                            style={{ color: C.secondary }}
                        >
                            Everything you need to know about making your study sessions
                            smarter with NoteLM.
                        </p>
                    </div>
                </motion.div>

                {/* FAQ list */}
                <div
                    className="border-t"
                    style={{ borderColor: C.border }}
                >
                    {faqs.map((faq, index) => {
                        const isOpen = activeIndex === index;

                        return (
                            <motion.div
                                key={faq.question}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: 0.6,
                                    delay: Math.min(index * 0.07, 0.35),
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="border-b cursor-pointer"
                                style={{ borderColor: C.border }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveIndex(isOpen ? -1 : index)
                                    }
                                    aria-expanded={isOpen}
                                    className="w-full flex items-center gap-5 md:gap-8 py-7 md:py-8 text-left group"
                                >
                                    {/* Number */}
                                    <span
                                        className="text-sm font-medium tabular-nums w-7 shrink-0"
                                        style={{
                                            color: isOpen ? C.accent : C.secondary,
                                        }}
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    {/* Question */}
                                    <span
                                        className="flex-1 text-lg md:text-2xl font-medium transition-colors duration-300"
                                        style={{
                                            color: isOpen ? C.accent : C.text,
                                            letterSpacing: "-0.025em",
                                        }}
                                    >
                                        {faq.question}
                                    </span>

                                    {/* Plus icon */}
                                    <motion.span
                                        animate={{
                                            rotate: isOpen ? 45 : 0,
                                            backgroundColor: isOpen
                                                ? C.accent
                                                : "transparent",
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="w-10 h-10 rounded-full border flex items-center justify-center shrink-0"
                                        style={{
                                            borderColor: isOpen ? C.accent : C.border,
                                            color: isOpen ? C.bg : C.secondary,
                                        }}
                                    >
                                        <Plus size={19} />
                                    </motion.span>
                                </button>

                                {/* Answer */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                height: {
                                                    duration: 0.4,
                                                    ease: [0.22, 1, 0.36, 1],
                                                },
                                                opacity: { duration: 0.25 },
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-8 pl-12 md:pl-[4.5rem] pr-12">
                                                <p
                                                    className="text-base md:text-lg leading-[1.85] max-w-2xl"
                                                    style={{ color: C.secondary }}
                                                >
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                >
                    <p
                        className="text-xs font-light"
                        style={{ color: C.secondary }}
                    >
                        Still have questions? We'd love to help.
                    </p>

                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 text-sm font-bold no-underline transition-all duration-300"
                        style={{ color: C.accent }}
                    >
                        Get started with NoteLM
                        <motion.span
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            →
                        </motion.span>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}

export default FAQSection;
