import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '../api/socket.js';
import { useAuthStore } from '../store/authStore.js';
import { 
  HiOutlineUsers, 
  HiOutlinePlay, 
  HiOutlineArrowRight, 
  HiOutlineTrophy,
  HiOutlineCheckCircle,
  HiOutlineXCircle
} from 'react-icons/hi2';

export default function LiveQuizHost() {
  const { joinCode } = useParams();
  const user = useAuthStore(s => s.user);
  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState('waiting'); // 'waiting', 'active', 'finished'
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [quizInfo, setQuizInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();
    socket.emit('join-session', { joinCode, userName: user.name, userId: user._id });

    socket.on('session-state', (state) => {
      setStatus(state.status);
      setParticipants(state.participants);
      setQuizInfo(state.quiz);
    });

    socket.on('participant-joined', (data) => {
      setParticipants(data.participants);
    });

    socket.on('quiz-started', (data) => {
      setStatus('active');
      setCurrentQuestion(data.question);
    });

    socket.on('new-question', (data) => {
      setCurrentQuestion(data.question);
    });

    socket.on('leaderboard-update', (data) => {
      setParticipants(data.leaderboard);
    });

    socket.on('quiz-finished', (data) => {
      setStatus('finished');
      setParticipants(data.leaderboard);
    });

    return () => {
      socket.off('session-state');
      socket.off('participant-joined');
      socket.off('quiz-started');
      socket.off('new-question');
      socket.off('leaderboard-update');
      socket.off('quiz-finished');
      socket.disconnect();
    };
  }, [joinCode, user]);

  const handleStart = () => {
    socket.emit('start-quiz', { joinCode });
  };

  const handleNext = () => {
    socket.emit('next-question', { joinCode });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-surface-800/30 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-black text-surface-100 tracking-tight">{quizInfo?.title || 'Live Quiz'}</h1>
          <div className="flex items-center gap-2 mt-1 text-surface-500 font-bold uppercase text-[10px] tracking-widest">
            <span className={status === 'active' ? 'text-green-400' : 'text-primary-400'}>{status}</span>
            <span className="w-1 h-1 bg-surface-700 rounded-full"></span>
            <span>{participants.length} Participants</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest mb-1">Join Code</p>
          <p className="text-4xl font-black text-primary-400 tracking-[0.2em] leading-none">{joinCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Main Control Area */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {status === 'waiting' && (
              <motion.div 
                key="waiting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center border border-white/10"
              >
                <div className="w-24 h-24 bg-primary-600/10 rounded-full flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20"></div>
                   <HiOutlineUsers className="w-12 h-12 text-primary-400" />
                </div>
                <h2 className="text-3xl font-black text-surface-100 mb-4">Waiting for Players...</h2>
                <p className="text-surface-500 max-w-md mb-12">Share the join code above with your participants. Once everyone is in, you can kick off the session!</p>
                
                <button 
                  onClick={handleStart}
                  disabled={participants.length === 0}
                  className="group flex items-center gap-3 px-12 py-5 rounded-2xl bg-primary-600 text-white text-xl font-black hover:bg-primary-500 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary-600/30 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <HiOutlinePlay className="w-6 h-6" />
                  START QUIZ
                </button>
              </motion.div>
            )}

            {status === 'active' && currentQuestion && (
              <motion.div 
                key="active"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-3xl p-8 border border-white/10 flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-8">
                   <span className="px-4 py-1.5 rounded-full bg-surface-800 text-surface-400 text-xs font-black tracking-widest uppercase">
                     Question {currentQuestion.index + 1} / {quizInfo?.numQuestions}
                   </span>
                   <div className="flex gap-1">
                      {[...Array(quizInfo?.numQuestions)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i <= currentQuestion.index ? 'bg-primary-500' : 'bg-surface-700'}`}></div>
                      ))}
                   </div>
                </div>

                <h2 className="text-3xl font-bold text-surface-100 mb-12 leading-tight">{currentQuestion.questionText}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  {currentQuestion.options.map((opt, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-surface-800/50 border border-white/5 flex items-center gap-4 group">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-surface-400 font-black group-hover:bg-primary-500/20 group-hover:text-primary-400 transition-all">
                         {String.fromCharCode(65 + i)}
                       </div>
                       <span className="text-surface-200 font-semibold">{opt}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="mt-12 group flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-white text-surface-950 text-xl font-black hover:bg-surface-200 transition-all active:scale-[0.98]"
                >
                  {currentQuestion.index + 1 === quizInfo?.numQuestions ? 'FINISH QUIZ' : 'NEXT QUESTION'}
                  <HiOutlineArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {status === 'finished' && (
              <motion.div 
                key="finished"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center border border-white/10"
              >
                <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-8">
                   <HiOutlineTrophy className="w-12 h-12 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-black text-surface-100 mb-4">Quiz Completed!</h2>
                <p className="text-surface-500 mb-12">The session has ended. Check out the final standings on the right.</p>
                
                <button 
                  onClick={() => navigate('/quizzes')}
                  className="px-12 py-5 rounded-2xl bg-surface-800 text-surface-100 text-xl font-black hover:bg-surface-700 transition-all active:scale-95 border border-white/5"
                >
                  CLOSE SESSION
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar: Leaderboard / Participants */}
        <div className="glass rounded-3xl border border-white/10 overflow-hidden flex flex-col h-full">
           <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-lg font-black text-surface-100 flex items-center gap-2">
                <HiOutlineTrophy className="text-yellow-400" />
                Leaderboard
              </h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {participants.length === 0 ? (
                <div className="text-center py-12 text-surface-600 font-bold uppercase text-[10px] tracking-widest">
                  No players yet
                </div>
              ) : (
                participants.map((p, i) => (
                  <motion.div 
                    key={p.name}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                      i === 0 ? 'bg-primary-600/20 border border-primary-500/20' : 'bg-surface-800/30 border border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                         i === 0 ? 'bg-primary-500 text-white' : 'bg-surface-700 text-surface-400'
                       }`}>
                         {i + 1}
                       </span>
                       <span className="font-bold text-surface-200">{p.name} {p.name === user.name && '(You)'}</span>
                    </div>
                    <span className="text-primary-400 font-black tracking-tight">{p.score} pts</span>
                  </motion.div>
                ))
              )}
           </div>

           <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <div className="flex items-center justify-between text-xs font-bold text-surface-500 uppercase tracking-widest">
                 <span>Syncing Active</span>
                 <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
