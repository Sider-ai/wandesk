import { db } from "./client.js";

const NOTEBOOK_SEEDS = [
  "Freeform Notes\n\nWrite down whatever comes to mind. Do not worry about structure.\nTap [Assist] at the bottom right and AI will use system context to finish, polish, or expand what you wrote.\n\nAIOS can also see what you write here.\nWhen you chat, it understands what you are thinking about and paying attention to,\nso its responses can feel more like they are truly for you.",
  "Even fragments are worth keeping\n\nIdeas do not wait for you to be ready.\nA single word, half a sentence, a thought you have not finished yet -\nthrow it in here first and do not worry about whether it is complete.\n\nSometimes when you look back a few weeks later,\nyou realize that one casual line you wrote down back then\nwas exactly the answer you need now.",
  "Things worth sitting with\n\nWhat kind of day does not feel empty when it ends?\nWhat is something only you can do?\nWhen do you feel most like yourself?\n\nYou do not have to answer right now.\nJust write it down and keep it."
];

const initNotebookTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL DEFAULT '',
      style INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
};

const seedNotebookIfEmpty = () => {
  const count = db.prepare("SELECT COUNT(*) as c FROM notes").get().c;
  if (count !== 0) return;
  const insert = db.prepare(`
    INSERT INTO notes (content, style, created_at, updated_at)
    VALUES (?, ?, datetime('now'), datetime('now'))
  `);
  for (const content of NOTEBOOK_SEEDS) {
    insert.run(content, Math.floor(Math.random() * 8));
  }
};

const initNotebookDatabase = () => {
  initNotebookTables();
  seedNotebookIfEmpty();
};

export {
  initNotebookDatabase
};
