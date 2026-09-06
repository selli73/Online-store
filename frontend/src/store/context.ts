import { createContext, useContext } from 'react';
import { RootStore } from './RootStore';

export const store = new RootStore();

export const StoreContext = createContext<RootStore>(store);

export function useStore(): RootStore {
    return useContext(StoreContext);
}
