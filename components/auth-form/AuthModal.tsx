import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, CheckCircle, ArrowLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming standard Shadcn tailwind-merge helper

export interface AuthModalProps {
  /** Is the modal open? */
  isOpen: boolean;
  /** Function to call when the modal should close */
  onClose: () => void;
  /** The brand name displayed in the header */
  brandName?: string;
  /** Primary gradient colors for the header */
  headerGradient?: string;
  /** Title displayed in the header */
  title?: string;
  /** Subtitle displayed in the header */
  subtitle?: string;
  /** Function to handle Magic Link email submission */
  onSendMagicLink: (email: string) => Promise<void>;
  /** Function to handle Admin or Password-based login */
  onAdminLogin?: (password: string) => Promise<void>;
}

export function AuthModal({
  isOpen,
  onClose,
  brandName = "SaaS Brand",
  headerGradient = "from-primary to-primary/80",
  title = "Your Account",
  subtitle = "Sign in to access your dashboard",
  onSendMagicLink,
  onAdminLogin,
}: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Hidden admin mode triggered by specific email pattern (e.g., 'admin@')
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailTrimmed = email.trim();
    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Trigger admin mode if the email matches a specific shorthand format.
    // E.g., 'admin@' configures it to flip to the password input screen.
    if (emailTrimmed.endsWith('@') && emailTrimmed.length > 2) {
      if (onAdminLogin) {
        setIsAdminMode(true);
        return;
      }
    }

    try {
      setIsLoading(true);
      // Wait for parent component's network call
      await onSendMagicLink(emailTrimmed.toLowerCase());
      
      setSentEmail(emailTrimmed);
      setLinkSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send login link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAdminLogin) return;

    setError(null);
    try {
      setIsLoading(true);
      await onAdminLogin(adminPassword);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setLinkSent(false);
    setSentEmail('');
    setIsAdminMode(false);
    setAdminPassword('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Simplified Backdrop and Modal logic built to complement standard frameworks without needing full Shadcn Dialog.
  // Using Framer Motion for smooth entrances and exits.

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-50 w-full h-full sm:h-auto sm:max-w-[420px] bg-background sm:rounded-[24px] shadow-2xl overflow-hidden flex flex-col border border-border/40"
          >
            {/* Close Button overlapping Header */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Content */}
            <div className={cn("px-6 pt-10 pb-8 flex-shrink-0 bg-gradient-to-br", headerGradient)}>
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-white tracking-wide">
                {brandName}
              </h2>
              {title && (
                <p className="text-center text-white/90 text-sm mt-2 font-medium">
                  {title}
                </p>
              )}
            </div>

            {/* Form Body - Scrollable on short screens */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 pt-6">
              {isAdminMode ? (
                /* Admin Password Login */
                <form onSubmit={handleAdminLoginSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminMode(false);
                      setError(null);
                    }}
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to email
                  </button>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    />
                  </div>

                  {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading || !adminPassword.trim()}
                    className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 py-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
                  </button>
                </form>

              ) : linkSent ? (
                /* Success State - Magic Link Sent */
                <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-400 space-y-6">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/10">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground tracking-tight">Check your inbox</h3>
                    <p className="text-sm text-muted-foreground px-2 leading-relaxed">
                      We've sent a magic link to <span className="font-semibold text-foreground">{sentEmail}</span>.<br/>
                      Click it to securely sign in.
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 mt-4"
                  >
                    Use a different email
                  </button>
                </div>

              ) : (
                /* Default Magic Link Form */
                <form onSubmit={handleMagicLinkSubmit} className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-foreground tracking-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium text-foreground">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="flex h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-sm text-destructive bg-destructive/10 px-3 py-2.5 rounded-lg border border-destructive/20"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl text-[15px] font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-md h-12 px-4 py-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue with Email'}
                  </button>

                  <p className="text-xs text-center text-muted-foreground mt-6 leading-relaxed px-4">
                    By confirming, you agree to our Terms of Service and Privacy Policy. Passwordless magic links provide secure, instant access.
                  </p>
                </form>
              )}
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;