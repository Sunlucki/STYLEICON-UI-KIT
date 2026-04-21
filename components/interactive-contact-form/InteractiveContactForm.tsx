import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, ArrowRight, ArrowLeft, ArrowUp, Send, 
  Building2, Mail, Phone, MapPin, UserCircle,
  MessageCircle, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming standard Shadcn class compiler

// --- Configuration Types ---
export type LeadType = 'PROFESSIONAL' | 'INDIVIDUAL';

export interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  address: string;
}

export interface StepDef {
  field: keyof FormData;
  icon: React.ElementType;
  required: boolean;
  label: string;
  placeholder: string;
  type: string;
}

export interface InteractiveContactFormProps {
  /** The text displayed in the header */
  title?: string;
  /** Subtitle text under the logo */
  subtitle?: string;
  /** The generic greeting text simulating an agent */
  chatGreeting?: string;
  /** Text for the completion button */
  submitText?: string;
  /** Consent markdown/text above submit */
  consentText?: React.ReactNode;
  /** Color theme base classes for buttons */
  themeClass?: string;
  
  /** Triggered when the user submits the completed form */
  onSubmit: (data: FormData, type: LeadType) => Promise<void>;
  
  /** External callback if you want to route back */
  onClose?: () => void;
}

const TYPE_BUTTONS = [
  { id: 'INDIVIDUAL', label: 'Individual Inquiry', icon: User },
  { id: 'PROFESSIONAL', label: 'Business / Professional', icon: Building2 },
];

const PRO_STEPS: StepDef[] = [
  { field: 'organization', icon: Building2, required: true, label: 'Organization / Company Name', placeholder: 'Acme Corp', type: 'text' },
  { field: 'role', icon: UserCircle, required: true, label: 'Your Role / Position', placeholder: 'Manager, Developer...', type: 'text' },
  { field: 'address', icon: MapPin, required: false, label: 'Office Address (Optional)', placeholder: '123 Tech Lane, NY', type: 'text' },
  { field: 'name', icon: User, required: true, label: 'Full Name', placeholder: 'Jane Doe', type: 'text' },
  { field: 'email', icon: Mail, required: true, label: 'Work Email address', placeholder: 'jane@acmecorp.com', type: 'email' },
  { field: 'phone', icon: Phone, required: true, label: 'Phone Number', placeholder: '+1 555-0123', type: 'tel' },
];

const INDIVIDUAL_STEPS: StepDef[] = [
  { field: 'name', icon: User, required: true, label: 'Full Name', placeholder: 'Jane Doe', type: 'text' },
  { field: 'email', icon: Mail, required: true, label: 'Email address', placeholder: 'jane@example.com', type: 'email' },
  { field: 'phone', icon: Phone, required: true, label: 'Phone Number', placeholder: '+1 555-0123', type: 'tel' },
  { field: 'organization', icon: MessageCircle, required: false, label: 'How can we help?', placeholder: 'I am interested in...', type: 'text' },
];

// Simple Typewriter Hook for Chat effect
function useTypewriter(text: string, speed = 25) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { text: displayed, done };
}

