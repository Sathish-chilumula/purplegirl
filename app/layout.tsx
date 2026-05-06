// app/layout.tsx
// This is the mandatory root layout for Next.js.
// It intentionally does not render <html> or <body> — that is handled by:
//   - app/[lang]/layout.tsx  → all public pages
//   - app/admin/layout.tsx   → admin panel
// The middleware.ts rewrites all root requests to /[lang]/... internally.

export default function MinimalRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
