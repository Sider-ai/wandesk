import { useEffect, useState } from 'react';

import { api } from '../lib/api';
import { toast } from '../overlay/toast';
import { Icon } from '../icons/Icon';
import { useShell } from './layout';
import { cycleTheme, useTheme } from '../lib/theme';
import { loadMeta } from '../conversation/store';

type DriverId = 'responses' | 'chat';

interface SettingsValue {
    driver: DriverId;
    responsesUrl: string;
    apiKey: string;
    model: string;
    instructions: string;
}

/** 和 ai/drivers/ 里的两个驱动一一对应。placeholder 直接给出各自的典型地址,
 *  免得选了 chat 还照着 Responses 的样子填。 */
const DRIVERS: { id: DriverId; label: string; hint: string; urlLabel: string; placeholder: string }[] = [
    {
        id: 'responses', label: 'Responses API', hint: 'OpenAI 的 Responses 协议',
        urlLabel: 'Responses 地址', placeholder: 'https://api.openai.com/v1/responses',
    },
    {
        id: 'chat', label: 'Chat Completions', hint: '只有 /chat/completions 的服务，例如 GLM',
        urlLabel: 'Chat Completions 地址', placeholder: 'https://api.z.ai/api/paas/v4/chat/completions',
    },
];

const EMPTY: SettingsValue = { driver: 'responses', responsesUrl: '', apiKey: '', model: '', instructions: '' };

export function Settings() {
    const [value, setValue] = useState(EMPTY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const theme = useTheme((state) => state.mode);
    const shell = useShell();

    useEffect(() => {
        void api.get<{ settings: Partial<SettingsValue> }>('/api/settings')
            .then((result) => setValue({ ...EMPTY, ...result.settings }))
            .catch((error) => toast(error instanceof Error ? error.message : '设置加载失败'))
            .finally(() => setLoading(false));
    }, []);

    const field = (key: keyof SettingsValue, next: string) => setValue((current) => ({ ...current, [key]: next }));
    const driver = DRIVERS.find((item) => item.id === value.driver) ?? DRIVERS[0];
    const save = async () => {
        if (!value.responsesUrl.trim() || !value.apiKey.trim() || !value.model.trim()) {
            toast(`${driver.urlLabel}、API Key 和模型不能为空`); return;
        }
        setSaving(true);
        try {
            await api.put('/api/settings', value);
            await loadMeta();
            toast('设置已保存');
        } catch (error) { toast(error instanceof Error ? error.message : '设置保存失败'); }
        finally { setSaving(false); }
    };

    return (
        <section className="settings-page">
            <header className="topbar">
                <button className={`icon-btn menu-btn${shell.collapsed ? ' show' : ''}`} title="展开侧栏" onClick={shell.openSidebar}><Icon name="panel" size={17} /></button>
                <span className="topbar-title">设置</span>
            </header>
            <main className="settings-content"><div className="settings-panel">
                <div className="settings-heading"><h1>设置</h1><p>模型连接与 Agent 行为保存在当前产品的本地数据库中。</p></div>
                {loading ? <div className="sheet-note">正在读取设置…</div> : <>
                <section className="settings-section"><div className="settings-section-title">模型</div><div className="settings-form">
                <label><span>驱动</span><div className="driver-choice" role="radiogroup" aria-label="接口协议">
                    {DRIVERS.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            role="radio"
                            aria-checked={item.id === value.driver}
                            className={`driver-option${item.id === value.driver ? ' on' : ''}`}
                            onClick={() => field('driver', item.id)}
                        >
                            <span className="driver-name">{item.label}</span>
                            <span className="driver-hint">{item.hint}</span>
                        </button>
                    ))}
                </div></label>
                <label><span>{driver.urlLabel}</span><input className="field-input mono" value={value.responsesUrl} placeholder={driver.placeholder} onChange={(event) => field('responsesUrl', event.target.value)} /></label>
                <label><span>API Key</span><div className="secret-field"><input className="field-input mono" type={showKey ? 'text' : 'password'} value={value.apiKey} placeholder="仅保存在本地数据库" onChange={(event) => field('apiKey', event.target.value)} /><button type="button" onClick={() => setShowKey((show) => !show)}>{showKey ? '隐藏' : '显示'}</button></div></label>
                <label><span>模型</span><input className="field-input mono" value={value.model} placeholder="模型 ID" onChange={(event) => field('model', event.target.value)} /></label>
                </div></section>
                <section className="settings-section"><div className="settings-section-title">Agent</div><div className="settings-form"><label><span>系统提示词</span><textarea className="field-input settings-prompt" rows={8} value={value.instructions} placeholder="定义 Agent 的角色和行为" onChange={(event) => field('instructions', event.target.value)} /></label></div></section>
                <section className="settings-section"><div className="settings-section-title">界面</div><div className="settings-theme"><span>主题</span><button className="btn btn-quiet" onClick={cycleTheme}>{theme === 'auto' ? '跟随系统' : theme === 'light' ? '浅色' : '深色'}</button></div></section>
                </>}
                <div className="settings-actions"><button className="btn btn-accent" disabled={loading || saving} onClick={() => void save()}>{saving ? '保存中…' : '保存设置'}</button></div>
            </div></main>
        </section>
    );
}
