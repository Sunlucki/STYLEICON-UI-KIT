# Auth Modal / Registration Form

A generic, animated component for Magic Link/Passwordless registration and login.
Built with React, Framer Motion, and Lucide Icons.

## Features
- **Passwordless Flow**: Collects email and sends a magic link for signups/logins.
- **Hidden Admin Mode**: Includes an easter-egg (detects a custom email signature, e.g. `admin@`) to toggle a password login view for staff users.
- **Beautiful Success States**: Animated green checkmark when a link is sent.
- **Fluid Entrance**: Uses `framer-motion` for springy modal entrances and height changes.
- **Zero Business Logic Tie-in**: The component does not make API calls itself—it delegates them to `onSendMagicLink` and `onAdminLogin` promises, automatically managing loading states and error strings.

## Installation

Ensure you have framer-motion and lucide-react.

```sh
npm install framer-motion lucide-react clsx tailwind-merge
```

## Usage

```tsx
import { useState } from 'react';
import { AuthModal } from '@/components/auth-form/AuthModal';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleMagicLink = async (email: string) => {
    // 1. Call your own authenticaton backend (Supabase, Firebase, NextAuth)
    await fetch('/api/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    // This function returns a Promise. The modal displays a spinner while waiting.
  };

  const handleAdminLogin = async (password: string) => {
    // 1. Call admin auth endpoint
    // 2. Throw an error if invalid, which the modal will catch and display.
  };

  return (
    <>
      <button onClick={() => setIsAuthOpen(true)}>Login / Sign Up</button>
      
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        brandName="Acme Corp"
        headerGradient="from-blue-500 to-indigo-600"
        title="Welcome Back"
        subtitle="Enter your email to sign in or create an account"
        onSendMagicLink={handleMagicLink}
        onAdminLogin={handleAdminLogin}
      />
    </>
  );
}
```

## Props

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `isOpen` | `boolean` | Controls modal visibility. |
| `onClose` | `() => void` | Fires when backdrop is clicked, close X is clicked, or after successful admin login. |
| `brandName` | `string` | The text shown in large bold font in the modal's colored header section. |
| `headerGradient` | `string` | Tailwind gradient classes for the header background. Override with your brand colors. |
| `title` | `string` | Contextual title text above the input. |
| `subtitle` | `string` | Contextual subtitle text below the title. |
| `onSendMagicLink` | `(email: string) => Promise<void>` | Action fired when submitting an email. Throw an Error inside the promise to display it. |
| `onAdminLogin` | `(password: string) => Promise<void>` | Action fired when admin credentials are submitted. |