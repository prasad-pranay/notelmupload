import { useRef } from 'react';
import {
    motion,
    useInView,
    useReducedMotion,
} from 'framer-motion';
import {
    Flame,
    CheckCircle,
} from 'lucide-react';


// ─── Design Tokens ─────────────────────────────────────────────────────────────
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


// ─── Analytics Mock ────────────────────────────────────────────────────────────
function AnalyticsMock() {
    const bars = [
        { topic: 'Mitosis', score: 45 },
        { topic: 'Genetics', score: 60 },
        { topic: 'Ecology', score: 72 },
        { topic: 'Evolution', score: 38 },
        { topic: 'Cell Resp.', score: 85 },
    ];

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const streakDays = [true, true, true, false, true, true, false];

    return (
        <div
            className="w-full rounded-xl overflow-hidden"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, fontFamily: 'Inter, sans-serif' }}
        >
            {/* Stats row */}
            <div className="grid grid-cols-3 border-b" style={{ borderColor: C.border }}>
                {[
                    { label: 'Docs', value: '12' },
                    { label: 'Quizzes', value: '47' },
                    { label: 'Avg Score', value: '74%' },
                ].map((s, i) => (
                    <div
                        key={s.label}
                        className="py-4 text-center"
                        style={{
                            borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
                        }}
                    >
                        <div className="text-xl font-bold" style={{ color: C.text, letterSpacing: '-0.04em' }}>
                            {s.value}
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: C.muted }}>
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Weak topics */}
            <div className="p-4 border-b" style={{ borderColor: C.border }}>
                <div className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: C.muted }}>
                    Weak Topics
                </div>
                <div className="space-y-2">
                    {bars.map((b) => (
                        <div key={b.topic} className="flex items-center gap-2">
                            <div className="text-[10px] w-14 text-right" style={{ color: C.secondary }}>
                                {b.topic}
                            </div>
                            <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: C.border }}>
                                <motion.div
                                    className="h-1.5 rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${b.score}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    style={{
                                        backgroundColor: b.score < 50 ? '#E05C5C' : b.score < 70 ? C.accentMuted : C.accent,
                                    }}
                                />
                            </div>
                            <div className="text-[10px] w-6" style={{ color: C.muted }}>
                                {b.score}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Streak */}
            <div className="px-4 py-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <Flame size={13} style={{ color: C.accent }} />
                    <span className="text-xs font-bold" style={{ color: C.accent }}>
                        5 day streak
                    </span>
                </div>
                <div className="flex gap-1.5">
                    {weekDays.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div
                                className="w-5 h-5 rounded-full flex items-center justify-center"
                                style={{
                                    backgroundColor: streakDays[i] ? C.accent : C.elevated,
                                    border: `1px solid ${streakDays[i] ? C.accent : C.border}`,
                                }}
                            >
                                {streakDays[i] && <CheckCircle size={10} color="#0C0F10" />}
                            </div>
                            <span className="text-[8px]" style={{ color: C.muted }}>
                                {d}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Shared animation variants ─────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
    }),
};


// ─── Scroll-aware reveal wrapper ───────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '', once = true, amount = 0.15 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once, amount });
    const shouldReduce = useReducedMotion();

    return (
        <motion.div
            ref={ref}
            variants={fadeUp}
            initial={shouldReduce ? 'visible' : 'hidden'}
            animate={inView ? 'visible' : 'hidden'}
            custom={delay}
            className={className}
        >
            {children}
        </motion.div>
    );
}
// ─── Analytics & Streaks Section ──────────────────────────────────────────────
export default function AnalyticsSection() {
    const stats = [
        { value: '12+', label: 'Documents' },
        { value: '47', label: 'Quizzes' },
        { value: '74%', label: 'Average score' },
        { value: '5🔥', label: 'Day streak' },
    ];

    return (
        <section
            id='analytics'
            className="py-24 md:py-36 px-6 md:px-10"
            style={{ backgroundColor: C.bg }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Headline */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <Reveal>
                            <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: C.accent }}>
                                Analytics
                            </div>
                        </Reveal>
                        <Reveal delay={0.5}>
                            <h2
                                className="font-bold mb-6 leading-tight"
                                style={{
                                    fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                                    letterSpacing: '-0.04em',
                                    color: C.text,
                                }}
                            >
                                Know exactly what you've mastered
                            </h2>
                        </Reveal>
                        <Reveal delay={1}>
                            <p className="text-sm font-light leading-relaxed mb-10" style={{ color: C.secondary }}>
                                Your dashboard tracks documents, quizzes attempted, average scores, and highlights the topics you keep getting wrong. Combined with streaks, badges, and XP — studying becomes a habit.
                            </p>
                        </Reveal>

                        {/* Big stat numbers */}
                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((s, i) => (
                                <Reveal key={s.label} delay={i * 0.3}>
                                    <div
                                        className="p-5 rounded-xl"
                                        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                                    >
                                        <div
                                            className="text-3xl font-bold mb-1"
                                            style={{ color: C.text, letterSpacing: '-0.04em' }}
                                        >
                                            {s.value}
                                        </div>
                                        <div className="text-sm" style={{ color: C.muted }}>
                                            {s.label}
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    {/* Visual */}
                    <Reveal delay={1} className="w-full">
                        <AnalyticsMock />
                    </Reveal>
                </div>
            </div>
        </section>
    );
}