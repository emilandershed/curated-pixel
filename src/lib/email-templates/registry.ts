import type { ComponentType } from 'react'
import { template as downloadReadyTemplate } from './download-ready'
import { template as contactMessageTemplate } from './contact-message'
import { template as waitlistConfirmationTemplate } from './waitlist-confirmation'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'download-ready': downloadReadyTemplate,
  'contact-message': contactMessageTemplate,
  'waitlist-confirmation': waitlistConfirmationTemplate,
}
