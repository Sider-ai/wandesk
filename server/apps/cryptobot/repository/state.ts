import { db } from "./client.js";
const getState = () => {
  const row = db.prepare("SELECT * FROM cryptobot_state WHERE id = 1").get();
  if (!row) {
    db.prepare(`
      INSERT INTO cryptobot_state (id, running, tick_count, started_at, last_run_at, last_error, last_error_at, updated_at)
      VALUES (1, 0, 0, '', '', '', '', datetime('now'))
    `).run();
    return { id: 1, running: 0, tick_count: 0, started_at: "", last_run_at: "", last_error: "", last_error_at: "" };
  }
  return row;
};
const saveState = (patch: any = {}) => {
  const state = { ...getState(), ...patch };
  db.prepare(`
    UPDATE cryptobot_state
    SET running = ?, tick_count = ?, started_at = ?, last_run_at = ?,
        last_error = ?, last_error_at = ?, updated_at = datetime('now')
    WHERE id = 1
  `).run(state.running, state.tick_count, state.started_at, state.last_run_at, state.last_error, state.last_error_at);
  return getState();
};
export {
  getState,
  saveState
};
