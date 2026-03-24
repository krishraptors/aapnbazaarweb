import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Home', href: '/#home' },
      { name: 'Solutions', href: '/#solutions' },
      { name: 'My Products', href: '/#my-products' },
      { name: 'GolaMart', href: '/my-product' },
      { name: 'Global Reach', href: '/#global-services' },
      { name: 'Contact', href: '/#contact' }
    ],
    support: [
      { name: 'Contact Us', href: '/#contact' },
      { name: 'My Products', href: '/#my-products' },
      { name: 'GolaMart', href: '/my-product' },
      { name: 'Admin Dashboard', href: '/admin/golamart' },
      { name: 'WhatsApp Support', href: 'https://wa.me/919876543210' }
    ],
    business: [
      { name: 'AapnBazaar Marketplace', href: '/#product-AapnBazaar' },
      { name: 'GolaMart Agritech', href: '/my-product' },
      { name: 'Global Delivery', href: '/#global-services' },
      { name: 'Vendor Registration', href: '/#contact' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: 'https://www.instagram.com/aapnbazaar/', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/aapnbazaar', label: 'LinkedIn' }
  ];

  return (
    <footer className="border-t border-border bg-card/90 backdrop-blur">
      <div className="container px-4 py-12 xl:py-16">
        <div className="grid gap-8 xl:grid-cols-5">
          {/* Brand section */}
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/favicon.png"
                alt="AapnBazaar logo"
                className="h-12 w-12 rounded-full object-cover ring-1 ring-primary/15"
              />
              <h3 className="text-2xl font-bold gradient-text">AapnBazaar</h3>
            </div>
            <p className="text-muted-foreground max-w-md">
              India's first zero-commission B2B marketplace connecting factories, wholesalers, and shops directly. Trade freely, grow faster.
            </p>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <a
                href="mailto:contact@aapnbazaar.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                contact@aapnbazaar.com
              </a>
            </div>
          </div>

          {/* Links sections */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Business</h4>
            <ul className="space-y-3">
              {footerLinks.business.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col xl:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AapnBazaar. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-all duration-300 hover:-translate-y-px hover:bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--secondary)))] hover:text-primary-foreground"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
