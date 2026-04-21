# AI Chat Widget

A beautiful, functional, and highly customizable UI for building an AI-powered e-commerce chat bot. 

Comprises two main components:
1. `FloatingChatTrigger`: A smooth, animated floating button with a typewriter effect to attract users.
2. `AIChatWidget`: The comprehensive chat interface capable of rendering message bubbles, inline product cards, order status cards, and interactive contact buttons (phone, email, map links).

## Features
- **Zero Business Logic Lock-in**: Fully presentational components. You manage state, calls to your AI API (e.g., OpenAI, Groq, Anthropic), and commerce platforms (Shopify, custom backend) on your end.
- **Rich Message Types**: Renders inline product cards with "Add to cart" states and formatted order history cards.
- **Keyboard & Viewport Safe**: Advanced height and viewport offset calculations for perfect iOS and Android soft-keyboard behavior.
- **Smooth Animations**: Integrated with `framer-motion` for fluid mount/unmount and message stream reveals.
- **i18n Ready**: Pass custom translation `strings` objects for instant localization.

## Installation

This element requires `lucide-react`, `framer-motion` and the `cn` utility (standard to tailwind-merge and clsx).

```sh
npm install framer-motion lucide-react clsx tailwind-merge
```

## Quick Start Context

### 1. The Floating Trigger

Add `FloatingChatTrigger` to your global layout or index page to prompt users.

```tsx
import { FloatingChatTrigger } from '@/components/ai-chat-widget/FloatingChatTrigger';
import { useState } from 'react';

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <FloatingChatTrigger
        placeholders={["Hello! How can I help you?", "Looking for a product?", "Ask me a question..."]}
        isVisible={!chatOpen}
        onClick={() => setChatOpen(true)}
      />
    </>
  );
}
```

### 2. The Main Chat Interface

Use the `AIChatWidget` component when the trigger is clicked. Pass the appropriate callbacks to handle the logic.

```tsx
import { AIChatWidget } from '@/components/ai-chat-widget/AIChatWidget';
import type { ChatMessage, Product } from '@/components/ai-chat-widget/types';

export default function ChatModal() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to our store! I am your AI assistant. How can I help you today?'
    }
  ]);
  
  const handleSendMessage = async (text: string) => {
    // Here you would typically call your backend AI logic.
    // e.g., await fetch('/api/chat', ...);
    
    // For now, let's mock a reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: 'assistant',
        content: `I received your message: "${text}".`
      }]);
    }, 1000);
  };

  return (
    <AIChatWidget
      initialMessages={messages}
      onSendMessage={handleSendMessage}
      onAddToCart={(product: Product) => console.log('Added to cart:', product)}
      onNavigateToCheckout={() => window.location.href = '/checkout'}
      onNavigateToProduct={(slug: string) => window.location.href = `/product/${slug}`}
    />
  );
}
```

## Available Customizations

### Props: `AIChatWidget`

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `initialMessages` | `ChatMessage[]` | Preloaded messages. |
| `isLoading` | `boolean` | Set `true` to render the typing animation bubble. |
| `showCheckoutBtn` | `boolean` | Hides the input field and displays a large checkout CTA. Useful when AI has successfully guided users to populate their cart. |
| `strings` | `Object` | Object of strings for overriding default texts. |
| `onSendMessage` | `(text: string) => Promise<void>` | Callback when user sends a standard chat message. |
| `onProvideEmail` | `(email: string) => Promise<boolean>` | Callback triggered in the "collect-email" phase of the UI. Return `true` if returning user. |
| `onProvideName` | `(name: string) => Promise<void>` | Callback triggered in the "collect-name" phase of the UI. |
| `onAddToCart` | `(product: Product) => void` | Event handler when an embedded product "Add to cart" is pressed. |
| `formatPrice` | `(price: number) => string` | Formatting util for prices inside product or order cards. |