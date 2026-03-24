import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';
import { Smartphone, Star, Download, CheckCircle } from 'lucide-react';

const appFeatures = [
  'Browse thousands of products',
  'Connect with verified sellers',
  'Real-time chat and negotiations',
  'Track orders and shipments',
  'Secure payment options',
  'Business analytics dashboard'
];

export default function AppDownload() {
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=bajarse.gola.com';

  const handleDownloadClick = () => {
    window.open(playStoreUrl, '_blank');
  };

  return (
    <section id="app-download" className="py-20 xl:py-32 bg-background">
      <div className="container px-4">
        <div className="grid gap-12 xl:grid-cols-2 items-center max-w-6xl mx-auto">
          {/* Left content */}
          <div className="space-y-8 text-center xl:text-left">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <Smartphone className="h-4 w-4" />
                Available on Android
              </span>
            </div>

            <h2 className="text-3xl xl:text-5xl font-bold">
              Download the <span className="gradient-text">AapnBazaar App</span>
            </h2>

            <p className="text-lg text-muted-foreground">
              Take your B2B business on the go. Download our mobile app for seamless trading anytime, anywhere.
            </p>

            {/* App features */}
            <div className="grid gap-3">
              {appFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* Download button */}
            <div className="flex flex-col xl:flex-row gap-4 justify-center xl:justify-start">
              <Button
                size="lg"
                onClick={handleDownloadClick}
                className="text-base"
              >
                <Download className="mr-2 h-5 w-5" />
                Download on Google Play
              </Button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 justify-center xl:justify-start pt-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">4.5+</span> rating on Play Store
              </div>
            </div>
          </div>

          {/* Right content - QR Code and phone mockup */}
          <div className="flex justify-center">
            <Card className="border-border p-8 max-w-sm">
              <CardContent className="space-y-6 p-0">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Scan to Download</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Scan this QR code with your phone camera to download the app
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-xl">
                    <QRCodeDataUrl
                      text={playStoreUrl}
                      width={200}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Available for Android devices
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
