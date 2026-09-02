// Zhajinhua — hand state and human actions live in this hook; the AI's turn is delegated to lib/aiTurn.
import { useCallback, useEffect, useRef, useState } from 'react';
import * as data from '../db';
import { evaluate, freshDeck } from './cards';
import {
  BASE_STAKE, BOT, MAX_RAISES, TABLE_STACK,
  placeBet, type FeedLine, type Phase, type Seat,
} from './game';
import { runAiTurn, type PokerCtx } from './aiTurn';
import { compare } from './cards';

let feedSeq = 0;

export function usePoker(appId: string) {
  const [chips, setChips] = useState(1000);
  const [record, setRecord] = useState({ win: 0, lose: 0 });
  const [seats, setSeats] = useState<Seat[]>([]);
  const [pot, setPot] = useState(0);
  const [stake, setStake] = useState(BASE_STAKE);
  const [turn, setTurn] = useState(0); // 0 = human, 1 = AI, -1 = no one (resolving)
  const [phase, setPhase] = useState<Phase>('idle');
  const [feed, setFeed] = useState<FeedLine[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [busyBank, setBusyBank] = useState(true);
  const [potFly, setPotFly] = useState<number | null>(null);
  const raisesRef = useRef(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const seatsRef = useRef<Seat[]>([]);
  seatsRef.current = seats;
  const stakeRef = useRef(BASE_STAKE);
  stakeRef.current = stake;
  const lastHumanActionRef = useRef<string>('');

  const human = seats.find((s) => s.isHuman);
  const ai = seats.find((s) => !s.isHuman);

  // ── persistence ──
  useEffect(() => {
    (async () => {
      const b = await data.loadBank(appId);
      setChips(b.chips);
      setRecord({ win: b.win, lose: b.lose });
      setBusyBank(false);
    })();
  }, [appId]);

  const saveChips = useCallback(async (next: number) => {
    setChips(next);
    await data.saveChips(appId, next);
  }, [appId]);

  useEffect(() => { feedRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' }); }, [feed, aiThinking]);

  const pushFeed = useCallback((line: Omit<FeedLine, 'id'>) => {
    setFeed((l) => [...l.slice(-60), { id: ++feedSeq, ...line }]);
  }, []);

  // ── settling a finished hand ──
  const settle = useCallback(async (finalSeats: Seat[], winId: number) => {
    const total = finalSeats.reduce((s, x) => s + x.bet, 0);
    setWinnerId(winId);
    setPhase('over');
    setTurn(-1);
    setAiThinking(false);
    setPotFly(winId);
    const win = finalSeats.find((s) => s.id === winId);
    const youWon = winId === 0;
    const you = finalSeats.find((s) => s.isHuman);
    setSeats((cur) => cur.map((s) => ({ ...s, mood: s.id === winId ? 'happy' : 'down' })));
    const remaining = you ? you.chips : 0;
    const youBet = you ? you.bet : 0;
    const finalWallet = remaining + (youWon ? total : 0);
    const delta = (youWon ? total : 0) - youBet;
    await saveChips(finalWallet);
    pushFeed(youWon
      ? { kind: 'result', text: `🏆 ${win ? win.name : 'Winner'} takes the pot of ${total}! (net +${delta})` }
      : { kind: 'result', text: `Hand over — ${win ? win.name : 'Opponent'} takes the pot of ${total}. (net ${delta})` });
    await data.insertStat(appId, youWon ? 'win' : 'lose', delta);
    setRecord((r) => (youWon ? { ...r, win: r.win + 1 } : { ...r, lose: r.lose + 1 }));
  }, [appId, saveChips, pushFeed]);

  // ── start a hand ──
  const deal = useCallback(async () => {
    if (busyBank) return;
    if (chips < BASE_STAKE) { pushFeed({ kind: 'sys', text: 'Not enough chips to cover the ante — hit "Reset" first.' }); return; }
    const deck = freshDeck();
    const ante = BASE_STAKE;
    const hCards = [deck[0], deck[1], deck[2]];
    const aCards = [deck[3], deck[4], deck[5]];
    const built: Seat[] = [
      { id: 0, name: 'You', emoji: '🧑', isHuman: true, cards: hCards, eval: evaluate(hCards), chips: chips - ante, bet: ante, peeked: true, folded: false, out: false, mood: 'idle' },
      { id: 1, name: BOT.name, emoji: BOT.emoji, isHuman: false, cards: aCards, eval: evaluate(aCards), chips: TABLE_STACK - ante, bet: ante, peeked: false, folded: false, out: false, mood: 'idle' },
    ];
    await saveChips(chips - ante); // human's ante comes out of the persisted bankroll
    setSeats(built);
    setPot(ante * 2);
    setStake(BASE_STAKE);
    setTurn(-1); setWinnerId(null); setPotFly(null); setAiThinking(false);
    raisesRef.current = 0;
    setFeed([]);
    setPhase('dealing');
    pushFeed({ kind: 'sys', text: `New hand · heads-up, each player antes ${ante}.` });
    window.setTimeout(() => {
      setPhase('playing');
      setTurn(0);
      pushFeed({ kind: 'sys', text: 'Cards are dealt — the hand begins.' });
      pushFeed({ kind: 'sys', text: 'Your turn — peek at your cards, or stay blind and call?' });
    }, 1100);
  }, [busyBank, chips, saveChips, pushFeed]);

  // pot derived for display
  useEffect(() => { if (phase !== 'idle') setPot(seats.reduce((s, x) => s + x.bet, 0)); }, [seats, phase]);

  // when it becomes the AI's turn, fire the agent-driven decision
  useEffect(() => {
    if (phase === 'playing' && turn === 1 && ai && !ai.folded && !ai.out && !aiThinking) {
      const ctx: PokerCtx = {
        appId, seatsRef, stakeRef, raisesRef, lastHumanActionRef,
        setSeats, setAiThinking, setStake, setPot, setTurn, pushFeed, settle,
      };
      const t = window.setTimeout(() => void runAiTurn(ctx), 420);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turn, ai?.id, ai?.folded, ai?.out]);

  // ── human actions ──
  const myTurn = phase === 'playing' && turn === 0 && !!human && !human.folded && !human.out;

  const onAllIn = useCallback(() => {
    if (!myTurn || !human || human.chips <= 0) return;
    const pay = seatsRef.current[0].chips;
    const updated = seatsRef.current.map((s, i) => (i === 0 ? { ...s, chips: 0, bet: s.bet + pay } : s));
    setSeats(updated);
    void saveChips(0);
    setStake(updated[0].bet);
    raisesRef.current += 1;
    lastHumanActionRef.current = `Goes all in for ${pay}`;
    pushFeed({ kind: 'you', who: 'You', action: 'allin', text: `Goes all in for ${pay}` });
    setTurn(1);
  }, [myTurn, human, saveChips, pushFeed]);

  const onFold = useCallback(() => {
    if (!myTurn) return;
    const arr = seatsRef.current.map((s) => (s.isHuman ? { ...s, folded: true } : s));
    setSeats(arr);
    pushFeed({ kind: 'you', who: 'You', text: 'You fold.', action: 'fold' });
    void settle(arr, arr.find((s) => !s.isHuman)!.id);
  }, [myTurn, pushFeed, settle]);

  const onCallOrRaise = useCallback((raise: boolean) => {
    if (!myTurn || !human) return;
    const cost = stake + (raise ? BASE_STAKE : 0);
    if (human.chips < Math.min(cost, stake)) { pushFeed({ kind: 'sys', text: 'You don\'t have enough chips left.' }); return; }
    const res = placeBet(seatsRef.current, 0, raise, stake);
    if (raise) raisesRef.current += 1;
    setSeats(res.updated);
    void saveChips(res.updated[0].chips); // human seat stack === wallet
    setStake(res.newStake);
    lastHumanActionRef.current = raise ? `Raises the call to ${res.newStake}` : `Calls ${res.pay}`;
    pushFeed({ kind: 'you', who: 'You', action: raise ? 'raise' : 'call', text: raise ? `You raise ${res.pay} (call is now ${res.newStake}).` : `You call ${res.pay}.` });
    setTurn(1);
  }, [myTurn, human, stake, pushFeed, saveChips]);

  const onShowdown = useCallback(() => {
    if (!myTurn || !human) return;
    const base = seatsRef.current;
    if (!base.find((s) => !s.isHuman)) return;
    const paid = placeBet(base, 0, false, stake);
    const me = paid.updated[0];
    void saveChips(me.chips);
    const oppP = paid.updated.find((s) => !s.isHuman)!;
    const cmp = compare(me.eval, oppP.eval);
    lastHumanActionRef.current = 'Calls for a showdown';
    pushFeed({ kind: 'you', who: 'You', text: 'You call for a showdown!', action: 'show' });
    const youWin = cmp > 0; // tie → challenger (you) loses
    const revealed = paid.updated.map((s) => ({ ...s, peeked: true }));
    setSeats(revealed);
    setPot(revealed.reduce((s, x) => s + x.bet, 0));
    void settle(revealed, youWin ? me.id : oppP.id);
  }, [myTurn, human, stake, pushFeed, saveChips, settle]);

  const onReset = useCallback(async () => {
    await data.resetBank(appId);
    setChips(1000); setRecord({ win: 0, lose: 0 });
    setSeats([]); setPhase('idle'); setPot(0); setFeed([]);
    setWinnerId(null); setPotFly(null); setAiThinking(false);
    pushFeed({ kind: 'sys', text: 'Reset — chips restored to 1000, record cleared.' });
  }, [appId, pushFeed]);

  const aiActive = phase === 'playing' && turn === 1;

  return {
    chips, record, seats, pot, stake, phase, feed, aiThinking, winnerId, busyBank, potFly,
    human, ai, myTurn, aiActive, raisesRef, feedRef,
    deal, onAllIn, onFold, onCallOrRaise, onShowdown, onReset,
  };
}

export type PokerState = ReturnType<typeof usePoker>;
