import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import LiquidEther from '../reactbits/LiquidEther.jsx';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation states
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  // Password strength logic
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  // Password match logic
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  // Email validation logic
  useEffect(() => {
    if (email) {
      setIsEmailValid(/\S+@\S+\.\S+/.test(email));
    } else {
      setIsEmailValid(true);
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordStrength < 2) {
      toast.error('Please choose a stronger password');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Account created! Welcome to NoteLM.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-surface-700';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0a0a0c] text-white">
      {/* Left Side - Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0d0d12] overflow-hidden z-10 border-r border-white/5">
        <div className="absolute inset-0 z-0">
          <img
            src="/register-illustration.png" // Using the generated illustration path (renamed for convenience)
            alt="Registration Illustration"
            className="w-full h-full object-cover opacity-60 scale-100 hover:scale-105 transition-transform duration-2000 ease-in-out"
            onError={(e) => {
              // Fallback if the specific name isn't linked yet
              e.target.src = '/login.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0c] via-transparent to-transparent opacity-90" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center bg-[#12141C]/80 backdrop-blur-md border border-white/5 rounded-2xl py-3 px-6 w-max shadow-2xl"
          >
            <img src="/icon.png" alt="NoteLM Logo" className='h-8 w-8' />
            <span className="ml-3 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">NoteLM</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-6xl font-bold leading-tight mb-6 tracking-tight">
              Join the <span className="text-primary-400">Future</span> of Learning.
            </h2>
            <p className="text-surface-400 text-lg max-w-md leading-relaxed">
              Create your account today and experience AI-powered note-taking, automated quizzes, and intelligent insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xs font-medium text-surface-500 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>End-to-end encrypted knowledge management</span>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 relative overflow-y-auto">
        <div className='absolute inset-0 z-0 opacity-40 pointer-events-none'>
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B497CF']}
            mouseForce={15}
            cursorSize={80}
            isViscous
            viscous={40}
            autoDemo
            autoSpeed={0.4}
          />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8 relative z-10"
        >
          <div className="space-y-2">
            <motion.h1 variants={itemVariants} className="text-4xl font-bold tracking-tight text-white">
              Create your account
            </motion.h1>
            <motion.p variants={itemVariants} className="text-surface-400">
              Start your journey with NoteLM in seconds.
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-medium text-surface-300 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-500 group-focus-within:text-primary-400 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="block w-full pl-12 pr-4 py-3.5 bg-surface-900/40 border border-white/5 rounded-2xl text-white placeholder-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 transition-all hover:bg-surface-900/60 backdrop-blur-sm"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} className="space-y-1.5">
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
                  placeholder="name@example.com"
                  className={`block w-full pl-12 pr-4 py-3.5 bg-surface-900/40 border border-white/5 rounded-2xl text-white placeholder-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 transition-all hover:bg-surface-900/60 backdrop-blur-sm ${!isEmailValid ? 'border-red-500/50' : ''}`}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-medium text-surface-300 ml-1">Password</label>
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
                  className="block w-full pl-12 pr-12 py-3.5 bg-surface-900/40 border border-white/5 rounded-2xl text-white placeholder-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 transition-all hover:bg-surface-900/60 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-surface-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div className="px-1 pt-1">
                  <div className="flex gap-1 h-1.5 mb-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`flex-1 rounded-full transition-colors duration-500 ${
                          passwordStrength >= step ? getStrengthColor() : 'bg-surface-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
                    Strength: <span className={passwordStrength > 0 ? 'text-primary-400' : ''}>{getStrengthLabel()}</span>
                  </span>
                </div>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-medium text-surface-300 ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-500 group-focus-within:text-primary-400 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`block w-full pl-12 pr-12 py-3.5 bg-surface-900/40 border border-white/5 rounded-2xl text-white placeholder-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 transition-all hover:bg-surface-900/60 backdrop-blur-sm ${!passwordsMatch ? 'border-red-500/50' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-surface-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!passwordsMatch && (
                <span className="text-[10px] text-red-500 font-medium ml-1">Passwords do not match</span>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                disabled={loading || !passwordsMatch || (password.length > 0 && passwordStrength < 2)}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="pt-4 flex flex-col items-center">
            <p className="text-surface-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-auto pt-8 text-[10px] text-surface-600 uppercase tracking-widest text-center"
        >
          By joining, you agree to our <Link to="/terms" className="hover:text-surface-400">Terms</Link> & <Link to="/privacy" className="hover:text-surface-400">Privacy Policy</Link>
        </motion.div>
      </div>
    </div>
  );
}

