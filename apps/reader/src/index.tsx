import { useReader } from './lib/useReader';
import { Shelf } from './components/Shelf';
import { ReaderView } from './components/ReaderView';
import './style.css';

/* ════════════════════════════════════════════════════
   Reader —— a pale birchwood bookcase in the morning light (iReader Birch).
   Home screen "shelf": pale birchwood bookcase, covers styled by genre;
   reader page: off-white paper, long-form single-column text,
   serif type, vermilion drop cap, "You chose:" vermilion annotation, choices scroll with the content.
   Each book maps to one engine session (native multi-turn continuation); rebuilt from
   stored pages if the session goes stale. Progress is fully persisted; reopening loads
   the whole book and stops at the decision point.
   This file only switches views; state and logic live in lib/useReader, data access in db.ts,
   persona/parsing in lib/story, views in components/.
   ════════════════════════════════════════════════════ */

export default function Reader({ appId }: { appId: string }) {
  const rd = useReader(appId);
  return rd.view === 'shelf' ? <Shelf rd={rd} /> : <ReaderView rd={rd} />;
}
