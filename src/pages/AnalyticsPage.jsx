
// import { useQuery } from '@tanstack/react-query';
// import { motion } from 'framer-motion';
// import {
//   BarChart3,
//   Calendar,
//   Download,
//   Filter,
//   LayoutDashboard,
//   MoreHorizontal,
//   Search,
//   Target,
//   Trophy,
//   Zap,
//   FileText,
//   CheckCircle2
// } from 'lucide-react';
// import api from '../api/axios.js';
// import MetricCard from '../components/analytics/MetricCard.jsx';
// import { ActivityChart, CategoryBarChart } from '../components/analytics/AnalyticsCharts.jsx';
// import { useState } from 'react';

// export default function AnalyticsPage() {
//   const [timeRange, setTimeRange] = useState('7d');

//   const { data: stats, isLoading: statsLoading } = useQuery({
//     queryKey: ['stats'],
//     queryFn: () => api.get('/analytics/stats').then((r) => r.data.data),
//   });

//   const { data: trends, isLoading: trendsLoading } = useQuery({
//     queryKey: ['trends'],
//     queryFn: () => api.get('/analytics/trends').then((r) => r.data.data),
//   });

//   const trendData = trends?.trends?.map((t) => ({
//     date: new Date(t.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
//     score: t.score,
//     quiz: t.quiz,
//   })) || [];

//   const weakTopics = trends?.weakTopics || [];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   if (statsLoading || trendsLoading) {
//     return (
//       <div className="flex items-center justify-center h-[80vh]">
//         <div className="relative">
//           <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-6 h-6 border-4 border-accent/20 border-b-accent rounded-full animate-spin-reverse"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0a0a0c] p-6 lg:p-10">
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="max-w-7xl mx-auto space-y-10"
//       >
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//           <div className="space-y-1">
//             <div className="flex items-center gap-2 text-primary-400 font-medium text-sm">
//               <LayoutDashboard className="w-4 h-4" />
//               <span>Personal Analytics</span>
//             </div>
//             <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Performance Overview</h1>
//             <p className="text-surface-400 max-w-md">Track your learning progress, quiz scores, and mastery across different topics.</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="flex bg-surface-900/50 p-1 rounded-xl border border-white/5 shadow-inner">
//               {['24h', '7d', '30d', 'All'].map((range) => (
//                 <button
//                   key={range}
//                   onClick={() => setTimeRange(range)}
//                   className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeRange === range
//                       ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
//                       : 'text-surface-400 hover:text-white'
//                     }`}
//                 >
//                   {range}
//                 </button>
//               ))}
//             </div>
//             <button className="p-2.5 rounded-xl bg-surface-900/50 border border-white/5 text-surface-400 hover:text-white transition-colors">
//               <Download className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Key Metrics Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <MetricCard
//             title="Total Points"
//             value={stats?.user?.points?.toLocaleString() || '0'}
//             icon={Zap}
//             color="amber"
//             trend="up"
//             trendValue="+12%"
//             delay={1}
//           />
//           <MetricCard
//             title="Documents"
//             value={stats?.stats?.documentsCount || '0'}
//             icon={FileText}
//             color="blue"
//             trend="up"
//             trendValue="+2"
//             delay={2}
//           />
//           <MetricCard
//             title="Quizzes Taken"
//             value={stats?.stats?.quizzesAttempted || '0'}
//             icon={CheckCircle2}
//             color="emerald"
//             trend="up"
//             trendValue="+5%"
//             delay={3}
//           />
//           <MetricCard
//             title="Average Score"
//             value={`${stats?.stats?.averageScore || 0}%`}
//             icon={Target}
//             color="purple"
//             trend={stats?.stats?.averageScore > 70 ? 'up' : 'down'}
//             trendValue={stats?.stats?.averageScore > 70 ? '+2.4%' : '-1.5%'}
//             delay={4}
//           />
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* Study Trends - 2/3 width on desktop */}
//           <motion.div
//             variants={containerVariants}
//             className="lg:col-span-2 glass rounded-3xl p-8 border border-white/5 relative overflow-hidden"
//           >
//             <div className="absolute top-0 right-0 p-8 opacity-5">
//               <BarChart3 className="w-32 h-32" />
//             </div>

