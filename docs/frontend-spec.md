# Frontend Specification - Usina de Cortes Virais

**Date:** 2026-03-12
**Agent:** @ux-design-expert (Uma)
**Phase:** 3 - Frontend Assessment

---

## Executive Summary

**Status:** Vanilla JS Single-Page Application (No Design System)

O frontend atual é um **arquivo único HTML** (463 linhas) com CSS inline e JavaScript vanilla. Funcional mas **não escalável** para SaaS multi-tenant.

---

## Current Frontend Architecture

### File Structure

```
public/
└── index.html (463 linhas)
    ├── CSS inline (<style>)
    ├── JavaScript inline (<script>)
    ├── Drop zone (drag & drop)
    ├── Upload handler
    ├── Progress display (SSE)
    └── Clips grid
```

### Technology Assessment

| Aspect | Current | SaaS Requirement | Gap |
|--------|---------|------------------|-----|
| Framework | ❌ Vanilla JS | React/Next.js/Vue | FULL REWRITE needed |
| State Management | ❌ Local variables | Redux/Zustand/Context | FULL REWRITE needed |
| Routing | ❌ Single page | Multi-route dashboard | FULL REWRITE needed |
| Styling | ⚠️ Inline CSS | Tailwind/Design System | CSS Migration needed |
| Components | ❌ Monolithic HTML | Atomic components | FULL REWRITE needed |
| Build Tool | ❌ None | Vite/Webpack | Toolchain setup needed |
| Testing | ❌ None | Jest/Cypress/Playwright | Testing framework needed |

---

## User Journey Analysis

### Current User Flow

```
1. Load page → Check env status
2. Drag/drop video OR click to browse
3. Select file → Show file info
4. Click "Gerar Cortes Virais"
5. SSE events → Progress bar (5 steps)
6. Clips appear one-by-one → Grid
7. Click download OR copy description
8. Optional: "Limpar tudo" to reset
```

### SaaS User Flow (REQUIRED)

```
1. Landing page → "Try Free" OR "Sign In"
2. Sign Up → Email/password + payment setup
3. Dashboard → View credits balance, history
4. Upload video → File drop with credit preview
5. Process → Real-time progress + credit consumption
6. Results → Clips grid with download + share
7. History → View all past jobs, re-process
8. Billing → View invoices, add credits
9. Settings → Profile, API keys, preferences
```

**GAP:** Current flow covers ~10% of SaaS requirements.

---

## Component Inventory (Current)

### Existing Components (Hardcoded in index.html)

| Component | Lines | Reusability | Test Coverage |
|-----------|-------|-------------|----------------|
| DropZone | ~80 | ❌ None (inline) | 0% |
| FileInfo | ~20 | ❌ None | 0% |
| ProgressBar | ~25 | ❌ None | 0% |
| ClipCard | ~80 | ❌ Duplicated per clip | 0% |
| Button (Process) | ~15 | ❌ Inline | 0% |
| Button (Clear) | ~10 | ❌ Inline | 0% |

**Total Components:** ~230 lines
**Reusable Code:** ~0%

### Design Tokens (Embedded)

```css
/* Current "Tokens" (Hardcoded) */
--gradient-primary: linear-gradient(135deg, #ff6b6b, #ee5a24);
--bg-dark: #0a0a0f;
--bg-card: #111118;
--bg-input: #1a1a2e;
--text-main: #e0e0e0;
--text-muted: #888;
--border-color: #222;
--accent: #ff6b6b;
--accent-secondary: #f0932b;
```

**Problem:** Tokens hardcoded in CSS, not reusable across components.

---

## UX Heuristic Evaluation

### Current UX Strengths

✅ **Drag & drop interface** - Intuitive file upload
✅ **Real-time progress** - SSE provides good feedback
✅ **Simple copy-to-clipboard** - One-click description copy
✅ **Visual preview** - 9:16 aspect ratio clips grid
✅ **Error handling** - Clear error messages

