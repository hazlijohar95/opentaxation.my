import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WarningCircle } from 'phosphor-react';
import Logo from '../Logo';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Logo size="lg" className="mb-6" />
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-display">Important Disclaimer</CardTitle>
            <CardDescription>Please read carefully before using our service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <WarningCircle weight="duotone" className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">Not Professional Advice</AlertTitle>
              <AlertDescription className="mt-2">
                opentaxation.my is a calculation tool for informational purposes only.
                It does not constitute professional tax, legal, or financial advice.
              </AlertDescription>
            </Alert>

            <section className="space-y-4">
              <h2 className="text-xl font-display font-semibold">Tax Accuracy</h2>
              <p className="text-muted-foreground">
                While we strive for accuracy, tax laws and rates may change. The calculations are based on 
                Malaysia tax rates for Year of Assessment (YA) 2024/2025. Always verify current rates with 
                LHDN (Lembaga Hasil Dalam Negeri Malaysia).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-display font-semibold">Consult a Professional</h2>
              <p className="text-muted-foreground">
                Before making any business structure decisions, you should:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Consult with a qualified tax advisor or accountant</li>
                <li>Review your specific circumstances with a professional</li>
                <li>Consider all factors beyond tax implications</li>
                <li>Verify all calculations independently</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-display font-semibold">No Guarantees</h2>
              <p className="text-muted-foreground">
                We make no guarantees about the accuracy, completeness, or suitability of the information 
                provided. Your use of this service is at your own risk.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-display font-semibold">Assumptions</h2>
              <p className="text-muted-foreground">
                Our calculations make certain assumptions:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>SME qualification criteria are met (for corporate tax rates)</li>
                <li>Single-tier dividend system applies</li>
                <li>Standard EPF contribution rates</li>
                <li>Audit exemption criteria as per current regulations</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Your actual situation may differ. Always consult a professional.
              </p>
            </section>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                By using opentaxation.my, you acknowledge that you have read, understood, and agree
                to this disclaimer.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

