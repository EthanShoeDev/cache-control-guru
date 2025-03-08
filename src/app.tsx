import Nav from '@/components/nav';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeScript } from '@/components/theme-script';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import './app.css';

export default function App() {
  return (
    <>
      <ThemeScript />
      <ThemeProvider>
        <Router
          root={(props) => (
            <div class="bg-background text-foreground min-h-screen">
              <Nav />
              <Suspense>{props.children}</Suspense>
            </div>
          )}
        >
          <FileRoutes />
        </Router>
      </ThemeProvider>
    </>
  );
}
