import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Buildings,
  BookBookmark,
  Calculator,
  Bank,
  Star,
  MapPin,
  Phone,
  Globe,
  ArrowLeft,
  ShieldCheck,
  CaretRight
} from 'phosphor-react';

// Partner data - in production, this would come from a database
interface Partner {
  id: string;
  name: string;
  category: 'company_secretary' | 'accounting' | 'tax_advisory' | 'banking';
  description: string;
  services: string[];
  priceRange: string;
  location: string;
  rating: number;
  reviewCount: number;
  website?: string;
  phone?: string;
  verified: boolean;
  featured: boolean;
}

const partners: Partner[] = [
  {
    id: 'coming-soon-1',
    name: 'Partner Coming Soon',
    category: 'company_secretary',
    description: 'We are currently onboarding verified company secretaries to join our partner network.',
    services: ['SSM Registration', 'Annual Returns', 'Compliance Management'],
    priceRange: 'Starting from RM1,200/year',
    location: 'Nationwide',
    rating: 0,
    reviewCount: 0,
    verified: false,
    featured: false,
  },
  {
    id: 'coming-soon-2',
    name: 'Partner Coming Soon',
    category: 'accounting',
    description: 'We are currently onboarding verified accounting firms to join our partner network.',
    services: ['Bookkeeping', 'Financial Statements', 'Payroll'],
    priceRange: 'Starting from RM200/month',
    location: 'Nationwide',
    rating: 0,
    reviewCount: 0,
    verified: false,
    featured: false,
  },
  {
    id: 'coming-soon-3',
    name: 'Partner Coming Soon',
    category: 'tax_advisory',
    description: 'We are currently onboarding verified tax advisors to join our partner network.',
    services: ['Corporate Tax Filing', 'Tax Planning', 'Tax Audits'],
    priceRange: 'Starting from RM500/year',
    location: 'Nationwide',
    rating: 0,
    reviewCount: 0,
    verified: false,
    featured: false,
  },
];

const categoryConfig = {
  company_secretary: {
    icon: Buildings,
    label: 'Company Secretary',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  accounting: {
    icon: BookBookmark,
    label: 'Accounting',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  tax_advisory: {
    icon: Calculator,
    label: 'Tax Advisory',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  banking: {
    icon: Bank,
    label: 'Business Banking',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
};

function PartnerCard({ partner }: { partner: Partner }) {
  const config = categoryConfig[partner.category];
  const Icon = config.icon;
  const isComingSoon = partner.id.startsWith('coming-soon');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative overflow-hidden transition-all duration-200 ${
        isComingSoon ? 'opacity-60' : 'hover:shadow-md hover:border-border/80'
      }`}>
        {partner.featured && !isComingSoon && (
          <div className="absolute top-0 right-0">
            <Badge className="rounded-none rounded-bl-lg bg-amber-500 text-white text-xs">
              Featured
            </Badge>
          </div>
        )}

        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
              <Icon weight="duotone" className={`h-6 w-6 ${config.color}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{partner.name}</h3>
                {partner.verified && !isComingSoon && (
                  <ShieldCheck weight="fill" className="h-4 w-4 text-blue-500 flex-shrink-0" />
                )}
              </div>

              <Badge variant="secondary" className="text-xs mb-2">
                {config.label}
              </Badge>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {partner.description}
              </p>

              {/* Services */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {partner.services.slice(0, 3).map((service) => (
                  <span
                    key={service}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {service}
                  </span>
                ))}
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="font-numbers font-medium text-foreground">
                  {partner.priceRange}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin weight="fill" className="h-3 w-3" />
                  {partner.location}
                </span>
                {!isComingSoon && partner.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star weight="fill" className="h-3 w-3 text-amber-500" />
                    {partner.rating.toFixed(1)} ({partner.reviewCount})
                  </span>
                )}
              </div>

              {/* Contact buttons */}
              {!isComingSoon && (
                <div className="flex items-center gap-2 mt-4">
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
                    >
                      <Globe weight="bold" className="h-3 w-3" />
                      Visit Website
                    </a>
                  )}
                  {partner.phone && (
                    <a
                      href={`tel:${partner.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <Phone weight="bold" className="h-3 w-3" />
                      Call
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PartnersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft weight="bold" className="h-4 w-4" />
            Back to Calculator
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-5 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Verified Partners
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ready to incorporate? Connect with our network of verified professionals who can help you
            set up your Sdn Bhd the right way.
          </p>
        </motion.div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <ShieldCheck weight="duotone" className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Partner Network Coming Soon
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    We're building a network of verified company secretaries, accountants, and tax advisors
                    to help you with your incorporation journey. Want to be notified when we launch?
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Go to Calculator & Get Updates
                    <CaretRight weight="bold" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Partner Categories */}
        <div className="grid gap-4 mb-8">
          {Object.entries(categoryConfig).map(([key, config], index) => {
            const Icon = config.icon;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${config.bgColor}`}
              >
                <Icon weight="duotone" className={`h-5 w-5 ${config.color}`} />
                <span className="text-sm font-medium text-foreground">{config.label}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  Coming Soon
                </Badge>
              </motion.div>
            );
          })}
        </div>

        {/* Partner List */}
        <div className="space-y-4">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <PartnerCard partner={partner} />
            </motion.div>
          ))}
        </div>

        {/* CTA for Partners */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="border-border/60 bg-muted/20">
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Are you a service provider?
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Join our partner network and connect with business owners who are ready to incorporate.
                We verify all partners to ensure quality service.
              </p>
              <a
                href="mailto:coding@hazli.dev?subject=Partner%20Inquiry"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Become a Partner
                <CaretRight weight="bold" className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center">
          <p className="text-xs text-muted-foreground">
            OpenTaxation.my - Open source tax calculator for Malaysian entrepreneurs
          </p>
        </div>
      </footer>
    </div>
  );
}

export default memo(PartnersPage);