export function InteractiveContactForm({
  title = "Contact Us",
  subtitle = "Complete the form below to get in touch.",
  chatGreeting = "Thank you for filling out the form! 🎉 We will be in touch shortly.",
  submitText = "Send Message",
  consentText = "By clicking Send, I agree to the privacy policy.",
  themeClass = "bg-primary",
  onSubmit,
  onClose,
}: InteractiveContactFormProps) {
  
  const [leadType, setLeadType] = useState<LeadType | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<FormData>({
    name: '', email: '', phone: '', organization: '', role: '', address: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const steps = leadType === 'PROFESSIONAL' ? PRO_STEPS : INDIVIDUAL_STEPS;
  const isFinished = leadType !== null && stepIndex >= steps.length;
  
  // Format phone automatically
  const handlePhoneInput = (val: string) => {
    const hasPlus = val.startsWith('+');
    const digits = val.replace(/\D/g, '');
    const limited = digits.slice(0, 15);
    return hasPlus ? `+${limited}` : limited;
  };

  const handleNext = () => {
    const currentStep = steps[stepIndex];
    const val = data[currentStep.field].trim();
    if (currentStep.required && !val) {
      setError(`Please provide your ${currentStep.label.toLowerCase()}`);
      return;
    }
    if (currentStep.field === 'email' && currentStep.required && !val.includes('@')) {
      setError(`Please provide a valid email address.`);
      return;
    }
    setError(null);
    setStepIndex(s => s + 1);
  };

  const handlePrev = () => {
    setError(null);
    if (stepIndex > 0) {
      setStepIndex(s => s - 1);
    } else {
      setLeadType(null); // Back to category selection
      setData({ name: '', email: '', phone: '', organization: '', role: '', address: '' });
    }
  };

  const doSubmit = async () => {
    if (!leadType) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(data, leadType);
      setSubmitted(true);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failure submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  // Chat message animation
  const greetingText = `${data.name ? `${data.name.split(' ')[0]}, ` : ''}${chatGreeting}`;
  const typewriter = useTypewriter(greetingText, 20);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-2xl mx-auto w-full px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button 
                onClick={onClose || handlePrev}
                className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground flex items-center justify-center transition-colors"
             >
                <ArrowLeft className="w-5 h-5" />
             </button>
             <h1 className="font-bold text-foreground text-lg tracking-tight">{title}</h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        
        <AnimatePresence mode="wait">
          {!leadType ? (
            /* STEP 1: SELECT CATEGORY */
            <motion.div
              key="select-type"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md space-y-6"
            >
              <div className="text-center space-y-2 mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-6">
                   <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h2>
                <p className="text-muted-foreground">{subtitle}</p>
              </div>

              <div className="grid gap-3">
                {TYPE_BUTTONS.map(btn => (
                  <button
                    key={btn.id}
                    onClick={() => setLeadType(btn.id as LeadType)}
                    className="flex items-center gap-4 w-full p-4 sm:p-5 rounded-2xl border-2 border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <btn.icon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {btn.label}
                    </span>
                    <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : !isFinished ? (
            /* STEP 2: FILL FORM (Step-by-step logic) */
            <motion.div
              key={`form-step-${stepIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-lg"
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <span>Step {stepIndex + 1} of {steps.length}</span>
                  <span>{Math.round(((stepIndex) / steps.length) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className={cn("h-full", themeClass)}
                    initial={{ width: `${((stepIndex) / steps.length) * 100}%` }}
                    animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Current Input Field */}
              {(() => {
                const currentStep = steps[stepIndex];
                const Icon = currentStep.icon;
                const value = data[currentStep.field];

                return (
                  <div className="bg-card border border-border/40 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
                    <div className="flex items-start gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                          <Icon className="w-6 h-6" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <label className="block text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">
                             {currentStep.label}
                          </label>
                          <p className="text-muted-foreground text-sm">
                             {currentStep.required ? 'Required field.' : '(Optional) Skip if not applicable.'}
                          </p>
                       </div>
                    </div>

                    <div className="relative group">
                       <input
                        ref={inputRef}
                        type={currentStep.type}
                        autoFocus
                        placeholder={currentStep.placeholder}
                        value={value}
                        onChange={e => setData(d => ({ 
                           ...d, 
                           [currentStep.field]: currentStep.field === 'phone' ? handlePhoneInput(e.target.value) : e.target.value 
                        }))}
                        onKeyDown={onKeyDown}
                        className="w-full text-lg sm:text-xl px-0 py-3 bg-transparent border-0 border-b-2 border-border/60 focus:border-primary focus:ring-0 placeholder:text-muted-foreground/40 transition-colors outline-none"
                       />
                       {/* Floating Arrow Up in input on desktop */}
                       <button
                         onClick={handleNext}
                         disabled={currentStep.required && !value.trim()}
                         className="absolute right-0 bottom-3 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-focus-within:opacity-100 disabled:opacity-0 transition-opacity hover:bg-primary hover:text-primary-foreground"
                       >
                         <ArrowUp className="w-4 h-4" />
                       </button>
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-sm font-medium text-destructive bg-destructive/10 px-4 py-3 rounded-xl">
                        {error}
                      </motion.div>
                    )}

                    <div className="flex items-center gap-3 pt-4">
                       <button
                         onClick={handleNext}
                         className={cn("flex-1 h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg text-primary-foreground transition-all hover:opacity-90 active:scale-95 shadow-md", themeClass)}
                       >
                         {stepIndex === steps.length - 1 ? 'Review' : 'Continue'}
                         <ArrowRight className="w-5 h-5" />
                       </button>
                       {!currentStep.required && (
                          <button
                            onClick={() => {
                               setData(d => ({ ...d, [currentStep.field]: '' }));
                               handleNext();
                            }}
                            className="h-14 px-6 rounded-xl font-bold bg-muted hover:bg-muted/80 text-muted-foreground transition-colors active:scale-95"
                          >
                            Skip
                          </button>
                       )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          ) : !submitted ? (
            /* STEP 3: REVIEW & SUBMIT */
            <motion.div
              key="review"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl"
            >
              <div className="bg-card border border-border/40 p-6 sm:p-10 rounded-[32px] shadow-2xl">
                 <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8 text-center">{title}</h2>
                 
                 <div className="space-y-4 mb-10 bg-muted/30 p-6 rounded-2xl border border-border/40">
                    {steps.map(step => (
                       <div key={step.field} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pb-4 border-b border-border/40 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3 w-48 shrink-0 text-muted-foreground">
                             <step.icon className="w-4 h-4" />
                             <span className="text-sm font-medium">{step.label}</span>
                          </div>
                          <div className="flex-1 font-semibold text-foreground text-base truncate">
                             {data[step.field] || '—'}
                          </div>
                       </div>
                    ))}
                 </div>

                 {error && (
                    <div className="text-sm font-medium text-destructive bg-destructive/10 px-4 py-3 rounded-xl mb-6">
                       {error}
                    </div>
                 )}

                 <div className="space-y-6">
                    <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed">
                       {consentText}
                    </p>
                    <button
                      onClick={doSubmit}
                      disabled={isSubmitting}
                      className={cn("w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg text-primary-foreground shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none", themeClass)}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-6 h-6" />
                          {submitText}
                        </>
                      )}
                    </button>
                 </div>
              </div>
            </motion.div>
          ) : (
            /* STEP 4: SUCCESS TERMINAL (Chatbot style finish) */
            <motion.div
               key="success"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="w-full max-w-md mx-auto"
            >
               <div className="bg-card border border-border/40 p-1 rounded-3xl shadow-2xl flex flex-col min-h-[300px] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                  
                  <div className="flex-1 p-6 flex flex-col justify-end">
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg mt-0.5">
                           <MessageCircle className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                           <div className="bg-muted px-5 py-4 rounded-2xl rounded-tl-sm border border-border/40 shadow-sm relative">
                              <p className="text-[15px] leading-relaxed text-foreground min-h-[44px]">
                                {typewriter.text}
                                {!typewriter.done && <span className="inline-block w-1.5 h-[15px] bg-primary ml-1 animate-pulse align-middle" />}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 border-t border-border/40 bg-muted/20">
                     <button
                       onClick={onClose}
                       className="w-full h-12 rounded-xl text-center font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                     >
                       Return to Home
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

export default InteractiveContactForm;