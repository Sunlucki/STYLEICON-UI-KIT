# Full Page AI Chat View

A fully generic, immersive exact replica of the XYLIMELTS Contact Page flow (ChatWidget). This handles the beautiful full-screen viewport layout, the step-by-step inputs, and the rich structured message cards.

## Features
- **3-Step Lead Generation Flow**: Allows transitioning seamlessly from `collect-email` to `collect-name` to `chat` without leaving the interface.
- **Glassmorphism Form Input**: Bottom-anchored glowing textarea with dynamic auto-resize, specific icon states based on the lead step, and a pulsing send button.
- **Rich Message Sub-Components**: Capable of reading an object structure and rendering:
  - Mini Product Cards with hover effects and Add to Cart specific callbacks.
  - Interactive Contact Badges (Pills for phone, email, directions).
  - Mini Order Check snippets with status badges (shipped, delivered, cancelled).
- **Responsive Viewport Control**: Overcomes default Safari/iOS URL-bar glitches by dynamically hooking into `window.visualViewport` to compute true layout height and preventing scrolling jumps. 

## Installation

Ensure you have framer-motion and lucide-react.

```sh
npm install framer-motion lucide-react clsx tailwind-merge
```

## Usage

```tsx
import { useState } from 'react';
import { FullPageChat, ChatMessage, ChatStep } from '@/components/full-page-chat/FullPageChat';

export default function ContactPage() {
  const [step, setStep] = useState<ChatStep>('collect-email');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Hello! Please enter your email to get started.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (email: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: email }]);
    setIsLoading(true);
    
    // Simulate backend user lookup
    setTimeout(() => {
      setMessages(prev => [...prev, { id: '2', role: 'assistant', content: "Thanks! What is your name?" }]);
      setStep('collect-name');
      setIsLoading(false);
    }, 1000);
  };

  const handleMessageSubmit = async (msg: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: msg }]);
    setIsLoading(true);
    
    // Call LLM endpoint here
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: "Here are some top products:", 
        products: [
          { id: '1', name: 'Product A', slug: '/product-a', basePrice: 19.99, inStock: true, images: [] }
        ]
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main className="pt-16 min-h-screen">
      <FullPageChat
        messages={messages}
        isLoading={isLoading}
        step={step}
        isLoggedIn={false}
        onEmailSubmit={handleEmailSubmit}
        onNameSubmit={async (name) => {
          setMessages(prev => [...prev, { id: 'user_name', role: 'user', content: name }]);
          setStep('chat');
        }}
        onMessageSubmit={handleMessageSubmit}
        onQuickAction={(action) => console.log(action)}
        onAddToCart={(product) => console.log('Added', product)}
        onProductClick={(slug) => console.log('Navigated to', slug)}
        getCartQuantity={(productId) => 0} // Implement cart lookup here
      />
    </main>
  );
}
```

## Props

See `FullPageChatProps` type definitions in `FullPageChat.tsx` for all callback references.