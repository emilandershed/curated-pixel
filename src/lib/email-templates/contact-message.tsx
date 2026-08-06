import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { brand } from '@/config/brand'
import type { TemplateEntry } from './registry'

interface ContactMessageEmailProps {
  name?: string
  email?: string
  message?: string
}

export const ContactMessageEmail = ({
  name,
  email,
  message,
}: ContactMessageEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New ${brand.name} contact message from ${name ?? 'a visitor'}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New contact message</Heading>
        <Section style={meta}>
          <Text style={metaLine}>
            <strong>From:</strong> {name ?? 'Unknown'}
          </Text>
          <Text style={metaLine}>
            <strong>Email:</strong> {email ?? 'Unknown'}
          </Text>
        </Section>
        <Text style={body}>{message ?? '(no message)'}</Text>
        <Text style={footer}>
          Sent from the {brand.name} contact form. Reply directly to reach the
          customer.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactMessageEmail,
  subject: `New ${brand.name} contact message`,
  displayName: 'Contact message',
  to: 'emil@andershed.se',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'My download link expired — can you help?',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Work Sans", ui-sans-serif, system-ui, sans-serif',
  color: '#1a1a1a',
}

const container = {
  padding: '40px 32px',
  maxWidth: '520px',
}

const h1 = {
  fontFamily: '"Instrument Serif", ui-serif, Georgia, serif',
  fontSize: '28px',
  fontWeight: 400,
  color: '#111111',
  margin: '0 0 24px',
  lineHeight: 1.15,
}

const meta = {
  margin: '0 0 20px',
}

const metaLine = {
  fontSize: '14px',
  color: '#444444',
  margin: '0 0 6px',
}

const body = {
  fontSize: '15px',
  color: '#111111',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
  margin: '0',
}

const footer = {
  fontSize: '12px',
  color: '#999999',
  margin: '32px 0 0',
}
