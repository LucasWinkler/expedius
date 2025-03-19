import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const HomeFaq = () => {
  return (
    <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-y-12 px-2 lg:grid-cols-[1fr_1fr]">
          <div className="text-center lg:text-left">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              Frequently <br className="hidden lg:block" /> Asked{" "}
              <br className="hidden lg:block" />
              Questions
            </h2>
            <p>Common questions about Expedius</p>
          </div>

          <div className="w-full sm:mx-auto sm:max-w-lg lg:mx-0 lg:max-w-none">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="free" className="w-full">
                <AccordionTrigger className="w-full text-left font-medium">
                  Is Expedius completely free to use?
                </AccordionTrigger>
                <AccordionContent className="w-full text-muted-foreground">
                  Yes, Expedius is completely free to use. There are no premium
                  plans or hidden fees.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="report-bug" className="w-full">
                <AccordionTrigger className="w-full text-left font-medium">
                  How can I report a bug or suggest a feature?
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <p className="text-muted-foreground">
                    You can report bugs or suggest features in several ways:
                  </p>
                  <ul className="mt-2 list-outside list-disc space-y-2 pl-4">
                    <li className="text-muted-foreground">
                      Email:{" "}
                      <a
                        href="mailto:hello@lucaswinkler.dev"
                        className="underline hover:text-primary"
                      >
                        hello@lucaswinkler.dev
                      </a>
                    </li>
                    <li className="text-muted-foreground">
                      Open an issue on{" "}
                      <a
                        href="https://github.com/LucasWinkler/expedius"
                        className="underline hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contribute" className="w-full">
                <AccordionTrigger className="w-full text-left font-medium">
                  How can I contribute to Expedius?
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <p className="text-muted-foreground">
                    Contributions are welcome! Here&apos;s how you can
                    contribute:
                  </p>
                  <ol className="mt-2 list-outside list-decimal space-y-2 pl-4">
                    <li className="text-muted-foreground">
                      Fork the repository on{" "}
                      <a
                        href="https://github.com/LucasWinkler/expedius"
                        className="underline hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    </li>
                    <li className="text-muted-foreground">
                      Create your feature branch (
                      <code className="rounded bg-muted px-1 py-0.5">
                        git checkout -b feature/amazing-feature
                      </code>
                      )
                    </li>
                    <li className="text-muted-foreground">
                      Commit and push your changes
                    </li>
                    <li className="text-muted-foreground">
                      Open a pull request
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="creator" className="w-full">
                <AccordionTrigger className="w-full text-left font-medium">
                  Who created Expedius?
                </AccordionTrigger>
                <AccordionContent className="w-full text-muted-foreground">
                  Expedius was created and is maintained by Lucas Winkler. You
                  can find more of his work on{" "}
                  <a
                    href="https://github.com/LucasWinkler"
                    className="underline hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                  .
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="limits" className="w-full">
                <AccordionTrigger className="w-full text-left font-medium">
                  Are there any usage limits?
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <p className="text-muted-foreground">
                    While Expedius is free to use, there are some technical
                    limitations:
                  </p>
                  <ul className="mt-2 list-outside list-disc space-y-2 pl-4">
                    <li className="text-muted-foreground">
                      We implement rate limiting to ensure fair usage and system
                      stability
                    </li>
                    <li className="text-muted-foreground">
                      Place data comes from Google Places API, which has its own
                      quota limits that we must adhere to
                    </li>
                    <li className="text-muted-foreground">
                      During peak usage times, you might experience temporary
                      slowdowns in place search or creation
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};