//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h2 className="text-xl font-bold text-white">Learning Velocity</h2>
//                 <p className="text-sm text-surface-500">Your average quiz scores over the last sessions</p>
//               </div>
//               <div className="flex items-center gap-2 text-xs font-medium text-surface-400 bg-surface-900/50 px-3 py-1.5 rounded-lg border border-white/5">
//                 <Calendar className="w-3.5 h-3.5" />
//                 <span>Last 30 Days</span>
//               </div>
//             </div>

//             {trendData.length > 0 ? (
//               <ActivityChart data={trendData} />
//             ) : (
//               <div className="h-[300px] flex flex-col items-center justify-center text-surface-600 bg-surface-950/20 rounded-2xl border border-dashed border-white/5">
//                 <p>Not enough data to show trends</p>
//               </div>
//             )}
//           </motion.div>

//           {/* Right Sidebar Column */}
//           <div className="space-y-8">
//             {/* Topic Performance */}
//             <motion.div
//               variants={containerVariants}
//               className="glass rounded-3xl p-6 border border-white/5"
//             >
//               <h2 className="text-lg font-bold text-white mb-1">Focus Areas</h2>
//               <p className="text-xs text-surface-500 mb-6">Performance across your most active topics</p>

//               {weakTopics.length > 0 ? (
//                 <CategoryBarChart data={weakTopics} />
//               ) : (
//                 <div className="py-12 text-center text-surface-600 text-sm italic">
//                   Complete more quizzes to see topic analytics
//                 </div>
//               )}
//             </motion.div>

//             {/* Badges Section */}
//             <motion.div
//               variants={containerVariants}
//               className="glass rounded-3xl p-6 border border-white/5"
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-lg font-bold text-white">Achievements</h2>
//                 <Trophy className="w-4 h-4 text-amber-500" />
//               </div>

//               <div className="space-y-4">
//                 {stats?.user?.badges?.length > 0 ? (
//                   stats.user.badges.slice(0, 3).map((badge, i) => (
//                     <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-surface-900/40 border border-white/5 group hover:bg-surface-900/60 transition-colors cursor-default">
//                       <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/5 text-2xl">
//                         {badge.icon || '🏅'}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-bold text-surface-100 group-hover:text-white transition-colors">{badge.name}</p>
//                         <p className="text-xs text-surface-500 line-clamp-1">{badge.description}</p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-4 text-surface-600 text-xs">
//                     No badges earned yet. Keep learning!
//                   </div>
//                 )}

//                 {stats?.user?.badges?.length > 3 && (
//                   <button className="w-full py-2 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors">
//                     View All Achievements
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           </div>
//         </div>

//         {/* Empty State / Bottom Message */}
//         {trendData.length === 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.8 }}
//             className="glass rounded-3xl p-12 text-center border border-dashed border-white/10"
//           >
//             <div className="w-20 h-20 bg-surface-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-2xl">
//               <BarChart3 className="w-8 h-8 text-surface-500" />
//             </div>
//             <h3 className="text-xl font-bold text-white mb-2">Ready to start your journey?</h3>
//             <p className="text-surface-500 max-w-md mx-auto mb-8">Take your first quiz or upload a document to generate analytics and track your learning progress over time.</p>
//             <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20">
//               Create My First Quiz
//             </button>
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// }



import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineTrophy,
  HiOutlineChartBar,
  HiOutlineArrowUpRight,
  HiOutlineExclamationCircle,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';
import api from '../api/axios';

// -----------------------------
// Metric Card
// -----------------------------

const sparklineData = [
  { value: 62 }, { value: 68 }, { value: 65 },
  { value: 74 }, { value: 70 }, { value: 79 },
  { value: 75 }, { value: 84 }, { value: 81 },
  { value: 91 },
];

const metricColors = {
  gold: '#c6a44e',
  neutral: '#899397',
  emerald: '#7caa91',
  rose: '#c47d7d',
};

