import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '../Logo';

export default function PrivacyPolicy() {
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
            <CardTitle className="text-3xl font-display">Privacy Policy</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString('en-MY')}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-display font-semibold mb-3">1. Introduction</h2>
              <p>
                opentaxation.my ("we", "our", or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you use our tax calculation service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold mb-2">2.1 Information You Provide</h3>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Business profit and income data</li>
                <li>Tax relief information</li>
                <li>Account information (via Google authentication)</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-4">2.2 Automatically Collected Information</h3>
              <p>We automatically collect certain information when you use our service:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Device information</li>
                <li>Usage data and analytics</li>
                <li>Error logs (for debugging)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide tax calculation services</li>
                <li>Improve our service and user experience</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Detect and prevent errors</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">4. Data Storage and Security</h2>
              <p>
                All calculations are performed client-side. We do not store your financial data on our servers. 
                Your authentication data is managed securely by Supabase and Google OAuth.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">5. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Supabase:</strong> Database and authentication</li>
                <li><strong>Google OAuth:</strong> Sign-in provider</li>
                <li><strong>Sentry:</strong> Error tracking and monitoring</li>
                <li><strong>Google Fonts:</strong> Font delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access your personal information</li>
                <li>Delete your account</li>
                <li>Opt-out of analytics tracking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold mb-3">7. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
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

