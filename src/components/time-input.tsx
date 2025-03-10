import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { createSignal, Show, type Component } from 'solid-js';

export type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days';

type TimeInputProps = {
  label: string | ReturnType<Component>;
  value: number;
  unit: TimeUnit;
  enabled: boolean;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: TimeUnit) => void;
  onEnabledChange: (enabled: boolean) => void;
  description?: string;
  class?: string;
  disabled?: boolean;
};

export const convertTimeUnitToSeconds = (value: number, unit: TimeUnit): number => {
  switch (unit) {
    case 'minutes':
      return value * 60;
    case 'hours':
      return value * 60 * 60;
    case 'days':
      return value * 60 * 60 * 24;
    default:
      return value;
  }
};

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
          disabled={props.disabled}
        >
          <div class="flex items-center space-x-2">
            <CheckboxControl />
            <CheckboxLabel class="text-sm leading-none font-medium">
              {props.label}
            </CheckboxLabel>
          </div>
        </Checkbox>
      </div>

      <Show when={props.enabled}>
        <div class="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="1"
            class={cn(
              'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-muted-foreground',
              'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              focused() && 'ring-ring ring-1',
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
            class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring inline-flex h-9 min-w-[100px] items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={props.disabled}
          >
            <option value="seconds">seconds</option>
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
          </select>
        </div>
        <Show when={props.description}>
          <p class="text-muted-foreground text-sm">{props.description}</p>
        </Show>
      </Show>
    </div>
  );
};
