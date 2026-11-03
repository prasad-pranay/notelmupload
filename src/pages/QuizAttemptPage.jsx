
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineTrophy,
  HiOutlineArrowPath,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

const formatTime = (seconds) =>
  `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

const getScoreColor = (score) => {
  if (score >= 70) return '#8db99f';
  if (score >= 40) return '#c6a44e';
  return '#cf8989';
};

const getDifficultyStyle = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-[#7caa91]/10 text-[#8db99f]';
    case 'hard':
      return 'bg-[#c47d7d]/10 text-[#cf8989]';
    default:
      return 'bg-[#c6a44e]/10 text-[#d1b36b]';
  }
};

export default function QuizAttemptPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  // Fetch public quiz first, then fall back to own quiz
  const {
    data: quiz,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['quizAttempt', id],
    queryFn: async () => {
      try {
        const res = await api.get(`/public/quizzes/${id}`);
        return res.data.data;
      } catch {
        const res = await api.get(`/quiz/${id}`);
        return res.data.data;
      }
    },
  });

  // Timer
  useEffect(() => {
    if (submitted || isLoading || !quiz) return;

    const interval = setInterval(() => {
      setTimeElapsed((time) => time + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [submitted, isLoading, quiz]);

  // Submit answers
  const submitMut = useMutation({
    mutationFn: (payload) =>
      api.post(`/public/quizzes/${id}/attempt`, payload),
    onSuccess: (res) => {
      setResults(res.data.data);
      setSubmitted(true);
      toast.success(`Score: ${res.data.data.score}%`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Submission failed');
    },
  });

  const questions = quiz?.questions || [];
  const q = questions[currentQ];

  const handleSelect = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    const formatted = Object.entries(answers).map(
      ([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      })
    );

    submitMut.mutate({
      answers: formatted,
      timeTaken: timeElapsed,
    });
  };

  const handleRetry = () => {
    setSubmitted(false);
    setResults(null);
    setAnswers({});
    setCurrentQ(0);
    setTimeElapsed(0);
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length
    ? (answeredCount / questions.length) * 100
    : 0;

  // Loading
  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center">
        <div className="flex items-center gap-3 text-[12px] text-[#84909a]">
          <span className="size-4 animate-spin rounded-full border-2 border-[#343a3c] border-t-[#c6a44e]" />
          Loading quiz...
        </div>
      </div>
    );
  }

  // Not found / error
  if (isError || !quiz) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center text-center">
        <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-[#292f31] bg-[#101314] text-[#84909a]">
          <HiOutlineExclamationCircle className="size-5" />
        </div>
        <h2 className="text-[15px] font-semibold text-[#e8e9e6]">
          Quiz not found
        </h2>
        <p className="mt-1 text-[11px] text-[#788183]">
          This quiz may have been removed or is no longer available.
        </p>
        <button
          onClick={() => navigate('/quizzes')}
          className="mt-5 rounded-lg border border-[#343a3c] bg-[#151a1b] px-4 py-2 text-[11px] font-medium text-[#c6a44e] transition-colors hover:border-[#c6a44e]/40"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center text-center">
        <HiOutlineDocumentText className="mb-3 size-7 text-[#596363]" />
        <h2 className="text-[14px] font-semibold text-[#e8e9e6]">
          No questions available
        </h2>
        <p className="mt-1 text-[11px] text-[#788183]">
          This quiz doesn't contain any questions yet.
        </p>
      </div>
    );
  }

  // -----------------------------
  // Results view
  // -----------------------------

  if (submitted && results) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 pb-8">
        {/* Result summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl border border-[#292f31] bg-[#101314]"
        >
          <div className="relative px-5 py-9 text-center sm:py-11">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#c6a44e]/[0.07] to-transparent" />

            <div className="relative">
              <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl border border-[#c6a44e]/20 bg-[#c6a44e]/[0.08] text-[#c6a44e]">
                <HiOutlineTrophy className="size-5" />
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#84909a]">
                Quiz completed
              </p>

              <h1
                className="mt-3 text-[48px] font-semibold leading-none tracking-tight sm:text-[58px]"
                style={{ color: getScoreColor(results.score) }}
              >
                {results.score}%
              </h1>

              <p className="mt-3 text-[12px] text-[#aab1ae]">
                {results.correctCount} of {results.total} answers correct
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[10px] text-[#788183]">
                <span className="flex items-center gap-1.5">
                  <HiOutlineCheckCircle className="size-3.5 text-[#8db99f]" />
                  {results.correctCount} correct
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineClock className="size-3.5" />
                  {formatTime(timeElapsed)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Answer review */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-[#e8e9e6]">
                Answer review
              </h2>
              <p className="mt-1 text-[10px] text-[#788183]">
                Review your answers and explanations
              </p>
            </div>
            <span className="text-[10px] text-[#788183]">
              {results.results?.length || 0} questions
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#292f31] bg-[#101314]">
            {results.results?.map((result, index) => (
              <div
                key={index}
                className={`p-4 sm:p-5 ${index !== results.results.length - 1
                  ? 'border-b border-[#252b2d]'
                  : ''
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ${result.isCorrect
                      ? 'bg-[#7caa91]/10 text-[#8db99f]'
                      : 'bg-[#c47d7d]/10 text-[#cf8989]'
                      }`}
                  >
                    {result.isCorrect ? (
                      <HiOutlineCheckCircle className="size-4" />
                    ) : (
                      <HiOutlineXCircle className="size-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-[10px] font-medium text-[#788183]">
                        QUESTION {index + 1}
                      </span>
                      <span
                        className={`text-[9px] font-medium ${result.isCorrect
                          ? 'text-[#8db99f]'
                          : 'text-[#cf8989]'
                          }`}
                      >
                        {result.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <p className="text-[12px] font-medium leading-relaxed text-[#e1e4df]">
                      {result.questionText}
                    </p>

                    {!result.isCorrect && (
                      <div className="mt-3 space-y-2">
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-[#788183]">
                            Your answer
                          </p>
                          <p className="mt-1 text-[11px] text-[#cf8989]">
                            {result.selectedAnswer || 'Not answered'}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-[#788183]">
                            Correct answer
                          </p>
                          <p className="mt-1 text-[11px] text-[#8db99f]">
                            {result.correctAnswer}
                          </p>
                        </div>
                      </div>
                    )}

                    {result.isCorrect && (
                      <p className="mt-2 text-[11px] text-[#8db99f]">
                        {result.correctAnswer}
                      </p>
                    )}

                    {result.explanation && (
                      <div className="mt-3 rounded-lg border border-[#252b2d] bg-[#131718] p-3">
                        <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-[#84909a]">
                          Explanation
                        </p>
                        <p className="text-[11px] leading-relaxed text-[#aab1ae]">
                          {result.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result actions */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <button
            onClick={() => navigate('/quizzes')}
            className="rounded-lg border border-[#292f31] bg-[#101314] px-5 py-2.5 text-[11px] font-medium text-[#aab1ae] transition-colors hover:border-[#414949] hover:text-[#e8e9e6]"
          >
            Back to Explore
          </button>

          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c6a44e] px-5 py-2.5 text-[11px] font-semibold text-[#17140c] transition-colors hover:bg-[#d5b35d]"
          >
            <HiOutlineArrowPath className="size-3.5" />
            Retry quiz
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Quiz taking view
  // -----------------------------


  return (
    <div className="mx-auto max-w-6xl pb-8">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-medium text-[#788183] transition-colors hover:text-[#c6a44e]"
          >
            <HiOutlineArrowLeft className="size-3.5" />
            Back
          </button>

          <h1 className="truncate text-[19px] font-semibold tracking-tight text-[#e8e9e6] sm:text-[22px]">
            {quiz.title}
          </h1>
          <p className="mt-1 text-[10px] text-[#788183]">
            {quiz.topic || 'General'}
            <span className="mx-1.5 text-[#42494a]">/</span>
            {questions.length} questions
          </p>
        </div>

        {/* Mobile timer */}
        <div className="flex shrink-0 items-center gap-2 rounded-lg border border-[#292f31] bg-[#101314] px-3 py-2 lg:hidden">
          <HiOutlineClock className="size-4 text-[#c6a44e]" />
          <span className="font-mono text-[12px] tabular-nums text-[#e1e4df]">
            {formatTime(timeElapsed)}
          </span>
        </div>
      </div>

      {/* Main workspace */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_270px] xl:grid-cols-[minmax(0,1fr)_290px]">

        {/* LEFT: Question area */}
        <div className="min-w-0 space-y-4">
          {/* Question panel */}
          <div className="overflow-hidden rounded-xl border border-[#292f31] bg-[#101314]">
            {/* Question header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#252b2d] px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#c6a44e]">
                  Question {currentQ + 1}
                </span>
                <span className="text-[10px] text-[#596363]">
                  / {questions.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {q.difficulty && (
                  <span
                    className={`rounded-md px-2 py-1 text-[9px] font-medium capitalize ${getDifficultyStyle(q.difficulty)}`}
                  >
                    {q.difficulty}
                  </span>
                )}

                {q.type && (
                  <span className="rounded-md bg-[#1a2021] px-2 py-1 text-[9px] font-medium uppercase tracking-wide text-[#84909a]">
                    {q.type}
                  </span>
                )}
              </div>
            </div>

            {/* Question body */}
            <div className="min-h-[300px] px-4 py-6 sm:px-6 sm:py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="mb-7 text-[15px] font-medium leading-[1.8] text-[#e5e7e3] sm:text-[17px]">
                    {q.questionText}
                  </p>

                  {(q.type === 'mcq' || q.type === 'truefalse') &&
                    q.options?.length > 0 ? (
                    <div className="space-y-2.5">
                      {q.options.map((option, index) => {
                        const selected = answers[q._id] === option;

                        return (
                          <button
                            key={index}
                            onClick={() => handleSelect(q._id, option)}
                            className={`group flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-all duration-150 sm:px-4 ${selected
                              ? 'border-[#c6a44e]/50 bg-[#c6a44e]/[0.07]'
                              : 'border-[#292f31] bg-[#131718] hover:border-[#414949] hover:bg-[#171c1d]'
                              }`}
                          >
                            <span
                              className={`flex size-7 shrink-0 items-center justify-center rounded-md border text-[10px] font-semibold transition-colors ${selected
                                ? 'border-[#c6a44e] bg-[#c6a44e] text-[#17140c]'
                                : 'border-[#3a4243] text-[#84909a] group-hover:border-[#596363] group-hover:text-[#dfe2dd]'
                                }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </span>

                            <span
                              className={`flex-1 text-[12px] leading-relaxed ${selected ? 'text-[#e8e9e6]' : 'text-[#aab1ae]'
                                }`}
                            >
                              {option}
                            </span>

                            {selected && (
                              <HiOutlineCheckCircle className="size-4 shrink-0 text-[#c6a44e]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <label className="mb-2 block text-[10px] font-medium text-[#84909a]">
                        Your answer
                      </label>
                      <textarea
                        value={answers[q._id] || ''}
                        onChange={(e) => handleSelect(q._id, e.target.value)}
                        placeholder="Type your answer..."
                        rows={4}
                        className="w-full resize-y rounded-lg border border-[#292f31] bg-[#131718] px-4 py-3 text-[12px] leading-relaxed text-[#e8e9e6] outline-none transition-colors placeholder:text-[#596363] focus:border-[#c6a44e]/50"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile question navigator */}
          <div className="rounded-xl border border-[#292f31] bg-[#101314] p-4 lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#84909a]">
                Questions
              </span>
              <span className="text-[10px] text-[#788183]">
                {answeredCount} / {questions.length} answered
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {questions.map((question, index) => {
                const isCurrent = currentQ === index;
                const isAnswered = Boolean(
                  answers[question._id]?.toString().trim()
                );

                return (
                  <button
                    key={question._id || index}
                    onClick={() => setCurrentQ(index)}
                    className={`flex size-8 items-center justify-center rounded-md text-[10px] font-medium transition-colors ${isCurrent
                      ? 'bg-[#c6a44e] text-[#17140c]'
                      : isAnswered
                        ? 'border border-[#c6a44e]/25 bg-[#c6a44e]/[0.08] text-[#d1b36b]'
                        : 'border border-[#292f31] bg-[#131718] text-[#788183]'
                      }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile previous / next */}
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <button
              onClick={() => setCurrentQ((current) => Math.max(0, current - 1))}
              disabled={currentQ === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#292f31] bg-[#101314] px-4 py-2.5 text-[11px] font-medium text-[#aab1ae] transition-colors hover:border-[#414949] disabled:opacity-30"
            >
              <HiOutlineArrowLeft className="size-3.5" />
              Previous
            </button>

            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ((current) => current + 1)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#c6a44e] px-5 py-2.5 text-[11px] font-semibold text-[#17140c] transition-colors hover:bg-[#d5b35d]"
              >
                Next
                <HiOutlineArrowRight className="size-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitMut.isPending || answeredCount === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-[#c6a44e] px-5 py-2.5 text-[11px] font-semibold text-[#17140c] transition-colors hover:bg-[#d5b35d] disabled:opacity-40"
              >
                {submitMut.isPending ? 'Submitting...' : 'Submit quiz'}
                <HiOutlineCheckCircle className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Quiz controls */}
        <aside className="hidden space-y-4 lg:sticky lg:top-5 lg:block">

          {/* Timer and progress */}
          <div className="overflow-hidden rounded-xl border border-[#292f31] bg-[#101314]">
            <div className="border-b border-[#252b2d] p-4">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#788183]">
                Time elapsed
              </p>

              <div className="flex items-center gap-2">
                <HiOutlineClock className="size-4 text-[#c6a44e]" />
                <span className="font-mono text-[22px] font-semibold tabular-nums tracking-tight text-[#e8e9e6]">
                  {formatTime(timeElapsed)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-medium text-[#aab1ae]">
                  Completion
                </span>
                <span className="text-[10px] tabular-nums text-[#c6a44e]">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-[#252b2d]">
                <motion.div
                  className="h-full rounded-full bg-[#c6a44e]"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <p className="mt-2 text-[9px] text-[#788183]">
                {answeredCount} of {questions.length} answered
              </p>
            </div>
          </div>

          {/* Question navigator */}
          <div className="rounded-xl border border-[#292f31] bg-[#101314] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold text-[#e8e9e6]">
                Questions
              </h3>
              <span className="text-[9px] text-[#788183]">
                {questions.length} total
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isCurrent = currentQ === index;
                const isAnswered = Boolean(
                  answers[question._id]?.toString().trim()
                );

                return (
                  <button
                    key={question._id || index}
                    onClick={() => setCurrentQ(index)}
                    title={`Question ${index + 1}`}
                    className={`flex aspect-square items-center justify-center rounded-md text-[10px] font-medium transition-all ${isCurrent
                      ? 'bg-[#c6a44e] text-[#17140c]'
                      : isAnswered
                        ? 'border border-[#c6a44e]/25 bg-[#c6a44e]/[0.08] text-[#d1b36b] hover:bg-[#c6a44e]/15'
                        : 'border border-[#292f31] bg-[#131718] text-[#788183] hover:border-[#596363] hover:text-[#dfe2dd]'
                      }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 border-t border-[#252b2d] pt-3">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-[#c6a44e]" />
                <span className="text-[9px] text-[#788183]">Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm border border-[#c6a44e]/50 bg-[#c6a44e]/20" />
                <span className="text-[9px] text-[#788183]">Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm border border-[#3a4243] bg-[#131718]" />
                <span className="text-[9px] text-[#788183]">Unanswered</span>
              </div>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="rounded-xl border border-[#292f31] bg-[#101314] p-3">
            <button
              onClick={() => setCurrentQ((current) => Math.max(0, current - 1))}
              disabled={currentQ === 0}
              className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#292f31] bg-[#131718] px-3 py-2.5 text-[11px] font-medium text-[#aab1ae] transition-colors hover:border-[#414949] hover:text-[#e8e9e6] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <HiOutlineArrowLeft className="size-3.5" />
              Previous question
            </button>

            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ((current) => current + 1)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c6a44e] px-3 py-2.5 text-[11px] font-semibold text-[#17140c] transition-colors hover:bg-[#d5b35d]"
              >
                Next question
                <HiOutlineArrowRight className="size-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitMut.isPending || answeredCount === 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c6a44e] px-3 py-2.5 text-[11px] font-semibold text-[#17140c] transition-colors hover:bg-[#d5b35d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitMut.isPending ? 'Submitting...' : 'Submit quiz'}
                <HiOutlineCheckCircle className="size-3.5" />
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );

}

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { motion } from 'framer-motion';
// import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
// import api from '../api/axios.js';
// import toast from 'react-hot-toast';

// export default function QuizAttemptPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [currentQ, setCurrentQ] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [timeElapsed, setTimeElapsed] = useState(0);
//   const [submitted, setSubmitted] = useState(false);
//   const [results, setResults] = useState(null);

//   // Try public quiz first, fall back to own quiz
//   const { data: quiz, isLoading } = useQuery({
//     queryKey: ['quizAttempt', id],
//     queryFn: async () => {
//       try {
//         const res = await api.get(`/public/quizzes/${id}`);
//         return res.data.data;
//       } catch {
//         const res = await api.get(`/quiz/${id}`);
//         return res.data.data;
//       }
//     },
//   });

//   // Timer
//   useEffect(() => {
//     if (submitted) return;
//     const interval = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
//     return () => clearInterval(interval);
//   }, [submitted]);

//   const submitMut = useMutation({
//     mutationFn: (payload) => api.post(`/public/quizzes/${id}/attempt`, payload),
//     onSuccess: (res) => { setResults(res.data.data); setSubmitted(true); toast.success(`Score: ${res.data.data.score}%`); },
//     onError: (err) => toast.error(err.response?.data?.message || 'Submission failed'),
//   });

//   const handleSelect = (questionId, answer) => {
//     setAnswers((prev) => ({ ...prev, [questionId]: answer }));
//   };

//   const handleSubmit = () => {
//     const formatted = Object.entries(answers).map(([questionId, selectedAnswer]) => ({ questionId, selectedAnswer }));
//     submitMut.mutate({ answers: formatted, timeTaken: timeElapsed });
//   };

//   const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

//   if (isLoading) return <div className="text-center py-12 text-surface-500">Loading quiz...</div>;
//   if (!quiz) return <div className="text-center py-16 text-surface-400">Quiz not found</div>;

//   const questions = quiz.questions || [];
//   const q = questions[currentQ];

//   // Results view
//   if (submitted && results) {
//     return (
//       <div className="max-w-3xl mx-auto space-y-6">
//         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
//           <div className={`text-6xl font-bold mb-2 ${results.score >= 70 ? 'text-success' : results.score >= 40 ? 'text-warning' : 'text-danger'}`}>{results.score}%</div>
//           <p className="text-surface-400">{results.correctCount} / {results.total} correct • {formatTime(timeElapsed)}</p>
//         </motion.div>
//         <div className="space-y-4">
//           {results.results?.map((r, i) => (
//             <div key={i} className={`glass rounded-2xl p-5 border-l-4 ${r.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
//               <div className="flex items-start gap-3">
//                 {r.isCorrect ? <HiOutlineCheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /> : <HiOutlineXCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
//                 <div className="flex-1">
//                   <p className="text-surface-200 font-medium">{r.questionText}</p>
//                   {!r.isCorrect && <p className="text-sm text-red-400 mt-1">Your answer: {r.selectedAnswer}</p>}
//                   <p className="text-sm text-green-400 mt-1">Correct: {r.correctAnswer}</p>
//                   {r.explanation && <p className="text-xs text-surface-500 mt-2 bg-surface-800/30 rounded-lg p-3">{r.explanation}</p>}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="flex gap-3 justify-center pt-4">
//           <button onClick={() => navigate('/explore')} className="px-6 py-2.5 rounded-xl bg-surface-800 text-surface-300 hover:bg-surface-700 transition">Back to Explore</button>
//           <button onClick={() => { setSubmitted(false); setResults(null); setAnswers({}); setCurrentQ(0); setTimeElapsed(0); }}
//             className="px-6 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition">Retry</button>
//         </div>
//       </div>
//     );
//   }

//   // Quiz taking view
//   return (
//     <div className="max-w-3xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-surface-100">{quiz.title}</h1>
//           <p className="text-xs text-surface-500">{quiz.topic} • {questions.length} questions</p>
//         </div>
//         <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800/50 border border-white/5">
//           <HiOutlineClock className="w-4 h-4 text-surface-400" />
//           <span className="text-sm font-mono text-surface-300">{formatTime(timeElapsed)}</span>
//         </div>
//       </div>

//       {/* Progress */}
//       <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
//         <div className="h-full bg-gradient-to-r from-primary-500 to-accent transition-all duration-300 rounded-full"
//           style={{ width: `${((Object.keys(answers).length) / questions.length) * 100}%` }} />
//       </div>

//       {/* Question */}
//       {q && (
//         <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 space-y-5">
//           <div className="flex items-center gap-2 text-xs text-surface-500">
//             <span>Question {currentQ + 1} of {questions.length}</span>
//             <span className={`px-2 py-0.5 rounded-md capitalize ${q.difficulty === 'easy' ? 'bg-green-500/10 text-green-400' : q.difficulty === 'hard' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{q.difficulty}</span>
//             <span className="px-2 py-0.5 rounded-md bg-surface-800 text-surface-400 uppercase">{q.type}</span>
//           </div>
//           <p className="text-lg text-surface-200 font-medium">{q.questionText}</p>

//           {(q.type === 'mcq' || q.type === 'truefalse') && q.options?.length > 0 ? (
//             <div className="space-y-3">
//               {q.options.map((opt, i) => (
//                 <button key={i} onClick={() => handleSelect(q._id, opt)}
//                   className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${answers[q._id] === opt ? 'border-primary-500 bg-primary-600/15 text-primary-300' : 'border-white/5 bg-surface-800/30 text-surface-300 hover:border-white/10 hover:bg-surface-800/50'}`}>
//                   <span className="inline-block w-6 h-6 rounded-full border border-current text-center mr-3 text-xs leading-6">{String.fromCharCode(65 + i)}</span>
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <input value={answers[q._id] || ''} onChange={(e) => handleSelect(q._id, e.target.value)} placeholder="Type your answer..."
//               className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-white/10 text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition" />
//           )}
//         </motion.div>
//       )}

//       {/* Navigation */}
//       <div className="flex items-center justify-between">
//         <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
//           className="px-5 py-2.5 rounded-xl bg-surface-800/50 text-surface-300 hover:bg-surface-700/50 disabled:opacity-30 transition text-sm">Previous</button>
//         <div className="flex gap-1.5">
//           {questions.map((_, i) => (
//             <button key={i} onClick={() => setCurrentQ(i)}
//               className={`w-8 h-8 rounded-lg text-xs font-medium transition ${currentQ === i ? 'bg-primary-600 text-white' : answers[questions[i]?._id] ? 'bg-primary-600/20 text-primary-400' : 'bg-surface-800/50 text-surface-500'}`}>{i + 1}</button>
//           ))}
//         </div>
//         {currentQ < questions.length - 1 ? (
//           <button onClick={() => setCurrentQ(currentQ + 1)} className="px-5 py-2.5 rounded-xl bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 transition text-sm">Next</button>
//         ) : (
//           <button onClick={handleSubmit} disabled={submitMut.isPending || Object.keys(answers).length === 0}
//             className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent text-white font-medium hover:opacity-90 transition disabled:opacity-40 text-sm">
//             {submitMut.isPending ? 'Submitting...' : 'Submit Quiz'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
