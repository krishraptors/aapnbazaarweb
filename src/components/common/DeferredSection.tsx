import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DeferredSectionProps {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  minHeightClassName?: string;
  rootMargin?: string;
}

function DefaultSectionFallback({ minHeightClassName }: { minHeightClassName?: string }) {
  return (
    <div className="container px-4 py-10">
      <div
        className={cn(
          'min-h-[320px] rounded-[32px] border border-border/60 bg-muted/30 shadow-sm',
          minHeightClassName
        )}
      />
    </div>
  );
}

export default function DeferredSection({
  children,
  className,
  fallback,
  minHeightClassName,
  rootMargin = '650px 0px',
}: DeferredSectionProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setShouldRender(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setShouldRender(true);
      return;
    }

    const node = containerRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [rootMargin]);

  const sectionFallback = fallback ?? (
    <DefaultSectionFallback minHeightClassName={minHeightClassName} />
  );

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? <Suspense fallback={sectionFallback}>{children}</Suspense> : sectionFallback}
    </div>
  );
}
