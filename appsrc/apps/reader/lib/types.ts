// 阅读 — 类型定义。
export type BookRow = {
  id: number;
  title: string;
  premise: string;
  conversation_id: string | null;
  status: string;
  updated_at: string;
};
// 一页:叙事 + 玩家走出的行动 + 这一页给出的待选项(用于恢复抉择点)
export type Page = { idx: number; narrative: string; chosen: string; choices: string[] };
export type Turn = { narrative: string; choices: string[]; title?: string };

// 题材体裁 —— 每一种一款封面版式。
export type Genre = 'cyberpunk' | 'wuxia' | 'apocalypse' | 'gothic' | 'scifi' | 'fantasy' | 'classic';

// 预置故事(书架上的成书,点封面即开局)。
export type Preset = {
  key: string;
  title: string;
  tagline: string;
  icon: string;
  genre: Genre;
  premise: string;
};
