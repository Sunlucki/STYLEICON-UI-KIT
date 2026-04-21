import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils'; // Optional utility typically used in Shadcn

export interface FloatingChatBarProps {
  /** Phrases to typewriter-animate in the input */
  placeholders?: string[];
  
  /** Typing speed metric in ms (default: 50) */
  typingSpeed?: number;
  
  /** Deletion speed metric in ms (default: 30) */
  deletingSpeed?: number;
  
  /** How long to wait before deleting the phrase (default: 2000) */
  delayBeforeDelete?: number;
  
  /** Action on click. E.g., Router navigate('/chat') or window.location.href='/chat' */
  onClick: () => void;
  
  /** Should the levitating bar be visible permanently, or controlled externally? Default: true */
  isVisible?: boolean;

  /** Extra styling overrides */
  className?: string;
}

const DEFAULT_PLACEHOLDERS = [
  "Hi! I'm here to help you!", 
  "Ask a question...", 
  "Chat with us directly..."
];

// Reusable Typewriter hook
function useTypewriter(texts: string[], typingSpeed: number, deletingSpeed: number, delayBeforeDelete: number) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setText('');
    setIndex(0);
    setIsDeleting(false);
  }, [texts]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = texts[index] || '';
    if (!currentFullText) return;

    if (isDeleting) {
      if (text === '') {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
      } else {
        timer = setTimeout(() => {
          setText(currentFullText.substring(0, text.length - 1));
        }, deletingSpeed);
      }
    } else {
      if (text === currentFullText) {
        timer = setTimeout(() => {setIsDeleting(true);}, delayBeforeDelete);
      } else {
        timer = setTimeout(() => {
          setText(currentFullText.substring(0, text.length + 1));
        }, typingSpeed);
      }
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, index, texts, typingSpeed, deletingSpeed, delayBeforeDelete]);

  return text;
}

export function FloatingChatBar({
  placeholders = DEFAULT_PLACEHOLDERS,
  typingSpeed = 50,
  deletingSpeed = 30,
  delayBeforeDelete = 2000,
  onClick,
  isVisible = true,
  className,
}: FloatingChatBarProps) {
  const typedText = useTypewriter(placeholders, typingSpeed, deletingSpeed, delayBeforeDelete);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          // Floating centered at lg screens, corner stick at mobile 
          className={cn(
            "fixed bottom-6 left-6 right-6 sm:left-auto sm:w-[350px] lg:inset-x-0 lg:mx-auto lg:w-[520px] z-50 pointer-events-auto",
            className
          )}
          onClick={onClick}
        >
          {/* Main levitating container */}
          <div className="relative flex items-center bg-background/80 backdrop-blur-2xl rounded-[24px] border border-primary/20 shadow-2xl transition-all cursor-pointer hover:border-primary/40 hover:shadow-primary/10 p-1.5 lg:p-2.5 group">
            
            {/* Left Bot Icon Bubble */}
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 ml-1">
              <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
            </div>

            {/* Typewriter Input Area */}
            <div className="flex-1 ml-3 bg-transparent text-[15px] lg:text-base text-foreground/80 outline-none truncate h-6 lg:h-7 flex items-center">
              <span className="relative font-medium tracking-tight">
                {typedText}
                {/* Blinking Cursor */}
                <span className="ml-[1px] inline-block w-[2px] h-[15px] lg:h-[17px] bg-primary animate-pulse align-middle" />
              </span>
            </div>

            {/* Right Arrow/Submit Bubble */}
            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mr-1 group-hover:scale-105 group-hover:-translate-y-0.5 transition-transform shadow-md">
              <ArrowUp className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={2.5} />
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FloatingChatBar;