import React, { useState } from 'react';
import { X, Send, CheckCircle2, Terminal, AlertCircle } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';


interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('AI & ML Engineering');
  const [customDomain, setCustomDomain] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showCustomDomain = category === 'OTHER / CUSTOM DOMAIN';

  const getDomainValue = (): string => {
    if (showCustomDomain) return customDomain;
    return category;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkWeb3FormsConfig = (): string | null => {
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') return 'VITE_WEB3FORMS_ACCESS_KEY';
    return null;
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) return;
    if (!validateEmail(email)) return;
    if (showCustomDomain && !customDomain) return;

    const missingConfig = checkWeb3FormsConfig();
    if (missingConfig) {
      setError(`Web3Forms configuration missing: ${missingConfig}. Please check your .env file.`);
      console.error(`Web3Forms configuration missing: ${missingConfig}`);
      return;
    }

    setError(null);
    soundFX.playScan();
    setIsSending(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          name,
          email,
          domain: getDomainValue(),
          customDomain,
          preferredDate,
          preferredTime,
          message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSending(false);
        setSent(true);
        soundFX.playEnter();
      } else {
        setIsSending(false);
        setError('TRANSMISSION FAILED // PLEASE TRY AGAIN');
        console.error('Web3Forms send error:', result.message);
      }
    } catch (err) {
      setIsSending(false);
      setError('TRANSMISSION FAILED // PLEASE TRY AGAIN');
      console.error('Web3Forms send error:', err);
    }
  };

  const handleClose = () => {
    soundFX.playClick();
    onClose();
    setTimeout(() => {
      setSent(false);
      setError(null);
      setName('');
      setEmail('');
      setMessage('');
      setCustomDomain('');
      setPreferredDate('');
      setPreferredTime('');
      setCategory('AI & ML Engineering');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-cyber-bgLight border border-cyber-cyan/40 p-6 md:p-8 rounded-sm shadow-cyan-md overflow-hidden"
        style={{ boxShadow: '0 0 35px rgba(0, 240, 255, 0.15)' }}
      >
        {/* Futuristic corner brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-cyan" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-cyan" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-cyan" />

        {/* Top header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-cyan animate-pulse" />
            <span className="text-xs font-mono text-cyber-cyan tracking-widest uppercase">
              TRANSMISSION // DIRECT_COMM
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-cyber-textMuted hover:text-cyber-cyan transition-colors p-1"
            aria-label="Close dialog"
          >
            <div>
              <X className="w-5 h-5" />
            </div>
          </button>
        </div>

        {sent ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-cyber-cyan mx-auto animate-bounce" />
            <h3 className="text-lg font-mono text-white tracking-wider uppercase">
              TRANSMISSION RECEIVED
            </h3>
            <p className="text-sm text-cyber-textMuted max-w-sm mx-auto">
              Your message has been encoded and forwarded to Mangal. Expect a response within 24 standard cycles.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 px-6 py-2 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan text-xs font-mono tracking-widest uppercase hover:bg-cyber-cyan hover:text-black transition-all"
            >
              <div>
                CLOSE TERMINAL
              </div>
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-cyber-accentRed/10 border border-cyber-accentRed/30 rounded-sm animate-slideDown">
                <div className="flex items-center gap-2 text-cyber-accentRed font-mono text-[10px] uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-cyber-textMuted tracking-wider mb-1">
                Your Identification // Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full px-3 py-2 bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-sm text-white focus:outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-cyber-textMuted tracking-wider mb-1">
                Comms Address // Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3 py-2 bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-sm text-white focus:outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-cyber-textMuted tracking-wider mb-1">
                Domain / Inquery Scope
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-sm text-white focus:outline-none transition-colors font-mono"
              >
                <option value="AI & ML Engineering">AI & Computer Vision Systems</option>
                <option value="Full-Stack Web Development">Full-Stack Web Architecture</option>
                <option value="Creative Tech & WebGL">Creative Technology / WebGL</option>
                <option value="Consulting / General">Collaborative Project / Advisory</option>
                <option value="OTHER / CUSTOM DOMAIN">OTHER / CUSTOM DOMAIN</option>
              </select>
            </div>

            {showCustomDomain && (
              <div className="animate-slideDown">
                <label className="block text-[11px] font-mono uppercase text-cyber-textMuted tracking-wider mb-1">
                  CUSTOM DOMAIN // SPECIFY
                </label>
                <input
                  type="text"
                  required
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="e.g. FinTech, Healthcare, EdTech, SaaS..."
                  className="w-full px-3 py-2 bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-sm text-white focus:outline-none transition-colors font-mono"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-cyber-textMuted tracking-wider mb-1">
                  PREFERRED DATE // CONSULTATION
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-sm text-white focus:outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-cyber-textMuted tracking-wider mb-1">
                  PREFERRED TIME // CONSULTATION
                </label>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2 bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-sm text-white focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-cyber-textMuted tracking-wider mb-1">
                Transmission Payload // Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your initiative or project parameters..."
                className="w-full px-3 py-2 bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-sm text-white focus:outline-none transition-colors font-mono resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 px-4 bg-cyber-cyan/15 hover:bg-cyber-cyan text-cyber-cyan hover:text-black border border-cyber-cyan font-mono text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  {isSending ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                      <span>TRANSMITTING...</span>
                    </>
                  ) : (
                    <>
                      <span>TRANSMIT MESSAGE</span>
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
          </>
        )}
      </div>
    </div>
  );
};
