import { createSignal, type Component } from 'solid-js';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HeaderDisplayProps {
  headerValue: string;
  class?: string;
}

export const HeaderDisplay: Component<HeaderDisplayProps> = (props) => {
  const [copied, setCopied] = createSignal(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.headerValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  return (
    <div class={cn('space-y-3', props.class)}>
      <h2 class="text-xl font-semibold">Generated Header</h2>
      <Card class="p-4 relative">
        <pre class="font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
          {props.headerValue || 'No header generated yet'}
        </pre>
        {props.headerValue && (
          <Button 
            variant="outline" 
            size="sm" 
            class="absolute top-2 right-2"
            onClick={copyToClipboard}
          >
            {copied() ? 'Copied!' : 'Copy'}
          </Button>
        )}
      </Card>
    </div>
  );
};