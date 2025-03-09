import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { type Component } from 'solid-js';

type Mode = 'explain' | 'generate';

interface ModeTabsProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
  class?: string;
}

export const ModeTabs: Component<ModeTabsProps> = (props) => {
  return (
    <Tabs
      value={props.mode}
      onChange={(value) => props.onChange(value as Mode)}
      class={cn(props.class)}
    >
      <TabsList class="w-full rounded-lg p-1">
        <TabsTrigger value="explain">Explain</TabsTrigger>
        <TabsTrigger value="generate">Generate</TabsTrigger>
        <TabsIndicator />
      </TabsList>
    </Tabs>
  );
};
