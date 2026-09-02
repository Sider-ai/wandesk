// The starter cards live in the message area, while the input box lives in Composer —
// a draft seed carries text between them: clicking a card fills the input (without sending), cursor at the end.
import { create } from 'zustand';

export const useDraftSeed = create<{ text: string; seq: number }>(() => ({ text: '', seq: 0 }));

export const seedDraft = (text: string) => useDraftSeed.setState((state) => ({ text, seq: state.seq + 1 }));
