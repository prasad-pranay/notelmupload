
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineUsers,
  HiOutlinePlay,
  HiOutlinePlus,
  HiOutlineChevronDown,
  HiOutlineListBullet,
  HiOutlineEye,
  HiOutlineChartBar,
  HiOutlineEllipsisVertical,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineXMark,
} from 'react-icons/hi2';
import {
  SiJavascript,
  SiPython,
  SiReact,
  SiFlask,
} from 'react-icons/si';
import { GiAtom } from 'react-icons/gi';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

const colors = {
  page: '#0b0d0e',
  panel: '#101314',
  surface: '#141819',
  border: '#252a2c',
  text: '#e8e9e6',
  muted: '#84909a',
  subtle: '#596368',
  gold: '#c6a44e',
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const SubjectIcon = ({ topic = '', className = '' }) => {
  const t = topic.toLowerCase();

  if (t.includes('javascript') || t.includes('js'))
    return <SiJavascript className={`text-[#d9bd50] ${className}`} />;
  if (t.includes('python'))
    return <SiPython className={`text-[#6b9ac7] ${className}`} />;
  if (t.includes('react'))
    return <SiReact className={`text-[#69b9c7] ${className}`} />;
  if (t.includes('science') || t.includes('atom'))
    return <GiAtom className={`text-[#8aabb2] ${className}`} />;
  if (t.includes('flask') || t.includes('chem'))
    return <SiFlask className={`text-[#aab2ad] ${className}`} />;

  return <HiOutlineDocumentText className={`text-[#a9a18a] ${className}`} />;
};

const formatDate = (date) => {
  if (!date) return '—';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const QuizSkeleton = () => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="h-[210px] animate-pulse rounded-xl border border-[#252a2c] bg-[#101314]"
      />
    ))}
  </div>
);


