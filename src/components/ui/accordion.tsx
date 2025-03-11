import { cn } from '@/lib/utils';
import type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionTriggerProps,
} from '@kobalte/core/accordion';
import { Accordion as AccordionPrimitive } from '@kobalte/core/accordion';
import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import { type ParentProps, type ValidComponent, splitProps } from 'solid-js';

export const Accordion = AccordionPrimitive;

type accordionItemProps<T extends ValidComponent = 'div'> =
  AccordionItemProps<T> & {
    class?: string;
  };

export const AccordionItem = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, accordionItemProps<T>>,
) => {
  const [local, rest] = splitProps(props as accordionItemProps, ['class']);

  return (
    <AccordionPrimitive.Item class={cn('border-b', local.class)} {...rest} />
  );
};

type accordionTriggerProps<T extends ValidComponent = 'button'> = ParentProps<
  AccordionTriggerProps<T> & {
    class?: string;
  }
>;

export const AccordionTrigger = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, accordionTriggerProps<T>>,
) => {
  const [local, rest] = splitProps(props as accordionTriggerProps, [
    'class',
    'children',
  ]);

  return (
    <AccordionPrimitive.Header class="flex" as="div">
      <AccordionPrimitive.Trigger
        class={cn(
          'focus-visible:ring-ring flex flex-1 items-center justify-between py-4 text-sm font-medium transition-shadow hover:underline focus-visible:ring-[1.5px] focus-visible:outline-none [&[data-expanded]>svg]:rotate-180',
          local.class,
        )}
        {...rest}
      >
        {local.children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="text-muted-foreground h-4 w-4 transition-transform duration-200"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m6 9l6 6l6-6"
          />
          <title>Arrow</title>
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

type accordionContentProps<T extends ValidComponent = 'div'> = ParentProps<
  AccordionContentProps<T> & {
    class?: string;
  }
>;

export const AccordionContent = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, accordionContentProps<T>>,
) => {
  const [local, rest] = splitProps(props as accordionContentProps, [
    'class',
    'children',
  ]);

  return (
    <AccordionPrimitive.Content
      class={cn(
        'animate-accordion-up data-[expanded]:animate-accordion-down overflow-hidden text-sm',
        local.class,
      )}
      {...rest}
    >
      <div class="pt-0 pb-4">{local.children}</div>
    </AccordionPrimitive.Content>
  );
};
