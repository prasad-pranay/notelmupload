import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useReducedMotion,
  motionValue
} from 'framer-motion';
import {
  BookOpen,
  Zap,
  BarChart2,
  Users,
  Brain,
  FileText,
  MessageSquare,
  Trophy,
  Flame,
  Star,
  ChevronRight,
  X,
  Menu,
  Upload,
  CheckCircle,
  TrendingUp,
  Play,
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

// ─── Shared animation variants ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.07 },
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

// ─── Scroll Progress Bar ────────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 z-[100] h-[2px]"
      css={{ backgroundColor: C.accent }}
    />
  );
}

// ─── Navigation ────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Quizzes', href: '#quizzes' },
  ];

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%', backgroundColor: C.accent }}
        className="fixed top-0 left-0 right-0 z-[100] h-[2px]"
      />

      {/* Nav bar */}
      <motion.nav
        initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16"
        style={{
          backgroundColor: scrolled ? 'rgba(12,15,16,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
          borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
          transition: 'background-color 0.3s, border-color 0.3s, backdrop-filter 0.3s',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <img src="/icon.png" alt="NoteLM icon" className="w-7 h-7 rounded-md" />
          <span
            className="font-bold text-[17px] tracking-tight"
            style={{ color: C.text, letterSpacing: '-0.03em', fontFamily: 'Inter, sans-serif' }}
          >
            NoteLM
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-sm font-medium transition-colors duration-200 no-underline"
              style={{ color: C.secondary }}
              onMouseEnter={(e) => (e.target.style.color = C.text)}
              onMouseLeave={(e) => (e.target.style.color = C.secondary)}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium no-underline transition-colors duration-200"
            style={{ color: C.secondary }}
            onMouseEnter={(e) => (e.target.style.color = C.text)}
            onMouseLeave={(e) => (e.target.style.color = C.secondary)}
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg text-sm font-semibold no-underline transition-all duration-200"
            style={{
              backgroundColor: C.accent,
              color: '#0C0F10',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D4B568';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = C.accent;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: C.text }}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col px-6 pt-24 pb-10"
            style={{ backgroundColor: C.bg }}
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="text-2xl font-semibold no-underline"
                  style={{ color: C.text, letterSpacing: '-0.03em' }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-3">
              <Link
                to="/login"
                className="text-center py-3.5 rounded-xl text-base font-semibold no-underline"
                style={{ color: C.text, border: `1px solid ${C.border}`, backgroundColor: C.surface }}
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-center py-3.5 rounded-xl text-base font-semibold no-underline"
                style={{ backgroundColor: C.accent, color: '#0C0F10' }}
                onClick={() => setMenuOpen(false)}
              >
                Get started free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Notebook Mock (Hero Visual) ───────────────────────────────────────────────
function NotebookMock() {
  return (
    <div
      className="w-full rounded-xl overflow-hidden shadow-2xl"
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ backgroundColor: C.elevated, borderColor: C.border }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28C840' }} />
        </div>
        <div
          className="flex-1 mx-4 px-3 py-1 rounded-md text-xs text-center"
          style={{ backgroundColor: C.surface, color: C.muted, border: `1px solid ${C.border}` }}
        >
          app.notelm.com/notebook
        </div>
      </div>

      {/* Mobile simplified preview */}
      <div className="md:hidden p-4" style={{ minHeight: '200px' }}>
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: C.muted }}>
          Notebook Preview
        </div>
        <div className="text-sm font-bold leading-tight mb-2" style={{ color: C.text, letterSpacing: '-0.02em' }}>
          Cell Biology
        </div>
        <div className="text-[11px] leading-relaxed mb-3" style={{ color: C.secondary }}>
          <p>The cell is the basic structural and functional unit of all living organisms...</p>
          <p className="mt-2">
            <span className="px-1 rounded" style={{ backgroundColor: `${C.accent}22`, color: C.accent }}>
              Mitochondria
            </span>{' '}
            produce ATP through cellular respiration.
          </p>
        </div>
        <div
          className="text-[10px] px-3 py-2 rounded-lg"
          style={{ backgroundColor: `${C.accent}15`, color: C.text, border: `1px solid ${C.accent}30` }}
        >
          <span className="font-semibold" style={{ color: C.accent }}>AI:</span>{' '}
          Mitochondria produce ATP through cellular respiration — the cell's energy currency.{' '}
          <span style={{ color: C.accent }}>↗ p.4</span>
        </div>
      </div>

      {/* 3-panel layout */}
      <div className="hidden md:grid grid-cols-[160px_1fr_160px]" style={{ minHeight: '280px' }}>
        {/* Sources panel */}
        <div className="p-3 flex flex-col gap-2" style={{ borderRight: `1px solid ${C.border}` }}>
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: C.muted }}>
            Sources
          </div>
          {[
            { name: 'Cell Biology.pdf', active: true },
            { name: 'Chemistry.pdf', active: false },
            { name: 'Genetics.txt', active: false },
          ].map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] truncate"
              style={{
                backgroundColor: f.active ? C.elevated : 'transparent',
                color: f.active ? C.text : C.muted,
                border: f.active ? `1px solid ${C.borderSoft}` : '1px solid transparent',
              }}
            >
              <FileText size={10} style={{ color: C.accent, flexShrink: 0 }} />
              <span className="truncate">{f.name}</span>
            </div>
          ))}
          <button
            className="mt-2 flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md w-full"
            style={{ backgroundColor: C.elevated, color: C.accent, border: `1px solid ${C.border}` }}
          >
            <Upload size={9} />
            Upload
          </button>
        </div>

        {/* Reader panel */}
        <div className="p-4 flex flex-col gap-2" style={{ borderRight: `1px solid ${C.border}` }}>
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: C.muted }}>
            Reader
          </div>
          <div className="text-sm font-bold leading-tight mb-1" style={{ color: C.text, letterSpacing: '-0.02em' }}>
            Cell Biology
          </div>
          <div className="text-[11px] leading-relaxed space-y-2" style={{ color: C.secondary }}>
            <p>The cell is the basic structural and functional unit of all living organisms. Each cell carries out essential life processes...</p>
            <p>
              <span className="px-1 rounded" style={{ backgroundColor: `${C.accent}22`, color: C.accent }}>
                Mitochondria
              </span>{' '}
              are organelles responsible for energy production via ATP synthesis through cellular respiration.
            </p>
            <p>The plasma membrane regulates the transport of substances in and out of the cell, maintaining homeostasis.</p>
          </div>
          {/* Page indicator */}
          <div className="mt-auto flex justify-between items-center">
            <span className="text-[10px]" style={{ color: C.muted }}>Page 4 of 31</span>
            <div className="h-1 rounded-full flex-1 mx-3" style={{ backgroundColor: C.border }}>
              <div className="h-1 rounded-full w-[13%]" style={{ backgroundColor: C.accent }} />
            </div>
          </div>
        </div>

        {/* Chat panel */}
        <div className="p-3 flex flex-col gap-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: C.muted }}>
            AI Chat
          </div>
          <div className="space-y-2">
            <div
              className="text-[10px] px-2 py-1.5 rounded-lg rounded-tl-sm"
              style={{ backgroundColor: C.elevated, color: C.secondary, border: `1px solid ${C.border}` }}
            >
              What does mitochondria do?
            </div>
            <div
              className="text-[10px] px-2 py-1.5 rounded-lg rounded-tr-sm leading-relaxed"
              style={{ backgroundColor: `${C.accent}15`, color: C.text, border: `1px solid ${C.accent}30` }}
            >
              Mitochondria produce ATP through cellular respiration — the cell's energy currency.{' '}
              <span style={{ color: C.accent }}>↗ p.4</span>
            </div>
            <div
              className="text-[10px] px-2 py-1.5 rounded-lg rounded-tl-sm"
              style={{ backgroundColor: C.elevated, color: C.secondary, border: `1px solid ${C.border}` }}
            >
              How many types of cells exist?
            </div>
          </div>
          <div
            className="mt-auto flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px]"
            style={{ backgroundColor: C.elevated, color: C.muted, border: `1px solid ${C.border}` }}
          >
            <span className="flex-1">Ask anything…</span>
            <div
              className="w-4 h-4 rounded flex items-center justify-center"
              style={{ backgroundColor: C.accent }}
            >
              <ChevronRight size={8} color="#0C0F10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Quiz Generator Mock ───────────────────────────────────────────────────────
