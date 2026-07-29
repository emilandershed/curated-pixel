import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { brand, DOWNLOAD_TOKEN_VALID_DAYS } from '@/config/brand'
import type { TemplateEntry } from './registry'

interface DownloadReadyEmailProps {
  orderUrl?: string
  validDays?: number
  links?: Array<{ title?: string; url?: string }>
}

export const DownloadReadyEmail = ({
  orderUrl,
  validDays = DOWNLOAD_TOKEN_VALID_DAYS,
  links = [],
}: DownloadReadyEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {brand.name} wallpapers are ready for download</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your wallpapers are ready</Heading>
        <Text style={text}>
          Thanks for your order from {brand.name}. Your download links are below
          — each album includes both iPhone (9:16) and MacBook (16:9) formats.
        </Text>

        {links.length > 0 && (
          <Section style={linksSection}>
            {links.map((link, index) => (
              <React.Fragment key={index}>
                <Link href={link.url} style={linkStyle}>
                  {link.title ?? `Download ${index + 1}`}
                </Link>
              </React.Fragment>
            ))}
          </Section>
        )}

        <Button style={button} href={orderUrl}>
          Open download page
        </Button>

        <Text style={note}>
          Your links stay valid for {validDays} days. If the email doesn&apos;t
          arrive, you can also resend your link from the contact page at any
          time.
        </Text>
        <Text style={footer}>
          {brand.name} — {brand.tagline}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DownloadReadyEmail,
  subject: `Your ${brand.name} downloads are ready`,
  displayName: 'Download ready',
  previewData: {
    orderUrl: 'https://faintline.shop/thank-you?order=sample-token',
    validDays: DOWNLOAD_TOKEN_VALID_DAYS,
    links: [
      { title: 'Nordic Mist', url: 'https://faintline.shop/api/public/download/sample-token-1' },
      { title: 'All-in-One Bundle', url: 'https://faintline.shop/api/public/download/sample-token-2' },
    ],
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
  fontSize: '32px',
  fontWeight: 400,
  color: '#111111',
  margin: '0 0 24px',
  lineHeight: 1.15,
}

const text = {
  fontSize: '15px',
  color: '#444444',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const linksSection = {
  margin: '0 0 28px',
}

const linkStyle = {
  display: 'block',
  fontSize: '15px',
  color: '#111111',
  textDecoration: 'underline',
  margin: '0 0 12px',
}

const button = {
  backgroundColor: '#111111',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 500,
  borderRadius: '4px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
}

const note = {
  fontSize: '13px',
  color: '#666666',
  lineHeight: '1.5',
  margin: '28px 0 0',
}

const footer = {
  fontSize: '12px',
  color: '#999999',
  margin: '32px 0 0',
}
