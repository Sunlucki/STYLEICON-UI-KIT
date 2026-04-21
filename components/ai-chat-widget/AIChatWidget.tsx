import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail as MailIcon,
  Headphones,
  ChevronRight,
  Bot,
  ShoppingBag,
  Package,
  HelpCircle,
  User as UserIcon,
  ArrowUp,
  ShoppingCart,
  Phone,
  MapPin,
  ExternalLink,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage, Product, OrderCard } from './types';

export interface AIChatWidgetProps {
  /** Initial messages to display */
  initialMessages?: ChatMessage[];
  /** Control the visibility of a fixed checkout button */
  showCheckoutBtn?: boolean;
  /** Whether the chat is currently waiting for an external response */
  isLoading?: boolean;
  /** Custom translation strings for i18n support */
  strings?: {
    greeting?: string;
    emailPlaceholder?: string;
    namePlaceholder?: string;
    messagePlaceholder?: string;
    quickOrders?: string;
    quickProducts?: string;
    questionShipping?: string;
    contactManager?: string;
    addToCartShort?: string;
    outOfStock?: string;
    goToCheckout?: string;
  };
  
  /** External callback handlers */
  onSendMessage?: (text: string) => Promise<void>;
  onProvideEmail?: (email: string) => Promise<boolean>; // return true if returning user
  onProvideName?: (name: string) => Promise<void>;
  onAddToCart?: (product: Product) => void;
  onRequestOrders?: () => void;
  onRequestProducts?: () => void;
  onRequestShippingInfo?: () => void;
  onRequestManager?: () => void;
  onNavigateToProduct?: (slug: string) => void;
  onNavigateToCheckout?: () => void;
  
  /** Utility formatters & getters */
  formatPrice?: (price: number) => string;
  getCartQuantity?: (productId: string) => number;
}

type ChatStep = 'collect-email' | 'collect-name' | 'chat';

