import { create } from 'zustand';
import api from '../api/axios.js';

export const useSolveStore = create((set, get) => ({
  questions: [],
  isLoading: false,
  isProcessing: false,
  error: null,
  
  config: {
    detailLevel: 'medium',
    style: 'paragraph',
    difficulty: 'exam',
    language: 'English',
    pageFormat: 'continuous',
    includeExtras: ['examples', 'summary'],
    pdf: {
      fontSize: 12,
      spacing: 1.5,
      margins: 20,
    }
  },

  setConfig: (updates) => set((state) => ({ 
    config: { ...state.config, ...updates } 
  })),

  processQuestions: async (file, manualText) => {
    set({ isProcessing: true, error: null });
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (manualText) formData.append('text', manualText);
      formData.append('config', JSON.stringify(get().config));

      // const res = await api.post('/solve/process', formData);
      const res = await api.post('/solve/process', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
      
      set({ questions: res.data.questions, isProcessing: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isProcessing: false });
    }
  },

  updateAnswer: (index, newAnswer) => {
    const newQuestions = [...get().questions];
    newQuestions[index].answer = newAnswer;
    set({ questions: newQuestions });
  },

  regenerateAnswer: async (index) => {
    const question = get().questions[index];
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append('text', question.question);
      formData.append('config', JSON.stringify(get().config));

      const res = await api.post('/solve/process', formData);
      const newQuestions = [...get().questions];
      newQuestions[index] = res.data.questions[0];
      set({ questions: newQuestions, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearSession: () => set({ questions: [], error: null }),
}));
