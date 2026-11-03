import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '../api/socket.js';
import { useAuthStore } from '../store/authStore.js';
import { 
  HiOutlineRocketLaunch,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineTrophy
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function LiveQuizParticipant() {
  const { joinCode } = useParams();
  const user = useAuthStore(s => s.user);
  const [status, setStatus] = useState('waiting');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null); // { isCorrect, points }
  const [quizInfo, setQuizInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [leaderboard, setLeaderboard] = useState([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();
    socket.emit('join-session', { joinCode, userName: user?.name || `Player_${Math.floor(Math.random()*1000)}`, userId: user?._id });

    socket.on('session-state', (state) => {
      setStatus(state.status);
      setQuizInfo(state.quiz);
      setLeaderboard(state.participants);
    });

    socket.on('quiz-started', (data) => {
      setStatus('active');
      startQuestion(data.question);
    });

    socket.on('new-question', (data) => {
      startQuestion(data.question);
    });

    socket.on('leaderboard-update', (data) => {
      setLeaderboard(data.leaderboard);
    });

    socket.on('quiz-finished', (data) => {
      setStatus('finished');
      setLeaderboard(data.leaderboard);
      clearInterval(timerRef.current);
    });

    socket.on('error', (err) => {
      toast.error(err.message);
      navigate('/quizzes');
    });

    return () => {
      socket.disconnect();
      clearInterval(timerRef.current);
    };
  }, [joinCode, user, navigate]);

  const startQuestion = (question) => {
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setFeedback(null);
    setTimeLeft(30);
    startTimeRef.current = Date.now();
    
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = (answer) => {
    if (hasAnswered || timeLeft === 0) return;
    
    setSelectedAnswer(answer);
    setHasAnswered(true);
    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    
    socket.emit('submit-answer', { joinCode, userName: user?.name, answer, timeTaken });
    
    // We don't get immediate feedback from server in this simple implementation to keep it fast, 
    // but the host reveals the flow. Actually, we can just show "Answer Submitted".
    toast.success('Answer submitted!');
  };

  const myRank = leaderboard.findIndex(p => p.name === user?.name) + 1;
  const myScore = leaderboard.find(p => p.name === user?.name)?.score || 0;

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-[90vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {status === 'waiting' && (
          <motion.div 
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="glass rounded-[3rem] p-12 text-center border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-primary-600 animate-pulse"></div>
            <div className="w-24 h-24 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
               <HiOutlineRocketLaunch className="w-12 h-12 text-primary-400 animate-bounce" />
            </div>
            <h1 className="text-3xl font-black text-surface-100 mb-4 tracking-tight">You're In!</h1>
            <p className="text-surface-500 mb-8 font-medium">Waiting for the host to start the quiz. Get ready!</p>
            
            <div className="bg-surface-800/50 rounded-2xl p-6 border border-white/5 inline-block min-w-[200px]">
               <p className="text-[10px] font-bold text-surface-600 uppercase tracking-[0.2em] mb-2">Your Profile</p>
               <p className="text-xl font-bold text-primary-400">{user?.name}</p>
            </div>

            <div className="mt-12 flex justify-center gap-2">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
               ))}
            </div>
          </motion.div>
        )}

        {status === 'active' && currentQuestion && (
          <motion.div 
            key="active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
          >
            {/* HUD */}
            <div className="flex items-center justify-between bg-surface-800/50 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-400 font-black">
                    {currentQuestion.index + 1}
                  </div>
                  <div className="text-left">
                     <p className="text-[10px] font-black text-surface-500 uppercase tracking-widest">Question</p>
                     <p className="text-sm font-bold text-surface-200">of {quizInfo?.numQuestions}</p>
                  </div>
               </div>

               <div className="flex flex-col items-center">
                  <div className={`flex items-center gap-2 text-2xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    <HiOutlineClock className="w-6 h-6" />
                    {timeLeft}s
                  </div>
                  <div className="w-32 h-1.5 bg-surface-700 rounded-full mt-2 overflow-hidden">
                     <motion.div 
                       initial={{ width: '100%' }}
                       animate={{ width: `${(timeLeft / 30) * 100}%` }}
                       className={`h-full ${timeLeft < 10 ? 'bg-red-500' : 'bg-primary-500'}`}
                     />
                  </div>
               </div>

               <div className="text-right">
                  <p className="text-[10px] font-black text-surface-500 uppercase tracking-widest">Your Rank</p>
                  <p className="text-xl font-black text-yellow-400">#{myRank}</p>
               </div>
            </div>

            {/* Question Card */}
            <div className="glass rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
               <h2 className="text-2xl font-bold text-surface-100 mb-10 text-center leading-tight">
                 {currentQuestion.questionText}
               </h2>

               <div className="grid gap-4">
                 {currentQuestion.options.map((opt, i) => (
                   <button
                     key={i}
                     onClick={() => handleAnswer(opt)}
                     disabled={hasAnswered || timeLeft === 0}
                     className={`w-full p-6 rounded-2xl text-left font-bold transition-all border-2 flex items-center justify-between group ${
                       selectedAnswer === opt
                         ? 'bg-primary-600/20 border-primary-500 text-primary-400'
                         : 'bg-surface-800/50 border-white/5 text-surface-300 hover:border-white/20'
                     } disabled:opacity-80`}
                   >
                     <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black transition-all ${
                          selectedAnswer === opt ? 'bg-primary-500 text-white' : 'bg-white/5 text-surface-500 group-hover:bg-white/10'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                     </div>
                     {selectedAnswer === opt && (
                        <HiOutlineCheckCircle className="w-6 h-6 animate-scale-in" />
                     )}
                   </button>
                 ))}
               </div>
            </div>

            {hasAnswered && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-center bg-white/5 p-4 rounded-2xl border border-white/5"
               >
                  <p className="text-primary-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                    Answer Locked. Waiting for Host...
                  </p>
               </motion.div>
            )}
          </motion.div>
        )}

        {status === 'finished' && (
          <motion.div 
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-[3rem] p-12 text-center border border-white/10 shadow-2xl"
          >
            <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
               <HiOutlineTrophy className="w-12 h-12 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-black text-surface-100 mb-2 tracking-tight">Final Score</h1>
            <p className="text-primary-400 text-6xl font-black mb-8 tracking-tighter">{myScore}</p>
            
            <div className="bg-surface-800/50 rounded-3xl p-8 border border-white/5 mb-10">
               <p className="text-sm font-bold text-surface-500 uppercase tracking-widest mb-2">Final Ranking</p>
               <p className="text-4xl font-black text-white">#{myRank}</p>
            </div>

            <button 
              onClick={() => navigate('/quizzes')}
              className="w-full py-5 rounded-2xl bg-white text-surface-950 text-xl font-black hover:bg-surface-200 transition-all active:scale-95 shadow-xl shadow-white/10"
            >
              EXIT SESSION
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
