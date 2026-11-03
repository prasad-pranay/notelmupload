import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, GitBranchPlus } from 'lucide-react';
import loginIllustration from '../assets/login-illustration.png';
import LiquidEther from '../reactbits/LiquidEther.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0a0a0c] text-white">
      {/* Left Side - Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0d0d12] overflow-hidden z-10">
        <div className="absolute inset-0 z-0">
          <img
            // src={loginIllustration}
            src='/login.jpg'
            alt="Authentication Illustration"
            className="w-full h-full opacity-60 scale-100 hover:scale-100 transition-transform duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0c] via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center bg-[#12141C] border border-[#1e1f26] rounded-xl py-2 px-5 w-max"
          >
            <img src="/icon.png" alt="" className='h-10' />
            <span className="text-xl font-bold tracking-tight">NoteLM</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <h2 className="text-7xl leading-tight mb-6">
              Unlock the power of <span className="text-primary-400">AI-driven</span> learning.
            </h2>
            <p className="text-surface-400 text-sm">
              Your intelligent companion for notes, quizzes, and knowledge management.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-xs font-medium text-surface-500"
          >
            © 2026 NoteLM Inc. All rights reserved.
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 relative">
        <div className='absolute w-screen h-screen'>
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B497CF']}
            mouseForce={20}
            cursorSize={100}
            isViscous
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
            color0="#5227FF"
            color1="#FF9FFC"
            color2="#B497CF"
          />
        </div>
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8 relative z-10"
        >
          <div className="space-y-2">
            <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </motion.h1>
            <motion.p variants={itemVariants} className="text-surface-400">
              Please enter your details to sign in.
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-surface-300 ml-1">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-500 group-focus-within:text-primary-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="block w-full pl-12 pr-4 py-3 bg-surface-900/50 border border-white/5 rounded-2xl text-white placeholder-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 transition-all hover:bg-surface-900/80"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-surface-300">Password</label>
                <Link to="/forgot-password" title="Forgot Password" id="forgot-password"
                  className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-500 group-focus-within:text-primary-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-12 py-3 bg-surface-900/50 border border-white/5 rounded-2xl text-white placeholder-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 transition-all hover:bg-surface-900/80"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-surface-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a0c] px-4 text-surface-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-900/50 border border-white/5 rounded-2xl text-surface-200 font-semibold hover:bg-surface-800 transition-colors hover:text-white group">
                <GitBranchPlus className="w-5 h-5" />
                Sign in with Google
              </button>
            </div>

            <p className="text-center text-sm text-surface-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">
                Create an account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

