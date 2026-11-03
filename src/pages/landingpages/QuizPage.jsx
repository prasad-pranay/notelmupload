
import React, { useEffect, useRef, useState } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useMotionValueEvent,
} from "framer-motion";
import { Zap } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const features = [
    "MCQ, True/False, Short Answer question types",
    "Easy, Medium, Hard, or Mixed difficulty",
    "5, 10, 15, or 20 questions per quiz",
    "Community quiz library to explore",
];
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

const sampleQuestions = [
    {
        type: "MCQ",
        question: "Which brain structure plays a critical role in forming new memories?",
        options: ["Hippocampus", "Cerebellum", "Amygdala", "Thalamus"],
        answer: "Hippocampus",
        explanation: "The hippocampus is essential for the formation and consolidation of new memories. It helps transfer information from short-term memory into long-term memory. It is particularly important for declarative memories, which include facts and events.",
        detail: "The hippocampus is located in the medial temporal lobe. Damage to this structure can make it difficult to form new explicit memories, even when older memories remain intact.",
    },
    {
        type: "True / False",
        question: "The hippocampus is located in the frontal lobe of the brain.",
        options: ["True", "False"],
        answer: "False",
        explanation: "The hippocampus is located in the medial temporal lobe, not the frontal lobe.",
        detail: "The temporal lobe is involved in memory and auditory processing. The frontal lobe is more closely associated with planning, decision-making and executive functions.",
    },
    {
        type: "MCQ",
        question: "Which part of a neuron receives signals from other neurons?",
        options: ["Axon", "Dendrites", "Myelin sheath", "Axon terminal"],
        answer: "Dendrites",
        explanation: "Dendrites are branching structures that receive signals from other neurons and carry them toward the cell body.",
        detail: "Their branched structure provides a large surface area for synaptic connections. Axons, by contrast, transmit signals away from the cell body.",
    },
    {
        type: "Short Answer",
        question: "What is the junction between two communicating neurons called?",
        options: [],
        answer: "Synapse",
        explanation: "A synapse is the junction where one neuron communicates with another neuron or target cell.",
        detail: "At a chemical synapse, the presynaptic neuron releases neurotransmitters into the synaptic cleft. These chemicals bind to receptors on the postsynaptic cell.",
    },
    {
        type: "MCQ",
        question: "Which type of memory temporarily stores and manipulates information?",
        options: ["Working memory", "Procedural memory", "Sensory memory", "Episodic memory"],
        answer: "Working memory",
        explanation: "Working memory temporarily stores and manipulates information while performing cognitive tasks.",
        detail: "It allows you to hold information in mind while using it, such as remembering a number while calculating or following a set of instructions.",
    },
];

const leaderboard = [
    { name: "Rachna Mishra", score: 100, time: "00:30" },
    { name: "Pranay", score: 90, time: "03:08" },
    { name: "Jai Bagul", score: 90, time: "03:42" },
    { name: "Moni", score: 80, time: "04:12" },
];

function Eyebrow({ children }) {
    return (
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/35 font-medium">
            {children}
        </p>
    );
}

