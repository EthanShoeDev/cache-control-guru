import { useLocation } from '@solidjs/router';
import { type Component } from 'solid-js';
import { cn } from '@/lib/utils';

interface NavProps {
  class?: string;
}

export default function Nav(props: NavProps) {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? 'border-primary text-foreground font-medium'
      : 'border-transparent hover:border-primary/50 text-muted-foreground hover:text-foreground';
  
  return (
    <nav class={cn('border-b bg-background', props.class)}>
      <div class="container mx-auto flex items-center justify-between p-4">
        <div class="flex items-center gap-6">
          <a href="/" class="font-semibold text-lg text-primary">
            Cache-Control Guru
          </a>
          <ul class="flex items-center gap-4">
            <li class={`border-b-2 ${active('/')} transition-colors`}>
              <a href="/" class="px-1">Home</a>
            </li>
            <li class={`border-b-2 ${active('/about')} transition-colors`}>
              <a href="/about" class="px-1">About</a>
            </li>
          </ul>
        </div>
        <div>
          <a 
            href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            MDN Reference
          </a>
        </div>
      </div>
    </nav>
  );
}
