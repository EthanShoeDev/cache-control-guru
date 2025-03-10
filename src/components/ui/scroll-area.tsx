import { cn } from '@/lib/utils';
import type { JSX } from 'solid-js';
import {
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js';

// Type definitions
type Direction = 'ltr' | 'rtl';
type ScrollbarType = 'auto' | 'always' | 'scroll' | 'hover';

// ScrollBar component props
type ScrollBarProps = {
  orientation?: 'horizontal' | 'vertical';
} & JSX.HTMLAttributes<HTMLDivElement>;

// ScrollArea component props
type ScrollAreaProps = {
  type?: ScrollbarType;
  dir?: Direction;
  scrollHideDelay?: number;
} & JSX.HTMLAttributes<HTMLDivElement>;

// Default props
const defaultProps = {
  type: 'hover' as ScrollbarType,
  dir: 'ltr' as Direction,
  scrollHideDelay: 600,
};

// Main ScrollArea component
export function ScrollArea(props: ScrollAreaProps) {
  const merged = mergeProps(defaultProps, props);
  const [local, others] = splitProps(merged, [
    'class',
    'children',
    'type',
    'dir',
    'scrollHideDelay',
  ]);

  // References to DOM elements
  let scrollAreaRef: HTMLDivElement | undefined;
  let viewportRef: HTMLDivElement | undefined;
  let contentRef: HTMLDivElement | undefined;
  let scrollbarXRef: HTMLDivElement | undefined;
  let scrollbarYRef: HTMLDivElement | undefined;

  // State for scroll visibility
  const [scrollbarXVisible, setScrollbarXVisible] = createSignal(false);
  const [scrollbarYVisible, setScrollbarYVisible] = createSignal(false);
  const [scrollVisible, setScrollVisible] = createSignal(false);

  // State for thumb sizes
  const [thumbXSize, setThumbXSize] = createSignal(0);
  const [thumbYSize, setThumbYSize] = createSignal(0);

  // For corner measurements - initialize with 0
  const cornerWidth = () => 0;
  const cornerHeight = () => 0;

  // Check if content overflows and scrollbars should be visible
  const checkOverflow = () => {
    if (viewportRef) {
      const isOverflowX = viewportRef.scrollWidth > viewportRef.clientWidth;
      const isOverflowY = viewportRef.scrollHeight > viewportRef.clientHeight;

      setScrollbarXVisible(isOverflowX);
      setScrollbarYVisible(isOverflowY);

      updateThumbSizes();
    }
  };

  // Update thumb sizes based on viewport and content sizes
  const updateThumbSizes = () => {
    if (viewportRef) {
      const viewportWidth = viewportRef.clientWidth;
      const viewportHeight = viewportRef.clientHeight;
      const contentWidth = viewportRef.scrollWidth;
      const contentHeight = viewportRef.scrollHeight;

      // Calculate thumb sizes similar to Radix implementation
      const xRatio = viewportWidth / contentWidth;
      const yRatio = viewportHeight / contentHeight;

      // Minimum thumb size is 18px
      const xSize = Math.max(xRatio * viewportWidth, 18);
      const ySize = Math.max(yRatio * viewportHeight, 18);

      setThumbXSize(xSize);
      setThumbYSize(ySize);

      // Set CSS variables for the thumb sizes
      scrollAreaRef?.style.setProperty('--thumb-x-size', `${String(xSize)}px`);
      scrollAreaRef?.style.setProperty('--thumb-y-size', `${String(ySize)}px`);
    }
  };

  // Update thumb positions based on scroll position
  const updateThumbPositions = () => {
    if (viewportRef && scrollAreaRef) {
      const {
        scrollLeft,
        scrollTop,
        scrollWidth,
        scrollHeight,
        clientWidth,
        clientHeight,
      } = viewportRef;

      // Calculate thumb offsets
      const maxScrollLeft = scrollWidth - clientWidth;
      const maxScrollTop = scrollHeight - clientHeight;

      if (maxScrollLeft > 0) {
        const xOffset =
          (scrollLeft / maxScrollLeft) * (clientWidth - thumbXSize());
        scrollAreaRef.style.setProperty(
          '--thumb-x-offset',
          `${String(xOffset)}px`,
        );
      }

      if (maxScrollTop > 0) {
        const yOffset =
          (scrollTop / maxScrollTop) * (clientHeight - thumbYSize());
        scrollAreaRef.style.setProperty(
          '--thumb-y-offset',
          `${String(yOffset)}px`,
        );
      }
    }
  };

  // Scroll event handler
  const handleScroll = () => {
    updateThumbPositions();

    if (local.type === 'scroll' || local.type === 'hover') {
      setScrollVisible(true);

      // Hide scrollbars after delay
      if (scrollHideTimeoutRef) {
        clearTimeout(scrollHideTimeoutRef);
      }

      scrollHideTimeoutRef = setTimeout(() => {
        setScrollVisible(false);
      }, local.scrollHideDelay);
    }
  };

  // Mouse enter handler for hover type
  const handleMouseEnter = () => {
    if (local.type === 'hover') {
      setScrollVisible(true);
    }
  };

  // Mouse leave handler for hover type
  const handleMouseLeave = () => {
    if (local.type === 'hover') {
      if (scrollHideTimeoutRef) {
        clearTimeout(scrollHideTimeoutRef);
      }

      scrollHideTimeoutRef = setTimeout(() => {
        setScrollVisible(false);
      }, local.scrollHideDelay);
    }
  };

  let scrollHideTimeoutRef: ReturnType<typeof setTimeout> | undefined;
  let styleElement: HTMLStyleElement | null = null;
  let resizeObserver: ResizeObserver | null = null;

  // Setup resize observers and event listeners
  onMount(() => {
    // Add CSS to hide native scrollbars
    styleElement = document.createElement('style');
    styleElement.textContent = `
      [data-scroll-area-viewport] {
        scrollbar-width: none;
        -ms-overflow-style: none;
        -webkit-overflow-scrolling: touch;
      }
      [data-scroll-area-viewport]::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(styleElement);

    // Setup native ResizeObserver to monitor size changes
    if (viewportRef && contentRef) {
      // Create a new ResizeObserver
      resizeObserver = new ResizeObserver(() => {
        checkOverflow();
      });

      // Observe both the viewport and content elements
      resizeObserver.observe(viewportRef);
      resizeObserver.observe(contentRef);

      // Initial check
      checkOverflow();

      // Add scroll event listener
      viewportRef.addEventListener('scroll', handleScroll, { passive: true });
    }

    if (scrollAreaRef) {
      scrollAreaRef.addEventListener('mouseenter', handleMouseEnter);
      scrollAreaRef.addEventListener('mouseleave', handleMouseLeave);
    }

    // Initial visibility based on type
    if (local.type === 'always') {
      setScrollVisible(true);
    }

    // Set initial values
    updateThumbSizes();
    updateThumbPositions();
  });

  // Clean up on component unmount
  onCleanup(() => {
    if (scrollHideTimeoutRef) {
      clearTimeout(scrollHideTimeoutRef);
    }

    // Safely remove the style element
    if (styleElement && document.head.contains(styleElement)) {
      document.head.removeChild(styleElement);
    }

    // Clean up the resize observer
    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    if (viewportRef) {
      viewportRef.removeEventListener('scroll', handleScroll);
    }

    if (scrollAreaRef) {
      scrollAreaRef.removeEventListener('mouseenter', handleMouseEnter);
      scrollAreaRef.removeEventListener('mouseleave', handleMouseLeave);
    }
  });

  return (
    <div
      ref={scrollAreaRef}
      class={cn('relative', local.class)}
      data-scroll-area=""
      style={{
        '--scroll-area-corner-width': `${String(cornerWidth())}px`,
        '--scroll-area-corner-height': `${String(cornerHeight())}px`,
      }}
      dir={local.dir}
      {...others}
    >
      <div
        ref={viewportRef}
        data-scroll-area-viewport=""
        class={cn('h-full w-full rounded-[inherit]')}
        style={{
          'overflow-x': scrollbarXVisible() ? 'scroll' : 'hidden',
          'overflow-y': scrollbarYVisible() ? 'scroll' : 'hidden',
        }}
      >
        <div ref={contentRef} style={{ 'min-width': '100%', display: 'table' }}>
          {local.children}
        </div>
      </div>

      {/* Vertical scrollbar */}
      <ScrollBar
        ref={scrollbarYRef}
        orientation="vertical"
        data-state={
          scrollVisible() && scrollbarYVisible() ? 'visible' : 'hidden'
        }
        style={{
          opacity: scrollVisible() && scrollbarYVisible() ? 1 : 0,
          transition: 'opacity 0.2s',
          position: 'absolute',
          top: 0,
          right: local.dir === 'ltr' ? 0 : undefined,
          left: local.dir === 'rtl' ? 0 : undefined,
          bottom: scrollbarXVisible() ? 'var(--scroll-area-corner-height)' : 0,
        }}
      />

      {/* Horizontal scrollbar */}
      <ScrollBar
        ref={scrollbarXRef}
        orientation="horizontal"
        data-state={
          scrollVisible() && scrollbarXVisible() ? 'visible' : 'hidden'
        }
        style={{
          opacity: scrollVisible() && scrollbarXVisible() ? 1 : 0,
          transition: 'opacity 0.2s',
          position: 'absolute',
          bottom: 0,
          left: local.dir === 'rtl' ? 'var(--scroll-area-corner-width)' : 0,
          right: local.dir === 'ltr' ? 'var(--scroll-area-corner-width)' : 0,
        }}
      />

      {/* Corner */}
      {scrollbarXVisible() && scrollbarYVisible() && (
        <div
          class="bg-border absolute"
          style={{
            width: `${String(cornerWidth())}px`,
            height: `${String(cornerHeight())}px`,
            right: local.dir === 'ltr' ? 0 : undefined,
            left: local.dir === 'rtl' ? 0 : undefined,
            bottom: 0,
          }}
        />
      )}
    </div>
  );
}

// ScrollBar component
export function ScrollBar(props: ScrollBarProps) {
  const merged = mergeProps({ orientation: 'vertical' }, props);
  const [local, others] = splitProps(merged, ['class', 'orientation']);

  return (
    <div
      data-scroll-area-scrollbar=""
      data-orientation={local.orientation}
      class={cn(
        'flex touch-none p-px transition-colors select-none',
        local.orientation === 'vertical' &&
          'h-full w-2.5 border-l border-l-transparent',
        local.orientation === 'horizontal' &&
          'h-2.5 w-full flex-col border-t border-t-transparent',
        local.class,
      )}
      {...others}
    >
      <div
        data-scroll-area-thumb=""
        class="bg-border relative flex-1 rounded-full"
        style={{
          transform:
            local.orientation === 'vertical'
              ? `translateY(var(--thumb-y-offset, 0px))`
              : `translateX(var(--thumb-x-offset, 0px))`,
          height:
            local.orientation === 'vertical'
              ? `var(--thumb-y-size, 20px)`
              : undefined,
          width:
            local.orientation === 'horizontal'
              ? `var(--thumb-x-size, 20px)`
              : undefined,
        }}
      />
    </div>
  );
}