function QuizGeneratorMock() {
  const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed'];
  const types = ['Multiple Choice', 'True / False', 'Short Answer'];
  const counts = [5, 10, 15, 20];

  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: C.accent }} />
          <span className="text-sm font-semibold" style={{ color: C.text }}>
            Quiz Generator
          </span>
        </div>
        <div className="text-xs mt-0.5" style={{ color: C.muted }}>
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
            {difficulties.map((d, i) => (
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
            {counts.map((n) => (
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
    </div>
  );
}

// ─── Live Quiz Mock ────────────────────────────────────────────────────────────
function LiveQuizMock() {
  const participants = [
    { name: 'Sarah K.', avatar: 'SK', score: 340 },
    { name: 'James T.', avatar: 'JT', score: 280 },
    { name: 'Priya M.', avatar: 'PM', score: 260 },
    { name: 'Leo R.', avatar: 'LR', score: 210 },
    { name: 'Ana B.', avatar: 'AB', score: 190 },
  ];

  return (
    <div
      className="w-full max-w-sm mx-auto rounded-xl overflow-hidden"
      style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, fontFamily: 'Inter, sans-serif' }}
    >
      {/* Join code */}
      <div
        className="px-6 py-5 text-center border-b"
        style={{ borderColor: C.border, backgroundColor: C.elevated }}
      >
        <div className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: C.muted }}>
          Join Code
        </div>
        <div
          className="text-2xl font-bold tracking-widest"
          style={{ color: C.accent, letterSpacing: '0.12em', fontFamily: 'monospace' }}
        >
          NLM-4827
        </div>
        <div className="text-xs mt-1" style={{ color: C.muted }}>
          5 participants waiting
        </div>
      </div>

      {/* Leaderboard */}
      <div className="p-4 space-y-2">
        {participants.map((p, i) => (
          <div key={p.name} className="flex items-center gap-3">
            <div
              className="text-xs font-bold w-4 text-center"
              style={{ color: i === 0 ? C.accent : C.muted }}
            >
              {i + 1}
            </div>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{
                backgroundColor: i === 0 ? C.accent : C.elevated,
                color: i === 0 ? '#0C0F10' : C.text,
                border: `1px solid ${i === 0 ? C.accent : C.border}`,
              }}
            >
              {p.avatar}
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium" style={{ color: C.text }}>
                {p.name}
              </div>
              <div className="h-1 rounded-full mt-0.5" style={{ backgroundColor: C.border }}>
                <div
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: `${(p.score / 340) * 100}%`,
                    backgroundColor: i === 0 ? C.accent : C.muted,
                  }}
                />
              </div>
            </div>
            <div className="text-[10px] font-bold" style={{ color: i === 0 ? C.accent : C.muted }}>
              {p.score}
            </div>
          </div>
        ))}
      </div>

      {/* Start button */}
      <div className="px-4 pb-4">
        <button
          className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          style={{ backgroundColor: C.accent, color: '#0C0F10' }}
        >
          <Play size={13} fill="#0C0F10" />
          Start Quiz
        </button>
      </div>
    </div>
  );
}

