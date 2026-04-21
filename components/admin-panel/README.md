# AI-Ready Admin Panel Kit

A fully generic, responsive, and beautifully animated Admin UI Kit built with React, Tailwind CSS, Lucide Icons, and Framer Motion. This kit extracts the core layout and dashboard structure from high-end e-commerce applications and makes them reusable across any project without business-logic tie-in.

## What's Included?

1. `AdminLayout.tsx`: The application shell. Handles mobile/desktop responsiveness, sidebar navigation, user profile block, and top-bar actions.
2. `AdminDashboard.tsx`: A robust overview dashboard. Includes animated stat cards with trend indicators, recent activity tables, and quick action panels.
3. `types.ts`: Comprehensive TypeScript definitions specifying exactly what data the components expect.

## Philosophy
* **Structure over State**: The components don't fetch data, handle auth, or dictate routing. You pass arrays of items (`stats`, `navigation`, `recentActivities`), and the kit renders it perfectly.
* **Dark-Mode Compatible**: By using standard Tailwind CSS semantic color variables (`bg-background`, `text-foreground`, `bg-primary`), this kit natively supports Dark Mode without extra effort.
* **Fluid**: All elements enter the screen with smooth `framer-motion` enter animations and hover states.

## Installation

Ensure you have the required dependencies:
```sh
npm install framer-motion lucide-react clsx tailwind-merge
```

Make sure your `tailwind.config.js` uses standard semantic color variables (like `var(--primary)`, `var(--muted)`).

## Usage Example

### 1. App Layout Wrap

Wrap your admin routes with the `AdminLayout` component. Pass your own generic navigation links and handle routing via callbacks.

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Settings } from 'lucide-react';
import { AdminLayout } from '@/components/admin-panel/AdminLayout';

export default function MyAdminApp({ children }) {
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/admin/dashboard');

  const navigationItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users, badge: 12 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <AdminLayout
      brandName="SaaS Core"
      navigation={navigationItems}
      currentPath={currentPath}
      user={{ name: "John Doe", email: "john@example.com", role: "Super Admin" }}
      onNavigate={(href) => {
        setCurrentPath(href);
        navigate(href);
      }}
      onLogout={() => console.log('Log out action')}
    >
      {/* Route Content goes here */}
      {children}
    </AdminLayout>
  );
}
```

### 2. Render the Dashboard Overview

Inside your dashboard route, use the `AdminDashboard` component to display key metrics and activity.

```tsx
import { ShoppingCart, Users, DollarSign } from 'lucide-react';
import { AdminDashboard } from '@/components/admin-panel/AdminDashboard';
import type { StatData, RecentActivity } from '@/components/admin-panel/types';

export default function DashboardRoute() {
  const stats: StatData[] = [
    {
      label: "Total Revenue",
      value: "$45,231.89",
      icon: DollarSign,
      change: "+20.1%",
      changeType: "positive"
    },
    {
      label: "Active Users",
      value: "+2350",
      icon: Users,
      change: "+180",
      changeType: "positive"
    }
  ];

  const activities: RecentActivity[] = [
    {
      id: "1",
      title: "New Subscription",
      subtitle: "Pro Plan - Annual",
      status: "COMPLETED",
      statusColor: "green",
      amount: "$120.00",
      date: "2 hours ago"
    }
  ];

  return (
    <AdminDashboard
      title="Overview"
      subtitle="Here is what is happening today."
      stats={stats}
      recentActivities={activities}
    />
  );
}
```

## Props Reference

### `AdminLayout`
- `brandName`: string or ReactNode. The logo/text at the top of the sidebar.
- `navigation`: Array of `NavigationItem`.
- `currentPath`: string. Used to highlight active nav link.
- `user`: Object with `name`, `email`, `avatarUrl`, and `role`. Places a user identity block at the bottom.
- `headerActions`: ReactNode slot for custom top-bar buttons (like Theme Toggles or Language Switchers).
- `onNavigate`: Function called with the `href` of the clicked nav item.

### `AdminDashboard`
- `title`: Main heading text.
- `subtitle`: Subtext below heading.
- `stats`: Array of `StatData` to render the animated top top cards. Needs a `lucide-react` icon reference.
- `recentActivities`: Array to render the unified activity table.
- `children`: A custom slot below the table for your own generic charts (`recharts`, `chart.js`, etc).