export function AIChatWidget({
  initialMessages = [],
  showCheckoutBtn = false,
  isLoading = false,
  strings = {},
  onSendMessage,
  onProvideEmail,
  onProvideName,
  onAddToCart,
  onRequestOrders,
  onRequestProducts,
  onRequestShippingInfo,
  onRequestManager,
  onNavigateToProduct,
  onNavigateToCheckout,
  formatPrice = (price) => `$${price.toFixed(2)}`,
  getCartQuantity = () => 0,
}: AIChatWidgetProps) {
  const defaultStrings = {
    greeting: "Hello! 👋 Welcome to our store. Please enter your email to get started.",
    emailPlaceholder: "your@email.com",
    namePlaceholder: "Your name...",
    messagePlaceholder: "Type a message...",
    quickOrders: "My Orders",
    quickProducts: "Products",
    questionShipping: "Shipping",
    contactManager: "Live Agent",
    addToCartShort: "Add",
    outOfStock: "Out of stock",
    goToCheckout: "Go to Checkout",
    ...strings,
  };

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [step, setStep] = useState<ChatStep>('chat'); // For demo purposes, defaulting to chat
  const [inputValue, setInputValue] = useState('');
  const [managerRequested, setManagerRequested] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus management
  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  // Viewport/keyboard height adjustment hook (iOS/Android smooth handling)
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportStyle, setViewportStyle] = useState({
    height: 'calc(100dvh - 4rem)',
    transform: 'translateY(0px)',
  });
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const isKbOpen = vv.height < window.innerHeight;
      setIsKeyboardOpen(isKbOpen);

      if (isKbOpen) {
        const visibleHeaderArea = Math.max(0, 64 - vv.pageTop);
        setViewportStyle({
          height: `${vv.height - visibleHeaderArea}px`,
          transform: `translateY(${vv.pageTop}px)`,
        });
      } else {
        setViewportStyle({
          height: 'calc(100dvh - 4rem)',
          transform: 'translateY(0px)',
        });
      }
    };

    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    const interval = setInterval(update, 50);

    update();
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      clearInterval(interval);
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isKeyboardOpen, isLoading, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
  }, [inputValue]);

  const addLocalMessage = (role: ChatMessage['role'], content: string, extra?: Partial<ChatMessage>) => {
    setMessages(prev => [...prev, { id: Math.random().toString(36), role, content, ...extra }]);
  };

  const handleEmailSubmit = async () => {
    if (!inputValue.trim().includes('@')) return;
    const email = inputValue.trim();
    addLocalMessage('user', email);
    setInputValue('');

    if (onProvideEmail) {
      const isReturning = await onProvideEmail(email);
      setStep(isReturning ? 'chat' : 'collect-name');
    } else {
      setStep('collect-name');
    }
  };

  const handleNameSubmit = async () => {
    if (!inputValue.trim()) return;
    const name = inputValue.trim();
    addLocalMessage('user', name);
    setInputValue('');

    if (onProvideName) await onProvideName(name);
    setStep('chat');
  };

  const handleFreeChat = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    addLocalMessage('user', text);
    setInputValue('');

    if (onSendMessage) await onSendMessage(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switch (step) {
      case 'collect-email': handleEmailSubmit(); break;
      case 'collect-name': handleNameSubmit(); break;
      case 'chat': handleFreeChat(); break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'orders': onRequestOrders?.(); break;
      case 'products': onRequestProducts?.(); break;
      case 'shipping': onRequestShippingInfo?.(); break;
      case 'manager': 
        setManagerRequested(true);
        onRequestManager?.();
        break;
    }
  };

  const getPlaceholder = () => {
    switch (step) {
      case 'collect-email': return defaultStrings.emailPlaceholder;
      case 'collect-name': return defaultStrings.namePlaceholder;
      default: return defaultStrings.messagePlaceholder;
    }
  };

  const showQuickActions = step === 'chat' && 
                             !isLoading && 
                             messages.length > 0 && 
                             messages.filter(m => m.role === 'user').length <= 1;

  const renderContactButtons = (message: ChatMessage) => {
    if (!message.contacts) return null;
    const { phones, emails, addresses } = message.contacts;
    if (!phones.length && !emails.length && !addresses.length) return null;

    return (
      <div className="ml-10 flex flex-wrap gap-2 mt-1">
        {phones.map((phone, i) => (
          <a
            key={`phone-${i}`}
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all"
          >
            <Phone className="w-3 h-3" /> {phone}
          </a>
        ))}
        {emails.map((email, i) => (
          <a
            key={`email-${i}`}
            href={`mailto:${email}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
          >
            <MailIcon className="w-3 h-3" /> {email}
          </a>
        ))}
        {addresses.map((addr, i) => (
          <a
            key={`addr-${i}`}
            href={`https://maps.google.com/?q=${encodeURIComponent(addr)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
          >
            <MapPin className="w-3 h-3" /> {addr} <ExternalLink className="w-2.5 h-2.5" />
          </a>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center bg-background w-full px-4 sm:px-6 relative"
      style={{
        height: viewportStyle.height,
        transform: viewportStyle.transform,
        paddingBottom: isKeyboardOpen ? '0px' : 'env(safe-area-inset-bottom, 0px)',
        transition: 'height 0.3s ease, transform 0.3s ease',
      }}
    >
      <div className="w-full max-w-3xl flex flex-col justify-center max-h-full py-4 gap-4">
        
        {/* Scrollable messages container */}
        <div ref={scrollContainerRef} className="overflow-y-auto overflow-x-visible pr-2 min-h-0 w-full">
          <div className="space-y-6 pb-2">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {message.role === 'assistant' ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 mt-0.5 ring-1 ring-primary/10">
                          <Bot className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-[15px] leading-[1.7] text-foreground whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>
                      </div>

                      {renderContactButtons(message)}

                      {/* Product Cards Rendering embedded in message stream */}
                      {message.products && message.products.length > 0 && (
                        <div className="ml-2 sm:ml-10 grid gap-2 w-full max-w-[calc(100%-0.5rem)] sm:max-w-[calc(100%-2.5rem)] overflow-hidden">
                          {message.products.map((product) => (
                            <div key={product.id} className="flex items-center gap-2 sm:gap-3 bg-muted/40 border border-border/60 rounded-xl p-2 sm:p-3 transition-all min-w-0">
                              {product.images[0] && (
                                <button onClick={() => onNavigateToProduct?.(product.slug)} className="shrink-0 cursor-pointer">
                                  <img src={product.images[0]} alt={product.name} className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg object-cover bg-muted hover:opacity-80 transition-opacity" />
                                </button>
                              )}
                              <div className="flex-1 min-w-0">
                                <button onClick={() => onNavigateToProduct?.(product.slug)} className="hover:text-primary transition-colors text-left">
                                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">{product.name}</p>
                                </button>
                                <p className="text-xs sm:text-sm text-primary font-semibold">
                                  {formatPrice(product.basePrice)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                                {product.inStock ? (
                                  getCartQuantity(product.id) > 0 ? (
                                    <button
                                      onClick={() => onAddToCart?.(product)}
                                      className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30 hover:bg-green-500/25"
                                    >
                                      <Plus className="w-3 h-3" />1
                                      <span className="text-[10px] opacity-60 ml-0.5">(×{getCartQuantity(product.id)})</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => onAddToCart?.(product)}
                                      className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 hover:border-primary/30"
                                    >
                                      <ShoppingCart className="w-3 h-3" />
                                      <span className="hidden sm:inline">{defaultStrings.addToCartShort}</span>
                                      <span className="sm:hidden">+</span>
                                    </button>
                                  )
                                ) : (
                                  <span className="text-[10px] sm:text-[11px] text-muted-foreground/60 px-1.5 sm:px-2 py-1 rounded-full bg-muted/60 border border-border/40">
                                    {defaultStrings.outOfStock}
                                  </span>
                                )}
                                <button onClick={() => onNavigateToProduct?.(product.slug)} className="p-1 sm:p-1.5 rounded-full hover:bg-muted/60 text-muted-foreground/50 hover:text-primary transition-all">
                                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Order Cards Rendering */}
                      {message.orders && message.orders.length > 0 && (
                        <div className="ml-2 sm:ml-10 grid gap-2 w-full max-w-[calc(100%-0.5rem)] sm:max-w-[calc(100%-2.5rem)] overflow-hidden">
                          {message.orders.map((order) => (
                            <div key={order.orderNumber} className="bg-muted/40 border border-border/60 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-mono font-medium text-foreground">{order.orderNumber}</span>
                                <span className={cn(
                                  'text-[11px] px-2 py-0.5 rounded-full font-medium',
                                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                                )}>{order.status}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {order.items.map(i => `${i.productName} ×${i.quantity}`).join(', ')}
                              </p>
                              <p className="text-sm font-semibold text-foreground mt-1">{formatPrice(order.total)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-foreground/[0.04] dark:bg-foreground/[0.08] rounded-2xl rounded-br-md px-4 py-3">
                        <p className="text-[15px] leading-[1.7] text-foreground whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 ring-1 ring-primary/10">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex items-center gap-1 pt-2">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick actions row */}
        <AnimatePresence>
          {showQuickActions && !managerRequested && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
              <div className="w-full flex flex-wrap gap-2 justify-center">
                <button onClick={() => handleQuickAction('orders')} disabled={isLoading} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium text-muted-foreground bg-transparent border border-border/70 hover:border-border hover:bg-muted/40 transition-all disabled:opacity-40">
                  <ShoppingBag className="w-3.5 h-3.5" />{defaultStrings.quickOrders}
                </button>
                <button onClick={() => handleQuickAction('products')} disabled={isLoading} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium text-muted-foreground bg-transparent border border-border/70 hover:border-border hover:bg-muted/40 transition-all disabled:opacity-40">
                  <Package className="w-3.5 h-3.5" />{defaultStrings.quickProducts}
                </button>
                <button onClick={() => handleQuickAction('shipping')} disabled={isLoading} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium text-muted-foreground bg-transparent border border-border/70 hover:border-border hover:bg-muted/40 transition-all disabled:opacity-40">
                  <HelpCircle className="w-3.5 h-3.5" />{defaultStrings.questionShipping}
                </button>
                <button onClick={() => handleQuickAction('manager')} disabled={isLoading} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium text-muted-foreground bg-transparent border border-border/70 hover:border-border hover:bg-muted/40 transition-all disabled:opacity-40">
                  <Headphones className="w-3.5 h-3.5" />{defaultStrings.contactManager}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input or Checkout Button */}
        <div className="flex-shrink-0 w-full">
          {showCheckoutBtn ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onNavigateToCheckout?.()}
              className="w-full py-4 px-6 rounded-[24px] bg-primary text-primary-foreground font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              {defaultStrings.goToCheckout}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="chat-input-glow relative flex items-end bg-muted/30 rounded-[24px] border border-primary/20 transition-all group focus-within:border-primary/50">
                {step === 'collect-email' && <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />}
                {step === 'collect-name' && <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />}
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getPlaceholder()}
                  disabled={isLoading}
                  rows={1}
                  className={cn(
                    'flex-1 bg-transparent py-3.5 text-[15px] text-primary placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 resize-none min-h-[48px] max-h-[120px] disabled:opacity-50 caret-primary',
                    (step === 'collect-email' || step === 'collect-name') ? 'pl-11 pr-14' : 'pl-5 pr-14'
                  )}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className={cn(
                    'absolute right-2.5 bottom-2.5 w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all',
                    inputValue.trim() && !isLoading
                      ? 'bg-foreground text-background hover:bg-foreground/90 hover:scale-105'
                      : 'bg-muted-foreground/10 text-muted-foreground/40 cursor-not-allowed'
                  )}
                >
                  <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIChatWidget;