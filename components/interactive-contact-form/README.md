# Interactive Contact Form

A generic, multi-step, lead-generation contact form. Extracted and abstracted from a complex high-converting pre-launch registration page.

## Features
- **Categorized Flows**: Splits users into `PROFESSIONAL` (B2B) vs `INDIVIDUAL` (B2C) paths with distinct requirements.
- **Typeform-Style Steps**: Asks one question at a time using Framer Motion for smooth, focused transitions.
- **Smart Progress Bar**: Automatically calculates completion percentage based on the active path.
- **Simulated Chat End-State**: On success, displays a terminal/chatbot style "typewriter" animation summarizing the result.
- **Fully Decoupled**: The component collects data and passes it to an asynchronous `onSubmit` promise. You handle the API calls, database persistence, and external routing.

## Installation

Ensure you have framer-motion and lucide-react.

```sh
npm install framer-motion lucide-react clsx tailwind-merge
```

## Usage

```tsx
import { InteractiveContactForm, FormData, LeadType } from '@/components/interactive-contact-form/InteractiveContactForm';

export default function ContactPage() {
  const handleSubmit = async (data: FormData, type: LeadType) => {
    // 1. You receive standard JS objects.
    // 2. Call your CRM, SendGrid, or Next.js API Route
    await fetch('/api/lead', {
      method: 'POST',
      body: JSON.stringify({ ...data, leadType: type })
    });
  };

  const handleClose = () => {
    // Optional: Route the user back to the homepage
    window.location.href = '/';
  };

  return (
    <InteractiveContactForm
      title="Partner with Us"
      subtitle="Select the category that best describes you."
      chatGreeting="Thanks for reaching out! We'll review your details and an agent will contact you within 24 hours."
      submitText="Send Application"
      themeClass="bg-blue-600 hover:bg-blue-700" 
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  );
}
```

## Props

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `title` | `string` | Main header and initial greeting title. |
| `subtitle` | `string` | Text displayed underneath the initial title. |
| `chatGreeting` | `string` | The text that acts as a simulated chatbot response upon successful submission. Automatically injects the user's First Name. |
| `submitText` | `string` | Label on the final step's submission button. |
| `consentText` | `React.ReactNode` | Markdown or standard text representing GDPR/Privacy consent terms shown before submit. |
| `themeClass` | `string` | Utility classes injected into the progress bar and primary buttons (e.g. `bg-emerald-500 text-white`). |
| `onSubmit` | `(data: FormData, type: LeadType) => Promise<void>` | Critical: Receives the deeply merged form data object and fires the backend promise. |
| `onClose` | `() => void` | Optional. Fired when clicking the Back arrow on step 1, or "Return Home" after success. |