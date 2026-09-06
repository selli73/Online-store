import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { store, StoreContext } from './store/context';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StoreContext.Provider value={store}>
            <App />
        </StoreContext.Provider>
    </StrictMode>,
);
