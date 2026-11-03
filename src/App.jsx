import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import DocumentViewPage from './pages/DocumentViewPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import QuizGeneratorPage from './pages/QuizGeneratorPage.jsx';
import QuizzesPage from './pages/QuizzesPage.jsx';
import LiveQuizHost from './pages/LiveQuizHost.jsx';
import LiveQuizParticipant from './pages/LiveQuizParticipant.jsx';
import QuizAttemptPage from './pages/QuizAttemptPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import NoteBookPage from './pages/NoteBookPage.jsx';
import SolvePage from './pages/SolvePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useEffect, useState } from 'react';
import SplashScreen from './Splash.jsx';
import Landing1 from './pages/Landing1.jsx';
import AuthPage from './pages/AuthPage.jsx';
import api from './api/axios.js';
import toast from 'react-hot-toast';

// function ProtectedRoute({ children }) {
//   const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
//   console.log(isAuthenticated);
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [splash, setSplash] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setSplash(false)
    }, 0);
    // }, 4000);
  }, [])

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Welcome back!');
      navigate('/')
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return {
        success: false,
        redirectTo: "/login",
      };
    }
  };

  const handleSignup = async ({ name, email, password }) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Account created! Welcome to NoteLM.');
      navigate('/');
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return {
        success: false,
        redirectTo: "/register",
      };
    }
  };

  return (
    <>
      {splash ? <SplashScreen /> : <Routes>
        <Route path="/landing1" element={<LandingPage />} />
        <Route path="/landing" element={<Landing1 />} />
        <Route path="/splash" element={<SplashScreen />} />
        {
          !isAuthenticated && <>
            <Route path="/" element={<Landing1 />} />
            <Route path="/login1" element={<LoginPage />} />
            <Route path="/register1" element={<RegisterPage />} />
            <Route
              path="/login"
              element={<AuthPage mode="login" onSubmit={handleLogin} />}
            />

            <Route
              path="/register"
              element={<AuthPage mode="signup" onSubmit={handleSignup} />}
            />
            <Route path="*" element={<Landing1 />} />
          </>
        }
        {isAuthenticated &&
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="notebook" element={<NoteBookPage />} />
            <Route path="solve" element={<SolvePage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="documents/:id" element={<DocumentViewPage />} />
            <Route path="chat/:documentId" element={<ChatPage />} />
            <Route path="quiz/generate/:documentId?" element={<QuizGeneratorPage />} />
            <Route path="quizzes" element={<QuizzesPage />} />
            <Route path="quiz/:id/attempt" element={<QuizAttemptPage />} />
            <Route path="quiz/live/host/:joinCode" element={<LiveQuizHost />} />
            <Route path="quiz/live/join/:joinCode" element={<LiveQuizParticipant />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        }
      </Routes>}
    </>
  );
}
