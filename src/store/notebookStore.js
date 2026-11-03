import { create } from 'zustand';
import api from '../api/axios.js';

export const useNotebookStore = create((set, get) => ({
  notebook: null,
  sources: [],
  activeSource: null,
  generatedContent: null,
  chatHistory: [],
  isLoading: false,
  error: null,

  fetchNotebook: async (id) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/notebooks/${id}`);
      set({ notebook: res.data, sources: res.data.sources, isLoading: false });
      
      // Select first source by default if none selected
      if (res.data.sources.length > 0 && !get().activeSource) {
        set({ activeSource: res.data.sources[0] });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrCreateDefaultNotebook: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/notebooks`);
      
      if (res.data.length > 0) {
        await get().fetchNotebook(res.data[0]._id);
      } else {
        const createRes = await api.post(`/notebooks`, { title: 'My Workspace' });
        set({ notebook: createRes.data, sources: [], isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addSource: async (formData) => {
    const { notebook } = get();
    if (!notebook) return;

    set({ isLoading: true });
    try {
      const res = await api.post(`/notebooks/${notebook._id}/sources`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      set(state => ({ 
        sources: [...state.sources, res.data],
        isLoading: false 
      }));
      return res.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addLinkSource: async (type, url) => {
    const { notebook } = get();
    if (!notebook) return;

    set({ isLoading: true });
    try {
      const res = await api.post(`/notebooks/${notebook._id}/sources`, { type, url });
      set(state => ({ 
        sources: [...state.sources, res.data],
        isLoading: false 
      }));
      return res.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addTextSource: async (title, text) => {
    const { notebook } = get();
    if (!notebook) return;

    set({ isLoading: true });
    try {
      const res = await api.post(`/notebooks/${notebook._id}/sources`, { type: 'text', title, text });
      set(state => ({ 
        sources: [...state.sources, res.data],
        isLoading: false 
      }));
      return res.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteSource: async (sourceId) => {
    const { notebook } = get();
    if (!notebook) return;

    try {
      await api.delete(`/notebooks/${notebook._id}/sources/${sourceId}`);
      set(state => ({ 
        sources: state.sources.filter(s => s._id !== sourceId),
        activeSource: state.activeSource?._id === sourceId ? null : state.activeSource
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  setActiveSource: (source) => set({ activeSource: source, generatedContent: null }),

  generateMaterial: async (type) => {
    const { notebook } = get();
    if (!notebook) return;

    set({ isLoading: true, generatedContent: null, activeSource: null });
    try {
      const res = await api.post(`/notebooks/${notebook._id}/generate-study-material`, { type });
      set({ 
        generatedContent: { type, response: res.data.response }, 
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearGeneratedContent: () => set({ generatedContent: null }),

  sendMessage: async (message) => {
    const { notebook, chatHistory } = get();
    if (!notebook) return;

    const userMsg = { role: 'user', content: message };
    set(state => ({ 
      chatHistory: [...state.chatHistory, userMsg],
      isLoading: true 
    }));

    try {
      const res = await api.post(`/notebooks/${notebook._id}/chat`, {
        message,
        history: chatHistory.map(m => ({ role: m.role, content: m.content }))
      });

      const assistantMsg = { 
        role: 'assistant', 
        content: res.data.response,
        sources: res.data.sources 
      };
      
      set(state => ({ 
        chatHistory: [...state.chatHistory, assistantMsg],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearChat: () => set({ chatHistory: [] }),
}));
