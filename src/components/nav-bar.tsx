import { ThemeSwitch } from '@/components/theme-switch';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/solid-router';

type NavProps = {
  class?: string;
};

export default function NavBar(props: NavProps) {
  return (
    <nav class={cn('bg-background border-b', props.class)}>
      <div class="container mx-auto flex items-center justify-between p-4">
        <div class="flex items-center gap-6">
          <Link to="/" class="text-primary text-lg font-semibold">
            Cache-Control Guru
          </Link>
          <ul class="flex items-center gap-4">
            <Link to="/" class="px-1">
              {({ isActive }) => (
                <li
                  class={cn(
                    'border-b-2 transition-colors',
                    isActive
                      ? 'border-primary text-foreground font-medium'
                      : 'hover:border-primary/50 text-muted-foreground hover:text-foreground border-transparent',
                  )}
                >
                  Home
                </li>
              )}
            </Link>
            <Link to="/about" class="px-1">
              {({ isActive }) => (
                <li
                  class={cn(
                    'border-b-2 transition-colors',
                    isActive
                      ? 'border-primary text-foreground font-medium'
                      : 'hover:border-primary/50 text-muted-foreground hover:text-foreground border-transparent',
                  )}
                >
                  About
                </li>
              )}
            </Link>
          </ul>
        </div>
        <div class="flex items-center gap-4">
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            MDN Reference
          </a>
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
