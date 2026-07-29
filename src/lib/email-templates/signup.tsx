import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'
import { common } from './styles'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email for {siteName}</Preview>
    <Body style={common.main}>
      <Container style={common.container}>
        <Heading style={common.h1}>Confirm your email</Heading>
        <Text style={common.text}>
          Thanks for signing up for{' '}
          <Link href={siteUrl} style={common.link}>
            <strong>{siteName}</strong>
          </Link>
          .
        </Text>
        <Text style={common.text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={common.link}>
            {recipient}
          </Link>
          ) by clicking the button below:
        </Text>
        <Button style={common.button} href={confirmationUrl}>
          Verify Email
        </Button>
        <Text style={common.footer}>
          If you didn&apos;t create an account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail
