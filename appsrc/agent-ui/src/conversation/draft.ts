// 起手卡在消息区,输入框在 Composer —— 中间用一粒草稿种子传话:
// 点卡片把文字填进输入框(不发送),光标落在尾部。
import { create } from 'zustand';

export const useDraftSeed = create<{ text: string; seq: number }>(() => ({ text: '', seq: 0 }));

export const seedDraft = (text: string) => useDraftSeed.setState((state) => ({ text, seq: state.seq + 1 }));
