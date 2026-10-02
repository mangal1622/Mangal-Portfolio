import React, { useState } from 'react';
import { X, Send, CheckCircle2, Terminal } from 'lucide-react';
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
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    soundFX.playScan();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      soundFX.playEnter();
    }, 1200);
  };

  const handleClose = () => {
    soundFX.playClick();
    onClose();
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
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
              </select>
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
                className="w-full py-2.5 px-4 bg-cyber-cyan/15 hover:bg-cyber-cyan text-cyber-cyan hover:text-black border border-cyber-cyan font-mono text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <div className="flex items-center justify-center gap-2">
                  {isSending ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                      <span>ENCODING TRANSMISSION...</span>
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
        )}
      </div>
    </div>
  );
};
