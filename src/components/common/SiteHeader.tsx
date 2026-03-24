import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/common/ThemeToggle';
import { cn } from '@/lib/utils';
import { ArrowRight, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'My Products', href: '/#my-products' },
  { label: 'Global Reach', href: '/#global-services' },
  { label: 'GolaMart', href: '/my-product' },
  { label: 'Contact', href: '/#contact' },
];

export default function SiteHeader() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const currentHref = `${location.pathname}${location.hash}`;

  const isNavItemActive = (href: string) => {
    if (href === '/#home') {
      return location.pathname === '/' && (!location.hash || location.hash === '#home');
    }

    if (href === '/my-product') {
      return location.pathname.startsWith('/my-product');
    }

    return currentHref === href;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-4">
        <div className="glass-panel flex items-center justify-between rounded-full px-4 py-3 shadow-[0_20px_60px_-32px_hsl(var(--foreground)/0.55)] sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="AapnBazaar logo"
              className="h-12 w-12 rounded-full object-cover shadow-[0_16px_32px_-16px_hsl(var(--secondary)/0.75)] ring-1 ring-primary/15"
            />
            <div>
              <div className="font-heading text-lg font-semibold">AapnBazaar</div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Global commerce and product studio
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                    isNavItemActive(item.href)
                      ? 'bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--secondary)))] text-primary-foreground shadow-[0_14px_30px_-18px_hsl(var(--primary)/0.75)]'
                      : 'text-foreground/75 hover:bg-muted hover:text-foreground hover:shadow-[0_12px_24px_-18px_hsl(var(--primary)/0.55)]'
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <ThemeToggle />
            <Button asChild variant="outline" className="rounded-full border-primary/20 bg-background/80">
              <a href="/admin/golamart">Admin</a>
            </Button>
            <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/20">
              <a href="/my-product">
                Open GolaMart
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground xl:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen ? (
          <div className="glass-panel mt-3 rounded-[28px] p-4 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.55)] xl:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300',
                    isNavItemActive(item.href)
                      ? 'bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--secondary)))] text-primary-foreground'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ThemeToggle className="w-full" />
              <Button asChild variant="outline" className="rounded-full">
                <a href="/admin/golamart" onClick={() => setIsOpen(false)}>
                  Admin Dashboard
                </a>
              </Button>
              <Button asChild className="rounded-full">
                <a href="/my-product" onClick={() => setIsOpen(false)}>
                  Open GolaMart
                </a>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
