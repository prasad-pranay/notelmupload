import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Puzzle,
  TrendingUp,
  Trophy,
  CheckCircle2,
  MoreVertical,
  Flame,
  Gift,
  Search,
  Layout,
  Star,
  PlayCircle,
  Lock,
  ArrowUpRight,
  Plus,
  Compass,
  Upload,
  Activity,
  Lightbulb,
  Award,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../api/axios.js';
import { useAuthStore } from '../store/authStore.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.045, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 9 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

const panelClass =
  'border border-[#25282d]/50 rounded-xs bg-[#101214] shadow-[0_8px_28px_rgba(0,0,0,0.12)]';
const hoverClass =
  'transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-[#41464e]/50 hover:bg-[#131619] hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]';

const StatCard = ({ label, value, trend, icon: Icon, accent, data }) => (
  <motion.div
    variants={itemVariants}
    className={`${panelClass} ${hoverClass} group min-w-0 p-5`}
  >
    <div className="mb-2 flex items-center justify-between">
      <div className={`flex  items-center justify-center border1 border-white/[0.06] bg1white/[0.035] ${accent}`}>
        <Icon className="size-7" strokeWidth={1.8} />
      </div>
      {/* <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#626b75]">
        Overview
      </span> */}
    </div>

    <p className="text-[13px] font-medium text-[#929ba6]">{label}</p>
    {/* <div className="mt-1 flex items-end justify-between gap-3"> */}
    <div className="mt-2">
      <h3 className="text-[30px] font-semibold leading-none tracking-[-0.045em] text-[#f2f3f4] tabular-nums">
        {value}
      </h3>
      <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#58b987]">
        <TrendingUp className="h-3 w-3" />
        {trend}
      </p>
    </div>
    <div className="h-[42px] w-[46%] min-w-[76px] opacity-90 transition-opacity duration-200 group-hover:opacity-100">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data || []}>
          <Area
            type="monotone"
            dataKey="value"
            stroke={accent.includes('blue') ? '#58a6e7' : accent.includes('violet') ? '#a879ed' : '#e7ad36'}
            strokeWidth={1.6}
            fill="none"
            dot={false}
            isAnimationActive
            animationDuration={650}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    {/* </div> */}
  </motion.div>
);