### Current UX Weaknesses

❌ **No user authentication** - Can't persist any state
❌ **No credit visibility** - Users don't know cost before processing
❌ **No job history** - Can't re-download or re-process
❌ **No error recovery** - One failure = start over
❌ **No responsive beyond mobile** - Limited mobile optimization
❌ **No feedback on copy** - Visual cue only (clipboard API may fail)
❌ **No loading states** - No skeleton loaders or spinners

### WCAG 2.1 Accessibility Gap Analysis

| Criterion | Current | Target | Gap |
|-----------|---------|-------|-----|
| Color contrast | ⚠️ Partial (dark theme) | AA (4.5:1) | Need validation |
| Keyboard nav | ❌ None | Full keyboard support | COMPLETE |
| Screen reader | ❌ None | ARIA labels | COMPLETE |
| Focus management | ❌ None | Visible focus rings | COMPLETE |
| Error messaging | ⚠️ Basic | Structured errors | HIGH |
| Reduced motion | ❌ None | `prefers-reduced-motion` | MEDIUM |

**Accessibility Score:** ~15% (Severely below target 90%+)

---

## Design System Requirements for SaaS

### Atomic Design Structure (Required)

```
design-system/
├── atoms/
│   ├── Button/
│   ├── Input/
│   ├── Progress/
│   ├── Card/
│   └── Icon/
├── molecules/
│   ├── DropZone/
│   ├── FileUpload/
│   ├── CreditBalance/
│   └── JobHistory/
├── organisms/
│   ├── ProcessingJob/
│   ├── ClipGrid/
│   └── BillingDashboard/
├── templates/
│   ├── Dashboard/
│   ├── Processing/
│   └── Settings/
└── pages/
    ├── Landing/
    ├── Dashboard/
    ├── Auth/
    └── Billing/
```

### Design Tokens (W3C DTCG Format)

```yaml
tokens:
  colors:
    primary:
      base: "#ff6b6b"
      light: "#ff8a8a"
      dark: "#cc4c4c"
    semantic:
      success: "#22c55e"
      warning: "#f59e0b"
      error: "#ef4444"
      info: "#3b82f6"
  spacing:
    xs: "0.25rem"
    sm: "0.5rem"
    md: "1rem"
    lg: "1.5rem"
    xl: "2rem"
  typography:
    font-family:
      base: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    font-size:
      xs: "0.75rem"
      sm: "0.875rem"
      base: "1rem"
      lg: "1.125rem"
      xl: "1.5rem"
    font-weight:
      normal: "400"
      medium: "500"
      semibold: "600"
      bold: "700"
  border-radius:
    sm: "0.25rem"
    md: "0.5rem"
    lg: "0.75rem"
    xl: "1rem"
  shadows:
    sm: "0 1px 2px rgba(0,0,0,0.1)"
    md: "0 4px 6px rgba(0,0,0,0.15)"
    lg: "0 10px 15px rgba(0,0,0,0.2)"
```

---

## Component Requirements for SaaS

### 1. Authentication Components

#### LoginForm
```tsx
interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: () => void;
  loading: boolean;
  error?: string;
}

Features:
  - Email input with validation
  - Password input with show/hide
  - "Remember me" checkbox
  - Error display
  - Loading state
  - Accessibility (ARIA labels)
```

#### RegisterForm
```tsx
interface RegisterFormProps {
  onRegister: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error?: string;
}

Features:
  - Email validation
  - Password strength meter
  - Terms of service checkbox
  - Inline validation
```

### 2. Dashboard Components

#### CreditBalance
```tsx
interface CreditBalanceProps {
  balance: number; // minutes available
  rate: number; // cost per minute
  currency: string;
}

Features:
  - Visual balance indicator (progress ring)
  - Estimated processing time remaining
  - "Add credits" CTA
  - Real-time updates (WebSocket/SSE)
```

