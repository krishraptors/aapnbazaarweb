import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Product } from '@/types/golamart';
import { Loader2, MapPin, ShoppingBasket, Truck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  displayPrice: number;
  isBuying?: boolean;
  onBuy: (product: Product, quantity: number, displayPrice: number) => Promise<void>;
}

export default function ProductCard({
  product,
  displayPrice,
  isBuying = false,
  onBuy,
}: ProductCardProps) {
  const [orderQuantity, setOrderQuantity] = useState(1);
  const metaChips = [product.state, product.market, product.season, product.cropType].filter(
    Boolean
  ) as string[];
  const qualityLine = [product.season, product.cropType, product.grade].filter(Boolean).join(' • ');

  useEffect(() => {
    setOrderQuantity((current) => {
      if (product.quantity <= 0) {
        return 0;
      }

      return Math.min(Math.max(current, 1), product.quantity);
    });
  }, [product.quantity]);

  return (
    <Card className="h-full overflow-hidden border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,253,244,0.94))] shadow-[0_24px_80px_-52px_rgba(22,101,52,0.18)] dark:border-emerald-900/50 dark:bg-[linear-gradient(180deg,rgba(6,24,16,0.98),rgba(8,34,22,0.94))]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              Live mandi pulse
            </div>
            <h3 className="font-heading mt-4 text-2xl font-semibold">{product.cropName}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Farmer-ready listing built for mandi procurement, regional crop movement, and
              direct buyer execution.
            </p>
            {metaChips.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {metaChips.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-emerald-200/80 bg-white/88 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-white/10 dark:bg-white/10 dark:text-white/78"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="rounded-3xl bg-[linear-gradient(180deg,#14532d,#166534)] px-4 py-3 text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.18em] text-background/65">Price</p>
            <p className="font-heading mt-2 text-2xl font-semibold">₹{displayPrice.toFixed(0)}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/90 px-4 py-4 dark:border-emerald-900/50 dark:bg-emerald-500/10">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Available</p>
            <p className="font-heading mt-2 text-xl font-semibold">{product.quantity} qtl</p>
          </div>
          <div className="rounded-2xl border border-lime-200/70 bg-lime-50/90 px-4 py-4 dark:border-lime-900/50 dark:bg-lime-500/10">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Farmer</p>
            <p className="mt-2 text-sm font-medium text-foreground">
              {product.farmer?.name ?? 'Verified partner'}
            </p>
            <p className="text-xs text-muted-foreground">{product.farmer?.phone ?? 'On request'}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200/70 bg-white/92 px-4 py-4 dark:border-white/10 dark:bg-white/8">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Market</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
              <Truck className="h-4 w-4 text-emerald-700" />
              {product.market ?? product.state ?? 'Local mandi'}
            </div>
          </div>
        </div>

        <div className="agri-soft mt-6 space-y-3 rounded-[28px] border border-emerald-200/70 p-4 dark:border-white/10">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ShoppingBasket className="h-4 w-4 text-emerald-700" />
            Order quantity
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="number"
              min={product.quantity > 0 ? 1 : 0}
              max={product.quantity}
              value={orderQuantity}
              onChange={(event) => {
                const nextValue = Number(event.target.value);

                if (Number.isNaN(nextValue)) {
                  setOrderQuantity(1);
                  return;
                }

                setOrderQuantity(Math.min(Math.max(nextValue, 1), Math.max(product.quantity, 1)));
              }}
              disabled={product.quantity <= 0 || isBuying}
              className="h-11 rounded-full bg-background"
            />
            <Button
              className="h-11 rounded-full bg-[linear-gradient(135deg,#15803d,#65a30d)] px-6 text-white hover:opacity-95"
              disabled={product.quantity <= 0 || orderQuantity <= 0 || isBuying}
              onClick={() => onBuy(product, orderQuantity, displayPrice)}
            >
              {isBuying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Buy crop'
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {qualityLine || 'Direct selling, rapid order creation, and settlement-ready workflow.'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
