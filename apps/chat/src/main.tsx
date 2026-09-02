import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/tokens.css';
import './styles/base.css';
import './shell/shell.css';
import './conversation/conversation.css';
import './styles/touch.css'; // Keep last: it needs to override each module's font sizes

import { App } from './App';
import { initTheme } from './lib/theme';

initTheme();

createRoot(document.getElementById('app')!).render(
    <StrictMode><App /></StrictMode>,
);
