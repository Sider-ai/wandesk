// Reader — type definitions.
export type BookRow = {
  id: number;
  title: string;
  premise: string;
  conversation_id: string | null;
  status: string;
  updated_at: string;
};
// One page: narrative + the action the player took to leave it + the pending choices offered on this page (used to restore a decision point)
export type Page = { idx: number; narrative: string; chosen: string; choices: string[] };
export type Turn = { narrative: string; choices: string[]; title?: string };

// Genre — each one gets its own cover style.
export type Genre = 'cyberpunk' | 'wuxia' | 'apocalypse' | 'gothic' | 'scifi' | 'fantasy' | 'classic';

// Preset story (a finished book on the shelf; clicking the cover starts it).
export type Preset = {
  key: string;
  title: string;
  tagline: string;
  icon: string;
  genre: Genre;
  premise: string;
};
