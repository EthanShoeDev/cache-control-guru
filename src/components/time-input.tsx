import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { createSignal, Show, type Component } from 'solid-js';

type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days';

interface TimeInputProps {
  label: string;
  value: number;
  unit: TimeUnit;
  enabled: boolean;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: TimeUnit) => void;
  onEnabledChange: (enabled: boolean) => void;
  description?: string;
  class?: string;
  disabled?: boolean;
}

export const TimeInput: Component<TimeInputProps> = (props) => {
  const [focused, setFocused] = createSignal(false);

  const handleValueChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    props.onValueChange(isNaN(value) ? 0 : value);
  };

  const handleUnitChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    props.onUnitChange(select.value as TimeUnit);
  };

  return (
    <div class={cn('relative space-y-2', props.class)}>
      <div class="flex items-center space-x-2">
        <Checkbox 
          checked={props.enabled} 
          onChange={props.onEnabledChange}
          id={`${props.label.toLowerCase().replace(/\s+/g, '-')}-enabled`}
          disabled={props.disabled}
        />
        <label 
          for={`${props.label.toLowerCase().replace(/\s+/g, '-')}-enabled`}
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {props.label}
        </label>
      </div>
      
      <Show when={props.enabled}>
        <div class="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="1"
            class={cn(
              'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              focused() && 'ring-1 ring-ring',
            )}
            value={props.value}
            onInput={handleValueChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={props.disabled}
          />
          
          <select
            value={props.unit}
            onChange={handleUnitChange}
            class="inline-flex h-9 min-w-[100px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            disabled={props.disabled}
          >
            <option value="seconds">seconds</option>
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
          </select>
        </div>
        <Show when={props.description}>
          <p class="text-sm text-muted-foreground">{props.description}</p>
        </Show>
      </Show>
    </div>
  );
};