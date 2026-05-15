import { getConfig, saveConfig } from "../repository/config.js";
import { getState } from "../repository/state.js";
import { getTodayChange } from "../repository/equity.js";
import { parseNum } from "../repository/client.js";
import { fetchAccountTotalEq } from "../runtime/okx.js";
import { isBotExecuting } from "../runtime/index.js";
const getStatus = async () => {
  const cfg = getConfig();
  const state = getState();
  let equity = parseNum(cfg.current_equity);
  if (cfg.api_key && cfg.api_secret && cfg.passphrase) {
    try {
      const liveEq = await fetchAccountTotalEq(cfg);
      if (liveEq > 0) {
        equity = liveEq;
        saveConfig({ current_equity: liveEq });
      }
    } catch {
    }
  }
  const initialEq = parseNum(cfg.initial_equity, equity) || 1;
  const pnl = equity - initialEq;
  return {
    success: true,
    config: {
      base_url: cfg.base_url,
      api_key: cfg.api_key || "",
      api_secret: cfg.api_secret || "",
      passphrase: cfg.passphrase || "",
      has_keys: Boolean(cfg.api_key && cfg.api_secret && cfg.passphrase),
      goal: cfg.goal || "",
      interval_sec: cfg.interval_sec,
      updated_at: cfg.updated_at
    },
    state: {
      running: Boolean(state.running),
      executing: isBotExecuting(),
      tick_count: state.tick_count || 0,
      started_at: state.started_at,
      last_run_at: state.last_run_at,
      last_error: state.last_error || null,
      last_error_at: state.last_error_at || null
    },
    equity: {
      current: equity,
      initial: parseNum(cfg.initial_equity),
      pnl,
      pnl_ratio: pnl / initialEq,
      today_change: getTodayChange(equity)
    }
  };
};
export {
  getStatus
};
