# Floating Chat Levitating Bar

A beautifully animated, levitating chat trigger mimicking a live input field. Includes a smart typewriter effect cycle to present multiple placeholders/prompts. 

Extracted from XYLIMELTS production codebase.

## Features
- **Typewriter Effect**: Cycles through provided prompts (e.g. `["Ask me anything", "Find your order"]`) with realistic cursor blinking.
- **Backdrop Blur & Glow Design**: Uses `backdrop-blur-2xl` and primary gradients for a premium glassmorphic appearance.
- **Adaptive Positioning**: Fully responsive on mobile (fixed bottom width) and desktop (centered fixed width).
- **Interactive Routing**: Use `onClick` to trigger your preferred navigation pattern (e.g. `next/router`, `react-router-dom navigate`, or modal toggle).

## Usage

```tsx
import { useState, useEffect } from 'react';
import { FloatingChatBar } from '@/components/floating-chat-bar/FloatingChatBar';

export default function GenericLayout() {
  const [showFloat, setShowFloat] = useState(false);

  useEffect(() => {
    // Show only after scrolling 500px, as an engagement pop-in
    const handleScroll = () => setShowFloat(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main>
      <h1>My Content</h1>
      
      {/* 
        This acts as the floating trigger to go into a dedicated chat page 
        or open a widget modal 
      */}
      <FloatingChatBar
        isVisible={showFloat}
        placeholders={[
          "Can I help you?",
          "Search for products...",
          "Need an agent?"
        ]}
        onClick={() => {
          // Go to your chat page
          window.location.href = '/chat-page';
        }}
      />
    </main>
  );
}
```

## Props

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `placeholders` | `string[]` | Array of text strings to typewrite. Default: English greeting set. |
| `isVisible` | `boolean` | Hard toggle for `AnimatePresence`. Default: `true`. |
| `onClick` | `() => void` | Triggers the redirect/open handler on the entire bar. |
| `typingSpeed` | `number` | MS delay per character typing. Default `50`. |
| `deletingSpeed` | `number` | MS delay per character deletion. Default `30`. |
| `delayBeforeDelete` | `number` | MS pause before erasing. Default `2000`. |
| `className` | `string` | Optional styling overrides for the container wrapper. |