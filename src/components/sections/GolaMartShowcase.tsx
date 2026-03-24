import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, PackageCheck, Tractor } from 'lucide-react';
import { motion } from 'motion/react';

const highlights = [
  'Bihar-first crop board for paddy, wheat, maize, makhana, and vegetables',
  'Buyer order creation with transparent quantity, mandi context, and pricing',
  'Agritech workflows for procurement, logistics, and rural commerce across India',
];

const capabilities = [
  'Crop inventory modules with season and mandi context',
  'Farmer sell forms',
  'Order management',
  'Admin visibility and status tracking',
];

const metrics = [
  { label: 'Product Lens', value: 'Bihar to Bharat' },
  { label: 'Audience', value: 'Farmers and buyers' },
  { label: 'Core Board', value: 'Paddy, wheat, makhana' },
];
const liveLanes = [
  'Paddy and white wheat board',
  'Sabzi rush for potato and onion',
  'Makhana and litchi specialty lane',
  'Pan-India sourcing for cotton and turmeric',
];
const journeyModes = [
  {
    title: 'For buyers',
    description: 'Fast crop discovery, mandi context, and order creation without digging through clutter.',
  },
  {
    title: 'For farmers',
    description: 'List produce with season, state, mandi, and grade so the board feels market ready.',
  },
];

export default function GolaMartShowcase() {
  return (
    <section
      id="golamart-section"
      className="scroll-mt-28 relative overflow-hidden py-20 xl:py-32"
    >
      <div className="agri-showcase-surface absolute inset-0" />
      <div className="surface-grid absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute left-[8%] top-20 h-44 w-44 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] bottom-10 h-64 w-64 rounded-full bg-lime-200/25 blur-3xl" />

      <div className="container relative px-4">
        <motion.div
          className="mx-auto mb-14 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 backdrop-blur">
            <Leaf className="h-4 w-4" />
            GolaMart
          </div>
          <h2 className="font-heading mb-4 text-3xl font-bold xl:text-5xl">
            Separate agritech section built for
            <span className="text-emerald-700 dark:text-emerald-300"> Indian farmers and crop trade</span>
          </h2>
          <p className="text-lg text-emerald-950/72 dark:text-emerald-50/72">
            GolaMart now stands on its own section so the agritech product has a clearer
            identity. It extends AapnBazaar into farm-to-market workflows with a greener,
            more farmer-friendly UI direction built around Bihar crop markets and broader
            India sourcing.
          </p>
        </motion.div>

        <motion.div
          className="rounded-[36px] border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(240,253,244,0.94)_55%,rgba(220,252,231,0.8))] p-6 shadow-[0_24px_90px_-55px_hsl(var(--foreground)/0.32)] dark:border-emerald-900/50 dark:bg-[linear-gradient(135deg,rgba(5,24,16,0.98),rgba(8,34,22,0.94)_55%,rgba(10,50,30,0.84))] sm:p-8"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid gap-8 xl:grid-cols-[0.94fr_1.06fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 backdrop-blur">
                <Tractor className="h-4 w-4" />
                Marketplace Product 02
              </div>
              <h3 className="font-heading mt-5 text-3xl font-semibold leading-tight xl:text-4xl">
                A greener agritech layer built for Bihar crop markets and Indian farmers.
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-950/78 dark:text-emerald-50/78">
                GolaMart extends the AapnBazaar ecosystem into agritech. It is built
                around crop inventory, mandi-style buying, farmer listings, paddy and
                wheat trade flows, makhana and litchi specialties, price visibility, and
                simple order capture for the farm-to-market journey.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-3xl border border-emerald-200/80 bg-white/88 px-5 py-5 backdrop-blur dark:border-white/10 dark:bg-white/8"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-emerald-900/55 dark:text-white/55">
                      {metric.label}
                    </p>
                    <p className="font-heading mt-3 text-xl font-semibold text-emerald-950 dark:text-white">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-700">
                  <a href="/my-product">
                    Open GolaMart
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-emerald-300 bg-white/80 text-emerald-800 hover:bg-emerald-50"
                >
                  <a href="/#contact">Request GolaMart Demo</a>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[30px] border border-emerald-200/80 bg-white/92 p-6 backdrop-blur dark:border-white/10 dark:bg-white/8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700/85">
                  Core Highlights
                </p>
                <div className="mt-5 space-y-3">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl bg-emerald-50/80 px-4 py-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <p className="text-sm leading-6 text-emerald-950/84">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-emerald-300/70 bg-[linear-gradient(180deg,#11472c,#166534)] p-6 text-white shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                  Capability Stack
                </p>
                <div className="mt-5 grid gap-3">
                  {capabilities.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white/84"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-emerald-200/80 bg-white/92 p-6 backdrop-blur dark:border-white/10 dark:bg-white/8 lg:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <PackageCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-900/60">
                      Agritech Positioning
                    </p>
                    <h4 className="font-heading mt-1 text-2xl font-semibold text-emerald-950">
                      Separate section so GolaMart does not feel buried under the main marketplace
                    </h4>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-emerald-950/72">
                  This section gives GolaMart its own presence on the homepage while still
                  keeping it connected to the overall AapnBazaar product ecosystem.
                </p>
              </div>

              <div className="rounded-[30px] border border-emerald-200/80 bg-white/92 p-6 backdrop-blur dark:border-white/10 dark:bg-white/8 lg:col-span-2">
                <div className="grid gap-4 lg:grid-cols-[0.96fr_1.04fr]">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700/85">
                      Live lanes
                    </p>
                    <div className="mt-4 grid gap-3">
                      {liveLanes.map((item) => (
                        <div key={item} className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-900 dark:border-white/10 dark:bg-white/8 dark:text-white/82">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700/85">
                      Clear user journeys
                    </p>
                    <div className="mt-4 grid gap-3">
                      {journeyModes.map((item) => (
                        <div key={item.title} className="rounded-2xl border border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(236,253,245,0.84))] px-4 py-4 dark:border-white/10 dark:bg-white/6">
                          <p className="font-heading text-lg font-semibold text-emerald-950 dark:text-white">
                            {item.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-emerald-950/72 dark:text-white/72">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
