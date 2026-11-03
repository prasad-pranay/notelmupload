import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineSparkles } from 'react-icons/hi2';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

export default function QuizGeneratorPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('mixed');
  const [types, setTypes] = useState(['mcq', 'truefalse', 'short']);

  const { data: doc } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => api.get(`/documents/${documentId}`).then((r) => r.data.data),
    enabled: !!documentId,
  });

  const genMut = useMutation({
    mutationFn: (payload) => api.post('/quiz/generate', payload),
    onSuccess: (res) => {
      toast.success('Quiz generated!');
      navigate(`/quizzes`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Generation failed'),
  });

  const handleGenerate = () => {
    genMut.mutate({ documentId, numQuestions, difficulty, types });
  };

  const toggleType = (t) => {
    setTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-surface-100 mb-1">Generate Quiz</h1>
        <p className="text-surface-400 text-sm">AI will create questions from your document content</p>
      </motion.div>

      {doc && (
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">📄</span>
          <div>
            <p className="font-medium text-surface-200">{doc.title}</p>
            <p className="text-xs text-surface-500">{doc.chunks?.length || 0} chunks • {doc.readableSize}</p>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-6 space-y-6">
        {/* Number of questions */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">Number of Questions</label>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((n) => (
              <button key={n} onClick={() => setNumQuestions(n)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${numQuestions === n ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'bg-surface-800/50 text-surface-400 border border-white/5 hover:border-white/10'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">Difficulty</label>
          <div className="flex gap-2">
            {['easy', 'medium', 'hard', 'mixed'].map((d) => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${difficulty === d ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'bg-surface-800/50 text-surface-400 border border-white/5 hover:border-white/10'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Question types */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">Question Types</label>
          <div className="flex gap-2">
            {[{ id: 'mcq', label: 'Multiple Choice' }, { id: 'truefalse', label: 'True/False' }, { id: 'short', label: 'Short Answer' }].map((t) => (
              <button key={t.id} onClick={() => toggleType(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${types.includes(t.id) ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'bg-surface-800/50 text-surface-400 border border-white/5 hover:border-white/10'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button id="generate-quiz-btn" onClick={handleGenerate} disabled={genMut.isPending || types.length === 0}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-primary-600 text-white font-semibold hover:from-purple-500 hover:to-primary-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20">
          <HiOutlineSparkles className="w-5 h-5" />
          {genMut.isPending ? 'Generating Quiz... (this takes a moment)' : 'Generate Quiz'}
        </button>
      </div>
    </div>
  );
}
