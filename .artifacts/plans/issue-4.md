# Implementation Plan: Theme Toggle Feature

**Issue:** [#4 Missing theme toggle](https://github.com/evanrooijen/ozu-web/issues/4)

## Goal

Implement a theme toggle that allows users to switch between light and dark modes, with automatic detection of system preference on first visit. The implementation must:
1. Detect and apply the user's system color scheme preference (`prefers-color-scheme`) on initial load
2. Allow users to toggle between light and dark modes explicitly
3. Persist the user's choice to localStorage
4. Display a toggle button in the UI
5. Avoid flash of unstyled content (FOUC) on page load

## Scope

**In scope:**
- Install and configure `next-themes` package (shadcn's official recommendation for Next.js)
- Create a theme provider wrapper component
- Create a theme toggle button component using lucide-react icons
- Update the root layout to wrap content with the theme provider
- Configure the provider to use `class` attribute, system preference detection, and localStorage persistence

**Out of scope:**
- Changes to existing CSS or dark mode styles (already complete)
- System-level OS theme integration beyond CSS media query detection
- Custom theme provider implementation (using next-themes instead)

## Phases

### Phase 1: Install next-themes
**Command:**
```bash
npm install next-themes
```

**Verification:**
```bash
npm ls next-themes
```

This installs the official shadcn/ui recommended package for theme management in Next.js.

### Phase 2: Create Theme Provider
**File:** `components/theme-provider.tsx` (new)

Create a wrapper around `next-themes` ThemeProvider for consistency with the project structure.

**Implementation:**
```typescript
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  )
}
```

**Configuration explained:**
- `attribute="class"` — Apply theme by toggling the `dark` class on `<html>`
- `defaultTheme="system"` — Default to system preference
- `enableSystem={true}` — Automatically detect and respect `prefers-color-scheme`

**Tests:**
- Verify next-themes provider wraps the app correctly
- Verify no hydration warnings

**Verification:**
```bash
npm run build && npm run lint
```

### Phase 3: Install shadcn Dropdown Menu
**Command:**
```bash
npx shadcn-ui@latest add dropdown-menu
```

This installs the shadcn/ui dropdown menu component, which provides accessible menu functionality.

**Verification:**
```bash
ls components/ui/dropdown-menu.tsx
```

### Phase 4: Create Theme Toggle Menu
**File:** `components/theme-toggle.tsx` (new)

Create a dropdown menu component that uses the `useTheme` hook from next-themes to switch between light and dark modes.

**Implementation:**
```typescript
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Design notes:**
- Dropdown menu provides three explicit options: Light, Dark, System
- Icons rotate/scale to indicate current theme (animation on transition)
- Aligns to the right for typical top-right placement
- Includes "System" option so users can reset to automatic preference detection

**Tests:**
- Verify dropdown menu renders and opens on click
- Verify all three options are clickable
- Verify selecting an option changes the theme
- Verify icon updates correctly
- Verify no hydration warnings

**Verification:**
```bash
npm run build && npm run lint
```

### Phase 5: Update Root Layout
**File:** `app/layout.tsx` (modify)

Wrap the layout with `ThemeProvider` and add the `suppressHydrationWarning` prop to the `<html>` tag (recommended by next-themes).

Changes:
- Import `ThemeProvider` from `'@/components/theme-provider'`
- Import `ThemeToggle` from `'@/components/theme-toggle'`
- Add `suppressHydrationWarning` to `<html>` tag
- Wrap `<body>` content with `<ThemeProvider>`
- Add `<ThemeToggle />` to a header or top-right area

**Expected result:** Root layout provides theme context and displays toggle menu in the UI.

**Tests:**
- Verify the app loads without hydration errors
- Verify the toggle menu appears and is visible
- Verify clicking menu options changes theme immediately
- Verify theme persists across page reloads
- Verify system preference is applied on first visit (in incognito/fresh localStorage)

**Verification:**
```bash
npm run dev
# Open http://localhost:3000
# Check DevTools: verify <html class="dark"> applies/removes
# Verify localStorage has 'theme' after selecting option
# Refresh page: verify theme persists
# Clear localStorage and system preference to light: refresh, verify light mode applies
npm run build
npm run lint
```

### Phase 6: Test & Integration
**Verification checklist:**
- [ ] No build errors: `npm run build`
- [ ] No lint errors: `npm run lint`
- [ ] No console warnings or errors on load
- [ ] Theme changes immediately when menu option selected (no flicker)
- [ ] Theme persists across navigation and page reloads
- [ ] System preference is respected on first visit (fresh browser/localStorage cleared)
- [ ] Dark mode styles are visible and correct
- [ ] Light mode styles are visible and correct
- [ ] Toggle menu is accessible (keyboard navigable, proper ARIA labels)
- [ ] Icon rotates/scales with theme change
- [ ] No hydration mismatch warnings in browser console

## Risks

1. **Hydration mismatch:** If theme is applied after SSR, there will be a flash. Mitigated by:
   - Using `useEffect` to apply theme only client-side
   - Checking `mounted` before rendering context value
   - Can be further improved with a script tag in `<head>` if needed in future

2. **System preference detection fails:** Some older browsers may not support `prefers-color-scheme`. Mitigated by:
   - Defaulting to `light` mode if detection fails
   - User can always manually set preference

3. **localStorage unavailable (privacy mode):** Reading/writing localStorage may fail silently. Mitigated by:
   - Wrapping in try/catch if needed
   - Fallback to system preference

## Assumptions

- The `.dark` class mechanism in globals.css is the correct way to apply dark mode (verified in code)
- Lucide React icons (`Moon`, `Sun`) are available and installed (already in package.json)
- Button component from shadcn/ui is accessible and suitable for the toggle (verified in code)
- localStorage key `ozu-theme` is acceptable (no conflict with other keys)
- Toggle button placement in header/top-right is acceptable (maintainer can adjust position)
- No explicit "System Auto" option needed initially (simple light/dark toggle)

## Open Questions

- Where in the layout should the `ThemeToggle` button be positioned? (Suggested: top-right corner in a header, can be adjusted after implementation)
