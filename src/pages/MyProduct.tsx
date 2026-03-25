import { useDeferredValue, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProductCard from '@/components/products/ProductCard';
import SellForm from '@/components/products/SellForm';
import Footer from '@/components/sections/Footer';
import { useToast } from '@/hooks/use-toast';
import { golamartApi } from '@/services/golamartApi';
import type { CreateProductPayload, Product } from '@/types/golamart';
import {
  ArrowRight,
  BadgeDollarSign,
  Leaf,
  Loader2,
  Network,
  SlidersHorizontal,
  Truck,
} from 'lucide-react';

const featureCards = [
  {
    title: 'Bihar mandi board',
    description:
      'Built to showcase paddy, white wheat, maize, mustard, makhana, vegetables, and fruit-led trade in one crop-first marketplace.',
    icon: Network,
  },
  {
    title: 'Season-wise crop flow',
    description:
      'Separate Kharif, Rabi, Zaid, and perennial produce so buyers understand arrivals, timing, and crop availability faster.',
    icon: Leaf,
  },
  {
    title: 'Buyer to logistics movement',
    description:
      'Farmers can list stock, buyers can raise orders, and teams can move into transport and fulfillment planning quickly.',
    icon: Truck,
  },
];

const biharSeasonBoards = [
  {
    season: 'Kharif',
    crops: 'Paddy, maize, arhar, jute',
    description:
      'Monsoon crop board tuned for Bihar paddy belts, maize arrivals, and fiber-linked procurement.',
  },
  {
    season: 'Rabi',
    crops: 'White wheat, masoor, chana, mustard, potato, onion',
    description:
      'Winter crop board for Bihar rabi fasal with grain, pulse, oilseed, and vegetable movement.',
  },
  {
    season: 'Specialty',
    crops: 'Makhana, litchi, banana, vegetables',
    description:
      'North Bihar and Mithila specialties for repeat buyers, fruit traders, and higher-value crop sourcing.',
  },
];

const biharTradeClusters = [
  {
    title: 'Patna grain and flour belt',
    crops: 'White wheat, paddy, maize, chana',
    description: 'Useful for grain distributors, flour networks, and wholesale procurement desks.',
  },
  {
    title: 'Mithila specialty corridor',
    crops: 'Makhana, litchi, banana, vegetables',
    description: 'Good for premium fruit buyers, festive demand, and specialty sourcing programs.',
  },
  {
    title: 'Seemanchal volume movement',
    crops: 'Paddy, maize, jute, mustard',
    description: 'Works for bulk buyers looking at large arrivals and transport-linked crop flow.',
  },
  {
    title: 'Magadh and Nalanda fresh board',
    crops: 'Potato, onion, tomato, cauliflower',
    description: 'Useful for retail-linked buyers, quick-turn trade, and daily mandi planning.',
  },
];

const biharBoardUseCases = [
  {
    title: 'Farmer selling desk',
    description: 'Farmers can list crop, grade, quantity, market, and expected price in a way buyers understand quickly.',
  },
  {
    title: 'Buyer procurement board',
    description: 'Procurement teams can shortlist crops by season, state, price, and market readiness without jumping across systems.',
  },
  {
    title: 'Dispatch planning board',
    description: 'Operations teams can move from order capture to pickup, route planning, and buyer settlement with clearer signals.',
  },
  {
    title: 'Season monitoring layer',
    description: 'The board helps teams see Kharif, Rabi, and specialty crop movement in one place instead of scattered spreadsheets.',
  },
];

const biharBoardModes = [
  { title: 'Procurement mode', detail: 'Bulk grain, pulses, and oilseed sourcing for active buyers.' },
  { title: 'Retail-linked mode', detail: 'Fast-turn vegetables and fruit discovery for daily demand.' },
  { title: 'Premium mode', detail: 'Makhana, litchi, and specialty produce for higher-value trade.' },
];

const indiaCropCategories = [
  {
    title: 'Cereals and staples',
    crops: ['Paddy', 'White Wheat', 'Maize', 'Bajra', 'Millets'],
  },
  {
    title: 'Pulses',
    crops: ['Chana', 'Masoor', 'Arhar', 'Moong'],
  },
  {
    title: 'Oilseeds',
    crops: ['Mustard', 'Groundnut', 'Soybean', 'Sesamum'],
  },
  {
    title: 'Vegetables',
    crops: ['Potato', 'Onion', 'Tomato', 'Cauliflower'],
  },
  {
    title: 'Fruits and specialty',
    crops: ['Litchi', 'Banana', 'Makhana', 'Apple'],
  },
  {
    title: 'Fiber and spices',
    crops: ['Jute', 'Cotton', 'Turmeric', 'Chilli'],
  },
];

const indiaMarketModes = [
  {
    title: 'National sourcing mode',
    detail: 'Compare Bihar supply with other state markets before locking a buyer order.',
  },
  {
    title: 'Category planning mode',
    detail: 'Group cereals, pulses, oilseeds, vegetables, fruits, fiber, and spices into one board.',
  },
  {
    title: 'Trade expansion mode',
    detail: 'Help GolaMart feel like an India-ready marketplace instead of a single-state listing page.',
  },
];

const indiaSourcingRegions = [
  {
    title: 'North grain belt',
    states: 'Bihar, Uttar Pradesh, Punjab, Haryana',
    description: 'Good for paddy, wheat, and maize boards tied to mill buyers, wholesalers, and bulk mandi procurement.',
  },
  {
    title: 'Central pulse and oilseed ring',
    states: 'Madhya Pradesh, Rajasthan, Gujarat',
    description: 'Useful for chana, soybean, mustard, and groundnut sourcing when buyers need broader commodity coverage.',
  },
  {
    title: 'West fiber and spice route',
    states: 'Gujarat, Maharashtra, Rajasthan',
    description: 'Supports cotton, chilli, turmeric, and processing-linked spice or fiber trade beyond Bihar.',
  },
  {
    title: 'South fresh and plantation lane',
    states: 'Karnataka, Andhra Pradesh, Tamil Nadu, Kerala',
    description: 'Helps the board include banana, vegetables, spices, and year-round produce movement.',
  },
];

const indiaBoardUseCases = [
  {
    title: 'Procurement comparison desk',
    description: 'Buyers can compare Bihar-first supply with other state lanes before finalizing volume, season, and price range.',
  },
  {
    title: 'Marketplace growth layer',
    description: 'This section shows how GolaMart can scale from a Bihar crop board into a wider India sourcing marketplace.',
  },
  {
    title: 'Seller expansion path',
    description: 'Farmer groups, traders, and aggregators from multiple states can fit into one structured board instead of disconnected pages.',
  },
];

const quickCropSearches = ['Paddy', 'White Wheat', 'Maize', 'Makhana', 'Litchi', 'Mustard'];
const marketIntelligence = [
  {
    title: 'Top Bihar demand',
    items: ['Patna grain demand', 'Muzaffarpur fruit flow', 'Nalanda vegetable movement'],
  },
  {
    title: 'Procurement mode',
    items: ['Bulk mandi pickups', 'Regional buyer aggregation', 'Direct farmer sourcing'],
  },
  {
    title: 'Dispatch readiness',
    items: ['Same-day order capture', 'Next-slot transport planning', 'Settlement-ready buyer flow'],
  },
];

const marketCorridors = [
  {
    title: 'Patna and Nalanda',
    description: 'White wheat, potato, onion, and daily retail-linked crop movement.',
  },
  {
    title: 'Purnea and Bhagalpur',
    description: 'Paddy, maize, jute, and grain board activity for bulk buyers.',
  },
  {
    title: 'Mithila and Muzaffarpur',
    description: 'Makhana, litchi, banana, and premium specialty produce lanes.',
  },
  {
    title: 'Pan-India supply bridge',
    description: 'Cotton, turmeric, groundnut, and chana for wider sourcing beyond Bihar.',
  },
];
const quickCommerceLanes = [
  {
    title: 'Bihar grain lane',
    badge: 'Bulk today',
    description: 'Paddy, white wheat, and maize boards for fast grain discovery.',
    className:
      'border-emerald-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(220,252,231,0.86))] dark:border-emerald-900/60 dark:bg-[linear-gradient(135deg,rgba(7,22,15,0.98),rgba(10,48,28,0.9))]',
    icon: Network,
  },
  {
    title: 'Fresh sabzi rush',
    badge: 'High turn',
    description: 'Potato, onion, and mandi vegetables in a faster trading lane.',
    className:
      'border-lime-200/80 bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(236,253,245,0.88))] dark:border-lime-900/60 dark:bg-[linear-gradient(135deg,rgba(9,21,17,0.98),rgba(23,55,32,0.9))]',
    icon: Truck,
  },
  {
    title: 'Mithila premium',
    badge: 'Special picks',
    description: 'Makhana, litchi, banana, and higher-value Bihar specialty produce.',
    className:
      'border-rose-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,228,230,0.9))] dark:border-rose-900/60 dark:bg-[linear-gradient(135deg,rgba(23,11,18,0.98),rgba(73,24,48,0.9))]',
    icon: BadgeDollarSign,
  },
  {
    title: 'India source grid',
    badge: 'Pan India',
    description: 'Cotton, turmeric, groundnut, chana, and beyond-Bihar sourcing.',
    className:
      'border-sky-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(224,242,254,0.88))] dark:border-sky-900/60 dark:bg-[linear-gradient(135deg,rgba(9,16,31,0.98),rgba(18,50,79,0.88))]',
    icon: Leaf,
  },
];
const flashBoardSignals = [
  { label: 'Morning board', value: 'Paddy + wheat quotes' },
  { label: 'Fast lane', value: 'Sabzi and fruit movement' },
  { label: 'Premium board', value: 'Makhana and litchi demand' },
];
const biharHotBoard = [
  'Bhagalpur Sonam paddy',
  'Patna white wheat',
  'Purnea maize arrivals',
  'Darbhanga makhana',
  'Muzaffarpur litchi',
  'Nalanda potato and onion',
];
const buyerWindows = [
  'Early grain procurement for Bihar distributors',
  'Midday fruit and specialty sourcing for premium buyers',
  'Evening dispatch planning with mandi-linked demand windows',
];

const filterSelectClassName =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background';

export default function MyProduct() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelling, setIsSelling] = useState(false);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [maxPrice, setMaxPrice] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [cropTypeFilter, setCropTypeFilter] = useState('all');
  const [buyerProfile, setBuyerProfile] = useState(() => ({
    name: typeof window !== 'undefined' ? localStorage.getItem('golamart-buyer-name') ?? '' : '',
    phone: typeof window !== 'undefined' ? localStorage.getItem('golamart-buyer-phone') ?? '' : '',
  }));

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await golamartApi.listProducts();
      setProducts(result);
      setLiveProducts(result);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Unable to load products';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem('golamart-buyer-name', buyerProfile.name);
    localStorage.setItem('golamart-buyer-phone', buyerProfile.phone);
  }, [buyerProfile]);

  useEffect(() => {
    if (products.length === 0) {
      return;
    }

    setLiveProducts(products);

    const interval = window.setInterval(() => {
      setLiveProducts(
        products.map((product) => {
          const variance = 1 + (Math.random() - 0.5) * 0.06;

          return {
            ...product,
            price: Number((product.price * variance).toFixed(0)),
          };
        })
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [products]);

  const filteredProducts = liveProducts.filter((product) => {
    const searchableText = [
      product.cropName,
      product.state,
      product.market,
      product.cropType,
      product.season,
      product.grade,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesQuery = searchableText.includes(deferredSearch.trim().toLowerCase());
    const matchesPrice = maxPrice ? product.price <= Number(maxPrice) : true;
    const matchesSeason = seasonFilter === 'all' ? true : product.season === seasonFilter;
    const matchesState = stateFilter === 'all' ? true : product.state === stateFilter;
    const matchesCropType = cropTypeFilter === 'all' ? true : product.cropType === cropTypeFilter;

    return matchesQuery && matchesPrice && matchesSeason && matchesState && matchesCropType;
  });

  const handleCreateProduct = async (payload: CreateProductPayload) => {
    setIsSelling(true);

    try {
      await golamartApi.createProduct(payload);
      toast({
        title: 'Listing published',
        description: `${payload.cropName} is now visible in the GolaMart crop board.`,
      });
      await loadProducts();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : 'Unable to publish product';
      toast({
        title: 'Listing failed',
        description: message,
        variant: 'destructive',
      });
      throw submitError;
    } finally {
      setIsSelling(false);
    }
  };

  const handleBuyProduct = async (product: Product, quantity: number, displayPrice: number) => {
    if (!buyerProfile.name.trim() || !buyerProfile.phone.trim()) {
      toast({
        title: 'Buyer profile needed',
        description: 'Add buyer name and phone before creating an order.',
        variant: 'destructive',
      });
      return;
    }

    setBuyingId(product._id);

    try {
      await golamartApi.createOrder({
        buyerName: buyerProfile.name.trim(),
        buyerPhone: buyerProfile.phone.trim(),
        products: [
          {
            productId: product._id,
            cropName: product.cropName,
            quantity,
            price: displayPrice,
          },
        ],
      });

      toast({
        title: 'Order created',
        description: `${quantity} qtl of ${product.cropName} added to the buyer order flow.`,
      });
      await loadProducts();
    } catch (buyError) {
      const message = buyError instanceof Error ? buyError.message : 'Unable to create order';
      toast({
        title: 'Order failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setBuyingId(null);
    }
  };

  const totalInventory = liveProducts.reduce((sum, product) => sum + product.quantity, 0);
  const biharListings = liveProducts.filter((product) => product.state === 'Bihar').length;
  const rabiListings = liveProducts.filter((product) => product.season === 'Rabi').length;
  const representedStates = Array.from(
    new Set(liveProducts.map((product) => product.state).filter((value): value is string => Boolean(value)))
  ).length;
  const stateOptions = Array.from(
    new Set(liveProducts.map((product) => product.state).filter((value): value is string => Boolean(value)))
  ).sort();
  const cropTypeOptions = Array.from(
    new Set(
      liveProducts
        .map((product) => product.cropType)
        .filter((value): value is string => Boolean(value))
    )
  ).sort();

  return (
    <div className="min-h-screen bg-background pt-28">
      <section className="agri-hero-surface relative overflow-hidden pb-16 pt-8 xl:pb-24">
        <div className="agri-field absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute left-[5%] top-12 h-40 w-40 rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] top-20 h-44 w-44 rounded-full bg-lime-200/60 blur-3xl" />
        <div className="pointer-events-none absolute bottom-12 left-1/3 h-48 w-48 rounded-full bg-amber-100/70 blur-3xl" />
        <div className="container relative px-4">
          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-4 py-2 text-sm font-semibold text-emerald-700 backdrop-blur">
                <Leaf className="h-4 w-4" />
                My Product - GolaMart
              </div>
              <h1 className="font-heading mt-6 text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl xl:text-7xl">
                Bihar mandi to
                <span className="mt-3 block bg-[linear-gradient(135deg,#15803d,#65a30d)] bg-clip-text text-transparent">
                  all-India crop exchange.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground xl:text-xl">
                GolaMart is now shaped like a fuller agritech marketplace for Bihar crop
                trade and pan-India sourcing, covering paddy, white wheat, maize, pulses,
                mustard, vegetables, makhana, litchi, fiber crops, spices, and more.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl bg-[linear-gradient(180deg,#14532d,#166534)] px-5 py-5 text-background shadow-lg">
                  <p className="text-sm uppercase tracking-[0.2em] text-background/70">Inventory</p>
                  <p className="font-heading mt-3 text-2xl font-semibold">{totalInventory} qtl</p>
                </div>
                <div className="rounded-3xl border border-emerald-200/80 bg-white/85 px-5 py-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Bihar board</p>
                  <p className="font-heading mt-3 text-2xl font-semibold">{biharListings} listings</p>
                </div>
                <div className="rounded-3xl border border-lime-200/80 bg-lime-50/85 px-5 py-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Rabi flow</p>
                  <p className="font-heading mt-3 text-2xl font-semibold">{rabiListings} live crops</p>
                </div>
                <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/85 px-5 py-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">India coverage</p>
                  <p className="font-heading mt-3 text-2xl font-semibold">{representedStates} states</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="agri-card rounded-[32px] border border-emerald-200/80 p-6 shadow-[0_24px_80px_-40px_rgba(22,101,52,0.28)] sm:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Network className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    Buyer profile
                  </p>
                  <h2 className="font-heading mt-1 text-2xl font-semibold">
                    Crop buying identity and filters
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="buyerName">Buyer name</Label>
                  <Input
                    id="buyerName"
                    placeholder="Bihar Grain Traders"
                    value={buyerProfile.name}
                    onChange={(event) =>
                      setBuyerProfile((current) => ({ ...current, name: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerPhone">Buyer phone</Label>
                  <Input
                    id="buyerPhone"
                    placeholder="+91 99999 11111"
                    value={buyerProfile.phone}
                    onChange={(event) =>
                      setBuyerProfile((current) => ({ ...current, phone: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="agri-soft mt-6 rounded-[28px] border border-emerald-200/70 p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <SlidersHorizontal className="h-4 w-4 text-emerald-700" />
                  Bihar and India crop filters
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="searchCrop">Crop or market</Label>
                    <Input
                      id="searchCrop"
                      placeholder="Search paddy, wheat, makhana, Purnea..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">Max price</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="5000"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="seasonFilter">Season</Label>
                    <select
                      id="seasonFilter"
                      value={seasonFilter}
                      onChange={(event) => setSeasonFilter(event.target.value)}
                      className={filterSelectClassName}
                    >
                      <option value="all">All seasons</option>
                      <option value="Kharif">Kharif</option>
                      <option value="Rabi">Rabi</option>
                      <option value="Zaid">Zaid</option>
                      <option value="Perennial">Perennial</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateFilter">State</Label>
                    <select
                      id="stateFilter"
                      value={stateFilter}
                      onChange={(event) => setStateFilter(event.target.value)}
                      className={filterSelectClassName}
                    >
                      <option value="all">All states</option>
                      {stateOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cropTypeFilter">Crop type</Label>
                    <select
                      id="cropTypeFilter"
                      value={cropTypeFilter}
                      onChange={(event) => setCropTypeFilter(event.target.value)}
                      className={filterSelectClassName}
                    >
                      <option value="all">All crop types</option>
                      {cropTypeOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {quickCropSearches.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => setSearchQuery(crop)}
                      className="rounded-full border border-emerald-200/80 bg-white/85 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
                    >
                      {crop}
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {flashBoardSignals.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[22px] border border-emerald-200/80 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/8"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-medium text-emerald-950 dark:text-white/84">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container px-4">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Quick commerce lanes
              </p>
              <h2 className="font-heading mt-2 text-3xl font-semibold">
                Decorated like a faster crop marketplace board
              </h2>
            </div>
            <div className="rounded-full border border-primary/15 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur">
              Inspired by fast discovery patterns
            </div>
          </div>

          <div className="mb-8 grid gap-4 xl:grid-cols-4">
            {quickCommerceLanes.map((lane, index) => (
              <motion.div
                key={lane.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                viewport={{ once: true }}
                className={`rounded-[30px] border p-5 shadow-[0_24px_60px_-42px_hsl(var(--foreground)/0.45)] ${lane.className}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background dark:bg-white/10 dark:text-white">
                    <lane.icon className="h-6 w-6" />
                  </div>
                  <div className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:bg-white/10 dark:text-white/70">
                    {lane.badge}
                  </div>
                </div>
                <h3 className="font-heading mt-5 text-xl font-semibold">{lane.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-white/72">
                  {lane.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,253,244,0.94))] shadow-[0_24px_60px_-42px_rgba(22,101,52,0.16)] dark:border-emerald-900/50 dark:bg-[linear-gradient(180deg,rgba(5,22,14,0.98),rgba(8,34,22,0.92))]">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading mt-5 text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container px-4">
          <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <Card className="border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,253,247,0.96))] shadow-[0_24px_70px_-48px_rgba(22,101,52,0.14)] dark:border-emerald-900/50 dark:bg-[linear-gradient(180deg,rgba(6,24,16,0.98),rgba(8,34,22,0.94))]">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                      Bihar crop board
                    </p>
                    <h2 className="font-heading mt-2 text-3xl font-semibold">
                      Bihar market focus across Kharif, Rabi, and specialty produce
                    </h2>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                    Bihar-first UI
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {biharSeasonBoards.map((item) => (
                    <div
                      key={item.season}
                      className="rounded-[28px] border border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(236,253,245,0.88))] p-5 dark:border-emerald-900/50 dark:bg-[linear-gradient(180deg,rgba(8,34,22,0.94),rgba(10,45,27,0.88))]"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                          {item.season}
                        </p>
                        <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-800">
                          {item.crops}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-emerald-950/75">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {biharBoardModes.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[24px] border border-emerald-200/80 bg-white/92 p-4 dark:border-white/10 dark:bg-white/6"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-emerald-950/80 dark:text-white/78">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
                  <div className="rounded-[28px] border border-emerald-200/80 bg-white/92 p-5 dark:border-emerald-900/50 dark:bg-white/6">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                      Hot on the Bihar board
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {biharHotBoard.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:border-white/10 dark:bg-white/8 dark:text-white/78"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-emerald-200/80 bg-[linear-gradient(180deg,rgba(16,72,45,0.98),rgba(22,101,52,0.94))] p-5 text-white shadow-lg">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                      Buyer windows
                    </p>
                    <div className="mt-4 space-y-3">
                      {buyerWindows.map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/8 px-4 py-3">
                          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-lime-300" />
                          <p className="text-sm leading-6 text-white/82">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.04fr_0.96fr]">
                  <div className="rounded-[28px] border border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,253,244,0.9))] p-5 dark:border-emerald-900/50 dark:bg-[linear-gradient(180deg,rgba(8,34,22,0.94),rgba(10,45,27,0.88))]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                          Bihar trade clusters
                        </p>
                        <h3 className="font-heading mt-2 text-2xl font-semibold">
                          Zone-wise board coverage for real mandi and buyer movement
                        </h3>
                      </div>
                      <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:bg-white/10 dark:text-emerald-200">
                        Board depth
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {biharTradeClusters.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-[22px] border border-emerald-200/80 bg-white/85 p-4 dark:border-white/10 dark:bg-white/6"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="font-heading text-lg font-semibold text-emerald-950 dark:text-white">
                              {item.title}
                            </p>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-white/10 dark:text-emerald-200">
                              {item.crops}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-emerald-950/75 dark:text-white/74">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-emerald-200/80 bg-white/92 p-5 dark:border-emerald-900/50 dark:bg-white/6">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                      Board use cases
                    </p>
                    <h3 className="font-heading mt-2 text-2xl font-semibold">
                      Clear ways this Bihar board helps farmers, buyers, and ops teams
                    </h3>

                    <div className="mt-5 space-y-3">
                      {biharBoardUseCases.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-[22px] border border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(236,253,245,0.88))] p-4 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(8,34,22,0.9),rgba(10,45,27,0.82))]"
                        >
                          <p className="font-heading text-lg font-semibold text-emerald-950 dark:text-white">
                            {item.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-emerald-950/75 dark:text-white/74">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-300/40 bg-[linear-gradient(180deg,#0f3f27,#166534)] text-background shadow-[0_24px_80px_-52px_rgba(22,101,52,0.42)]">
              <CardContent className="p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-background/70">
                  India crop map
                </p>
                <h2 className="font-heading mt-2 text-3xl font-semibold">
                  Crop categories that let GolaMart go beyond a single-state demo
                </h2>
                <p className="mt-3 text-sm leading-6 text-background/75">
                  The board now supports cereal, pulse, oilseed, vegetable, fruit,
                  specialty, fiber, and spice-style listings so the marketplace can feel
                  relevant across Bihar and wider India.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/68">
                      State coverage
                    </p>
                    <p className="font-heading mt-2 text-3xl font-semibold text-white">
                      {representedStates}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/72">
                      Live listing states already represented inside the marketplace board.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/68">
                      Crop families
                    </p>
                    <p className="font-heading mt-2 text-3xl font-semibold text-white">
                      {indiaCropCategories.length}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/72">
                      Broad crop groups that let the platform move beyond one mandi segment.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/68">
                      Search-ready board
                    </p>
                    <p className="font-heading mt-2 text-3xl font-semibold text-white">
                      {quickCropSearches.length}+
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/72">
                      Quick crop prompts pushing buyers into faster national discovery flows.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {indiaMarketModes.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/90">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/78">{item.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {indiaCropCategories.map((category) => (
                    <div
                      key={category.title}
                      className="rounded-[24px] border border-white/10 bg-white/8 p-4"
                    >
                      <p className="font-heading text-lg font-semibold text-white">
                        {category.title}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {category.crops.map((crop) => (
                          <span
                            key={crop}
                            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/85"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[26px] border border-white/10 bg-white/8 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                        Active state lanes
                      </p>
                      <h3 className="font-heading mt-2 text-2xl font-semibold text-white">
                        Visible sourcing spread across the current live board
                      </h3>
                    </div>
                    <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/74">
                      Live spread
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {stateOptions.slice(0, 12).map((state) => (
                      <span
                        key={state}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/82"
                      >
                        {state}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="rounded-[26px] border border-white/10 bg-white/8 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                      Market intelligence
                    </p>
                    <div className="mt-4 space-y-4">
                      {marketIntelligence.map((group) => (
                        <div key={group.title} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                          <p className="font-heading text-lg font-semibold text-white">{group.title}</p>
                          <div className="mt-3 space-y-2">
                            {group.items.map((item) => (
                              <div
                                key={item}
                                className="flex items-center gap-3 text-sm text-white/78"
                              >
                                <div className="h-2.5 w-2.5 rounded-full bg-lime-300" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                          Trade corridors
                        </p>
                        <h3 className="font-heading mt-2 text-2xl font-semibold text-white">
                          Real buyer and mandi lanes, not an empty side panel
                        </h3>
                      </div>
                      <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/72">
                        Live board feel
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {marketCorridors.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-[22px] border border-white/10 bg-white/8 p-4"
                        >
                          <p className="font-heading text-lg font-semibold text-white">{item.title}</p>
                          <p className="mt-2 text-sm leading-6 text-white/72">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
                  <div className="rounded-[26px] border border-white/10 bg-white/8 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                          India sourcing regions
                        </p>
                        <h3 className="font-heading mt-2 text-2xl font-semibold text-white">
                          Wider state clusters for grain, pulses, oilseed, fiber, and fresh trade
                        </h3>
                      </div>
                      <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/74">
                        Expansion map
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {indiaSourcingRegions.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-[22px] border border-white/10 bg-white/6 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="font-heading text-lg font-semibold text-white">
                              {item.title}
                            </p>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/76">
                              {item.states}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-white/72">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.05))] p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                      Board use cases
                    </p>
                    <h3 className="font-heading mt-2 text-2xl font-semibold text-white">
                      Why this India crop map matters inside GolaMart
                    </h3>

                    <div className="mt-5 space-y-3">
                      {indiaBoardUseCases.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-[22px] border border-white/10 bg-white/8 p-4"
                        >
                          <p className="font-heading text-lg font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/74">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="pb-20 xl:pb-28">
        <div className="container px-4">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              {error ? (
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardContent className="p-6">
                    <p className="font-medium text-destructive">Backend connection issue</p>
                    <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                  </CardContent>
                </Card>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    Marketplace grid
                  </p>
                  <h2 className="font-heading mt-2 text-3xl font-semibold">
                    Bihar and India live crop listings
                  </h2>
                </div>
                <div className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
                  {filteredProducts.length} active listings
                </div>
              </div>

              {isLoading ? (
                <Card className="border-border/80">
                  <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading GolaMart inventory...
                  </CardContent>
                </Card>
              ) : filteredProducts.length === 0 ? (
                <Card className="border-border/80">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold">No crops match the filter</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try searching for paddy, white wheat, makhana, litchi, Bihar, or a
                      broader crop category.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      displayPrice={product.price}
                      isBuying={buyingId === product._id}
                      onBuy={handleBuyProduct}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
              <SellForm isSubmitting={isSelling} onSubmit={handleCreateProduct} />

              <Card className="border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,253,244,0.94))] shadow-[0_24px_70px_-48px_rgba(22,101,52,0.15)] dark:border-emerald-900/50 dark:bg-[linear-gradient(180deg,rgba(6,24,16,0.98),rgba(8,34,22,0.94))]">
                <CardContent className="p-6 sm:p-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                    Today on GolaMart
                  </p>
                  <h3 className="font-heading mt-2 text-2xl font-semibold">
                    Dense buyer board, not an empty side rail
                  </h3>
                  <div className="mt-5 grid gap-3">
                    {quickCropSearches.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSearchQuery(item)}
                        className="flex items-center justify-between rounded-[20px] border border-emerald-200/80 bg-white/90 px-4 py-3 text-left text-sm font-medium text-emerald-950 transition-all duration-300 hover:-translate-y-px hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/8 dark:text-white/82 dark:hover:bg-white/10"
                      >
                        <span>{item}</span>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                          Open
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-300/40 bg-[linear-gradient(180deg,#14532d,#166534)] text-background shadow-[0_24px_80px_-52px_rgba(22,101,52,0.42)]">
                <CardContent className="p-6 sm:p-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-background/70">
                    Next step
                  </p>
                  <h3 className="font-heading mt-3 text-2xl font-semibold">
                    Need full mandi and order operations?
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-background/75">
                    Use the admin dashboard to review crop listings, buyer orders, market
                    flow, and live status progression for the GolaMart module.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild variant="secondary" className="rounded-full">
                      <Link to="/admin/golamart">Open Admin Dashboard</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background"
                    >
                      <a href="/#contact">Talk to the team</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container px-4">
          <div className="overflow-hidden rounded-[36px] border border-primary/15 bg-[linear-gradient(135deg,hsl(var(--foreground)),hsl(var(--foreground)/0.92),hsl(var(--primary)/0.7))] px-6 py-10 text-background shadow-[0_30px_90px_-44px_hsl(var(--foreground)/0.75)] sm:px-10">
            <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-background/70">
                  Build next
                </p>
                <h2 className="font-heading mt-3 text-3xl font-semibold">
                  GolaMart now reads more like a real crop marketplace, not just a demo inventory page.
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-background/75">
                  Use the module to support Bihar mandi trade, rabi fasal discovery,
                  all-India crop sourcing, faster order capture, and a more believable
                  farmer-to-buyer marketplace experience.
                </p>
              </div>
              <Button asChild className="h-12 rounded-full bg-background px-6 text-foreground hover:bg-background/90">
                <a href="/#contact">
                  Plan Custom Module
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