const EmptyState = ({ title, description }) => (
  <div className="relative flex min-h-[190px] flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
    {/* Subtle background detail */}
    <div className="pointer-events-none absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c6a44e]/[0.035] blur-3xl" />

    <div className="relative mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#353329] bg-[#171815] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      <HiOutlineDocumentText className="size-6 text-[#c6a44e]" />
      <span className="absolute -bottom-1 -right-1 size-3 rounded-full border-[3px] border-[#101314] bg-[#c6a44e]" />
    </div>

    <div className="relative max-w-sm">
      <p className="text-[14px] font-semibold tracking-[-0.01em] text-[#e8e9e6]">
        {title}
      </p>
      <p className="mx-auto mt-1.5 max-w-[290px] text-[12px] leading-[1.7] text-[#899194]">
        {description}
      </p>
    </div>

    <div className="relative mt-5 h-px w-10 rounded-full bg-[#c6a44e]/40" />
  </div>
);


function QuizCard({ quiz }) {
  const topic = quiz.topic || 'General';

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="group flex min-w-0 flex-col rounded-xl border border-[#252a2c] bg-[#101314] p-4 transition-colors hover:border-[#3b4140] hover:bg-[#111617]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#292f30] bg-[#171c1d]">
          <SubjectIcon topic={topic} className="size-5" />
        </div>

        <span className="max-w-[120px] truncate rounded-md border border-[#303431] bg-[#171b1a] px-2 py-1 text-[10px] font-medium text-[#a9a18a]">
          {topic.split(' ')[0]}
        </span>
      </div>

      <div className="mt-4 min-w-0 flex-1">
        <h3 className="truncate text-[14px] font-semibold tracking-[-0.01em] text-[#e8e9e6] transition-colors group-hover:text-[#d8c184]">
          {quiz.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 min-h-9 text-[11px] leading-[1.65] text-[#84909a]">
          {quiz.description ||
            `Test your knowledge of ${topic} with this quiz.`}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-[#252a2c] pt-3">
        <span className="flex items-center gap-1.5 text-[11px] text-[#84909a]">
          <HiOutlineListBullet className="size-3.5 text-[#697579]" />
          {quiz.questions?.length || 0} questions
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#84909a]">
          <HiOutlineUsers className="size-3.5 text-[#697579]" />
          {quiz.attempts || 0} attempts
        </span>
      </div>

      <Link
        to={`/quiz/${quiz._id}/attempt`}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#8d763e]/35 bg-[#c6a44e]/[0.07] py-2.5 text-[11px] font-semibold text-[#c6a44e] transition-colors hover:border-[#c6a44e]/55 hover:bg-[#c6a44e]/[0.12]"
      >
        View quiz
        <HiOutlinePlay className="size-3" />
      </Link>
    </motion.article>
  );
}

function QuizActions({
  quiz,
  onDelete,
  onPublish,
  onHost,
  isDeleting,
  isPublishing,
  isHosting,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        to={`/quiz/${quiz._id}/attempt`}
        title="Preview quiz"
        className="rounded-md p-2 text-[#84909a] transition-colors hover:bg-[#202627] hover:text-[#e8e9e6]"
      >
        <HiOutlineEye className="size-4" />
      </Link>

      <button
        type="button"
        onClick={onHost}
        disabled={isHosting}
        title="Host live quiz"
        className="rounded-md p-2 text-[#84909a] transition-colors hover:bg-[#202627] hover:text-[#c6a44e] disabled:opacity-40"
      >
        <HiOutlineChartBar className="size-4" />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="More quiz actions"
          aria-expanded={open}
          className="rounded-md p-2 text-[#84909a] transition-colors hover:bg-[#202627] hover:text-[#e8e9e6]"
        >
          <HiOutlineEllipsisVertical className="size-4" />
        </button>

        <AnimatePresence>
          {open && (
            <>
              <button
                type="button"
                aria-label="Close actions menu"
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-20 cursor-default"
              />
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full z-30 mt-1 w-36 overflow-hidden rounded-lg border border-[#303637] bg-[#171c1d] p-1 shadow-xl shadow-black/30"
              >
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={() => {
                    setOpen(false);
                    onPublish();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[11px] text-[#c6a44e] transition-colors hover:bg-[#c6a44e]/[0.08] disabled:opacity-40"
                >
                  <HiOutlinePlus className="size-3.5" />
                  {quiz.isPublic ? 'Unpublish' : 'Publish'}
                </button>

                <div className="my-1 border-t border-[#292f30]" />

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    setOpen(false);
                    onDelete();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[11px] text-[#d17e75] transition-colors hover:bg-[#d17e75]/[0.08] disabled:opacity-40"
                >
                  <HiOutlineTrash className="size-3.5" />
                  Delete quiz
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function QuizzesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sort, setSort] = useState('Most Recent');
  const [joinCode, setJoinCode] = useState('');

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: myQuizzes = [], isLoading: loadingMy } = useQuery({
    queryKey: ['myQuizzes'],
    queryFn: () => api.get('/quiz').then((r) => r.data.data),
  });

  const { data: publicQuizzes = [], isLoading: loadingPublic } = useQuery({
    queryKey: ['publicQuizzes', search],
    queryFn: () =>
      api
        .get('/public/quizzes', {
          params: { search: search.trim() || undefined },
        })
        .then((r) => r.data.data),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/quiz/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myQuizzes'] });
      toast.success('Quiz deleted');
    },
    onError: () => toast.error('Could not delete quiz'),
  });

  const publishMut = useMutation({
    mutationFn: (id) => api.post(`/quiz/${id}/publish`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['myQuizzes'] });
      toast.success(res.data.message || 'Quiz visibility updated');
    },
    onError: () => toast.error('Could not update quiz'),
  });

  const hostLiveMut = useMutation({
    mutationFn: (id) => api.post(`/quiz/${id}/live`),
    onSuccess: (res) => {
      navigate(`/quiz/live/host/${res.data.data.joinCode}`);
    },
    onError: () => toast.error('Could not start live quiz'),
  });

  const handleJoinLive = (e) => {
    e.preventDefault();

    const code = joinCode.trim().toUpperCase();

    if (code.length !== 6) {
      toast.error('Enter a valid 6-character code');
      return;
    }

    navigate(`/quiz/live/join/${code}`);
  };

  const categories = useMemo(() => {
    const topics = [...new Set(
      publicQuizzes.map((quiz) => quiz.topic).filter(Boolean)
    )];

    return ['All Categories', ...topics.sort((a, b) => a.localeCompare(b))];
  }, [publicQuizzes]);

  const filteredPublicQuizzes = useMemo(() => {
    let result = [...publicQuizzes];

    if (category !== 'All Categories') {
      result = result.filter((quiz) => quiz.topic === category);
    }

    if (sort === 'Most Recent') {
      result.sort(
        (a, b) => new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0)
      );
    } else if (sort === 'Most Popular') {
      result.sort((a, b) => (b.attempts || 0) - (a.attempts || 0));
    } else if (sort === 'Title A–Z') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [publicQuizzes, category, sort]);

  const sortedMyQuizzes = useMemo(() => {
    return [...myQuizzes].sort(
      (a, b) => new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0)
    );
  }, [myQuizzes]);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 text-[#e8e9e6] sm:px-6 lg:px-8 lg:py-8">

      {/* Page heading and actions */}
      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h1 className="text-[24px] font-semibold tracking-[-0.04em] text-[#e8e9e6] sm:text-[27px]">
            Quizzes
          </h1>
          <p className="mt-1.5 text-[12px] text-[#84909a]">
            Create, discover and manage your quizzes.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto">
          {/* Join live quiz */}
          <form
            onSubmit={handleJoinLive}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-[#252a2c] bg-[#101314] p-3"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1a2020] text-[#c6a44e]">
              <HiOutlineUsers className="size-[18px]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-[#e8e9e6]">
                Join live quiz
              </p>
              <input
                value={joinCode}
                onChange={(e) =>
                  setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
                }
                placeholder="Enter 6-character code"
                maxLength={6}
                aria-label="Live quiz code"
                className="mt-1 w-full min-w-0 bg-transparent text-[11px] tracking-[0.12em] text-[#e8e9e6] outline-none placeholder:tracking-normal placeholder:text-[#596368]"
              />
            </div>

            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#c6a44e] px-3 py-2 text-[10px] font-semibold text-[#17140c] transition-colors hover:bg-[#d5b65f]"
            >
              Join
              <HiOutlinePlay className="size-3" />
            </button>
          </form>

          {/* Create quiz */}
          <Link
            to="/documents"
            className="flex items-center gap-3 rounded-xl border border-[#252a2c] bg-[#101314] p-3 transition-colors hover:border-[#474333] hover:bg-[#121716]"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#c6a44e]/[0.09] text-[#c6a44e]">
              <HiOutlinePlus className="size-[18px]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-[#e8e9e6]">
                Create a quiz
              </p>
              <p className="mt-0.5 text-[10px] text-[#788183]">
                Build one from your documents
              </p>
            </div>
            <HiOutlinePlus className="size-4 text-[#788183]" />
          </Link>
        </div>
      </div>

      {/* Public quizzes */}
      <section className="mb-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#e8e9e6]">
              Explore quizzes
            </h2>
            <p className="mt-1 text-[11px] text-[#788183]">
              Discover quizzes shared by the community.
            </p>
          </div>
          <span className="text-[10px] text-[#788183]">
            {filteredPublicQuizzes.length} available
          </span>
        </div>

        {/* Search and filters */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#697579]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes..."
              className="h-10 w-full rounded-lg border border-[#252a2c] bg-[#101314] pl-10 pr-9 text-xs text-[#e8e9e6] outline-none transition-colors placeholder:text-[#596368] focus:border-[#8d763e]/70"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#788183] hover:text-[#e8e9e6]"
              >
                <HiOutlineXMark className="size-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <div className="relative min-w-0">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-[#252a2c] bg-[#101314] py-0 pl-3 pr-8 text-[11px] text-[#aab2ad] outline-none transition-colors focus:border-[#8d763e]/70 sm:w-44"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-[#697579]" />
            </div>

            <div className="relative min-w-0">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-[#252a2c] bg-[#101314] py-0 pl-3 pr-8 text-[11px] text-[#aab2ad] outline-none transition-colors focus:border-[#8d763e]/70 sm:w-40"
              >
                <option>Most Recent</option>
                <option>Most Popular</option>
                <option>Title A–Z</option>
              </select>
              <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-[#697579]" />
            </div>
          </div>
        </div>

        {loadingPublic ? (
          <QuizSkeleton />
        ) : filteredPublicQuizzes.length === 0 ? (
          <div className="rounded-xl border border-[#252a2c] bg-[#101314]">
            <EmptyState
              title="No quizzes found"
              description="Try a different search or category."
            />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredPublicQuizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* My quizzes */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#e8e9e6]">
              My quizzes
            </h2>
            <p className="mt-1 text-[11px] text-[#788183]">
              Manage the quizzes you have created.
            </p>
          </div>
          <span className="shrink-0 text-[10px] text-[#788183]">
            {myQuizzes.length} total
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#252a2c] bg-[#101314]">
          {loadingMy ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-lg bg-[#171c1d]"
                />
              ))}
            </div>
          ) : myQuizzes.length === 0 ? (
            <EmptyState
              title="No quizzes yet"
              description="Create a quiz from one of your documents to get started."
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#252a2c] bg-[#121617] text-[9px] font-semibold uppercase tracking-[0.12em] text-[#788183]">
                      <th className="px-5 py-3.5">Quiz</th>
                      <th className="px-5 py-3.5">Questions</th>
                      <th className="px-5 py-3.5">Last updated</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#252a2c]">
                    {sortedMyQuizzes.map((quiz) => (
                      <tr
                        key={quiz._id}
                        className="group transition-colors hover:bg-[#14191a]"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#292f30] bg-[#171c1d]">
                              <SubjectIcon
                                topic={quiz.topic || quiz.title}
                                className="size-[17px]"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-[#e8e9e6]">
                                {quiz.title}
                              </p>
                              <span
                                className={`mt-1 inline-flex items-center gap-1.5 text-[9px] ${quiz.isPublic
                                  ? 'text-[#a9a18a]'
                                  : 'text-[#84909a]'
                                  }`}
                              >
                                <span
                                  className={`size-1.5 rounded-full ${quiz.isPublic
                                    ? 'bg-[#c6a44e]'
                                    : 'bg-[#697579]'
                                    }`}
                                />
                                {quiz.isPublic ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-xs tabular-nums text-[#aab2ad]">
                          {quiz.questions?.length || 0}
                        </td>

                        <td className="px-5 py-3.5 text-xs text-[#84909a]">
                          {formatDate(quiz.updatedAt || quiz.createdAt)}
                        </td>

                        <td className="px-5 py-3.5">
                          <QuizActions
                            quiz={quiz}
                            onDelete={() => deleteMut.mutate(quiz._id)}
                            onPublish={() => publishMut.mutate(quiz._id)}
                            onHost={() => hostLiveMut.mutate(quiz._id)}
                            isDeleting={deleteMut.isPending}
                            isPublishing={publishMut.isPending}
                            isHosting={hostLiveMut.isPending}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-[#252a2c] md:hidden">
                {sortedMyQuizzes.map((quiz) => (
                  <div key={quiz._id} className="flex items-center gap-3 p-3.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#292f30] bg-[#171c1d]">
                      <SubjectIcon
                        topic={quiz.topic || quiz.title}
                        className="size-[17px]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#e8e9e6]">
                        {quiz.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-[#788183]">
                        <span>{quiz.questions?.length || 0} questions</span>
                        <span className="text-[#3c4445]">·</span>
                        <span>{formatDate(quiz.updatedAt || quiz.createdAt)}</span>
                      </div>
                    </div>

                    <QuizActions
                      quiz={quiz}
                      onDelete={() => deleteMut.mutate(quiz._id)}
                      onPublish={() => publishMut.mutate(quiz._id)}
                      onHost={() => hostLiveMut.mutate(quiz._id)}
                      isDeleting={deleteMut.isPending}
                      isPublishing={publishMut.isPending}
                      isHosting={hostLiveMut.isPending}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// import { useState, useMemo } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   HiOutlineMagnifyingGlass,
//   HiOutlineUsers,
//   HiOutlinePlay,
//   HiOutlineHashtag,
//   HiOutlinePlus,
//   HiOutlineChevronDown,
//   HiOutlineListBullet,
//   HiOutlineEye,
//   HiOutlinePencilSquare,
//   HiOutlineChartBar,
//   HiOutlineEllipsisVertical,
//   HiOutlineTrash,
//   HiOutlineDocumentText
// } from 'react-icons/hi2';
// import {
//   SiJavascript,
//   SiPython,
//   SiReact,
//   SiFlask
// } from 'react-icons/si';
// import { GiAtom } from 'react-icons/gi';
// import api from '../api/axios.js';
// import toast from 'react-hot-toast';

// // Helper for subject icons
// const SubjectIcon = ({ topic = '', className = "" }) => {
//   const t = topic.toLowerCase();
//   if (t.includes('javascript') || t.includes('js')) return <SiJavascript className={`text-[#F7DF1E] ${className}`} />;
//   if (t.includes('python')) return <SiPython className={`text-[#3776AB] ${className}`} />;
//   if (t.includes('react')) return <SiReact className={`text-[#61DAFB] ${className}`} />;
//   if (t.includes('science') || t.includes('atom')) return <GiAtom className={`text-[#61DAFB] ${className}`} />;
//   if (t.includes('flask') || t.includes('chem')) return <SiFlask className={`text-[#000000] dark:text-white ${className}`} />;
//   return <HiOutlineDocumentText className={`text-primary-400 ${className}`} />;
// };

// export default function QuizzesPage() {
//   const [search, setSearch] = useState('');
//   const [category, setCategory] = useState('All Categories');
//   const [sort, setSort] = useState('Most Recent');
//   const [joinCode, setJoinCode] = useState('');
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   // Data Fetching
//   const { data: myQuizzes = [], isLoading: loadingMy } = useQuery({
//     queryKey: ['myQuizzes'],
//     queryFn: () => api.get('/quiz').then((r) => r.data.data),
//   });

//   const { data: publicQuizzes = [], isLoading: loadingPublic } = useQuery({
//     queryKey: ['publicQuizzes', search],
//     queryFn: () => api.get('/public/quizzes', { params: { search: search || undefined } }).then((r) => r.data.data),
//   });

//   // Mutations
//   const deleteMut = useMutation({
//     mutationFn: (id) => api.delete(`/quiz/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['myQuizzes'] });
//       toast.success('Quiz deleted');
//     },
//   });

//   const publishMut = useMutation({
//     mutationFn: (id) => api.post(`/quiz/${id}/publish`),
//     onSuccess: (res) => {
//       queryClient.invalidateQueries({ queryKey: ['myQuizzes'] });
//       toast.success(res.data.message);
//     },
//   });

//   const hostLiveMut = useMutation({
//     mutationFn: (id) => api.post(`/quiz/${id}/live`),
//     onSuccess: (res) => {
//       navigate(`/quiz/live/host/${res.data.data.joinCode}`);
//     },
//   });

//   const handleJoinLive = (e) => {
//     e.preventDefault();
//     if (joinCode.length === 6) {
//       navigate(`/quiz/live/join/${joinCode}`);
//     } else {
//       toast.error('Enter a valid 6-digit code');
//     }
//   };

//   return (
//     <div className="max-w-[1400px] mx-auto p-6 space-y-10 text-[#E2E8F0]">

//       {/* Header & Top Action Cards */}
//       <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
//         <div className="space-y-2">
//           <h1 className="text-4xl font-bold text-white tracking-tight">Quizzes</h1>
//           <p className="text-[#94A3B8] font-medium">Create, manage, and explore quizzes.</p>
//         </div>

//         <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
//           {/* Join Card */}
//           <div className="flex-1 lg:w-[380px] bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex items-start gap-4">
//             <div className="w-12 h-12 rounded-xl bg-[#1A1C23] border border-[#2A2D35] flex items-center justify-center shrink-0">
//               <HiOutlineUsers className="w-6 h-6 text-[#8B5CF6]" />
//             </div>
//             <div className="flex-1 space-y-3">
//               <div>
//                 <h3 className="font-bold text-white">Join a Live Quiz</h3>
//                 <p className="text-[11px] text-[#64748B] mt-1">Enter the code provided by your host to join a live quiz.</p>
//               </div>
//               <form onSubmit={handleJoinLive} className="flex gap-2">
//                 <input
//                   value={joinCode}
//                   onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
//                   placeholder="Enter quiz code"
//                   maxLength={6}
//                   className="flex-1 bg-[#0B0C10] border border-[#1E222A] rounded-xl px-3 py-2 text-xs text-white placeholder-[#475569] outline-none focus:border-[#8B5CF6]/50"
//                 />
//                 <button type="submit" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
//                   Join Quiz <HiOutlinePlay className="w-3 h-3" />
//                 </button>
//               </form>
//             </div>
//           </div>

//           {/* Create Card */}
//           <div className="flex-1 lg:w-[320px] bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex items-start gap-4">
//             <div className="w-12 h-12 rounded-xl bg-[#1A1C23] border border-[#2A2D35] flex items-center justify-center shrink-0">
//               <HiOutlinePlus className="w-6 h-6 text-[#10B981] bg-[#10B981]/10 rounded-lg p-1" />
//             </div>
//             <div className="flex-1 space-y-4">
//               <div>
//                 <h3 className="font-bold text-white">Create a New Quiz</h3>
//                 <p className="text-[11px] text-[#64748B] mt-1">Build your own quiz and share it with others.</p>
//               </div>
//               <Link to="/documents" className="block text-center border border-[#10B981]/30 hover:bg-[#10B981]/5 text-[#10B981] py-2 rounded-xl text-xs font-bold transition-all">
//                 Create Quiz
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* All Quizzes Section */}
//       <section className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-bold text-white">All Quizzes</h2>
//         </div>

//         {/* Search & Filter Toolbar */}
//         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//           <div className="relative flex-1 w-full">
//             <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#475569]" />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search quizzes..."
//               className="w-full bg-[#111318] border border-[#1E222A] rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-[#475569] outline-none focus:border-[#3B82F6]/50 transition-colors"
//             />
//           </div>

//           <div className="flex items-center gap-3 w-full md:w-auto">
//             <div className="relative group w-full md:w-48">
//               <button className="w-full flex items-center justify-between bg-[#111318] border border-[#1E222A] rounded-xl px-4 py-3 text-sm text-[#94A3B8] font-medium">
//                 {category} <HiOutlineChevronDown className="w-4 h-4" />
//               </button>
//             </div>
//             <div className="relative group w-full md:w-48">
//               <button className="w-full flex items-center justify-between bg-[#111318] border border-[#1E222A] rounded-xl px-4 py-3 text-sm text-[#94A3B8] font-medium">
//                 {sort} <HiOutlineChevronDown className="w-4 h-4" />
//               </button>
//             </div>
//             <button className="text-sm font-bold text-[#3B82F6] whitespace-nowrap px-2">View all</button>
//           </div>
//         </div>

//         {/* Public Quiz Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {loadingPublic ? (
//             Array(4).fill(0).map((_, i) => <div key={i} className="h-64 bg-[#111318] animate-pulse rounded-2xl" />)
//           ) : publicQuizzes.slice(0, 4).map((quiz) => (
//             <motion.div
//               key={quiz._id}
//               whileHover={{ y: -4 }}
//               className="bg-[#111318] border border-[#1E222A] rounded-[2rem] p-6 flex flex-col gap-4 relative group"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
//                   <SubjectIcon topic={quiz.topic || quiz.title} className="w-7 h-7" />
//                 </div>
//                 <button className="text-[#475569] hover:text-white transition-colors">
//                   <HiOutlineEllipsisVertical className="w-5 h-5" />
//                 </button>
//               </div>

//               <div>
//                 <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">{quiz.title}</h3>
//                 <p className="text-xs text-[#64748B] mt-2 line-clamp-2 leading-relaxed">
//                   {quiz.description || `Test your knowledge of ${quiz.topic || 'the subject'} with these fundamental concepts.`}
//                 </p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="px-3 py-1 rounded-full bg-[#1E222A] border border-[#2A2D35] text-[10px] font-bold text-primary-400 uppercase tracking-widest">
//                   {quiz.topic?.split(' ')[0] || 'General'}
//                 </span>
//               </div>

//               <div className="flex items-center gap-6 mt-2">
//                 <div className="flex items-center gap-2 text-[#94A3B8]">
//                   <HiOutlineListBullet className="w-4 h-4" />
//                   <span className="text-xs font-bold">{quiz.questions?.length || 0} Questions</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-[#94A3B8]">
//                   <HiOutlineUsers className="w-4 h-4" />
//                   <span className="text-xs font-bold">{quiz.attempts || 0}</span>
//                 </div>
//               </div>

//               <Link
//                 to={`/quiz/${quiz._id}/attempt`}
//                 className="mt-4 w-full py-3 rounded-xl border border-primary-500/30 bg-primary-500/5 hover:bg-primary-500/10 text-primary-400 text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
//               >
//                 View Quiz
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* My Quizzes Section */}
//       <section className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-bold text-white">My Quizzes</h2>
//           <button className="text-sm font-bold text-[#3B82F6]">View all</button>
//         </div>

//         <div className="bg-[#111318] border border-[#1E222A] rounded-2xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="border-b border-[#1E222A] text-[10px] font-black text-[#475569] uppercase tracking-widest">
//                   <th className="px-6 py-5">Quiz Title</th>
//                   <th className="px-6 py-5">Questions</th>
//                   <th className="px-6 py-5">Updated</th>
//                   <th className="px-6 py-5 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#1E222A]">
//                 {loadingMy ? (
//                   Array(2).fill(0).map((_, i) => (
//                     <tr key={i} className="animate-pulse">
//                       <td colSpan={4} className="h-16 bg-white/5"></td>
//                     </tr>
//                   ))
//                 ) : myQuizzes.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="px-6 py-10 text-center text-[#64748B] text-sm">No quizzes found.</td>
//                   </tr>
//                 ) : myQuizzes.map((quiz) => (
//                   <tr key={quiz._id} className="hover:bg-[#15181E] transition-colors group">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center">
//                           <SubjectIcon topic={quiz.topic || quiz.title} className="w-5 h-5" />
//                         </div>
//                         <div className="flex flex-col">
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm font-bold text-white">{quiz.title}</span>
//                             <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${quiz.isPublic ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
//                               {quiz.isPublic ? 'Published' : 'Draft'}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-bold text-[#94A3B8]">
//                       {quiz.questions?.length || 0}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-bold text-[#94A3B8]">
//                       {new Date(quiz.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Link to={`/quiz/${quiz._id}/attempt`} className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors">
//                           <HiOutlineEye className="w-4 h-4" />
//                         </Link>
//                         <button className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors">
//                           <HiOutlinePencilSquare className="w-4 h-4" />
//                         </button>
//                         <button onClick={() => hostLiveMut.mutate(quiz._id)} className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors">
//                           <HiOutlineChartBar className="w-4 h-4" />
//                         </button>
//                         <div className="relative group/menu">
//                           <button className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors">
//                             <HiOutlineEllipsisVertical className="w-4 h-4" />
//                           </button>
//                           <div className="absolute right-0 top-full mt-2 w-32 bg-[#1E222A] border border-[#2A303C] rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 py-1 overflow-hidden">
//                             <button
//                               onClick={() => deleteMut.mutate(quiz._id)}
//                               className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 flex items-center gap-2"
//                             >
//                               <HiOutlineTrash className="w-4 h-4" /> Delete
//                             </button>
//                             <button
//                               onClick={() => publishMut.mutate(quiz._id)}
//                               className="w-full text-left px-4 py-2 text-xs text-[#3B82F6] hover:bg-[#3B82F6]/10 flex items-center gap-2"
//                             >
//                               <HiOutlinePlus className="w-4 h-4" /> {quiz.isPublic ? 'Unpublish' : 'Publish'}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// }
