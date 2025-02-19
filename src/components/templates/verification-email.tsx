import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'

const bodyStyle = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  margin: '0 auto',
} as const

const containerStyle = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  margin: '0 auto',
  maxWidth: '512px',
  padding: '24px 0',
} as const

const headingStyle = {
  color: '#111',
  fontSize: '24px',
  fontWeight: 'bold',
} as const

const sectionStyle = {
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center',
} as const

const codeStyle = {
  backgroundColor: '#FF6363',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontFamily: 'monospace',
  fontSize: '32px',
  letterSpacing: '4px',
  padding: '16px 24px',
} as const

const hintStyle = {
  color: '#555',
  fontSize: '14px',
  textAlign: 'center',
} as const

const footerStyle = {
  color: '#777',
  fontSize: '14px',
  textAlign: 'center',
} as const

interface VerificationEmailProps {
  verificationCode: string
}

export default function VerificationEmail({ verificationCode }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Preview>Here is your verification code: {verificationCode}.</Preview>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>Your verification code</Heading>
          <Section style={sectionStyle}>
            <Text style={codeStyle}>{verificationCode}</Text>
            <Text style={hintStyle}>If you didn&apos;t request this, please ignore this email.</Text>
          </Section>
          <Text style={footerStyle}>Noterfly Team</Text>
        </Container>
      </Body>
    </Html>
  )
}
