// 通用弹层:点蒙层关,Esc 关。一次只有一层,不管栈。
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
