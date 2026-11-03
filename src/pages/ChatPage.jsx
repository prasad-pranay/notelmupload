import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlinePaperAirplane, HiOutlineTrash, HiOutlineArrowLeft } from 'react-icons/hi2';
import api from '../api/axios.js';
import { useAuthStore } from '../store/authStore.js';

export default function ChatPage() {
  const { documentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef(null);
  const token = useAuthStore((s) => s.accessToken);

  const { data: doc } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => api.get(`/documents/${documentId}`).then((r) => r.data.data),
  });

  // Load chat history
  useEffect(() => {
    api.get(`/chat/history/${documentId}`).then((res) => {
      if (res.data.data?.length) setMessages(res.data.data);
    }).catch(() => {});
  }, [documentId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;
    const userMsg = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setStreaming(true);

    // Add placeholder for assistant response
    setMessages((prev) => [...prev, { role: 'assistant', content: '', timestamp: new Date() }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ documentId, message: userMsg.content }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line.replace('data: ', ''));
            if (parsed.type === 'chunk') {
              fullText += parsed.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullText };
                return updated;
              });
            }
            if (parsed.type === 'done') {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...updated[updated.length - 1], sources: parsed.sources };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: 'Error: Failed to get response. Is Ollama running?' };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  const clearChat = async () => {
    await api.delete(`/chat/history/${documentId}`).catch(() => {});
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <Link to={`/documents/${documentId}`} className="p-2 rounded-lg hover:bg-white/5 text-surface-400"><HiOutlineArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-lg font-semibold text-surface-100">Chat with Document</h1>
            <p className="text-xs text-surface-500">{doc?.title || 'Loading...'}</p>
          </div>
        </div>
        <button onClick={clearChat} className="p-2 rounded-lg hover:bg-red-500/10 text-surface-400 hover:text-red-400 transition" title="Clear history">
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-surface-300 font-medium">Ask anything about your document</p>
            <p className="text-sm text-surface-500 mt-1">AI will find relevant passages and answer your questions</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-primary-600/20 text-surface-200' : 'glass text-surface-300'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content || <span className="inline-flex gap-1"><span className="w-2 h-2 rounded-full bg-surface-400 animate-pulse-dot" /><span className="w-2 h-2 rounded-full bg-surface-400 animate-pulse-dot" style={{ animationDelay: '0.3s' }} /><span className="w-2 h-2 rounded-full bg-surface-400 animate-pulse-dot" style={{ animationDelay: '0.6s' }} /></span>}</div>
              {msg.sources?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-surface-500 mb-1">Sources:</p>
                  {msg.sources.map((s, j) => (
                    <p key={j} className="text-xs text-surface-600 truncate">📎 Chunk {s.chunkIndex} ({(s.score * 100).toFixed(0)}%)</p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 pt-4 border-t border-white/5">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
          <input id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your document..."
            className="flex-1 px-4 py-3 rounded-xl bg-surface-800/50 border border-white/10 text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition" disabled={streaming} />
          <button id="chat-send" type="submit" disabled={streaming || !input.trim()}
            className="px-4 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition disabled:opacity-40 disabled:cursor-not-allowed">
            <HiOutlinePaperAirplane className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
