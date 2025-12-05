import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '../Logo';

export default function TermsOfService() {
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
            <CardTitle className="text-3xl font-display">Terms of Service</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString('en-MY')}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-display font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using opentaxation.my, you accept and agree to be bound by these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">2. Service Description</h2>
              <p>
                opentaxation.my provides a tax calculation tool to help users compare Enterprise and Sdn Bhd
                business structures. The service is provided "as is" for informational purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">3. Disclaimer</h2>
              <p>
                <strong>IMPORTANT:</strong> This service is for informational purposes only and does not constitute 
                professional tax, legal, or financial advice. You should consult with a qualified tax advisor or 
                accountant before making any business structure decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">4. User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate information</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Not misuse or abuse the service</li>
                <li>Not attempt to reverse engineer or copy the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">5. Limitation of Liability</h2>
              <p>
                opentaxation.my and its operators shall not be liable for any indirect, incidental,
                special, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the service
                constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">7. Contact</h2>
              <p>
                For questions about these Terms, contact us at:
                <br />
                <a href="mailto:coding@hazli.dev" className="text-primary hover:underline">
                  coding@hazli.dev
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

