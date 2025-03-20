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

interface EmailVerificationProps {
  url: string;
  name: string;
}

export const EmailVerification = ({ url, name }: EmailVerificationProps) => {
  const previewText = `Verify your email address for Expedius`;

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
                Welcome, {name}!
              </Heading>
              <Text className="my-4 text-base leading-6 text-muted-foreground">
                Thanks for signing up with Expedius. We&apos;re excited to help
                you discover and share your favorite places from around the
                world.
              </Text>
              <Text className="my-4 text-base leading-6 text-muted-foreground">
                Please verify your email address to get started.
              </Text>
              <Button
                href={url}
                className="mb-4 mt-6 block w-full rounded-md bg-primary px-5 py-3 text-center text-base font-bold text-primary-foreground no-underline"
              >
                Verify your email
              </Button>
              <Text className="my-4 text-base leading-6 text-muted-foreground">
                If the button doesn&apos;t work, you can also verify by clicking
                this link:
              </Text>
              <Text className="my-4 text-base leading-6 text-muted-foreground">
                <Link href={url} className="text-primary underline">
                  {url}
                </Link>
              </Text>
              <Text className="my-4 text-base leading-6 text-muted-foreground">
                This verification link will expire in 24 hours.
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
