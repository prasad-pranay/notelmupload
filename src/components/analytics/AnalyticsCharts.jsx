import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-semibold text-surface-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-white">
          {payload[0].value}{payload[0].name === 'score' ? '%' : ''}
        </p>
      </div>
    );
  }
  return null;
};

export function ActivityChart({ data }) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-dash-border)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-surface-500)', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-surface-500)', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary-500)', strokeWidth: 1 }} />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="var(--color-primary-500)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorActivity)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBarChart({ data }) {
  const colors = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#ef4444'];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="topic" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-surface-200)', fontSize: 12 }}
            width={100}
          />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<CustomTooltip />} />
          <Bar dataKey="averageScore" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.averageScore < 60 ? 'var(--color-danger)' : colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
