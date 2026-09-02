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

/** Matches the two drivers in ai/drivers/ one-to-one. The placeholder shows each one's typical
 *  URL directly, so picking "chat" doesn't leave you filling it in as if it were Responses. */
const DRIVERS: { id: DriverId; label: string; hint: string; urlLabel: string; placeholder: string }[] = [
    {
        id: 'responses', label: 'Responses API', hint: "OpenAI's Responses protocol",
        urlLabel: 'Responses URL', placeholder: 'https://api.openai.com/v1/responses',
    },
    {
        id: 'chat', label: 'Chat Completions', hint: 'A service that only exposes /chat/completions, e.g. GLM',
        urlLabel: 'Chat Completions URL', placeholder: 'https://api.z.ai/api/paas/v4/chat/completions',
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
            .catch((error) => toast(error instanceof Error ? error.message : 'Failed to load settings'))
            .finally(() => setLoading(false));
    }, []);

    const field = (key: keyof SettingsValue, next: string) => setValue((current) => ({ ...current, [key]: next }));
    const driver = DRIVERS.find((item) => item.id === value.driver) ?? DRIVERS[0];
    const save = async () => {
        if (!value.responsesUrl.trim() || !value.apiKey.trim() || !value.model.trim()) {
            toast(`${driver.urlLabel}, API Key, and model can't be empty`); return;
        }
        setSaving(true);
        try {
            await api.put('/api/settings', value);
            await loadMeta();
            toast('Settings saved');
        } catch (error) { toast(error instanceof Error ? error.message : 'Failed to save settings'); }
        finally { setSaving(false); }
    };

    return (
        <section className="settings-page">
            <header className="topbar">
                <button className={`icon-btn menu-btn${shell.collapsed ? ' show' : ''}`} title="Expand sidebar" onClick={shell.openSidebar}><Icon name="panel" size={17} /></button>
                <span className="topbar-title">Settings</span>
            </header>
            <main className="settings-content"><div className="settings-panel">
                <div className="settings-heading"><h1>Settings</h1><p>Model connection and Agent behavior are stored in this product's local database.</p></div>
                {loading ? <div className="sheet-note">Loading settings…</div> : <>
                <section className="settings-section"><div className="settings-section-title">Model</div><div className="settings-form">
                <label><span>Driver</span><div className="driver-choice" role="radiogroup" aria-label="Interface protocol">
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
                <label><span>API Key</span><div className="secret-field"><input className="field-input mono" type={showKey ? 'text' : 'password'} value={value.apiKey} placeholder="Only stored in the local database" onChange={(event) => field('apiKey', event.target.value)} /><button type="button" onClick={() => setShowKey((show) => !show)}>{showKey ? 'Hide' : 'Show'}</button></div></label>
                <label><span>Model</span><input className="field-input mono" value={value.model} placeholder="Model ID" onChange={(event) => field('model', event.target.value)} /></label>
                </div></section>
                <section className="settings-section"><div className="settings-section-title">Agent</div><div className="settings-form"><label><span>System prompt</span><textarea className="field-input settings-prompt" rows={8} value={value.instructions} placeholder="Define the Agent's role and behavior" onChange={(event) => field('instructions', event.target.value)} /></label></div></section>
                <section className="settings-section"><div className="settings-section-title">Interface</div><div className="settings-theme"><span>Theme</span><button className="btn btn-quiet" onClick={cycleTheme}>{theme === 'auto' ? 'Follow system' : theme === 'light' ? 'Light' : 'Dark'}</button></div></section>
                </>}
                <div className="settings-actions"><button className="btn btn-accent" disabled={loading || saving} onClick={() => void save()}>{saving ? 'Saving…' : 'Save settings'}</button></div>
            </div></main>
        </section>
    );
}
