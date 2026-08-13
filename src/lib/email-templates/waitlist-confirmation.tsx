import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import { brand } from '@/config/brand'
import { common } from './styles'
import type { TemplateEntry } from './registry'

/**
 * Short, plain confirmation that an email address was registered as interest in
 * a design that is still being tested. It deliberately promises nothing: no
 * price, no date, no product claim.
 */
export const WaitlistConfirmationEmail = () => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`You're on the ${brand.name} list`}</Preview>
    <Body style={common.main}>
      <Container style={common.container}>
        <Heading style={common.h1}>You&apos;re on the list</Heading>
        <Text style={common.text}>
          Thanks for registering your interest. The design is still being tested — if
          we decide to make it, you&apos;ll hear from us first.
        </Text>
        <Text style={common.text}>
          Nothing has been charged and nothing has been ordered. That&apos;s all for now.
        </Text>
        <Text style={common.footer}>{brand.name} — {brand.legal.address}</Text>
      </Container>
    </Body>
  </Html>
)

export const template: TemplateEntry = {
  component: WaitlistConfirmationEmail,
  subject: `You're on the ${brand.name} list`,
  displayName: 'Waitlist confirmation',
  previewData: {},
}

export default WaitlistConfirmationEmail
