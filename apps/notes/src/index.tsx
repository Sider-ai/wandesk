import { useNotebook } from './lib/useNotebook';
import { IndexPane } from './components/IndexPane';
import { Sheet } from './components/Sheet';
import { DeleteModal } from './components/DeleteModal';
import './style.css';

// ════════════════════════════════════════════════════════════════════
//  Notebook — a skeuomorphic leather-bound notebook (leather cover · double-ring binding · multiple papers · ribbon bookmark · pen).
//  Opening: cover slowly opens → spread of open pages. Page turns have a curling flip animation.
//  This file only does assembly: state and logic live in lib/useNotebook, the view in components/, data in db.ts.
// ════════════════════════════════════════════════════════════════════

export default function Notes({ appId }: { appId: string }) {
  const nb = useNotebook(appId);
  const empty = nb.loaded && nb.pages.length === 0;

  return (
    <div className="nb-root">
      <div className="nb-desk-glow" aria-hidden />
      <div className={`nb-cover ${nb.opened ? 'opened' : ''}`}>
        {/* Cover (opens on entry, revealing the inner pages) */}
        <div className="nb-lid" aria-hidden>
          <div className="nb-lid-face">
            <div className="nb-lid-frame" />
            <div className="nb-lid-emblem">
              <span className="nb-lid-mono">✦</span>
              <span className="nb-lid-word">Notes</span>
              <span className="nb-lid-rule" />
            </div>
          </div>
          <div className="nb-lid-edge" />
        </div>

        <div className="nb-book">
          <IndexPane
            pages={nb.pages} activeId={nb.activeId} title={nb.title} body={nb.body} paper={nb.paper}
            loaded={nb.loaded} empty={empty} saving={nb.saving} savedPulse={nb.savedPulse} dirty={nb.dirty}
            onOpen={nb.openPage} onAdd={nb.addPage} onDelete={nb.setDeleteId}
          />

          {/* Spine: double-ring binding + pen */}
          <div className="nb-spine">
            <div className="nb-spiral" aria-hidden>
              {Array.from({ length: 16 }).map((_, i) => (<span key={i} className="nb-ring" />))}
            </div>
            <div className="nb-pen" aria-hidden>
              <span className="nb-pen-cap" /><span className="nb-pen-body" /><span className="nb-pen-grip" /><span className="nb-pen-nib" />
            </div>
          </div>

          <Sheet
            active={nb.active} title={nb.title} body={nb.body} paper={nb.paper} flip={nb.flip}
            cmd={nb.cmd} busy={nb.busy} cmdErr={nb.cmdErr}
            taRef={nb.taRef} titleRef={nb.titleRef} scrollRef={nb.scrollRef}
            onEdit={nb.edit} onCmdChange={(v) => { nb.setCmd(v); if (nb.cmdErr) nb.setCmdErr(''); }} onRunCommand={nb.runCommand}
          />

          {nb.deleteId != null && <DeleteModal onCancel={() => nb.setDeleteId(null)} onConfirm={nb.deletePage} />}
        </div>
      </div>
    </div>
  );
}
