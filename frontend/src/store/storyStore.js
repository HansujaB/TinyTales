import { create } from 'zustand';

const useStoryStore = create((set) => ({
  currentStory: null,
  currentMoral: null,
  isGenerating: false,
  setCurrentStory: (story) => set({ currentStory: story }),
  setCurrentMoral: (moral) => set({ currentMoral: moral }),
  setIsGenerating: (val) => set({ isGenerating: val }),
  clearStory: () => set({ currentStory: null, currentMoral: null }),
}));

export default useStoryStore;
