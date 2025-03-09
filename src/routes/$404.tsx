import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/$404')({
  component: NotFound,
});

function NotFound() {
  return (
    <div class="container mx-auto flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 class="text-9xl font-bold text-gray-300">404</h1>
      <h2 class="mt-4 text-2xl font-bold">Page Not Found</h2>
      <p class="text-muted-foreground mt-2">
        We couldn't find the page you're looking for.
      </p>
      <a
        href="/"
        class="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 rounded-md px-4 py-2 text-sm font-medium"
      >
        Go back home
      </a>
    </div>
  );
}
