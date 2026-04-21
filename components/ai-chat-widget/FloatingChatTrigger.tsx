import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils'; // Optional util from your ui-kit

interface FloatingChatTriggerProps {
  /** Text lines that cycle in the input placeholder */
  placeholders?: string[];
  /** Shows or hides the trigger */
  isVisible?: boolean;
  /** Callback when user clicks the widget */
  onClick: () => void;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBeforeDelete?: number;
}

function useTypewriter(texts: string[], typingSpeed = 50, deletingSpeed = 30, delayBeforeDelete = 2000) {
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
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBeforeDelete);
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

export function FloatingChatTrigger({
  placeholders = ["Hi! I'm here to help you!", "Ask a question...", "Looking for something?"],
  isVisible = true,
  onClick,
  typingSpeed = 50,
  deletingSpeed = 30,
  delayBeforeDelete = 2000,
}: FloatingChatTriggerProps) {
  
  const typedText = useTypewriter(placeholders, typingSpeed, deletingSpeed, delayBeforeDelete);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 sm:left-auto sm:w-[350px] lg:inset-x-0 lg:w-[520px] lg:mx-auto z-50 pointer-events-auto shadow-2xl"
          onClick={onClick}
        >
          <div className="relative flex items-center bg-background/90 backdrop-blur-xl rounded-[24px] border border-primary/20 transition-all cursor-pointer hover:border-primary/40 p-1.5 lg:p-2.5 shadow-xl group overflow-hidden">
            {/* Soft gradient background glow effect */}
            <div className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100 bg-primary/5 rounded-[24px] -z-10" />
            
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 ml-1">
              <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
            </div>
            
            <div className="flex-1 ml-3 bg-transparent text-[15px] lg:text-base text-foreground/80 outline-none truncate h-6 lg:h-7 flex items-center">
              <span className="relative">
                {typedText}
                <span className="ml-[1px] inline-block w-[2px] h-[15px] lg:h-[17px] bg-primary animate-pulse align-middle" />
              </span>
            </div>
            
            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mr-1 group-hover:scale-105 transition-transform shadow-md">
              <ArrowUp className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FloatingChatTrigger;