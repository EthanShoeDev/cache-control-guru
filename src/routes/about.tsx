import { Card } from '@/components/ui/card';
import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/about')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main class="container mx-auto max-w-3xl px-4 py-8">
      <div class="space-y-8">
        <div class="space-y-2 text-center">
          <h1 class="text-4xl font-bold tracking-tight">
            About Cache-Control Guru
          </h1>
          <p class="text-muted-foreground text-xl">
            Your go-to resource for HTTP caching headers
          </p>
        </div>

        <Card class="p-6">
          <div class="prose dark:prose-invert max-w-none">
            <h2>What is Cache-Control?</h2>
            <p>
              The <code>Cache-Control</code> HTTP header field is used to
              specify browser caching policies in both client requests and
              server responses. Policies include how a resource is cached, where
              it's cached, and its maximum age before expiring.
            </p>

            <h2>Why is caching important?</h2>
            <p>
              Proper caching strategies can significantly improve web
              performance by:
            </p>
            <ul>
              <li>Reducing network traffic and bandwidth costs</li>
              <li>Lowering server load</li>
              <li>Decreasing page load times</li>
              <li>Improving user experience</li>
            </ul>

            <h2>About this tool</h2>
            <p>
              Cache-Control Guru helps you understand and generate optimal cache
              control headers for your web applications. The tool offers two
              main modes:
            </p>
            <ul>
              <li>
                <strong>Explain Mode:</strong> Paste in an existing
                cache-control header to understand what each directive means
              </li>
              <li>
                <strong>Generate Mode:</strong> Use a form-based interface to
                build the perfect cache-control header for your needs
              </li>
            </ul>

            <h2>Inspiration</h2>
            <p>
              This project was inspired by tools like{' '}
              <a
                href="https://crontab.guru/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline"
              >
                crontab.guru
              </a>{' '}
              and
              <a
                href="https://kurtextrem.de/cache"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline"
              >
                {' '}
                kurtextrem.de/cache
              </a>
              , which simplify complex technical specifications into
              user-friendly interfaces.
            </p>

            <h2>Learn more</h2>
            <p>
              For a comprehensive reference on Cache-Control headers, visit the
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline"
              >
                {' '}
                MDN Web Docs
              </a>
              .
            </p>

            <h2>Technologies</h2>
            <p>This application is built with:</p>
            <ul>
              <li>
                <a
                  href="https://docs.solidjs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline"
                >
                  SolidJS
                </a>{' '}
                - Reactive JavaScript library
              </li>
              <li>
                <a
                  href="https://tanstack.com/router/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline"
                >
                  TanStack Router
                </a>{' '}
                - Type-safe routing
              </li>
              <li>
                <a
                  href="https://shadcn-solid.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline"
                >
                  shadcn-solid
                </a>{' '}
                - UI components
              </li>
              <li>
                <a
                  href="https://kobalte.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline"
                >
                  Kobalte
                </a>{' '}
                - Accessible UI components
              </li>
              <li>
                <a
                  href="https://tailwindcss.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline"
                >
                  Tailwind CSS
                </a>{' '}
                - Styling
              </li>
            </ul>

            <h2>License</h2>
            <p>
              This project is open source and available under the MIT License.
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
