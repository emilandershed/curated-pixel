/**
 * Shared email style constants for Faint Line.
 *
 * Email clients have limited CSS support, so these are intentionally simple:
 * inline-friendly values, system/Web-safe font stacks, and high-contrast
 * neutrals that work regardless of the recipient's dark/light preference.
 */

export const colors = {
  background: '#ffffff',
  foreground: '#1a1a1a',
  heading: '#111111',
  text: '#444444',
  muted: '#666666',
  footer: '#999999',
  button: '#111111',
  buttonText: '#ffffff',
  border: '#e5e5e5',
} as const

export const fonts = {
  display: '"Instrument Serif", Georgia, "Times New Roman", serif',
  sans: '"Work Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const

export const spacing = {
  containerPadding: '40px 32px',
  sectionGap: '24px',
  buttonPadding: '14px 24px',
} as const

export const common = {
  main: {
    backgroundColor: colors.background,
    fontFamily: fonts.sans,
    color: colors.foreground,
  },
  container: {
    padding: spacing.containerPadding,
    maxWidth: '520px',
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: '32px',
    fontWeight: 400,
    color: colors.heading,
    margin: '0 0 24px',
    lineHeight: 1.15,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: '22px',
    fontWeight: 400,
    color: colors.heading,
    margin: '0 0 16px',
  },
  text: {
    fontSize: '15px',
    color: colors.text,
    lineHeight: '1.6',
    margin: '0 0 24px',
  },
  link: {
    color: colors.foreground,
    textDecoration: 'underline',
  },
  button: {
    backgroundColor: colors.button,
    color: colors.buttonText,
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '4px',
    padding: spacing.buttonPadding,
    textDecoration: 'none',
    display: 'inline-block',
  },
  code: {
    fontFamily: fonts.mono,
    fontSize: '28px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    color: colors.heading,
    margin: '0 0 24px',
  },
  footer: {
    fontSize: '12px',
    color: colors.footer,
    margin: '32px 0 0',
  },
  note: {
    fontSize: '13px',
    color: colors.muted,
    lineHeight: '1.5',
    margin: '24px 0 0',
  },
} as const