function MetricCard({
  title,
  value,
  icon: Icon,
  color = 'gold',
  delay = 0,
}) {
  const activeColor = metricColors[color] || metricColors.gold;
  const gradientId = `metric-${title.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.08 }}
      className="card-shine group relative flex min-h-[148px] flex-col border-r border-[#292f31] outline-none justify-between gap-4 overflow-hidden  p-4 transition-colors duration-200 sm:p-5"
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex size-9 items-center justify-center rounded-lg  border-white/[0.06] bg-[#1b2020]/80">
          {Icon && (
            <Icon
              className="size-[18px] transition-colors duration-200 group-hover:text-[#d1b36b]"
              style={{ color: activeColor }}
            />
          )}
        </div>
      </div>

      <div className="relative z-10 space-y-1">
        <p className="text-[11px] font-medium text-[#84909a]">
          {title}
        </p>
        <h3 className="text-[25px] font-semibold leading-none tracking-tight text-[#e8e9e6]">
          {value}
        </h3>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[52px] opacity-[0.19] transition-opacity duration-300 group-hover:opacity-[0.28]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={activeColor} stopOpacity={0.45} />
                <stop offset="100%" stopColor={activeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={activeColor}
              strokeWidth={1.6}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// -----------------------------
// Chart Tooltip
// -----------------------------

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[#303738] bg-[#151a1b] px-3 py-2 shadow-xl">
      <p className="mb-1 text-[10px] text-[#84909a]">{label}</p>
      <p className="text-sm font-semibold text-[#e8e9e6]">
        {payload[0].value}%
      </p>
    </div>
  );
}

// -----------------------------
// Analytics Page
// -----------------------------

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const response = await api.get('/analytics/stats');
      return response.data.data;
    },
  });

  const {
    data: trends,
    isLoading: trendsLoading,
    isError: trendsError,
    refetch: refetchTrends,
  } = useQuery({
    queryKey: ['analytics-trends'],
    queryFn: async () => {
      const response = await api.get('/analytics/trends');
      return response.data.data;
    },
  });

  const loading = statsLoading || trendsLoading;
  const hasError = statsError || trendsError;

  const metrics = [
    {
      title: 'Total Documents',
      value: stats?.stats?.documentsCount ?? 0,
      icon: HiOutlineDocumentText,
      color: 'gold',
    },
    {
      title: 'Quizzes Attempted',
      value: stats?.stats?.quizzesAttempted ?? 0,
      icon: HiOutlineAcademicCap,
      color: 'neutral',
    },
    {
      title: 'Average Score',
      value: `${stats?.stats?.averageScore ?? 0}%`,
      icon: HiOutlineChartBar,
      color: 'emerald',
    },
    {
      title: 'Total Points',
      value: stats?.user?.points ?? 0,
      icon: HiOutlineTrophy,
      color: 'gold',
    },
  ];

  const activityData = (trends?.trends || []).map((item) => ({
    ...item,
    date: item.date
      ? new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      : '',
  }));

  const weakTopics = trends?.weakTopics || [];
  const badges = stats?.user?.badges || [];

  const refreshData = () => {
    refetchStats();
    refetchTrends();
  };

  return (
    <div className="min-h-full space-y-7 pb-8 px-10 py-9">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[23px] font-semibold tracking-[-0.035em] text-[#e8e9e6] sm:text-[26px]">
            Analytics
          </h1>
          <p className="mt-1.5 text-[11px] text-[#84909a]">
            Track your learning progress and performance.
          </p>
        </div>

        <button
          onClick={refreshData}
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#292f31] bg-[#101314] px-3 py-2 text-[11px] font-medium text-[#aab1ae] transition-colors hover:border-[#414949] hover:text-[#e8e9e6] disabled:opacity-50"
        >
          <HiOutlineArrowPath className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {hasError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-[#754444]/40 bg-[#754444]/10 px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] text-[#d69b9b]">
            <HiOutlineExclamationCircle className="size-4 shrink-0" />
            Unable to load some analytics data.
          </div>
          <button
            onClick={refreshData}
            className="shrink-0 text-[11px] font-medium text-[#d69b9b] hover:text-[#edb5b5]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metric cards */}
      <section className="grid grid-cols-1 bg-[#101214] rounded-xl overflow-hidden border border-[#292f31] min-[420px]:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            delay={index}
          />
        ))}
      </section>

      {/* Activity and weak topics */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.65fr_1fr]">
        {/* Activity chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-xl border border-[#292f31] bg-[#101314] p-4 sm:p-5"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[13px] font-semibold text-[#e8e9e6]">
                Learning activity
              </h2>
              <p className="mt-1 text-[10px] text-[#788183]">
                Your quiz performance over time
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-[#292f31] bg-[#0b0d0e] p-1">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`rounded-md px-2.5 py-1.5 text-[10px] font-medium transition-colors ${timeRange === range
                    ? 'bg-[#28271f] text-[#d1b36b]'
                    : 'text-[#788183] hover:text-[#d6d9d5]'
                    }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[230px] w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-[11px] text-[#788183]">
                Loading activity...
              </div>
            ) : activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData}
                  margin={{ top: 8, right: 5, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c6a44e" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#c6a44e" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#252b2d"
                    strokeDasharray="3 5"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#788183', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    dy={9}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#788183', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />

                  <Tooltip content={<ChartTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#c6a44e"
                    strokeWidth={2}
                    fill="url(#activityGradient)"
                    activeDot={{
                      r: 4,
                      fill: '#c6a44e',
                      stroke: '#101314',
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <HiOutlineChartBar className="mb-2 size-6 text-[#596363]" />
                <p className="text-[11px] font-medium text-[#aab1ae]">
                  No activity yet
                </p>
                <p className="mt-1 text-[10px] text-[#788183]">
                  Complete a quiz to see your progress here.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Weak topics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="rounded-xl border border-[#292f31] bg-[#101314] p-4 sm:p-5"
        >
          <div className="mb-5">
            <h2 className="text-[13px] font-semibold text-[#e8e9e6]">
              Areas to improve
            </h2>
            <p className="mt-1 text-[10px] text-[#788183]">
              Topics that need more practice
            </p>
          </div>

          {loading ? (
            <div className="flex h-[230px] items-center justify-center text-[11px] text-[#788183]">
              Loading topics...
            </div>
          ) : weakTopics.length > 0 ? (
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weakTopics}
                  layout="vertical"
                  margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#252b2d"
                    horizontal={false}
                    strokeDasharray="3 5"
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: '#788183', fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="topic"
                    width={85}
                    tick={{ fill: '#aab1ae', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#ffffff08' }}
                    contentStyle={{
                      background: '#151a1b',
                      border: '1px solid #303738',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="#bda052"
                    radius={[0, 4, 4, 0]}
                    barSize={13}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[230px] flex-col items-center justify-center text-center">
              <HiOutlineTrophy className="mb-2 size-6 text-[#bda052]" />
              <p className="text-[11px] font-medium text-[#aab1ae]">
                Nothing to improve yet
              </p>
              <p className="mt-1 text-[10px] text-[#788183]">
                Your weak topics will appear here.
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Achievements */}
      <section className="rounded-xl border border-[#292f31] bg-[#101314] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[13px] font-semibold text-[#e8e9e6]">
              Achievements
            </h2>
            <p className="mt-1 text-[10px] text-[#788183]">
              Milestones earned along the way
            </p>
          </div>
          <span className="text-[10px] tabular-nums text-[#788183]">
            {badges.length} earned
          </span>
        </div>

        {loading ? (
          <p className="py-6 text-center text-[11px] text-[#788183]">
            Loading achievements...
          </p>
        ) : badges.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge, index) => (
              <motion.div
                key={`${badge.name}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-3 rounded-lg border border-[#252b2d] bg-[#131718] px-3 py-3 transition-colors hover:border-[#3a4141]"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#c6a44e]/15 bg-[#c6a44e]/[0.07] text-lg">
                  {badge.icon || '🏅'}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-[#dfe2dd]">
                    {badge.name}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-[#788183]">
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-7 text-center">
            <HiOutlineTrophy className="mx-auto mb-2 size-6 text-[#596363]" />
            <p className="text-[11px] text-[#aab1ae]">
              No achievements earned yet
            </p>
            <p className="mt-1 text-[10px] text-[#788183]">
              Keep learning to unlock your first achievement.
            </p>
          </div>
        )}
      </section>

      {/* Explore link */}
      <div className="flex justify-end">
        <Link
          to="/documents"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#bda052] transition-colors hover:text-[#e0bd69]"
        >
          Explore your documents
          <HiOutlineArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
