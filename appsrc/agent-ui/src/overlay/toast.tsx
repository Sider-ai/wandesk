// 轻提示:一次一条,自己消失。
import { create } from 'zustand';

const useToast = create<{ text: string }>(() => ({ text: '' }));
let timer: ReturnType<typeof setTimeout> | undefined;

export function toast(text: string, ms = 1800) {
    clearTimeout(timer);
    useToast.setState({ text });
    timer = setTimeout(() => useToast.setState({ text: '' }), ms);
}

export function ToastHost() {
    const text = useToast((state) => state.text);
    if (!text) return null;
    return <div className="toast">{text}</div>;
}