// ─── AI Solver Mock ────────────────────────────────────────────────────────────
function SolverMock() {
  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, fontFamily: 'Inter, sans-serif' }}
    >
      {/* Problem statement */}
      <div className="p-4 border-b" style={{ borderColor: C.border, backgroundColor: C.elevated }}>
        <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: C.muted }}>
          Problem
        </div>
        <p className="text-xs leading-relaxed" style={{ color: C.text }}>
          A cell contains 2.4 × 10⁻¹² g of DNA. During meiosis, how much DNA will each resulting cell contain?
        </p>
      </div>

      {/* AI solution */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${C.accent}20`, border: `1px solid ${C.accent}40` }}
          >
            <Brain size={10} style={{ color: C.accent }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: C.accent }}>
            AI Solution
          </span>
        </div>

        {[
          { step: 1, text: 'Meiosis produces 4 haploid cells from 1 diploid cell.' },
          { step: 2, text: 'DNA content is halved twice: first in Meiosis I, then Meiosis II.' },
          { step: 3, text: '2.4 × 10⁻¹² ÷ 4 = 0.6 × 10⁻¹² g per cell' },
        ].map((s) => (
          <div key={s.step} className="flex gap-3 items-start">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
              style={{ backgroundColor: C.accent, color: '#0C0F10' }}
            >
              {s.step}
            </div>
            <p className="text-xs leading-relaxed" style={{ color: C.secondary }}>
              {s.text}
            </p>
          </div>
        ))}

        <div
          className="mt-2 px-3 py-2 rounded-lg text-xs font-bold"
          style={{ backgroundColor: `${C.accent}15`, color: C.accent, border: `1px solid ${C.accent}30` }}
        >
          Answer: 0.6 × 10⁻¹² g (6 × 10⁻¹³ g)
        </div>
      </div>
    </div>
  );
}

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

// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection() {
  const shouldReduce = useReducedMotion();
  const words = ['Your', 'documents,', 'finally', 'understood.'];

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 md:px-10 overflow-hidden"
      style={{ backgroundColor: C.bg }}
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C.accent}0A 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex uppercase items-center gap-2 px-3 py-1.5 rounded-full text-[9px] tracking-wider font-light mb-8"
              style={{
                color: C.accent,
              }}
            >
              <Star size={10} fill={C.accent} />
              AI-powered study assistant
            </motion.div>

            {/* Headline — staggered word reveal */}
            <h1
              className="font-bold leading-[0.95] mb-6"
              style={{
                fontSize: 'clamp(2.6rem, 6vw, 5rem)',
                letterSpacing: '-0.04em',
                color: C.text,
              }}
            >
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: 40, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.7,
                    delay: 0.2 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-[0.22em]"
                >
                  {word === 'understood.' ? (
                    <span style={{ color: C.accent }}>{word}</span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </h1>

            {/* Sub-copy */}
            <motion.p
              initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg leading-relaxed mb-10 max-w-[440px]"
              style={{ color: C.secondary }}
            >
              Upload your study material. Ask questions, generate quizzes, solve problems — all powered by AI that reads your documents, not the internet.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3 items-center"
            >
              <Link
                to="/register"
                className="no-underline px-6 py-3 rounded-xl text-base font-bold transition-all duration-200 inline-flex items-center gap-2"
                style={{ backgroundColor: C.accent, color: '#0C0F10', letterSpacing: '-0.01em' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4B568';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${C.accent}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = C.accent;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Start studying free
                <ChevronRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="no-underline px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 inline-flex items-center gap-2"
                style={{ color: C.secondary, border: `1px solid ${C.border}` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.borderSoft;
                  e.currentTarget.style.color = C.text;
                  e.currentTarget.style.backgroundColor = C.surface;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = C.secondary;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                See how it works
              </a>
            </motion.div>
          </div>

          {/* Right: Notebook mock */}
          <motion.div
            initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <NotebookMock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Feature List Section ──────────────────────────────────────────────────────
const featureList = [
  {
    icon: MessageSquare,
    title: 'Ask your documents',
    description:
      'Type any question. The AI returns an answer drawn directly from your uploaded file, with the source page cited — so you can always verify.',
  },
  {
    icon: BookOpen,
    title: 'Read & chat side-by-side',
    description:
      'The Notebook workspace keeps your document, a structured reader, and the AI chat panel open simultaneously. No tab-hopping.',
  },
  {
    icon: Zap,
    title: 'Generate quizzes instantly',
    description:
      "Choose the number of questions, difficulty (easy to mixed), and type \u2014 MCQ, true/false, or short answer. One click and it's ready.",
  },
  {
    icon: Brain,
    title: 'AI Problem Solver',
    description:
      'Drop in an exam question, homework problem, or photo of an exercise. The AI walks through the solution step by step.',
  },
  {
    icon: BarChart2,
    title: 'Track your weak spots',
    description:
      'Analytics surface which topics you keep missing. Combined with streaks, XP, and achievements, you always know what to study next.',
  },
];

// function FeaturesSection() {
//   return (
//     <section id="features" className="py-24 md:py-36 px-6 md:px-10" style={{ backgroundColor: C.bg }}>
//       <div className="max-w-7xl mx-auto">
//         <div className="grid md:grid-cols-[200px_1fr] gap-16 md:gap-24">
//           {/* Sticky label */}
//           <div className="md:sticky md:top-24 self-start">
//             <Reveal>
//               <div className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: C.accent }}>
//                 Features
//               </div>
//               <div className="text-2xl font-bold leading-tight" style={{ color: C.text, letterSpacing: '-0.03em' }}>
//                 Everything your documents contain
//               </div>
//             </Reveal>
//           </div>

//           {/* Feature list */}
//           <div className="divide-y" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
//             {featureList.map((feature, i) => {
//               const Icon = feature.icon;
//               return (
//                 <Reveal key={feature.title} delay={i * 0.12}>
//                   <div
//                     className="py-8 flex gap-6 group"
//                     style={{ borderColor: C.border }}
//                   >
//                     <div
//                       className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-200"
//                       style={{ backgroundColor: `${C.accent}15`, border: `1px solid ${C.accent}25` }}
//                     >
//                       <Icon size={18} style={{ color: C.accent }} />
//                     </div>
//                     <div>
//                       <div
//                         className="font-semibold text-lg mb-1.5"
//                         style={{ color: C.text, letterSpacing: '-0.02em' }}
//                       >
//                         {feature.title}
//                       </div>
//                       <p className="text-base leading-relaxed" style={{ color: C.secondary }}>
//                         {feature.description}
//                       </p>
//                     </div>
//                   </div>
//                 </Reveal>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// ─── Quiz Generator Section ────────────────────────────────────────────────────


function OrbitFeatureCard({
  feature,
  index,
  total,
  scrollProgress,
}) {
  const Icon = feature.icon;

  const progress = useTransform(
    scrollProgress,
    [index / total, (index + 1) / total],
    [0, 1]
  );

  // 180 degree orbit: bottom -> right -> top
  const angle = useTransform(
    progress,
    (p) => Math.PI / 2 - p * Math.PI
  );

  const x = useTransform(
    angle,
    (a) => `${Math.cos(a) * 40}vw`
  );

  const y = useTransform(
    angle,
    (a) => `${Math.sin(a) * 300}px`
  );

  const scale = useTransform(
    progress,
    [0, 0.5, 1],
    [0.58, 1, 0.58]
  );

  const opacity = useTransform(
    progress,
    [0, 0.15, 0.85, 1],
    [0, 0.8, 0.8, 0]
  );

  const rotate = useTransform(
    progress,
    [0, 0.5, 1],
    [-8, 0, 8]
  );

  return (
    <motion.div
      className="absolute top-1/2 left-[12%]"
      style={{
        x,
        y,
        scale,
        opacity,
        rotate,
      }}
    >
      <div
        className="w-[min(430px,75vw)] -translate-x-1/2 -translate-y-1/2
        rounded-2xl p-8 md:p-10"
        style={{
          backgroundColor: C.bg,
          border: `1px solid ${C.border}`,
          boxShadow: "0 24px 80px rgba(0,0,0,0.14)",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-8"
          style={{
            backgroundColor: `${C.accent}15`,
            border: `1px solid ${C.accent}30`,
          }}
        >
          <Icon size={22} style={{ color: C.accent }} />
        </div>

        <div
          className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
          style={{ color: C.accent }}
        >
          0{index + 1} / 0{total}
        </div>

        <h3
          className="text-2xl md:text-3xl font-bold mb-4"
          style={{
            color: C.text,
            letterSpacing: "-0.035em",
          }}
        >
          {feature.title}
        </h3>

        <p
          className="text-sm md:text-base leading-relaxed"
          style={{ color: C.secondary }}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

function FeaturesSection() {
  const sectionRef = useRef(null);

  const total = featureList.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    mass: 0.6,
  });

  // Snap scrolling to the nearest feature's focused position
  useEffect(() => {
    const snapToNearest = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();

      if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
        return;
      }

      const sectionTop = window.scrollY + rect.top;
      const scrollDistance =
        section.offsetHeight - window.innerHeight;

      if (scrollDistance <= 0) return;

      const currentProgress =
        (window.scrollY - sectionTop) / scrollDistance;

      const progress = Math.max(0, Math.min(1, currentProgress));

      // Find the closest feature focus point
      const nearestIndex = Math.max(
        0,
        Math.min(
          total - 1,
          Math.round(progress * total - 0.5)
        )
      );

      // Each feature is focused halfway through its scroll interval
      const targetProgress = (nearestIndex + 0.5) / total;

      const targetY =
        sectionTop + targetProgress * scrollDistance;

      if (Math.abs(window.scrollY - targetY) > 2) {
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("scrollend", snapToNearest);

    return () => {
      window.removeEventListener("scrollend", snapToNearest);
    };
  }, [total]);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative px-6 md:px-10"
      style={{
        backgroundColor: C.bg,
        height: `${(total + 1) * 100}vh`,
      }}
    >
      {/* Sticky animation viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">

        <div className="relative max-w-7xl mx-auto h-full">

          {/* LEFT: ORBIT CENTER TEXT */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 max-w-[270px]">

            <Reveal>
              <div
                className="text-xs uppercase tracking-[0.2em] font-semibold mb-4"
                style={{ color: C.accent }}
              >
                Features
              </div>

              <h2
                className="text-3xl md:text-4xl font-bold leading-[1.12]"
                style={{
                  color: C.text,
                  letterSpacing: "-0.045em",
                }}
              >
                Everything your documents contain.
              </h2>

              <p
                className="mt-5 text-sm leading-relaxed"
                style={{ color: C.secondary }}
              >
                One workspace. Powerful tools. Everything you need
                to understand and master your documents.
              </p>
            </Reveal>

          </div>

          {/* RIGHT: SEMICIRCULAR ORBIT */}
          <div className="absolute inset-0 pointer-events-none">

            {featureList.map((feature, i) => (
              <OrbitFeatureCard
                key={feature.title}
                feature={feature}
                index={i}
                total={total}
                scrollProgress={smoothProgress}
              />
            ))}

          </div>

        </div>
      </div>
    </section>
  );
}


function QuizGeneratorSection() {
  return (
    <section
      className="py-24 md:py-36 px-6 md:px-10"
      style={{ backgroundColor: C.surface }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <Reveal>
              <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: C.accent }}>
                Quiz Generator
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
                From document to quiz in seconds
              </h2>
            </Reveal>
            <Reveal delay={1}>
              <p className="text-lg leading-relaxed mb-8" style={{ color: C.secondary }}>
                Choose your question types — Multiple Choice, True/False, or Short Answer. Pick a difficulty level from Easy to Mixed. Set how many questions you need. The AI does the rest, pulling directly from your uploaded material.
              </p>
            </Reveal>
            <Reveal delay={1.5}>
              <div className="space-y-3">
                {[
                  'MCQ, True/False, Short Answer question types',
                  'Easy, Medium, Hard, or Mixed difficulty',
                  '5, 10, 15, or 20 questions per quiz',
                  'Community quiz library to explore',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={15} style={{ color: C.accent, flexShrink: 0 }} />
                    <span className="text-base" style={{ color: C.secondary }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={2}>
              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 no-underline px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ backgroundColor: C.elevated, color: C.text, border: `1px solid ${C.border}` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.accent;
                  e.currentTarget.style.color = C.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = C.text;
                }}
              >
                Try the quiz generator
                <ChevronRight size={15} />
              </Link>
            </Reveal>
          </div>

          {/* Visual */}
          <Reveal delay={1} className="w-full max-w-md mx-auto md:mx-0 md:ml-auto">
            <QuizGeneratorMock />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Live Quiz Section ─────────────────────────────────────────────────────────
function LiveQuizSection() {
  return (
    <section
      id="quizzes"
      className="py-24 md:py-36 px-6 md:px-10"
      style={{ backgroundColor: C.bg }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <Reveal>
            <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: C.accent }}>
              Live Quiz
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
              Challenge your class in real time
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="text-xl leading-relaxed" style={{ color: C.secondary }}>
              Host a live session with a join code. Students compete on a live leaderboard as you advance questions — making revision into a shared moment.
            </p>
          </Reveal>
        </div>

        {/* Live mock centered */}
        <Reveal delay={1.5}>
          <div className="flex justify-center">
            <LiveQuizMock />
          </div>
        </Reveal>

        {/* Feature bullets */}
        <div className="mt-16 grid sm:grid-cols-3 gap-8">
          {[
            { icon: Users, label: 'Shared join code', desc: 'Share a short code. Anyone with it joins instantly — no accounts required for participants.' },
            { icon: TrendingUp, label: 'Live leaderboard', desc: 'Scores update in real time as each question is answered.' },
            { icon: Trophy, label: 'Competitive learning', desc: 'The friendly pressure of a leaderboard makes revision stick.' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.label} delay={i * 0.5}>
                <div
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                >
                  <Icon size={20} style={{ color: C.accent, marginBottom: '12px' }} />
                  <div className="font-semibold mb-2" style={{ color: C.text, letterSpacing: '-0.02em' }}>
                    {item.label}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── AI Solver Section ─────────────────────────────────────────────────────────
function SolverSection() {
  return (
    <section
      className="py-24 md:py-36 px-6 md:px-10"
      style={{ backgroundColor: C.surface }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Visual — left */}
          <Reveal delay={0.5} className="w-full order-2 md:order-1">
            <SolverMock />
          </Reveal>

          {/* Text — right */}
          <div className="order-1 md:order-2">
            <Reveal>
              <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: C.accent }}>
                AI Problem Solver
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
                Drop in a problem.
                <br />
                Get the solution.
              </h2>
            </Reveal>
            <Reveal delay={1}>
              <p className="text-lg leading-relaxed mb-8" style={{ color: C.secondary }}>
                Upload an exam paper, paste in a homework question, or photograph a textbook exercise. NoteLM reads the problem and walks through the solution step by step — showing its reasoning, not just the answer.
              </p>
            </Reveal>
            <Reveal delay={1.5}>
              <div className="space-y-3">
                {[
                  'Supports PDFs, DOCX, TXT, and pasted text',
                  'Step-by-step reasoning, not just the final answer',
                  'Works for biology, chemistry, maths, and more',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={15} style={{ color: C.accent, flexShrink: 0 }} />
                    <span className="text-base" style={{ color: C.secondary }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Analytics & Streaks Section ──────────────────────────────────────────────
function AnalyticsSection() {
  const stats = [
    { value: '12+', label: 'Documents' },
    { value: '47', label: 'Quizzes' },
    { value: '74%', label: 'Average score' },
    { value: '5🔥', label: 'Day streak' },
  ];

  return (
    <section
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
              <p className="text-lg leading-relaxed mb-10" style={{ color: C.secondary }}>
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

// ─── How It Works ──────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Upload your material',
      description:
        'Drop in PDFs, Word docs, text files, or presentations. NoteLM processes them immediately — chunking and indexing so the AI can answer precisely.',
    },
    {
      number: '02',
      title: 'Ask, quiz, solve',
      description:
        'Chat with any document, generate a practice quiz, host a live session with classmates, or paste in a problem for step-by-step guidance.',
    },
    {
      number: '03',
      title: 'Track your mastery',
      description:
        'Review your weak topics, maintain a study streak, earn XP and achievements, and watch your average quiz score improve over time.',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-36 px-6 md:px-10"
      style={{ backgroundColor: C.surface }}
    >
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-20">
          <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: C.accent }}>
            How it works
          </div>
          <h2
            className="font-bold"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              letterSpacing: '-0.04em',
              color: C.text,
            }}
          >
            Three steps to studying smarter
          </h2>
        </Reveal>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.7} className={i === 1 ? 'md:mt-16' : i === 2 ? 'md:mt-8' : ''}>
              <div
                className="p-8 rounded-2xl relative"
                style={{ backgroundColor: C.elevated, border: `1px solid ${C.border}` }}
              >
                <div
                  className="text-6xl font-bold mb-6 leading-none"
                  style={{ color: C.accent, opacity: 0.9, letterSpacing: '-0.04em', fontFamily: 'Inter, sans-serif' }}
                >
                  {step.number}
                </div>
                <h3
                  className="font-bold text-xl mb-3"
                  style={{ color: C.text, letterSpacing: '-0.03em' }}
                >
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: C.secondary }}>
                  {step.description}
                </p>
                {/* Connector arrow on desktop */}
                {i < 2 && (
                  <div
                    className="hidden md:block absolute top-1/2 -right-7 -translate-y-1/2 text-2xl"
                    style={{ color: C.border }}
                  >
                    →
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section
      className="py-24 md:py-40 px-6 md:px-10 relative overflow-hidden"
      style={{ backgroundColor: C.bg }}
    >
      {/* Background accent glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${C.accent}0C 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <Reveal>
          <h2
            className="font-bold mb-6 leading-tight"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              letterSpacing: '-0.04em',
              color: C.text,
            }}
          >
            Stop rereading.
            <br />
            <span style={{ color: C.accent }}>Start remembering.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.5}>
          <p
            className="text-xl leading-relaxed mb-12"
            style={{ color: C.secondary, maxWidth: '560px', margin: '0 auto 3rem' }}
          >
            Join thousands of students who study smarter with NoteLM.
          </p>
        </Reveal>
        <Reveal delay={1}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="no-underline px-8 py-4 rounded-xl text-lg font-bold inline-flex items-center gap-2 transition-all duration-200"
              style={{ backgroundColor: C.accent, color: '#0C0F10', letterSpacing: '-0.01em' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D4B568';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${C.accent}35`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = C.accent;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get started free
              <ChevronRight size={18} />
            </Link>
            <Link
              to="/login"
              className="no-underline px-8 py-4 rounded-xl text-lg font-medium inline-flex items-center gap-2 transition-all duration-200"
              style={{ color: C.secondary, border: `1px solid ${C.border}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.borderSoft;
                e.currentTarget.style.color = C.text;
                e.currentTarget.style.backgroundColor = C.surface;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.secondary;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Sign in
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="px-6 md:px-10 py-16 border-t"
      style={{ backgroundColor: C.surface, borderColor: C.border }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4 no-underline">
              <img src="/icon.png" alt="NoteLM" className="w-7 h-7 rounded-md" />
              <span
                className="font-bold text-base"
                style={{ color: C.text, letterSpacing: '-0.03em' }}
              >
                NoteLM
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
              An AI-powered study assistant that understands your documents, not just the internet.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: C.muted }}>
              Product
            </div>
            <div className="space-y-3">
              {[
                { label: 'Features', href: '#features', isHash: true },
                { label: 'Quizzes', href: '#quizzes', isHash: true },
                { label: 'Analytics', to: '/analytics' },
                { label: 'Notebook', to: '/notebook' },
                { label: 'Problem Solver', to: '/solve' },
              ].map((item) =>
                item.isHash ? (
                  <div key={item.label}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="no-underline text-sm block transition-colors duration-200"
                      style={{ color: C.muted }}
                      onMouseEnter={(e) => (e.target.style.color = C.text)}
                      onMouseLeave={(e) => (e.target.style.color = C.muted)}
                    >
                      {item.label}
                    </a>
                  </div>
                ) : (
                  <div key={item.label}>
                    <Link
                      to={item.to}
                      className="no-underline text-sm block transition-colors duration-200"
                      style={{ color: C.muted }}
                      onMouseEnter={(e) => (e.target.style.color = C.text)}
                      onMouseLeave={(e) => (e.target.style.color = C.muted)}
                    >
                      {item.label}
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Account */}
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: C.muted }}>
              Account
            </div>
            <div className="space-y-3">
              {[
                { label: 'Sign in', to: '/login' },
                { label: 'Create account', to: '/register' },
                { label: 'Dashboard', to: '/' },
                { label: 'Profile', to: '/profile' },
              ].map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.to}
                    className="no-underline text-sm block transition-colors duration-200"
                    style={{ color: C.muted }}
                    onMouseEnter={(e) => (e.target.style.color = C.text)}
                    onMouseLeave={(e) => (e.target.style.color = C.muted)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t text-sm"
          style={{ borderColor: C.border, color: C.muted }}
        >
          <span>© {new Date().getFullYear()} NoteLM. All rights reserved.</span>
          <span>Built for students.</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: 'Inter, sans-serif' }}>
      <Nav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <QuizGeneratorSection />
        <LiveQuizSection />
        <SolverSection />
        <AnalyticsSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
