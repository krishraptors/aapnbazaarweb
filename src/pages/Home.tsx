import { Suspense, lazy, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import DeferredSection from '@/components/common/DeferredSection';
import Hero from '@/components/sections/Hero';
import { cn } from '@/lib/utils';

const ServicesShowcase = lazy(() => import('@/components/sections/ServicesShowcase'));
const Features = lazy(() => import('@/components/sections/Features'));
const MyProductsShowcase = lazy(() => import('@/components/sections/MyProductsShowcase'));
const GolaMartShowcase = lazy(() => import('@/components/sections/GolaMartShowcase'));
const GlobalServices = lazy(() => import('@/components/sections/GlobalServices'));
const Testimonials = lazy(() => import('@/components/sections/Testimonials'));
const HowItWorks = lazy(() => import('@/components/sections/HowItWorks'));
const VendorForm = lazy(() => import('@/components/sections/VendorForm'));
const AppDownload = lazy(() => import('@/components/sections/AppDownload'));
const Contact = lazy(() => import('@/components/sections/Contact'));
const Footer = lazy(() => import('@/components/sections/Footer'));

function HomeSectionFallback({ minHeightClassName }: { minHeightClassName: string }) {
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

export default function Home() {
  const location = useLocation();
  const shouldLoadAllSections = location.pathname === '/' && location.hash.length > 0;

  const renderSection = (section: ReactNode, minHeightClassName: string) => {
    const fallback = <HomeSectionFallback minHeightClassName={minHeightClassName} />;

    if (shouldLoadAllSections) {
      return <Suspense fallback={fallback}>{section}</Suspense>;
    }

    return (
      <DeferredSection fallback={fallback} minHeightClassName={minHeightClassName}>
        {section}
      </DeferredSection>
    );
  };

  return (
    <div className="min-h-screen">
      <Hero />
      <Suspense fallback={<HomeSectionFallback minHeightClassName="min-h-[980px]" />}>
        <ServicesShowcase />
      </Suspense>
      {renderSection(<Features />, 'min-h-[640px]')}
      {renderSection(<MyProductsShowcase />, 'min-h-[860px]')}
      {renderSection(<GolaMartShowcase />, 'min-h-[760px]')}
      {renderSection(<GlobalServices />, 'min-h-[620px]')}
      {renderSection(<Testimonials />, 'min-h-[520px]')}
      {renderSection(<HowItWorks />, 'min-h-[540px]')}
      {renderSection(<VendorForm />, 'min-h-[680px]')}
      {renderSection(<AppDownload />, 'min-h-[480px]')}
      {renderSection(<Contact />, 'min-h-[640px]')}
      {renderSection(<Footer />, 'min-h-[220px]')}
    </div>
  );
}
