import { Sidebar } from './shell/Sidebar';
import { ConversationView } from './conversation';
import { ToastHost } from './overlay/toast';
import { Settings } from './shell/Settings';
import { useShell } from './shell/layout';
import { useEffect } from 'react';
import { init } from './conversation/store';

export function App() {
    const page = useShell((state) => state.page);
    useEffect(() => { void init(); }, []);
    return (
        <>
            <Sidebar />
            {page === 'settings' ? <Settings /> : <ConversationView />}
            <ToastHost />
        </>
    );
}