const ScoreCard = ({ score, trend }) => {
  const data = [
    { value: score },
    { value: Math.max(0, 100 - score) },
  ];

  return (
    <motion.div
      variants={itemVariants}
      className={`${panelClass} ${hoverClass} flex min-w-0 items-center justify-between gap-3 p-5`}
    >
      <div>
        <div className="mb-2 flex  items-center justify-start border1 border-[#d6a63d]/20 bg1[#d6a63d]/[0.07]">
          <Trophy className="size-8 text-[#45C692]" strokeWidth={1.8} />
        </div>
        <p className="text-[13px] font-medium text-[#929ba6]">Average Score</p>
        <h3 className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.045em] text-[#f2f3f4] tabular-nums">
          {score}%
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#58b987]">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </p>
      </div>
      <div className="relative h-[88px] w-[88px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={33}
              outerRadius={44}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              isAnimationActive
              animationDuration={650}
            >
              <Cell fill="#d9a83e" stroke="none" />
              <Cell fill="#292d32" stroke="none" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[13px] font-semibold text-[#e9ebed] tabular-nums">{score}%</span>
        </div>
      </div>
    </motion.div>
  );
};

const getActivityIcon = (type) => {
  switch (type) {
    case 'document':
      return { icon: FileText, color: 'text-[#58a6e7]', bg: 'bg-[#58a6e7]/[0.09]' };
    case 'quiz':
      return { icon: Puzzle, color: 'text-[#b184ef]', bg: 'bg-[#b184ef]/[0.09]' };
    case 'attempt':
      return { icon: Trophy, color: 'text-[#e5b343]', bg: 'bg-[#e5b343]/[0.09]' };
    default:
      return { icon: Layout, color: 'text-[#58b987]', bg: 'bg-[#58b987]/[0.09]' };
  }
};

const formatTimeAgo = (dateString) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/analytics/dashboard').then((r) => r.data.data),
  });

  if (isLoading || !dashboardData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#0b0d0f]">
        <div className="h-7 w-7 animate-spin border-2 border-[#d9a83e] border-t-transparent" />
      </div>
    );
  }

  const {
    stats,
    sparklines,
    streak,
    continueLearning,
    recentActivity,
    goal,
    recommended,
  } = dashboardData;
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <div className="min-h-screen bg-[#0b0d0f] md:px-4 py-6 text-[#edf0f2] px-2 sm:py-8 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full space-y-7"
      >
        {/* Welcome and streak */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(350px,0.9fr)]">
          <div className="flex min-w-0 flex-col justify-between gap-7 py-1">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(100px,190px)] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
              <div className="min-w-0">
                <p className="font-serif text-[clamp(20px,2.2vw,30px)] leading-tight text-[#c3c8ce]">
                  Good to see you again,
                </p>
                <h1 className="mt-1 break-words capitalize font-serif text-[clamp(42px,5vw,66px)] leading-[0.98] tracking-[-0.035em] text-[#f3f1ed]">
                  {user?.name?.split(' ')[0] || 'User'}
                  <span className="text-[#e4b23e]">!</span>
                </h1>
                <p className="mt-3 max-w-[440px] text-[13px] leading-relaxed text-[#858e98] sm:text-sm">
                  Let&apos;s keep the momentum going. You&apos;ve got this!
                </p>
              </div>
              <img
                src="/dash.png"
                alt=""
                className="h-[105px] w-full max-w-[190px] justify-self-end object-contain opacity-90 sm:h-[125px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                to="/documents"
                className={`${panelClass} ${hoverClass} group flex min-h-[76px] items-center gap-3 p-3`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border1 border-[#d9a83e]/20 bg-[#d9a83e]/[0.09] text-[#e5b343]">
                  <Plus className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[#e9ebed]">Create Quiz</span>
                  <span className="mt-1 block text-[10px] leading-[1.45] text-[#858e98]">
                    Turn your notes into interactive quizzes
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#747d87] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e5b343]" />
              </Link>

              <Link
                to="/documents"
                className={`${panelClass} ${hoverClass} group flex min-h-[76px] items-center gap-3 p-3`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border1 border-[#58a6e7]/20 bg-[#58a6e7]/[0.08] text-[#58a6e7]">
                  <FileText className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[#e9ebed]">Upload Document</span>
                  <span className="mt-1 block text-[10px] leading-[1.45] text-[#858e98]">
                    Upload PDF, PPT, TXT files &amp; more
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#747d87] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e5b343]" />
              </Link>

              <Link
                to="/explore"
                className={`${panelClass} ${hoverClass} group flex min-h-[76px] items-center gap-3 p-3`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border1 border-[#d9a83e]/20 bg-[#d9a83e]/[0.09] text-[#e5b343]">
                  <Compass className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[#e9ebed]">Explore Quizzes</span>
                  <span className="mt-1 block text-[10px] leading-[1.45] text-[#858e98]">
                    Discover quizzes from the community
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#747d87] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e5b343]" />
              </Link>
            </div>
          </div>

          <motion.div
            variants={itemVariants}
            className={`${panelClass} relative overflow-hidden p-5 sm:p-6 flex flex-col h-full`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#292d32] pb-4">
              <h2 className="flex items-center gap-2 text-[14px] font-semibold text-[#e9ebed]">
                <Flame className="h-[18px] w-[18px] fill-[#e5a63b] text-[#e5a63b]" />
                Your Learning Streak
              </h2>
              <span className="text-[10px] font-medium text-[#7e8791]">This week</span>
            </div>

            <div className="h-full flex items-center gap-5 py-5 sm:gap-7">
              <div className="min-w-[62px] border-r border-[#292d32] pr-5">
                <span className="block text-[44px] font-semibold leading-none tracking-[-0.05em] text-[#f1f2f3] tabular-nums">
                  {streak.current}
                </span>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#818a94]">
                  Days
                </p>
              </div>
              <div className="grid flex-1 grid-cols-7 gap-1.5 sm:gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                  const isDayDone = streak.weekly[i];
                  const isToday = i === todayIndex;
                  return (
                    <div key={day + i} className="flex min-w-0 flex-col items-center gap-2">
                      <span className="text-[10px] font-semibold text-[#8b949e]">{day}</span>
                      <div
                        className={`flex h-7 w-7 items-center justify-center border1 rounded-full transition-colors duration-200 sm:h-8 sm:w-8 ${isToday
                          ? 'border-[#d9a83e] bg-[#d9a83e]'
                          : isDayDone
                            ? 'border-[#4b9b78]/60 bg-[#4b9b78]/[0.10]'
                            : 'border-[#353a40] bg-[#171a1d]'
                          }`}
                      >
                        {isDayDone && (
                          <CheckCircle2
                            className={`h-4 w-4 ${isToday ? 'text-[#e5b343]' : 'text-[#58b987]'}`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[#292d32] pt-4">
              {/* <p className="text-[11px] leading-relaxed text-[#8b949e]">
                Keep it up! Consistency is key to mastery.
              </p> */}
              <div className="flex shrink-0 items-center gap-2 text-[11px] font-medium text-[#c2c7cc]">
                <Trophy className="h-4 w-4 text-[#e5b343]" />
                <span>Longest Streak: {streak.longest} days</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Documents"
            value={stats.documentsCount}
            trend="Active"
            icon={FileText}
            accent="text-[#58a6e7]"
            data={sparklines.documents}
          />
          <StatCard
            label="Quizzes Created"
            value={stats.quizzesCreated}
            trend="Active"
            icon={Puzzle}
            accent="text-[#b184ef]"
            data={sparklines.quizzes}
          />
          <StatCard
            label="Quizzes Taken"
            value={stats.quizzesAttempted}
            trend="Active"
            icon={TrendingUp}
            accent="text-[#e5b343]"
            data={sparklines.attempts}
          />
          <ScoreCard score={Math.round(stats.averageScore)} trend="Overall" />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1.8fr)_minmax(270px,0.85fr)]">
          <div className="min-w-0 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-[#252a30] pb-3">
                <h2 className="border-l-[3px] border-[#d9a83e] pl-3 font-serif text-[21px] text-[#eceeed]">
                  Continue Learning
                </h2>
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#e5b343] transition-colors hover:text-[#f3cb72]"
                >
                  View all <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {continueLearning.length > 0 ? (
                  continueLearning.map((item, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className={`${panelClass} ${hoverClass} flex min-w-0 items-center gap-4 p-4`}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#58a6e7]/20 bg-[#58a6e7]/[0.08] text-[#58a6e7]">
                        <FileText className="h-5 w-5" strokeWidth={1.7} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[13px] font-semibold text-[#e8eaec]">{item.title}</h3>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-[3px] flex-1 overflow-hidden bg-[#292e34]">
                            <div
                              className="h-full bg-[#d9a83e] transition-[width] duration-500"
                              style={{ width: `${item.progress || 0}%` }}
                            />
                          </div>
                          <span className="whitespace-nowrap text-[10px] text-[#89929c]">
                            {item.progress || 0}% completed
                          </span>
                        </div>
                      </div>
                      <button className="shrink-0 border border-[#353a40] px-3 py-2 text-[10px] font-semibold text-[#cbd0d5] transition-colors hover:border-[#d9a83e]/60 hover:text-[#e5b343]">
                        Continue
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div
                    className={`${panelClass} col-span-full flex flex-col items-center justify-center px-6 py-9 min-h-[210px] text-center`}
                  >
                    <FileText
                      size={29}
                      strokeWidth={1.4}
                      className="text-[#71869a] mb-4"
                    />

                    <h3 className="text-[19px] text-[#e8e5df] font-serif mb-2">
                      Your library starts here.
                    </h3>

                    <p className="text-[12px] text-[#8294a8] leading-relaxed max-w-[300px]">
                      Upload your study material and keep everything
                      organized in one place.
                    </p>

                    <button
                      onClick={() => navigate('/documents')}
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2
    bg-[#171817] border border-[#39352a]
    text-[#e3ad32] text-[12px] font-medium
    hover:bg-[#201f1a] hover:border-[#71602f]
    transition-colors duration-200"
                    >
                      <Plus size={14} />
                      Upload your first document
                    </button>

                    <span className="mt-5 text-[10px] tracking-wide text-[#657585]">
                      PDF · PPT · TXT · DOCX supported
                    </span>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-[#252a30] pb-3">
                <h2 className="border-l-[3px] border-[#d9a83e] pl-3 font-serif text-[21px] text-[#eceeed]">
                  Recent Activity
                </h2>
                <Link
                  to="/analytics"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#e5b343] transition-colors hover:text-[#f3cb72]"
                >
                  View all <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className={`${panelClass} overflow-hidden`}>
                {recentActivity.length > 0 ? (
                  <div className="divide-y divide-[#252a30]">
                    {recentActivity.map((item, i) => {
                      const iconData = getActivityIcon(item.type);
                      const IconComp = iconData.icon;
                      return (
                        <div
                          key={i}
                          className="group flex min-w-0 items-center gap-3 px-4 py-4 transition-colors duration-200 hover:bg-white/[0.025] sm:gap-4 sm:px-5"
                        >
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center ${iconData.bg}`}>
                            <IconComp className={`h-[17px] w-[17px] ${iconData.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold text-[#e6e8ea]">{item.title}</p>
                            <p className="mt-0.5 truncate text-[11px] text-[#858e98]">{item.desc}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                            <span className="text-[10px] font-medium text-[#7f8993]">
                              {formatTimeAgo(item.createdAt)}
                            </span>
                            <button className="p-1 text-[#6f7882] transition-colors hover:text-[#e5b343]">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center px-6 py-9 min-h-[190px] text-center">

                    <Activity
                      size={26}
                      strokeWidth={1.4}
                      className="text-[#71869a] mb-4"
                    />

                    <h3 className="text-[19px] font-serif text-[#e8e5df] mb-2">
                      Your journey starts here.
                    </h3>

                    <p className="text-[12px] text-[#8294a8] leading-relaxed max-w-[300px]">
                      Your learning activity will appear here as you
                      create quizzes, take tests and explore.
                    </p>

                    <button
                      // onClick={handleExplore}
                      className="mt-4 inline-flex items-center gap-1.5
    text-[12px] font-medium text-[#e3ad32]
    hover:text-[#f1c65c] transition-colors duration-200"
                    >
                      Start learning
                      <ArrowUpRight size={14} />
                    </button>

                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}

          <aside className="min-w-0 space-y-6">

            {/* UPCOMING GOAL */}
            <section className={`${panelClass} p-5`}>

              {/* Header */}
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#252a30] pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp
                    className="h-4 w-4 text-[#e5b343]"
                    strokeWidth={1.7}
                  />
                  <h3 className="text-[13px] font-semibold text-[#e9ebed]">
                    Upcoming Goal
                  </h3>
                </div>

                <span className="shrink-0 text-[9px] font-semibold tracking-[0.8px] text-[#d9ad4e]">
                  IN PROGRESS
                </span>
              </div>

              {/* Goal Details */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-[13px] font-semibold text-[#e3e6e8]">
                  {goal.title}
                </span>

                <span className="shrink-0 text-[11px] font-medium text-[#a1aab4] tabular-nums">
                  {goal.current} / {goal.target}
                </span>
              </div>

              {/* Progress Information */}
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] text-[#8294a8]">
                  Your progress
                </span>

                <span className="text-[10px] font-semibold text-[#e5b343] tabular-nums">
                  {goal.target > 0
                    ? Math.min(100, (goal.current / goal.target) * 100).toFixed(0)
                    : 0}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-[5px] w-full overflow-hidden bg-[#292e34]">
                <div
                  className="h-full bg-[#d9a83e] transition-[width] duration-500 ease-out"
                  style={{
                    width: `${goal.target > 0
                      ? Math.min(100, (goal.current / goal.target) * 100)
                      : 0}%`
                  }}
                />
              </div>

              {/* Reward */}
              <div className="mt-5 flex items-center justify-between border-t border-[#292e34] pt-4">
                <div className="flex items-center gap-2 text-[11px] font-medium text-[#d9ad4e]">
                  <span className="flex h-5 w-6 items-center justify-center border border-[#d9a83e]/25 bg-[#d9a83e]/[0.08] text-[9px] font-bold">
                    XP
                  </span>
                  Reward: +50 XP
                </div>

                <Trophy
                  className="h-4 w-4 text-[#8a7443]"
                  strokeWidth={1.5}
                />
              </div>
            </section>


            {/* ACHIEVEMENTS */}
            <section className="space-y-3">

              {/* Section Header */}
              <div className="flex items-center justify-between gap-3 border-b border-[#252a30] pb-3">
                <div className="flex items-center gap-2">
                  <Award
                    className="h-4 w-4 text-[#e5b343]"
                    strokeWidth={1.6}
                  />

                  <h3 className="text-[13px] font-semibold text-[#e9ebed]">
                    Achievements
                  </h3>
                </div>

                <Link
                  to="/profile"
                  className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-[#e5b343] transition-colors duration-200 hover:text-[#f3cb72]"
                >
                  View all
                  <ArrowUpRight size={12} />
                </Link>
              </div>

              {/* Achievement Grid */}
              <div className={`${panelClass} grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-x-2 gap-y-4 p-4`}>

                {[
                  {
                    icon: Flame,
                    label: '3 Day Streak',
                    color: 'text-[#e5a63b]',
                    bg: 'bg-[#282117]',
                    border: 'border-[#554326]',
                    unlocked: true,
                  },
                  {
                    icon: Layout,
                    label: 'Quiz Master',
                    color: 'text-[#b184ef]',
                    bg: 'bg-[#241d2c]',
                    border: 'border-[#49375d]',
                    unlocked: true,
                  },
                  {
                    icon: FileText,
                    label: 'First Upload',
                    color: 'text-[#58b987]',
                    bg: 'bg-[#192820]',
                    border: 'border-[#304b3a]',
                    unlocked: true,
                  },
                  {
                    icon: Lock,
                    label: 'Consistent Learner',
                    color: 'text-[#707983]',
                    bg: 'bg-[#191c20]',
                    border: 'border-[#30353b]',
                    unlocked: false,
                  },
                ].map((ach, i) => (
                  <div
                    key={i}
                    className="group flex min-w-0 flex-col items-center gap-2 text-center"
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center border1 rounded-sm transition-all duration-200 group-hover:border-[#71602f] group-hover:bg-[#211f19] ${ach.bg} ${ach.border}`}
                    >
                      <ach.icon
                        className={`h-[19px] w-[19px] ${ach.color}`}
                        strokeWidth={1.6}
                      />
                    </div>

                    {/* Achievement Name */}
                    <span
                      className={`text-[10px] font-medium leading-tight ${ach.unlocked
                        ? 'text-[#c4c8ce]'
                        : 'text-[#858e98]'
                        }`}
                    >
                      {ach.label}
                    </span>

                    {/* Achievement Status */}
                    <span
                      className={`text-[8px] font-semibold tracking-[0.7px] ${ach.unlocked
                        ? 'text-[#d9ad4e]'
                        : 'text-[#68727d]'
                        }`}
                    >
                      {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                ))}
              </div>
            </section>


            {/* RECOMMENDED FOR YOU */}
            <section className="space-y-3">

              {/* Section Header */}
              <div className="flex items-center justify-between gap-3 border-b border-[#252a30] pb-3">

                <div className="flex min-w-0 items-center gap-2.5">
                  <Compass
                    className="h-4 w-4 shrink-0 text-[#e5b343]"
                    strokeWidth={1.6}
                  />

                  <h3 className="truncate text-[13px] font-semibold tracking-[0.1px] text-[#e9ebed]">
                    Recommended for You
                  </h3>
                </div>

                <Link
                  to="/explore"
                  className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-[#e5b343] transition-colors duration-200 hover:text-[#f3cb72]"
                >
                  View all
                  <ArrowUpRight size={12} />
                </Link>
              </div>

              {/* Recommendation List */}
              <div className="space-y-2.5">

                {recommended.length > 0 ? (
                  recommended.map((rec, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className={`${panelClass} ${hoverClass} group flex min-h-[66px] min-w-0 items-center gap-3 p-3 transition-colors duration-200`}
                    >

                      {/* Recommendation Icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#d9a83e]/15 bg-[#d9a83e]/[0.06] text-[#d9a83e] transition-colors duration-200 group-hover:border-[#d9a83e]/35 group-hover:bg-[#d9a83e]/[0.10]">
                        <PlayCircle
                          className="h-5 w-5"
                          strokeWidth={1.6}
                        />
                      </div>

                      {/* Recommendation Details */}
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-[11px] font-semibold text-[#e6e8ea] transition-colors duration-200 group-hover:text-[#f0c66a]">
                          {rec.title}
                        </h4>

                        <div className="mt-1 flex items-center gap-3">
                          <span className="text-[10px] text-[#89929c]">
                            {rec.questions} Questions
                          </span>

                          <span className="flex items-center gap-1 text-[10px] font-medium text-[#e5b343]">
                            {rec.rating}
                            <Star className="h-2.5 w-2.5 fill-[#e5b343]" />
                          </span>
                        </div>
                      </div>

                      {/* Start Action */}
                      <button
                        className="flex shrink-0 items-center gap-1 border border-[#353a40] px-2.5 py-1.5 text-[10px] font-semibold text-[#cbd0d5] transition-all duration-200 hover:border-[#d9a83e]/60 hover:bg-[#d9a83e]/[0.06] hover:text-[#e5b343]"
                      >
                        Start
                        <ArrowUpRight size={11} />
                      </button>

                    </motion.div>
                  ))
                ) : (

                  /* Empty State */
                  <div className={`${panelClass} flex flex-col gap-3 p-4`}>

                    <div className="flex items-center gap-2">
                      <Lightbulb
                        size={18}
                        strokeWidth={1.5}
                        className="shrink-0 text-[#71869a]"
                      />

                      <h4 className="text-[13px] font-medium text-[#e8e5df]">
                        Building your recommendations
                      </h4>
                    </div>

                    <p className="text-[11px] leading-relaxed text-[#8294a8]">
                      Explore quizzes and start learning to get personalized suggestions.
                    </p>

                    <button
                      onClick={() => navigate("/quizzes")}
                      className="flex w-fit items-center gap-1.5 text-[11px] font-medium text-[#e3ad32] transition-colors duration-200 hover:text-[#f1c65c]"
                    >
                      Explore quizzes
                      <ArrowUpRight size={13} />
                    </button>

                  </div>
                )}

              </div>
            </section>

          </aside>

        </div>
      </motion.div>
    </div>
  );
}

// import { useQuery } from '@tanstack/react-query';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   FileText,
//   Puzzle,
//   TrendingUp,
//   Trophy,
//   Plus,
//   Compass,
//   History,
//   ArrowUpRight,
//   Clock,
//   CheckCircle2,
//   MoreVertical,
//   Flame,
//   Gift,
//   Search,
//   Layout,
//   Star,
//   PlayCircle,
//   Lock
// } from 'lucide-react';
// import {
//   AreaChart,
//   Area,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from 'recharts';
// import api from '../api/axios.js';
// import { useAuthStore } from '../store/authStore.js';

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.05,
//     }
//   }
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
//   }
// };

// const StatCard = ({ label, value, trend, icon: Icon, color, data }) => (
//   <motion.div variants={itemVariants} className="group p-5 rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-white/10 transition-all duration-300 card-shine">
//     <div className="flex justify-between items-start mb-4">
//       <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110`}>
//         <Icon className={`w-5 h-5 ${color}`} />
//       </div>
//     </div>
//     <div className="space-y-1">
//       <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>
//       <div className="flex items-baseline gap-2">
//         <h3 className="text-3xl font-bold text-[var(--text-main)] tabular-nums tracking-tight">{value}</h3>
//       </div>
//       <p className="text-[11px] font-semibold text-emerald-400/90 flex items-center gap-1">
//         <TrendingUp className="w-3 h-3" />
//         {trend}
//       </p>
//     </div>
//     <div className="h-16 mt-4 -mx-2">
//       <ResponsiveContainer width="100%" height="100%">
//         <AreaChart data={data || []}>
//           <defs>
//             <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor={color.includes('blue') ? '#4F46E5' : color.includes('violet') ? '#7C3AED' : '#FBBF24'} stopOpacity={0.2} />
//               <stop offset="100%" stopColor={color.includes('blue') ? '#4F46E5' : color.includes('violet') ? '#7C3AED' : '#FBBF24'} stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <Area
//             type="monotone"
//             dataKey="value"
//             stroke={color.includes('blue') ? '#4F46E5' : color.includes('violet') ? '#7C3AED' : '#FBBF24'}
//             strokeWidth={2}
//             fill={`url(#gradient-${label})`}
//             dot={false}
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   </motion.div>
// );

// const ScoreCard = ({ score, trend }) => {
//   const data = [
//     { value: score },
//     { value: Math.max(0, 100 - score) }
//   ];
//   return (
//     <motion.div variants={itemVariants} className="p-5 rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-white/10 transition-all duration-300 card-shine flex items-center justify-between">
//       <div className="space-y-1">
//         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
//           <Trophy className="w-5 h-5 text-emerald-400" />
//         </div>
//         <p className="text-sm font-medium text-[var(--text-muted)]">Average Score</p>
//         <h3 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">{score}%</h3>
//         <p className="text-[11px] font-semibold text-emerald-400/90 flex items-center gap-1">
//           <TrendingUp className="w-3 h-3" />
//           {trend}
//         </p>
//       </div>
//       <div className="w-24 h-24 relative">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               innerRadius={30}
//               outerRadius={40}
//               paddingAngle={0}
//               dataKey="value"
//               startAngle={90}
//               endAngle={-270}
//             >
//               <Cell fill="#10B981" stroke="none" />
//               <Cell fill="#1E222A" stroke="none" />
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <span className="text-sm font-bold text-[var(--text-main)]">{score}%</span>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Helper for Activity icons
// const getActivityIcon = (type) => {
//   switch (type) {
//     case 'document': return { icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
//     case 'quiz': return { icon: Puzzle, color: 'text-violet-400', bg: 'bg-violet-400/10' };
//     case 'attempt': return { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/10' };
//     default: return { icon: Layout, color: 'text-blue-400', bg: 'bg-blue-400/10' };
//   }
// };

// const formatTimeAgo = (dateString) => {
//   const diff = Date.now() - new Date(dateString).getTime();
//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   if (hours < 1) return 'Just now';
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   return `${days}d ago`;
// };

// export default function DashboardPage() {
//   const user = useAuthStore((s) => s.user);
//   const { data: dashboardData, isLoading } = useQuery({
//     queryKey: ['dashboard'],
//     queryFn: () => api.get('/analytics/dashboard').then((r) => r.data.data),
//   });

//   if (isLoading || !dashboardData) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   const { stats, sparklines, streak, continueLearning, recentActivity, goal, recommended } = dashboardData;
//   const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // Mon=0, Sun=6

//   return (
//     <div className="min-h-screen px-4 py-8 md:px-8 max-w-[1440px] mx-auto text-[var(--text-main)]">
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="space-y-8"
//       >
//         {/* ── Header & Streak Card ── */}
//         <div className="flex flex-col xl:flex-row gap-6 items-stretch">
//           <div className="flex-1 flex flex-col justify-center py-4">

//             <div className='grid grid-cols-[1fr_auto]'>


//               <h2 className="text-xl md:text-3xl  tracking-tight">
//                 Good to see you again,
//               </h2>
//               <img src="/dash.png" alt="" className='row-span-3 h-30' />
//               <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
//                 <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}!</span> 👋
//               </h1>
//               <p className="text-[var(--text-muted)] mt-3 text-base font-medium">
//                 Let's keep the momentum going. You've got this!
//               </p>

//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
//               <Link to="/documents" className="group flex items-center gap-4 p-3 pr-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-indigo-500/30 transition-all">
//                 <div className="w-12 h-12 rounded-xl icon-gradient-purple flex items-center justify-center flex-shrink-0">
//                   {/* <Plus className="w-6 h-6 text-white" /> */}
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
//                     <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
//                   </svg>

//                 </div>
//                 <div>
//                   <p className="font-bold text-sm">Create Quiz</p>
//                   <p className="text-[11px] text-[var(--text-muted)]">Turn your notes into interactive quizzes</p>
//                 </div>
//               </Link>

//               <Link to="/documents" className="group flex items-center gap-4 p-3 pr-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-white/10 transition-all">
//                 <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
//                   {/* <FileText className="w-5 h-5 text-blue-400" /> */}
//                   <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true" className='fill-blue-400 w-7  h-7 translate-x-[2px]'>
//                     <path className='fill-blue-400' d="M13.862 6h-8c-.553 0-1-.448-1-1s.447-1 1-1h8c.553 0 1 .448 1 1s-.447 1-1 1zM11.862 10h-6c-.553 0-1-.448-1-1s.447-1 1-1h6c.553 0 1 .448 1 1s-.447 1-1 1zM10.862 13c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1z"></path>
//                     <path className='fill-blue-400' d="M18.862 2v9c0 .55-.45 1-1 1s-1-.45-1-1V2.5c0-.28-.22-.5-.5-.5h-13c-.28 0-.5.22-.5.5v19c0 .28.22.5.5.5h10.5c.55 0 1 .45 1 1s-.45 1-1 1h-11c-1.1 0-2-.9-2-2V2c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2z"></path>
//                     <path className='fill-blue-400' d="M21.862 18c0 .55-.45 1-1 1h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2h-2c-.55 0-1-.45-1-1s.45-1 1-1h2v-2c0-.55.45-1 1-1s1 .45 1 1v2h2c.55 0 1 .45 1 1z"></path>
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-bold text-sm">Upload Document</p>
//                   <p className="text-[11px] text-[var(--text-muted)]">Upload PDF, PPT, TXT files & more</p>
//                 </div>
//               </Link>

//               <Link to="/explore" className="group flex items-center gap-4 p-3 pr-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-white/10 transition-all">
//                 <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
//                   <Search className="w-5 h-5 text-amber-400" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-sm">Explore Quizzes</p>
//                   <p className="text-[11px] text-[var(--text-muted)]">Discover quizzes from the Community</p>
//                 </div>
//               </Link>
//             </div>
//           </div>

//           {/* Streak Card */}
//           <div className="xl:w-[450px] p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] relative overflow-hidden group">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="font-bold text-[var(--text-main)] flex items-center gap-2">
//                 Your Learning Streak <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
//               </h3>
//             </div>

//             <div className="flex items-end gap-6 mb-8">
//               <div className="text-center">
//                 <span className="text-5xl font-black text-[var(--text-main)]">{streak.current}</span>
//                 <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mt-1">days</p>
//               </div>
//               <div className="flex-1 pb-1">
//                 <div className="flex justify-between mb-4">
//                   {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
//                     const isDayDone = streak.weekly[i];
//                     const isToday = i === todayIndex;
//                     return (
//                       <div key={day + i} className="flex flex-col items-center gap-2">
//                         <span className="text-[10px] font-bold text-[var(--text-muted)]">{day}</span>
//                         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isToday ? 'border-indigo-500 bg-indigo-500/20' :
//                           isDayDone ? 'border-emerald-500/50 bg-emerald-500/10' :
//                             'border-white/5 bg-white/5'
//                           }`}>
//                           {isDayDone && <CheckCircle2 className={`w-4 h-4 ${isToday ? 'text-indigo-400' : 'text-emerald-400'}`} />}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//                 <p className="text-[11px] text-[var(--text-muted)] leading-tight">
//                   Keep it up! Consistency is key to mastery.
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center justify-between pt-6 border-t border-[var(--border-main)]">
//               <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-muted)]">
//                 <Flame className="w-3.5 h-3.5 text-orange-500" />
//                 Longest streak: {streak.longest} days
//               </div>
//               <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
//                 <Gift className="w-5 h-5 text-amber-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── Stats Row ── */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             label="Documents"
//             value={stats.documentsCount}
//             trend="Active"
//             icon={FileText}
//             color="text-blue-400"
//             data={sparklines.documents}
//           />
//           <StatCard
//             label="Quizzes Created"
//             value={stats.quizzesCreated}
//             trend="Active"
//             icon={Puzzle}
//             color="text-violet-400"
//             data={sparklines.quizzes}
//           />
//           <StatCard
//             label="Quizzes Taken"
//             value={stats.quizzesAttempted}
//             trend="Active"
//             icon={TrendingUp}
//             color="text-amber-400"
//             data={sparklines.attempts}
//           />
//           <ScoreCard
//             score={Math.round(stats.averageScore)}
//             trend="Overall"
//           />
//         </div>

//         {/* ── Main Content Grid ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-8">
//             {/* Continue Learning */}
//             <section className="space-y-6">
//               <div className="flex items-center justify-between px-2">
//                 <h2 className="text-xl font-bold">Continue Learning</h2>
//                 <Link to="/documents" className="text-sm text-indigo-400 font-bold hover:text-indigo-300 transition-colors">View all</Link>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {continueLearning.length > 0 ? continueLearning.map((item, i) => (
//                   <div key={i} className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] flex items-center gap-5 hover:border-white/10 transition-all group">
//                     <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
//                       <FileText className="w-7 h-7 text-indigo-500" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-bold text-sm truncate">{item.title}</h4>
//                       <div className="flex items-center gap-3 mt-2">
//                         <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
//                           <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.progress || 0}%` }} />
//                         </div>
//                         <span className="text-[10px] font-bold text-[var(--text-muted)] whitespace-nowrap">{item.progress || 0}% completed</span>
//                       </div>
//                     </div>
//                     <button className="px-4 py-1.5 rounded-lg bg-white/5 text-[11px] font-bold hover:bg-white/10 transition-colors">Continue</button>
//                   </div>
//                 )) : (
//                   <div className="col-span-2 p-8 text-center text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl">
//                     No recent documents found. Upload one to start!
//                   </div>
//                 )}
//               </div>
//             </section>

//             {/* Recent Activity */}
//             <section className="space-y-6">
//               <div className="flex items-center justify-between px-2">
//                 <h2 className="text-xl font-bold">Recent Activity</h2>
//                 <Link to="/analytics" className="text-sm text-indigo-400 font-bold hover:text-indigo-300 transition-colors">View all</Link>
//               </div>

//               <div className="rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-main)] overflow-hidden">
//                 <div className="divide-y divide-[var(--border-main)]">
//                   {recentActivity.length > 0 ? recentActivity.map((item, i) => {
//                     const iconData = getActivityIcon(item.type);
//                     const IconComp = iconData.icon;
//                     return (
//                       <div key={i} className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors group">
//                         <div className={`w-10 h-10 rounded-xl ${iconData.bg} flex items-center justify-center flex-shrink-0`}>
//                           <IconComp className={`w-5 h-5 ${iconData.color}`} />
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-bold">{item.title}</p>
//                           <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium truncate">{item.desc}</p>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <span className="text-[11px] font-bold text-[var(--text-muted)]">{formatTimeAgo(item.createdAt)}</span>
//                           <button className="p-1 hover:bg-white/5 rounded transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]">
//                             <MoreVertical className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     )
//                   }) : (
//                     <div className="p-8 text-center text-[var(--text-muted)]">
//                       No recent activity. Start learning!
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-8">
//             {/* Upcoming Goal */}
//             <div className="p-6 rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-main)]">
//               <div className="flex items-center gap-2 mb-6">
//                 <TrendingUp className="w-4 h-4 text-orange-500" />
//                 <h3 className="font-bold text-sm">Upcoming Goal</h3>
//               </div>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-bold">{goal.title}</span>
//                   <span className="text-[11px] font-bold text-[var(--text-muted)]">{goal.current} / {goal.target}</span>
//                 </div>
//                 <div className="h-2 rounded-full bg-white/5 overflow-hidden">
//                   <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }} />
//                 </div>
//                 <div className="flex items-center gap-2 pt-2">
//                   <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
//                     <span className="text-[10px] font-black text-indigo-400">XP</span>
//                   </div>
//                   <span className="text-[11px] font-bold text-indigo-400">Reward: +50 XP</span>
//                 </div>
//               </div>
//             </div>

//             {/* Achievements */}
//             <div className="space-y-6">
//               <div className="flex items-center justify-between px-2">
//                 <h3 className="font-bold text-sm">Achievements</h3>
//                 <Link to="/profile" className="text-[11px] text-indigo-400 font-bold">View all</Link>
//               </div>
//               <div className="grid grid-cols-4 gap-3">
//                 {[
//                   { icon: Flame, label: '3 Day Streak', color: 'bg-orange-500/20 text-orange-500' },
//                   { icon: Layout, label: 'Quiz Master', color: 'bg-violet-500/20 text-violet-500' },
//                   { icon: FileText, label: 'First Upload', color: 'bg-emerald-500/20 text-emerald-500' },
//                   { icon: Lock, label: 'Consistent Learner', color: 'bg-white/5 text-white/20' },
//                 ].map((ach, i) => (
//                   <div key={i} className="flex flex-col items-center gap-2 text-center">
//                     <div className={`w-12 h-12 rounded-2xl ${ach.color} flex items-center justify-center`}>
//                       <ach.icon className="w-6 h-6" />
//                     </div>
//                     <span className="text-[9px] font-bold text-[var(--text-muted)] leading-tight">{ach.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Recommended */}
//             <div className="space-y-6">
//               <div className="flex items-center justify-between px-2">
//                 <h3 className="font-bold text-sm">Recommended for You</h3>
//                 <Link to="/explore" className="text-[11px] text-indigo-400 font-bold">View all</Link>
//               </div>
//               <div className="space-y-3">
//                 {recommended.length > 0 ? recommended.map((rec, i) => (
//                   <div key={i} className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] flex items-center gap-3 hover:border-white/10 transition-all group">
//                     <div className={`w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0`}>
//                       <PlayCircle className="w-6 h-6 text-white/40" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="text-xs font-bold truncate">{rec.title}</h4>
//                       <div className="flex items-center gap-3 mt-1">
//                         <span className="text-[10px] font-bold text-[var(--text-muted)]">{rec.questions} Questions</span>
//                         <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
//                           {rec.rating} <Star className="w-2.5 h-2.5 fill-amber-400" />
//                         </div>
//                       </div>
//                     </div>
//                     <button className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold hover:bg-white/10 transition-colors">Start</button>
//                   </div>
//                 )) : (
//                   <div className="p-4 text-center text-[var(--text-muted)] text-sm">
//                     No recommendations yet.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
