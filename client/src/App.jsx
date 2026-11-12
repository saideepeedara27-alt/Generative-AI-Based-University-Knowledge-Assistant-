import { useEffect, useRef, useState } from 'react';

const suggestions = [
  'Help me plan my semester schedule',
  'Where can I find academic support?',
  'What campus events are coming up?'
];

function GraduationIcon() {
  return <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true"><path d="M9 24 24 13l15 11-15 11L9 24Z" /><path d="M14 28v7.8c5.8 4.3 14.2 4.3 20 0V28" /><path d="M39 24v10" /><circle cx="39" cy="35.5" r="1.8" /></svg>;
}

function SettingsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" /><path d="M19.3 13.5a7.8 7.8 0 0 0 .1-1.5 7.8 7.8 0 0 0-.1-1.5l2-1.5-2-3.4-2.4 1a8 8 0 0 0-2.5-1.5L14 2.5h-4L9.6 5.1A8 8 0 0 0 7 6.6l-2.4-1-2 3.4 2 1.5a7.8 7.8 0 0 0-.1 1.5c0 .5 0 1 .1 1.5l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 2.5 1.5l.5 2.6h4l.5-2.6a8 8 0 0 0 2.5-1.5l2.4 1 2-3.4-2.1-1.5Z" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>;
}

function PlusIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
}

function newSessionId() {
  const saved = sessionStorage.getItem('campusmind-session');
  if (saved) return saved;
  const value = crypto.randomUUID();
  sessionStorage.setItem('campusmind-session', value);
  return value;
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('Focused');
  const [theme, setTheme] = useState(() => localStorage.getItem('campusmind-theme') || 'dark');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reply, setReply] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const inputRef = useRef(null);
  const sessionId = useRef(newSessionId());

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('campusmind-theme', theme);
  }, [theme]);

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 170)}px`;
  }, [prompt]);

  async function submitQuestion(event) {
    event.preventDefault();
    const message = prompt.trim();
    if (!message || isThinking) return;

    setIsThinking(true);
    setReply('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, mode, sessionId: sessionId.current })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The assistant could not answer right now.');
      setReply(data.reply);
      setPrompt('');
    } catch (error) {
      setReply(error.message || 'The assistant could not answer right now. Please try again.');
    } finally {
      setIsThinking(false);
    }
  }

  function useSuggestion(value) {
    setPrompt(value);
    inputRef.current?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const isLight = theme === 'light';
  const isSignup = authMode === 'signup';

  return <>
    <div className="page-glow glow-one" />
    <div className="page-glow glow-two" />

    <header className="topbar">
      <a className="brand" href="#top" aria-label="CampusMind home"><GraduationIcon /><span>CampusMind</span><span className="ai-tag">AI</span></a>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Open preferences" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((open) => !open)}><SettingsIcon /></button>
        <button className="button button-quiet" type="button" onClick={() => setAuthMode('signin')}>Sign in</button>
        <button className="button button-light" type="button" onClick={() => setAuthMode('signup')}>Get started</button>
      </div>
    </header>

    {settingsOpen && <div className="popover" role="menu" aria-label="Preferences">
      <p className="popover-label">PREFERENCES</p>
      <button type="button" role="menuitemcheckbox" aria-checked={isLight} onClick={() => setTheme(isLight ? 'dark' : 'light')}><span className="toggle-icon">{isLight ? '☀' : '☾'}</span> Appearance <strong>{isLight ? 'Light' : 'Dark'}</strong></button>
      <button type="button" role="menuitem"><span className="toggle-icon">✦</span> Response style <strong>{mode}</strong></button>
    </div>}

    <main className="hero" id="top">
      <section className="assistant-intro" aria-labelledby="mainTitle">
        <h1 id="mainTitle">What would you like to <em>discover?</em></h1>
        <p className="intro-copy">Ask CampusMind about courses, resources, policies, campus life, or anything in between.</p>
      </section>

      <section className="chat-shell" aria-label="Ask CampusMind">
        <div className="suggestions" aria-label="Suggested questions">
          {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => useSuggestion(suggestion)}>{suggestion.replace('Help me ', '').replace('Where can I ', '').replace('What ', '')} <span>↗</span></button>)}
        </div>
        <form className="prompt-box" onSubmit={submitQuestion}>
          <label className="sr-only" htmlFor="promptInput">Ask CampusMind a question</label>
          <textarea ref={inputRef} id="promptInput" rows="1" maxLength="500" value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={onKeyDown} placeholder="Ask about your university..." />
          <div className="prompt-controls">
            <button className="add-button" type="button" aria-label="Attach a file" title="Attach a file"><PlusIcon /></button>
            <div className="mode-control"><select value={mode} aria-label="Response mode" onChange={(event) => setMode(event.target.value)}><option>Focused</option><option>Detailed</option><option>Quick</option></select></div>
            <button className="send-button" type="submit" aria-label="Send question" disabled={!prompt.trim() || isThinking}>{isThinking ? <span className="sending-dots">•••</span> : <ArrowIcon />}</button>
          </div>
        </form>
      </section>

      {reply && <aside className="response-card" aria-live="polite">
        <div className="response-heading"><div className="mini-mark">C</div><div><strong>CampusMind</strong><span>AI knowledge assistant</span></div><button type="button" aria-label="Close answer" onClick={() => setReply('')}>×</button></div>
        <p>{reply}</p>
      </aside>}
    </main>

    <footer><p>CampusMind can make mistakes. Please verify important academic information with your university.</p><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#help">Help</a></div></footer>

    {authMode && <div className="modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setAuthMode(null); }}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="authTitle">
        <button className="modal-close" type="button" aria-label="Close" onClick={() => setAuthMode(null)}>×</button>
        <div className="modal-brand"><span className="mini-mark">C</span> CampusMind</div>
        <h2 id="authTitle">{isSignup ? 'Start exploring your campus.' : 'Welcome back to CampusMind.'}</h2>
        <p>{isSignup ? 'Create an account to save conversations and personalize your university assistant.' : 'Sign in to access your saved conversations and personalized campus knowledge.'}</p>
        <button className="continue-button" type="button">Continue with email <span>→</span></button>
      </section>
    </div>}
  </>;
}
