export const tailwindPatterns = {
  colors: {
    appBackground: '#0A0E27',
    surface: '#1a202c',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    accent: '#3b82f6'
  },
  typography: {
    pageTitle: 'text-lg font-bold tracking-tight text-md3-on-surface',
    sectionTitle: 'text-base font-semibold tracking-tight',
    label: 'text-[11px] font-semibold uppercase tracking-[0.14em] text-md3-on-surface-variant',
    body: 'text-[13px] text-md3-on-surface',
    caption: 'text-[11px] font-medium text-md3-on-surface-variant'
  },
  layout: {
    appShell: 'grid min-h-screen grid-cols-1 gap-6 p-6 lg:grid-cols-[256px_1fr]',
    sectionStack: 'space-y-6',
    cardPadding: 'p-6'
  },
  cards: {
    shell: 'md3-card',
    section: 'md3-card space-y-4 p-6',
    inline: 'rounded-lg border border-md3-outline bg-md3-surface-variant'
  },
  buttons: {
    primary: 'md3-button md3-button-primary',
    secondary: 'md3-button',
    sidebarItem: 'md3-button w-full justify-start gap-2'
  },
  inputs: {
    base: 'md3-input',
    compact: 'md3-input py-1.5 text-[12px]'
  },
  header: {
    container: 'flex h-16 items-center justify-between border-b border-md3-outline px-6'
  },
  sidebar: {
    container: 'md3-card h-fit space-y-4 p-4 lg:sticky lg:top-6',
    navItem: 'md3-button w-full justify-start gap-2'
  },
  interactions: {
    button: 'transition duration-200 ease-out hover:bg-white/[0.05] active:scale-[0.98]',
    card: 'transition duration-200 ease-out'
  }
} as const;