#### JobHistory
```tsx
interface JobHistoryProps {
  jobs: ProcessingJob[];
  onReprocess: (jobId: string) => void;
  onDownload: (clipId: string) => void;
}

Features:
  - Filter by status/date
  - Sort by date/credits
  - Pagination
  - Quick actions (re-download, re-process)
  - Status badges
```

### 3. Processing Components

#### VideoUploader
```tsx
interface VideoUploaderProps {
  onUpload: (file: File) => void;
  creditsAvailable: number;
  maxFileSize: number; // bytes
}

Features:
  - Drag & drop with visual feedback
  - File picker with size preview
  - Credit cost estimate before upload
  - File validation (type, size)
  - Upload progress bar
  - Error handling with retry
```

#### ProcessingProgress
```tsx
interface ProcessingProgressProps {
  steps: ProcessingStep[];
  currentStep: number;
  creditsUsed: number;
  totalTime: number;
}

Features:
  - Step-by-step visualization
  - Real-time credit consumption
  - ETA calculation
  - Cancellable processing
  - Error recovery options
```

#### ClipGrid
```tsx
interface ClipGridProps {
  clips: GeneratedClip[];
  onDownload: (clipId: string) => void;
  onShare: (clipId: string, platform: string) => void;
  onCopyDescription: (clipId: string, platform: string) => void;
}

Features:
  - Grid layout (responsive)
  - Video preview (9:16)
  - Platform-specific descriptions
  - Bulk download
  - Share to platform buttons
```

### 4. Billing Components

#### BillingDashboard
```tsx
interface BillingDashboardProps {
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  onAddPayment: () => void;
  onPurchaseCredits: (amount: number) => void;
}

Features:
  - Invoice history with download
  - Payment method management
  - Credit purchase flow
  - Usage chart (credits over time)
```

### 5. Settings Components

#### UserProfile
```tsx
interface UserProfileProps {
  user: User;
  onUpdate: (updates: Partial<User>) => Promise<void>;
}

Features:
  - Email change with verification
  - Password update
  - API key management
  - Notification preferences
  - Account deletion
```

---

## Responsive Design Requirements

### Breakpoints

```css
--breakpoint-xs: 320px;   /* Mobile portrait */
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet portrait */
--breakpoint-lg: 1024px;  /* Tablet landscape / Desktop small */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Desktop large */
```

### Layout Adaptation

| Screen Size | Clip Grid | Dashboard | Forms |
|------------|-----------|-----------|-------|
| XS (320px) | 1 column | Stacked cards | Full width inputs |
| SM (640px) | 2 columns | Stacked cards | Full width inputs |
| MD (768px) | 2 columns | 2 columns | Form side-by-side |
| LG (1024px) | 3 columns | Sidebar + main | Form side-by-side |
| XL (1280px) | 4 columns | Sidebar + main | 3-column form |

---

## Technology Stack Recommendation

### Option 1: Next.js 14+ (RECOMMENDED)

**Why:**
- App Router for intuitive routing
- Server Components for performance
- Built-in API routes
- Server Actions for mutations
- Image optimization
- Great DX

**Migration:**
```bash
npx create-next-app@latest usina-saas
# Migrate current SSE logic to Server Actions
```

### Option 2: Vite + React

**When to use:**
- Full control needed
- Simpler build than Next.js
- Custom routing requirements

---

## State Management Strategy

### Zustand (Recommended)

```typescript
// store/processing.ts
interface ProcessingStore {
  currentJob: ProcessingJob | null;
  clips: GeneratedClip[];
  credits: number;
  setJob: (job: ProcessingJob) => void;
  addClip: (clip: GeneratedClip) => void;
  decrementCredits: (amount: number) => void;
}

export const useProcessingStore = create<ProcessingStore>((set) => ({
  currentJob: null,
  clips: [],
  credits: 0,
  setJob: (job) => set({ currentJob: job }),
  addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),
  decrementCredits: (amount) => set((state) => ({ credits: state.credits - amount })),
}));
```

