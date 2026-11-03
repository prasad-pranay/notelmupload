import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineSparkles, 
  HiOutlineListBullet, 
  HiOutlineRectangleStack,
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlineArrowDownTray,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineCpuChip,
  HiOutlineAcademicCap
} from 'react-icons/hi2';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function DocumentViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [subTab, setSubTab] = useState('content');

  const { data: doc, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: () => api.get(`/documents/${id}`).then((r) => r.data.data),
  });

  const deleteMut = useMutation({
    mutationFn: () => api.delete(`/documents/${id}`),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['documents'] }); 
      toast.success('Asset purged'); 
      navigate('/documents');
    },
  });

  if (isLoading) return (
    <div className="h-full flex flex-col items-center justify-center bg-[var(--bg-main)]">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-8" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] animate-pulse">Syncing Context...</p>
    </div>
  );

  if (!doc) return (
    <div className="h-full flex flex-col items-center justify-center bg-[var(--bg-main)] p-12 text-center">
       <h3 className="text-2xl font-black italic mb-6">Asset Missing.</h3>
       <Link to="/documents" className="text-[10px] font-black text-primary-500 hover:underline uppercase tracking-widest flex items-center gap-2">
          <HiOutlineArrowLeft size={14}/> Back to Archives
       </Link>
    </div>
  );

  const tabs = [
    { id: 'content', label: 'Reader', icon: HiOutlineEye },
    { id: 'summary', label: 'Summary', icon: HiOutlineListBullet },
    { id: 'keypoints', label: 'Insights', icon: HiOutlineSparkles },
    { id: 'recall', label: 'Recall', icon: HiOutlineRectangleStack },
  ];

  return (
    <div className="h-full flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden">
      
      {/* Workspace Header */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-main)] px-8 pt-8 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
           <div className="flex items-center gap-6">
              <Link to="/documents" className="p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-primary-500 transition-all">
                <HiOutlineArrowLeft size={20}/>
              </Link>
              <div className="space-y-1">
                <h1 className="text-xl font-black italic tracking-tight">{doc.title}</h1>
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">{doc.fileType} • {doc.readableSize}</p>
              </div>
           </div>

           <nav className="flex items-center gap-1 bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-main)] mb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSubTab(tab.id)}
                  className={`
                    px-6 py-2 rounded-lg flex items-center gap-2 transition-all text-[9px] font-black uppercase tracking-widest
                    ${subTab === tab.id ? 'bg-primary-600/10 text-primary-500 shadow-inner' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}
                  `}
                >
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
                </button>
              ))}
           </nav>

           <div className="flex items-center gap-2 pb-4">
              <Link to={`/chat/${doc._id}`} className="p-3 text-[var(--text-muted)] hover:text-primary-500 rounded-2xl transition-all">
                <HiOutlineChatBubbleLeftRight size={20}/>
              </Link>
              <button onClick={() => deleteMut.mutate()} className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                <HiOutlineTrash size={20}/>
              </button>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={subTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {subTab === 'content' && (
                <div className="space-y-12">
                   <div className="flex flex-wrap gap-8 py-6 border-y border-[var(--border-main)]">
                      {[
                        { label: 'Volume', val: doc.readableSize },
                        { label: 'Ingested', val: new Date(doc.createdAt).toLocaleDateString() },
                        { label: 'Status', val: doc.embeddingStatus, accent: true }
                      ].map(stat => (
                        <div key={stat.label} className="space-y-1">
                          <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">{stat.label}</p>
                          <p className={`text-xs font-bold ${stat.accent ? 'text-primary-500' : 'text-[var(--text-main)]'}`}>{stat.val}</p>
                        </div>
                      ))}
                   </div>
                   <article className="prose prose-invert max-w-none text-lg leading-relaxed text-[var(--text-main)] font-serif opacity-90 p-10 bg-[var(--bg-card)] rounded-[3rem] border border-[var(--border-main)] shadow-inner">
                      <ReactMarkdown>{doc.extractedText || 'Transcription unavailable.'}</ReactMarkdown>
                   </article>
                </div>
              )}

              {subTab === 'summary' && <ToolView type="summary" docId={doc._id} title="Semantic Summary" icon={HiOutlineListBullet}/>}
              {subTab === 'keypoints' && <ToolView type="keypoints" docId={doc._id} title="Core Insights" icon={HiOutlineSparkles}/>}
              {subTab === 'recall' && <ToolView type="flashcards" docId={doc._id} title="Active Recall" icon={HiOutlineRectangleStack}/>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Global Actions */}
      <div className="fixed bottom-12 right-12 flex flex-col gap-3">
         <Link to={`/quiz/generate/${doc._id}`} className="flex items-center gap-3 px-6 py-3 bg-primary-600 text-white rounded-full shadow-2xl hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest">
            <HiOutlineAcademicCap size={18}/>
            <span>Generate Quiz</span>
         </Link>
         <button className="flex items-center gap-3 px-6 py-3 bg-[var(--text-main)] text-[var(--bg-main)] rounded-full shadow-2xl hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest">
            <HiOutlineArrowDownTray size={18}/>
            <span>Export Record</span>
         </button>
      </div>
    </div>
  );
}

function ToolView({ type, docId, title, icon: Icon }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/ai/${type}`, { documentId: docId });
      setData(res.data.data);
      toast.success(`${title} Ready`);
    } catch (err) {
      toast.error('AI Module failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-main)]">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                <Icon size={32}/>
             </div>
             <div>
                <h3 className="text-xl font-black tracking-tight">{title}</h3>
                <p className="text-xs text-[var(--text-muted)]">Leverage neural context to extract intelligence.</p>
             </div>
          </div>
          <button 
            onClick={handleAction}
            disabled={loading}
            className="px-8 py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20 disabled:opacity-30 hover:bg-primary-500 transition-all"
          >
            {loading ? 'Analyzing Context...' : 'Run Module'}
          </button>
       </div>

       <AnimatePresence>
         {data && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="p-10 bg-[var(--bg-card)] rounded-[3rem] border border-[var(--border-main)] shadow-inner"
           >
             <div className="prose prose-invert max-w-none text-lg leading-relaxed text-[var(--text-main)] font-serif opacity-90">
                {type === 'summary' && <ReactMarkdown>{data.summary}</ReactMarkdown>}
                {type === 'keypoints' && (
                  <ul className="space-y-4 list-none p-0">
                    {data.keyPoints.map((kp, i) => (
                      <li key={i} className="flex gap-4">
                         <span className="text-primary-500 font-black text-xl">/</span>
                         <span className="mt-1">{kp}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {type === 'flashcards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.flashcards.map((card, i) => (
                      <div key={i} className="p-6 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-main)] space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary-500">Question {i + 1}</p>
                        <p className="text-sm font-bold italic">"{card.front}"</p>
                      </div>
                    ))}
                  </div>
                )}
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