function formatTime(seconds) {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function QuizExperience({ onAskFurther }) {
    const sectionRef = useRef(null);

    // Introduction
    const [featureIndex, setFeatureIndex] = useState(0);

    // Generator
    const [difficulty, setDifficulty] = useState("Mixed");
    const [types, setTypes] = useState(["MCQ", "True / False", "Short Answer"]);
    const [count, setCount] = useState(10);

    // Quiz
    const [questions, setQuestions] = useState(sampleQuestions);
    const [current, setCurrent] = useState(0);
    const question = questions[current];
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [seconds, setSeconds] = useState(0);

    // Results
    const [tab, setTab] = useState("results");
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [followUps, setFollowUps] = useState({});
    const [followUpInputs, setFollowUpInputs] = useState({});
    const [followUpLoading, setFollowUpLoading] = useState(null);

    const [stage, setStage] = useState("intro");

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        if (v < 0.20) setStage("intro");
        else if (v < 0.43) setStage("generator");
        else if (v < 0.78) setStage("quiz");
        else setStage("results");
    });

    // Intro moves out of the screen towards the LEFT
    const introOpacity = useTransform(
        scrollYProgress,
        [0, 0.1, 0.25],
        [1, 1, 0],
        { clamp: true }
    );

    const introX = useTransform(
        scrollYProgress,
        [0, 0.19],
        [0, -700]
    );

    const introBlur = useTransform(
        scrollYProgress,
        [0.10, 0.40],
        ["0px", "8px"]
    );

    // Title moves to top center
    const titleLeft = useTransform(
        scrollYProgress,
        [0, 0.30],
        ["8%", "50%"]
    );

    const titleTop = useTransform(
        scrollYProgress,
        [0, 0.30],
        ["20%", "8%"]
    );

    const titleX = useTransform(
        scrollYProgress,
        [0, 0.30],
        ["0%", "-50%"]
    );

    const titleWidth = useTransform(
        scrollYProgress,
        [0, 0.30],
        ["43vw", "85vw"]
    );

    const titleSize = useTransform(
        scrollYProgress,
        [0, 0.30],
        ["clamp(38px, 5vw, 72px)", "clamp(30px, 3.8vw, 52px)"]
    );

    // Generator moves from right to center and expands
    const cardLeft = useTransform(
        scrollYProgress,
        [0, 0.30],
        ["70%", "50%"]
    );

    const cardTop = useTransform(
        scrollYProgress,
        [0, 0.30],
        ["50%", "56%"]
    );

    const cardX = useTransform(
        scrollYProgress,
        [0, 0.30],
        ["0%", "-50%"]
    );

    const cardY = "-50%";

    const cardWidth = useTransform(
        scrollYProgress,
        [0, 0.30],
        ["min(390px, 43vw)", "min(900px, 90vw)"]
    );

    // The wrapper stays in place. Only its inner content changes.
    const cardOpacity = useTransform(
        scrollYProgress,
        [0, 0.30, 0.40, 0.78, 0.82],
        [1, 1, 1, 1, 1]
    );

    // Intro -> Quiz -> Results
    const quizOpacity = useTransform(
        scrollYProgress,
        [0.40, 0.46, 0.73, 0.78],
        [0, 1, 1, 0]
    );

    const resultOpacity = useTransform(
        scrollYProgress,
        [0.73, 0.80],
        [0, 1]
    );

    const goTo = (progress) => {
        if (!sectionRef.current) return;

        const sectionTop =
            sectionRef.current.getBoundingClientRect().top +
            window.scrollY;

        const distance =
            sectionRef.current.offsetHeight - window.innerHeight;

        window.scrollTo({
            top: sectionTop + distance * progress,
            behavior: "smooth",
        });
    };

    // Feature carousel
    useEffect(() => {
        const id = setInterval(() => {
            setFeatureIndex((v) => (v + 1) % features.length);
        }, 3200);

        return () => clearInterval(id);
    }, []);

    // Timer
    useEffect(() => {
        if (stage !== "quiz" || submitted) return;

        const id = setInterval(() => {
            setSeconds((v) => v + 1);
        }, 1000);

        return () => clearInterval(id);
    }, [stage, submitted]);

    const toggleType = (type) => {
        setTypes((prev) =>
            prev.includes(type)
                ? prev.filter((v) => v !== type)
                : [...prev, type]
        );
    };

    const startQuiz = () => {
        // Replace this with your API response.
        setQuestions(sampleQuestions);

        setCurrent(0);
        setAnswers({});
        setSubmitted(false);
        setSeconds(0);
        setTab("results");
        setExpandedQuestion(null);
        setFollowUps({});
        setFollowUpInputs({});

        goTo(0.49);
    };

    const selectAnswer = (value) => {
        if (submitted) return;

        setAnswers((prev) => ({
            ...prev,
            [current]: value,
        }));
    };

    const isCorrect = (q, value) =>
        String(value || "").trim().toLowerCase() ===
        q.answer.toLowerCase();

    const attempted = questions.filter(
        (_, i) => String(answers[i] || "").trim().length > 0
    ).length;

    const score = questions.filter(
        (q, i) => isCorrect(q, answers[i])
    ).length;

    const percentage = Math.round(
        (score / questions.length) * 100
    );

    const submitQuiz = () => {
        setSubmitted(true);
        setTab("results");
        goTo(0.85);
    };

    const askFurther = async (index) => {
        const prompt = followUpInputs[index]?.trim();
        if (!prompt) return;

        setFollowUpLoading(index);

        try {
            if (onAskFurther) {
                const response = await onAskFurther({
                    question: questions[index].question,
                    correctAnswer: questions[index].answer,
                    explanation: questions[index].explanation,
                    detail: questions[index].detail,
                    userQuestion: prompt,
                });

                setFollowUps((prev) => ({
                    ...prev,
                    [index]: response,
                }));
            } else {
                setFollowUps((prev) => ({
                    ...prev,
                    [index]: "Connect the onAskFurther prop to your AI endpoint to receive a personalized explanation.",
                }));
            }
        } catch {
            setFollowUps((prev) => ({
                ...prev,
                [index]: "Something went wrong. Please try asking again.",
            }));
        } finally {
            setFollowUpLoading(null);
        }
    };

    const title =
        stage === "intro"
            ? "From document to quiz in seconds."
            : "Experience the quiz.";

    return (
        <section
            id="quiz"
            ref={sectionRef}
            className="relative h-[500vh] bg-gradient-to-b from-[#0B0B0B] to-[#111618] text-white"
        >
            <div className="sticky top-0 h-screen overflow-hidden">

                {/* TITLE - persistent through every stage */}
                <motion.div
                    style={{
                        left: titleLeft,
                        top: titleTop,
                        x: titleX,
                        width: titleWidth,
                    }}
                    className="absolute z-30 pointer-events-none"
                >
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={title}
                            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                            transition={{ duration: 0.5, ease }}
                            className={`${stage === "intro" ? "text-left" : "text-center"} font-semibold tracking-[-0.055em] leading-[1.05]`}
                            style={{ fontSize: titleSize }}
                        >
                            {stage === "intro" ? (
                                <>
                                    From document to quiz{" "}
                                    <span className="text-white/35">in seconds.</span>
                                </>
                            ) : (
                                <>
                                    Experience <span className="text-white/35">the quiz.</span>
                                </>
                            )}
                        </motion.h2>
                    </AnimatePresence>
                </motion.div>

                {/* INTRO CONTENT - exits left */}
                <motion.div
                    style={{
                        opacity: introOpacity,
                        x: introX,
                        filter: introBlur,
                    }}
                    className="absolute left-[8%] top-[46%] max-w-[220px] sm:max-w-[530px] z-10"
                >
                    <p className="hidden sm:block text-sm font-light md:text-sm text-white/50 leading-[1.5]">
                        Choose your question types — Multiple Choice,
                        True/False, or Short Answer. Pick a difficulty
                        level from Easy to Mixed.  The AI does the rest, pulling directly
                        from your uploaded material.
                    </p>

                    <div className="mt-3">
                        {/* <Eyebrow>BUILT FOR YOUR LEARNING</Eyebrow> */}

                        <div className="relative h-12 mt-4 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={featureIndex}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -18 }}
                                    transition={{ duration: 0.45, ease }}
                                    className="absolute inset-0 flex items-center gap-3"
                                >
                                    <span className="text-[#eab42e]">✓</span>
                                    <p className="text-sm text-white/85">
                                        {features[featureIndex]}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-2 mt-2">
                            {features.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setFeatureIndex(i)}
                                    className={`h-1 rounded-full transition-all duration-500 ${i === featureIndex
                                        ? "w-9 bg-[#eab42e]"
                                        : "w-3 bg-white/20"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => goTo(0.30)}
                        className="mt-8 inline-flex cursor-pointer items-center gap-8 px-7 py-4 rounded-full bg-[#C6A44E] text-black text-sm font-semibold hover:bg-[#f2c451] transition-all"
                    >
                        Try the quiz <span>↗</span>
                    </button>
                </motion.div>

                {/* ONE CARD WRAPPER: GENERATOR -> QUIZ -> RESULTS */}
                <motion.div
                    style={{
                        left: cardLeft,
                        top: cardTop,
                        x: cardX,
                        y: cardY,
                        width: cardWidth,
                        opacity: cardOpacity,
                    }}
                    className="absolute z-20"
                >
                    <div
                        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, fontFamily: 'Inter, sans-serif' }}
                        className="w-full rounded-2xl overflow-hidden">

                        <AnimatePresence mode="wait">

                            {/* GENERATOR */}
                            {(stage === "intro" || stage === "generator") && (
                                <motion.div
                                    key="generator"
                                    initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -18, filter: "blur(5px)" }}
                                    transition={{ duration: 0.45, ease }}
                                    className="flex flex-col"
                                >
                                    <div className="px-5 py-4 border-b" style={{ borderColor: "#1E2628" }}>
                                        <div className="flex items-center gap-2">
                                            <Zap size={14} style={{ color: "#C6A44E" }} />
                                            <span className="text-sm font-semibold" style={{ color: "#E8ECE4" }}>
                                                Quiz Generator
                                            </span>
                                        </div>
                                        <div className="text-xs mt-0.5" style={{ color: "#5A6864" }}>
                                            Cell Biology.pdf · 31 pages
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-5">
                                        {/* Difficulty */}
                                        <div>
                                            <div className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: C.muted }}>
                                                Difficulty
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {['Easy', 'Medium', 'Hard', 'Mixed'].map((d, i) => (
                                                    <div
                                                        key={d}
                                                        className="px-3 py-1 rounded-full text-xs font-medium"
                                                        style={{
                                                            backgroundColor: i === 1 ? C.accent : C.elevated,
                                                            color: i === 1 ? '#0C0F10' : C.secondary,
                                                            border: `1px solid ${i === 1 ? C.accent : C.border}`,
                                                        }}
                                                    >
                                                        {d}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Question types */}
                                        <div>
                                            <div className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: C.muted }}>
                                                Question Types
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {types.map((t, i) => (
                                                    <div
                                                        key={t}
                                                        className="px-3 py-1 rounded-full text-xs font-medium"
                                                        style={{
                                                            backgroundColor: i !== 1 ? C.elevated : 'transparent',
                                                            color: i !== 1 ? C.text : C.muted,
                                                            border: `1px solid ${i !== 1 ? C.accent + '50' : C.border}`,
                                                        }}
                                                    >
                                                        {i !== 1 && <span style={{ color: C.accent }}>✓ </span>}
                                                        {t}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Number of questions */}
                                        <div>
                                            <div className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: C.muted }}>
                                                Questions
                                            </div>
                                            <div className="flex gap-2">
                                                {[5, 10, 15, 20].map((n) => (
                                                    <div
                                                        key={n}
                                                        className="flex-1 py-2 rounded-lg text-center text-xs font-bold"
                                                        style={{
                                                            backgroundColor: n === 10 ? C.accent : C.elevated,
                                                            color: n === 10 ? '#0C0F10' : C.secondary,
                                                            border: `1px solid ${n === 10 ? C.accent : C.border}`,
                                                        }}
                                                    >
                                                        {n}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Generate button */}
                                        <button
                                            className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                                            style={{ backgroundColor: C.accent, color: '#0C0F10' }}
                                        >
                                            <Zap size={14} />
                                            Generate Quiz
                                        </button>
                                    </div>


                                </motion.div>
                            )}

                            {/* QUIZ PLAYER */}
                            {stage === "quiz" && (
                                <motion.div
                                    key="quiz"
                                    initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                                    transition={{ duration: 0.5, ease }}
                                    className="p-5 sm:p-7 md:p-9 max-h-130"
                                >

                                    <div className="grid lg:grid-cols-[minmax(0,1fr)_220px] gap-8">

                                        {/* LEFT: QUESTION */}
                                        <div className="min-w-0">
                                            <div className="flex justify-between text-xs text-white/40">
                                                <p>QUESTION {String(current + 1).padStart(2, "0")}
                                                    <span className="opacity-50 ml-2">
                                                        /&nbsp; {`0${questions.length}`}
                                                    </span>
                                                </p>

                                                {/* <span>{current + 1} / {questions.length}</span> */}
                                                <span>{question.type}</span>
                                            </div>

                                            <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-[#eab42e]"
                                                    animate={{
                                                        width: `${((current + 1) / questions.length) * 100}%`,
                                                    }}
                                                />
                                            </div>

                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={current}
                                                    initial={{ opacity: 0, y: 14 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -14 }}
                                                    transition={{ duration: 0.35, ease }}
                                                    className="mt-8"
                                                >

                                                    <h3 className="text-xl sm:text-2xl md:text-[28px] leading-snug font-semibold mt-4">
                                                        {question.question}
                                                    </h3>

                                                    {question.type === "Short Answer" ? (
                                                        <input
                                                            value={answers[current] || ""}
                                                            onChange={(e) => selectAnswer(e.target.value)}
                                                            placeholder="Write your answer..."
                                                            className="w-full mt-7 px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl outline-none focus:border-[#eab42e] text-white placeholder:text-white/30"
                                                        />
                                                    ) : (
                                                        <div className="grid gap-3 mt-7">
                                                            {question.options.map((option, i) => {
                                                                const selected = answers[current] === option;
                                                                return (
                                                                    <button
                                                                        key={option}
                                                                        onClick={() => selectAnswer(option)}
                                                                        className={`flex items-center gap-4 p-4 rounded-xl border text-left text-sm transition-all duration-200 ${selected
                                                                            ? "border-[#eab42e] bg-[#eab42e]/10"
                                                                            : "border-white/10 hover:border-white/30"
                                                                            }`}
                                                                    >
                                                                        <span className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center text-xs ${selected
                                                                            ? "bg-[#eab42e] text-black border-[#eab42e]"
                                                                            : "border-white/20 text-white/50"
                                                                            }`}>
                                                                            {String.fromCharCode(65 + i)}
                                                                        </span>
                                                                        {option}
                                                                        {selected && <span className="ml-auto text-[#eab42e]">✓</span>}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>

                                        {/* RIGHT: NAVIGATOR + PREVIOUS/NEXT */}
                                        <aside className="border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6 flex flex-col">
                                            <Eyebrow>QUESTION NAVIGATOR</Eyebrow>

                                            <div className="grid grid-cols-5 lg:grid-cols-4 gap-2 mt-5">
                                                {questions.map((q, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrent(i)}
                                                        className={`aspect-square rounded-lg border text-xs transition-all ${current === i
                                                            ? "bg-[#eab42e] border-[#eab42e] text-black"
                                                            : answers[i]
                                                                ? "border-emerald-400/40 text-emerald-400 bg-emerald-400/[0.05]"
                                                                : "border-white/10 text-white/50 hover:border-white/30"
                                                            }`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="mt-5">
                                                <div className="text-xs font-light text-white/40 flex items-center gap-2">
                                                    Answered
                                                    <div className="w-full h-px bg-white opacity-20" />
                                                </div>
                                                <p className="text-2xl font-semibold mt-1">
                                                    {Object.keys(answers).length}
                                                    <span className="text-sm text-white/30">
                                                        {" "}/ {questions.length}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Both buttons underneath navigator */}
                                            <div className="grid grid-cols-2 gap-2 mt-7 mt-auto">
                                                <button
                                                    disabled={current === 0}
                                                    onClick={() => setCurrent((v) => v - 1)}
                                                    className="py-3 rounded-lg cursor-pointer border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/30 disabled:opacity-20 transition-all"
                                                >
                                                    ← Previous
                                                </button>

                                                <button
                                                    disabled={current === questions.length - 1}
                                                    onClick={() => setCurrent((v) => v + 1)}
                                                    className="py-3 rounded-lg cursor-pointer bg-white text-black text-xs font-semibold disabled:opacity-20 transition-all"
                                                >
                                                    Next →
                                                </button>
                                            </div>
                                            {/* seperator */}
                                            <div className="w-20 h-px bg-white my-6 mx-auto opacity-20" />
                                            <button
                                                onClick={submitQuiz}
                                                className="w-full py-3 rounded-lg cursor-pointer bg-[#eab42e] text-black text-xs font-semibold hover:bg-[#f2c451] transition-all"
                                            >
                                                Submit quiz
                                            </button>
                                        </aside>
                                    </div>
                                </motion.div>
                            )}

                            {/* RESULTS */}
                            {stage === "results" && (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ duration: 0.5, ease }}
                                    className="p-5 sm:p-7 md:p-9 max-h-130"
                                >
                                    <div className="">
                                        <Eyebrow>
                                            <span className="text-[#C6A44E]">
                                                YOUR PERFORMANCE
                                            </span>
                                        </Eyebrow>
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-end">
                                            <h3 className="text-3xl sm:text-4xl font-semibold mt-3 tracking-tight">
                                                Knowledge, <span className="text-white/35">measured.</span>
                                            </h3>
                                            <div className="flex gap-x-5">
                                                {[
                                                    ["results", "Your results"],
                                                    ["leaderboard", "Leaderboard"],
                                                ].map(([value, label]) => (
                                                    <button
                                                        key={value}
                                                        onClick={() => setTab(value)}
                                                        className={`relative text-sm pb-2 cursor-pointer h-max transition-colors ${tab === value
                                                            ? "text-white"
                                                            : "text-white/40 hover:text-white/70"
                                                            }`}
                                                    >
                                                        {label}
                                                        {tab === value && (
                                                            <motion.div
                                                                layoutId="quiz-result-tab"
                                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#eab42e]"
                                                            />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Score summary */}
                                    <div className="flex mt-8 items-center border border-[#353738] rounded-xl">
                                        {[
                                            {
                                                label: "Score",
                                                value: submitted ? `${percentage}%` : "—",
                                            },
                                            {
                                                label: null,
                                                value: 'haha'
                                            },
                                            {
                                                label: "Correct",
                                                value: submitted ? `${score}/${questions.length}` : "—",
                                            },
                                            {
                                                label: null,
                                                value: 'haha123'
                                            },
                                            {
                                                label: "Attempted",
                                                value: `${attempted}/${questions.length}`,
                                            },
                                        ].map((item) => {
                                            if (item.label == null) {
                                                return <div key={item.value} className="w-px h-12 bg-[#545859] mx-5" />
                                            } else {
                                                return <div
                                                    key={item.label}
                                                    className="rounded-xl w-full p-3 sm:p-4 text-center"
                                                >
                                                    <p className="text-xl sm:text-2xl md:text-3xl font-semibold">
                                                        {item.value}
                                                    </p>
                                                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/35 mt-2">
                                                        {item.label}
                                                    </p>
                                                </div>
                                            }
                                        })}
                                    </div>


                                    <AnimatePresence mode="wait">
                                        {tab === "results" ? (
                                            <motion.div
                                                key="result-list"
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                className="mt-5 space-y-3 max-h-[390px] overflow-y-auto pr-1"
                                            >
                                                {questions.map((q, i) => {
                                                    const value = answers[i];
                                                    const attemptedQuestion =
                                                        String(value || "").trim().length > 0;
                                                    const correct =
                                                        attemptedQuestion && isCorrect(q, value);
                                                    const expanded = expandedQuestion === i;

                                                    return (
                                                        <div
                                                            key={i}
                                                            className="rounded-xl border border-white/10 overflow-hidden"
                                                        >
                                                            <button
                                                                onClick={() =>
                                                                    setExpandedQuestion(expanded ? null : i)
                                                                }
                                                                className="w-full text-left p-4 sm:p-5 flex items-start gap-3 hover:bg-white/[0.025] transition-colors"
                                                            >
                                                                <span className={`mt-0.5 text-sm ${!attemptedQuestion
                                                                    ? "text-white/30"
                                                                    : correct
                                                                        ? "text-emerald-400"
                                                                        : "text-red-400"
                                                                    }`}>
                                                                    {!attemptedQuestion ? "—" : correct ? "✓" : "✕"}
                                                                </span>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex flex-wrap gap-2 items-center mb-2">
                                                                        <Eyebrow>QUESTION {String(i + 1).padStart(2, "0")}</Eyebrow>
                                                                        <span className="text-[9px] text-white/30 uppercase tracking-wider">
                                                                            {q.type}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm sm:text-base font-medium leading-relaxed">
                                                                        {q.question}
                                                                    </p>
                                                                    <p className={`text-xs mt-2 ${!attemptedQuestion
                                                                        ? "text-white/40"
                                                                        : correct
                                                                            ? "text-emerald-400"
                                                                            : "text-red-400"
                                                                        }`}>
                                                                        {!attemptedQuestion
                                                                            ? "You didn't attempt this question."
                                                                            : correct
                                                                                ? "Correct answer"
                                                                                : "Incorrect answer"}
                                                                    </p>
                                                                </div>

                                                                <motion.span
                                                                    animate={{ rotate: expanded ? 180 : 0 }}
                                                                    className="text-white/40 text-sm"
                                                                >
                                                                    ↓
                                                                </motion.span>
                                                            </button>

                                                            <AnimatePresence>
                                                                {expanded && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.35, ease }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="px-4 sm:px-5 pb-5 border-t border-white/10 pt-5">

                                                                            {/* Your answer */}
                                                                            <div className="grid sm:grid-cols-2 gap-3">
                                                                                <div className="rounded-lg bg-white/[0.035] p-4">
                                                                                    <Eyebrow>YOUR ANSWER</Eyebrow>
                                                                                    <p className="text-sm mt-2 text-white/75">
                                                                                        {attemptedQuestion
                                                                                            ? value
                                                                                            : "You didn't attempt this question."}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="rounded-lg bg-emerald-400/[0.05] border border-emerald-400/10 p-4">
                                                                                    <Eyebrow>CORRECT ANSWER</Eyebrow>
                                                                                    <p className="text-sm mt-2 text-emerald-400">
                                                                                        {q.answer}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            {/* Explanation */}
                                                                            <div className="mt-5">
                                                                                <Eyebrow>DETAILED EXPLANATION</Eyebrow>
                                                                                <p className="text-sm leading-[1.85] text-white/65 mt-3">
                                                                                    {q.explanation}
                                                                                </p>
                                                                            </div>

                                                                            {/* Further context */}
                                                                            <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                                                                                <Eyebrow>GO A LITTLE DEEPER</Eyebrow>
                                                                                <p className="text-sm leading-[1.8] text-white/60 mt-3">
                                                                                    {q.detail}
                                                                                </p>
                                                                            </div>

                                                                            {/* Ask further */}
                                                                            <div className="mt-5">
                                                                                <p className="text-xs font-medium text-white/80 mb-3">
                                                                                    Still curious? Ask further.
                                                                                </p>

                                                                                <div className="flex flex-col sm:flex-row gap-2">
                                                                                    <input
                                                                                        value={followUpInputs[i] || ""}
                                                                                        onChange={(e) =>
                                                                                            setFollowUpInputs((prev) => ({
                                                                                                ...prev,
                                                                                                [i]: e.target.value,
                                                                                            }))
                                                                                        }
                                                                                        placeholder="Why does this happen?"
                                                                                        className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-white/[0.035] border border-white/10 outline-none focus:border-[#eab42e] text-sm placeholder:text-white/25"
                                                                                    />

                                                                                    <button
                                                                                        onClick={() => askFurther(i)}
                                                                                        disabled={
                                                                                            !followUpInputs[i]?.trim() ||
                                                                                            followUpLoading === i
                                                                                        }
                                                                                        className="px-5 py-3 rounded-lg bg-[#eab42e] text-black text-xs font-semibold disabled:opacity-40 transition-all"
                                                                                    >
                                                                                        {followUpLoading === i
                                                                                            ? "Thinking..."
                                                                                            : "Ask further ↗"}
                                                                                    </button>
                                                                                </div>

                                                                                {followUps[i] && (
                                                                                    <div className="mt-4 p-4 rounded-lg border border-[#eab42e]/20 bg-[#eab42e]/[0.04]">
                                                                                        <Eyebrow>FURTHER EXPLANATION</Eyebrow>
                                                                                        <p className="text-sm leading-relaxed text-white/75 mt-3">
                                                                                            {typeof followUps[i] === "string"
                                                                                                ? followUps[i]
                                                                                                : JSON.stringify(followUps[i])}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    );
                                                })}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="leaderboard"
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                className="mt-5 space-y-2 max-h-[390px] overflow-y-auto"
                                            >
                                                {leaderboard.map((person, i) => (
                                                    <div
                                                        key={person.name}
                                                        className={`flex items-center justify-between gap-3 p-4 rounded-xl border ${person.name === "You"
                                                            ? "border-[#eab42e]/30 bg-[#eab42e]/[0.04]"
                                                            : "border-white/10"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <span className="text-xs text-white/30">
                                                                {String(i + 1).padStart(2, "0")}
                                                            </span>
                                                            <span className="text-sm truncate">
                                                                {person.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-4 text-sm shrink-0">
                                                            <span>{person.score}%</span>
                                                            <span className="text-white/40 text-xs">
                                                                {person.time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <button
                                        onClick={() => {
                                            setSubmitted(false);
                                            goTo(0.30);
                                        }}
                                        className="mt-7 text-sm text-[#eab42e] hover:text-white transition-colors"
                                    >
                                        Create another quiz ↗
                                    </button>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                {/* <motion.div
                    style={{
                        opacity: useTransform(
                            scrollYProgress,
                            [0, 0.12, 0.20],
                            [1, 0.7, 0]
                        ),
                    }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.25em] uppercase text-white/30 pointer-events-none"
                >
                    Scroll to explore ↓
                </motion.div> */}

            </div>
        </section>
    );
}

export default QuizExperience;