---

## Testing Strategy

### Component Testing (Jest + React Testing Library)

```typescript
describe('ClipCard', () => {
  it('displays video preview', () => {
    render(<ClipCard clip={mockClip} />);
    expect(screen.getByTestId('clip-video')).toBeInTheDocument();
  });

  it('downloads on button click', async () => {
    const onDownload = jest.fn();
    render(<ClipCard clip={mockClip} onDownload={onDownload} />);
    fireEvent.click(screen.getByText('Download'));
    expect(onDownload).toHaveBeenCalledWith(mockClip.id);
  });
});
```

### E2E Testing (Playwright)

```typescript
test('complete processing flow', async ({ page }) => {
  await page.goto('/dashboard');

  // Login
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Upload
  await page.setInputFiles('input[type="file"]', 'test-video.mp4');
  await page.click('button:has-text("Process")');

  // Wait for completion
  await expect(page.locator('.clip-card')).toHaveCount(3);
});
```

---

## Technical Debt - Frontend Layer

### CRITICAL Issues

1. **No component architecture** - Monolithic HTML, no reusability
2. **No state management** - Variables lost on reload
3. **No routing** - Single page only, no navigation
4. **No authentication UI** - Login/signup completely missing
5. **No error boundaries** - Unhandled errors crash app
6. **No accessibility** - WCAG compliance near zero

### HIGH Priority

1. **No build tool** - No bundling, optimization, or code splitting
2. **No type safety** - Pure JavaScript, error-prone
3. **No testing** - Zero test coverage
4. **No design system** - Inline CSS, no tokenization
5. **No responsive design** - Limited mobile support

### MEDIUM Priority

1. **No internationalization** - Hardcoded Portuguese
2. **No theming** - Hardcoded dark theme
3. **No analytics** - No usage tracking
4. **No error logging** - Silent failures

---

## Migration Effort Estimate

### Component Migration (Atomic Design)

| Phase | Components | Lines of Code | Time Estimate |
|-------|-----------|----------------|---------------|
| Atoms (8) | ~1,200 | 1 week |
| Molecules (6) | ~900 | 4 days |
| Organisms (5) | ~1,500 | 5 days |
| Templates (4) | ~600 | 2 days |
| Pages (5) | ~1,800 | 4 days |
| **Total** | **~6,000** | **~4 weeks** |

### Feature Implementation (SaaS Only)

| Feature | Complexity | Time Estimate |
|---------|------------|---------------|
| Authentication (login/register) | Medium | 1 week |
| Credit management | Medium | 3 days |
| Dashboard layout | Low | 2 days |
| Job history | Medium | 3 days |
| Billing UI | High | 1.5 weeks |
| Settings page | Medium | 3 days |
| **Total** | | **~4.5 weeks** |

**Total Frontend Migration:** ~8-9 weeks

---

## Recommendations Summary

### IMMEDIATE (Week 1-2)

1. ✅ **Setup Next.js project** with TypeScript
2. ✅ **Create design system** (tokens + atoms)
3. ✅ **Implement authentication flow** (login/register)
4. ✅ **Setup state management** (Zustand)

### SHORT TERM (Week 3-6)

5. ✅ **Build core components** (molecules, organisms)
6. ✅ **Implement dashboard** (layout + pages)
7. ✅ **Create processing UI** (upload + progress)
8. ✅ **Add job history** with filtering

### MEDIUM TERM (Week 7-9)

9. ✅ **Build billing UI** (invoices + payments)
10. ✅ **Implement settings** (profile + preferences)
11. ✅ **Add testing** (unit + E2E)
12. ✅ **Accessibility audit** (WCAG AA compliance)

---

## Next Phase

Phase 4: Technical Debt Draft → @architect

---

**Frontend Spec Complete**
**Agent:** @ux-design-expert (Uma)
**Date:** 2026-03-12
**Status:** READY for Phase 4
