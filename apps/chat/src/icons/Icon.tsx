// 自绘的极简线性图标。统一 24 视窗 / 1.8 描边 / 圆头,颜色随 currentColor。
import type { ReactNode } from 'react';

const GLYPHS: Record<string, ReactNode> = {
    /** 新对话:方框 + 落笔 */
    compose: (<>
        <path d="M12 4.5H6.7A2.7 2.7 0 0 0 4 7.2v10.1A2.7 2.7 0 0 0 6.7 20h10.1a2.7 2.7 0 0 0 2.7-2.7V12" />
        <path d="M17.8 3.9a2 2 0 0 1 2.8 2.8l-7.6 7.6-3.6.8.8-3.6z" />
    </>),
    /** 侧栏开关:面板 */
    panel: (<>
        <rect x="3.5" y="4.8" width="17" height="14.4" rx="2.6" />
        <path d="M9.6 4.8v14.4" />
    </>),
    /** 发送:上箭头 */
    send: (<>
        <path d="M12 19V5.6" />
        <path d="M6.2 11.2 12 5.4l5.8 5.8" />
    </>),
    /** 停止:实心圆角方块 */
    stop: <rect x="6.6" y="6.6" width="10.8" height="10.8" rx="2.4" fill="currentColor" stroke="none" />,
    plus: (<>
        <path d="M12 5.2v13.6" />
        <path d="M5.2 12h13.6" />
    </>),
    /** 展开:右尖号 */
    chev: <path d="m9.2 5.8 6.2 6.2-6.2 6.2" />,
    /** bash:终端 */
    terminal: (<>
        <rect x="3.5" y="4.8" width="17" height="14.4" rx="2.6" />
        <path d="m7.2 9.3 3 2.7-3 2.7" />
        <path d="M12.8 15h4" />
    </>),
    /** read:折角文档 */
    doc: (<>
        <path d="M13.6 3.6H8a2.2 2.2 0 0 0-2.2 2.2v12.4A2.2 2.2 0 0 0 8 20.4h8a2.2 2.2 0 0 0 2.2-2.2V8.2z" />
        <path d="M13.6 3.6v4.6h4.6" />
        <path d="M9 12.6h6M9 15.8h4" />
    </>),
    /** write / edit:笔 */
    pen: <path d="M16.9 4.1a2.4 2.4 0 0 1 3.4 3.4l-9.8 9.8-4.6 1.2 1.2-4.6z" />,
    /** 思考:四芒星 */
    spark: <path d="M12 3.8l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1-5.1-1.9 5.1-1.9z" />,
    /** 置顶:图钉 */
    pin: (<>
        <path d="M14.8 3.8 20 9l-4.2 1.2-3 5.6-2.3-2.3-2.3-2.3 5.6-3z" />
        <path d="m10.4 13.6-5 5" />
    </>),
    pinFill: (<>
        <path d="M14.8 3.8 20 9l-4.2 1.2-3 5.6-2.3-2.3-2.3-2.3 5.6-3z" fill="currentColor" />
        <path d="m10.4 13.6-5 5" />
    </>),
    trash: (<>
        <path d="M4.8 7h14.4" />
        <path d="M9.6 7V5.2a1.2 1.2 0 0 1 1.2-1.2h2.4a1.2 1.2 0 0 1 1.2 1.2V7" />
        <path d="m6.6 7 .8 12h9.2l.8-12" />
        <path d="M10.2 10.6v5M13.8 10.6v5" />
    </>),
    copy: (<>
        <rect x="9" y="9" width="11" height="11" rx="2.2" />
        <path d="M15 5.4H7.2A2.2 2.2 0 0 0 5 7.6v7.8" />
    </>),
    check: <path d="m5 12.6 4.4 4.4L19 7.4" />,
    folder: <path d="M3.8 7.4a2.2 2.2 0 0 1 2.2-2.2h3.7l2.1 2.5h6.2a2.2 2.2 0 0 1 2.2 2.2v7.5a2.2 2.2 0 0 1-2.2 2.2H6a2.2 2.2 0 0 1-2.2-2.2z" />,
    sun: (<>
        <circle cx="12" cy="12" r="3.7" />
        <path d="M12 3.2v2M12 18.8v2M3.2 12h2M18.8 12h2M5.8 5.8l1.4 1.4M16.8 16.8l1.4 1.4M18.2 5.8l-1.4 1.4M7.2 16.8l-1.4 1.4" />
    </>),
    moon: <path d="M19.8 13.7A7.8 7.8 0 0 1 10.3 4.2a7.1 7.1 0 1 0 9.5 9.5z" />,
    /** 跟随系统:半染的圆 */
    auto: (<>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none" />
    </>),
    x: <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />,
    settings: (<>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 3.6v2M12 18.4v2M3.6 12h2M18.4 12h2M6.1 6.1l1.4 1.4M16.5 16.5l1.4 1.4M17.9 6.1l-1.4 1.4M7.5 16.5l-1.4 1.4" />
    </>),
};

export type IconName = keyof typeof GLYPHS;

export function Icon({ name, size = 16 }: { name: IconName | string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            {GLYPHS[name] || null}
        </svg>
    );
}

/** 品牌标:圆角方块里一枚提示符。空状态和侧栏共用。 */
export function Mark({ size = 26 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
            <defs>
                <linearGradient id="mark-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#4b83f2" />
                    <stop offset="1" stopColor="#1d52c8" />
                </linearGradient>
            </defs>
            <rect x="2" y="2" width="28" height="28" rx="8.5" fill="url(#mark-g)" />
            <path
                d="m11 11 5.4 5-5.4 5M18.6 21.4h4"
                fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            />
        </svg>
    );
}
