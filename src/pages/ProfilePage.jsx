import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore.js';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  FileText,
  Puzzle,
  Award,
  Activity
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfileData } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ? `http://localhost:5000${user.avatar}` : null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (name !== user.name) formData.append('name', name);
      if (password) formData.append('password', password);
      if (avatarFile) formData.append('avatar', avatarFile);

      // Only send if there's something to update
      if (formData.entries().next().done) {
        toast.success('Profile is up to date.');
        setIsSubmitting(false);
        return;
      }

      await updateProfileData(formData);
      toast.success('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: 'Documents Uploaded', value: user?.stats?.documentsUploaded || 0, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Quizzes Created', value: user?.stats?.quizzesCreated || 0, icon: Puzzle, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { label: 'Quizzes Taken', value: user?.stats?.quizzesAttempted || 0, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Total Score', value: user?.stats?.totalScore || 0, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-[1200px] mx-auto text-[var(--text-main)]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-[var(--text-muted)] mt-2">Manage your account settings and view your learning statistics.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Settings Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 md:p-8 rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-main)] relative overflow-hidden">
              <form onSubmit={handleSaveProfile} className="space-y-6">

                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[var(--border-main)]">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--border-main)] bg-[var(--bg-main)] flex items-center justify-center">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-[var(--text-muted)]" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold">Profile Picture</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Upload a new avatar. Max size 5MB.</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--text-muted)]">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl py-3 pl-12 pr-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--text-muted)]">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl py-3 pl-12 pr-4 text-sm opacity-50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-main)]">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--text-muted)]">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl py-3 pl-12 pr-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                          placeholder="Leave blank to keep current"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--text-muted)]">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl py-3 pl-12 pr-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Stats Column */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Your Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="p-5 rounded-[1.5rem] bg-[var(--bg-card)] border border-[var(--border-main)] flex flex-col items-start gap-4 hover:border-white/10 transition-all group">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold tracking-tight">{stat.value}</h4>
                    <p className="text-xs font-medium text-[var(--text-muted)] mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-[1.5rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-indigo-400">Total Points</h3>
                <Award className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-4xl font-black text-[var(--text-main)]">{user?.points || 0}</p>
              <p className="text-xs text-indigo-400/60 mt-2 font-bold uppercase tracking-wider">Keep learning to earn more!</p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
