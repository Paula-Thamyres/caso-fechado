import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { progressStorage, tutorialStorage } from './compositionRoot';
import { allCases } from './data/cases';
import './index.css';
import { App } from './presentation/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento raiz não encontrado no index.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App cases={allCases} progressStorage={progressStorage} tutorialStorage={tutorialStorage} />
  </StrictMode>,
);
