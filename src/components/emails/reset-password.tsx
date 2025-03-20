import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ResetPasswordProps {
  url: string;
  name: string;
}

export const ResetPassword = ({ url, name }: ResetPasswordProps) => {
  const previewText = `Reset your password for Expedius`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#f9fafb] font-sans">
          <Container className="mx-auto my-0 max-w-[600px] px-0 py-12">
            <Heading className="px-5 text-center text-2xl font-bold text-primary">
              Expedius
            </Heading>
            <Section className="my-4 rounded-lg bg-white p-8 shadow-sm">
              <Heading className="my-4 p-0 text-2xl font-bold text-foreground">
                Password Reset Request
              </Heading>
              <Text className="my-4 text-base leading-6 text-muted-foreground">
                Hi {name}, we received a request to reset your password for your
                Expedius account.
              </Text>
              <Text className="my-4 text-base leading-6 text-muted-foreground">
                Click the button below to reset your password. If you
                didn&apos;t request a password reset, you can safely ignore this
                email.
              </Text>
              <Button
                href={url}
                className="mb-4 mt-6 block w-full rounded-md bg-primary px-5 py-3 text-center text-base font-bold text-primary-foreground no-underline"
              >
                Reset Password
              </Button>
              <Text className="my-4 text-base leading-6 text-muted-foreground">
                If the button doesn&apos;t work, you can also reset your
                password by clicking this link:
              </Text>
              <Text className="my-4 text-base leading-6 text-muted-foreground">
                <Link href={url} className="text-primary underline">
                  {url}
                </Link>
              </Text>
              <Text className="my-4 text-base leading-6 text-muted-foreground">
                This password reset link will expire in 1 hour for security
                reasons.
              </Text>
            </Section>
            <Hr className="my-6 border-border" />
            <Text className="my-2 text-center text-sm text-muted-foreground/70">
              © {new Date().getFullYear()} Expedius. All rights reserved.
            </Text>
            <Text className="my-2 mb-4 text-center text-sm text-muted-foreground/50">
              Find, organize, and share your favourite places from around the
              world.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
