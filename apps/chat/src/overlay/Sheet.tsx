// Generic overlay sheet: click the backdrop to close, Esc to close. Only one layer at a time, no stack.
import { useEffect, type ReactNode } from 'react';

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className="veil" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <div className="sheet">
                <div className="sheet-title">{title}</div>
                {children}
            </div>
        </div>
    );
}
