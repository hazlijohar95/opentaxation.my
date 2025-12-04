const en = {
  // Navigation
  'nav.calculator': 'Calculator',
  'nav.calendar': 'Calendar',

  // Landing - Calculator
  'landing.badge': 'Malaysian Business Structure Calculator',
  'landing.badge.mobile': 'Malaysian Tax Calculator',
  'landing.hero.title.start': 'Enterprise or',
  'landing.hero.title.highlight': 'Sdn Bhd',
  'landing.hero.title.end': '?',
  'landing.hero.subtitle': 'A free tool to help you estimate tax differences between Enterprise and Sdn Bhd. Results are for reference only—consult a',
  'landing.hero.subtitle.link': 'tax professional',
  'landing.hero.subtitle.end': 'for advice.',
  'landing.hero.subtitle.mobile': 'Free tool to compare tax between Enterprise and Sdn Bhd structures.',
  'landing.cta.start': 'Get Started',
  'landing.cta.calculate': 'Start Calculating',
  'landing.cta.dashboard': 'Dashboard',

  // Landing - Features
  'landing.features.comparison': 'Side-by-Side',
  'landing.features.comparison.full': 'Side-by-Side Comparison',
  'landing.features.fair': 'Fair Analysis',
  'landing.features.fair.full': 'All Deductions Included',
  'landing.features.latest': 'YA 2025',
  'landing.features.latest.full': 'Latest LHDN Rates',

  // Landing - Comparison Cards
  'landing.comparison.personalTax': 'Personal Tax (0-30%)',
  'landing.comparison.corporateTax': 'Corporate Tax (15-24%)',
  'landing.comparison.epf': 'EPF Contributions',
  'landing.comparison.dividend': 'Dividend Distribution',
  'landing.comparison.liability': 'Liability Protection',

  'landing.enterprise.title': 'Enterprise',
  'landing.enterprise.subtitle': 'Sole Proprietorship',
  'landing.enterprise.bestFor': 'Best for: Freelancers, small businesses, low compliance needs',

  'landing.sdnbhd.title': 'Sdn Bhd',
  'landing.sdnbhd.subtitle': 'Private Limited Company',
  'landing.sdnbhd.bestFor': 'Best for: Growing businesses, investor-ready, asset protection',

  // Landing - Stats
  'landing.stats.free': 'Free forever',
  'landing.stats.latest': 'Latest rates',
  'landing.stats.answer': 'Get answer',

  // Landing - Footer
  'landing.footer.openSource': 'Open source',
  'landing.footer.contribute': 'Contribute on GitHub',

  // Landing - Calendar
  'calendar.badge': 'Malaysian Tax Filing System',
  'calendar.hero.title.start': 'Never Miss a Tax Filing',
  'calendar.hero.title.highlight': 'Deadline',
  'calendar.hero.subtitle': 'Track all your LHDN tax filing deadlines for individuals, companies, employers, and partnerships.',

  'calendar.features.forms': 'All LHDN Forms',
  'calendar.features.reminders': 'Smart Reminders',
  'calendar.features.malaysia': 'Malaysia-Specific',

  'calendar.filter.title': 'Filter by Entity Type',
  'calendar.filter.showAll': 'Show all',
  'calendar.deadlines.title': 'All Deadlines',
  'calendar.deadlines.count': '{{count}} deadline',
  'calendar.deadlines.count_plural': '{{count}} deadlines',

  'calendar.entity.individual': 'Individual',
  'calendar.entity.individual.desc': 'Personal tax filing',
  'calendar.entity.company': 'Company',
  'calendar.entity.company.desc': 'Corporate tax filing',
  'calendar.entity.employer': 'Employer',
  'calendar.entity.employer.desc': 'Employee tax forms',
  'calendar.entity.partnership': 'Partnership',
  'calendar.entity.partnership.desc': 'Partnership filing',

  'calendar.footer.lhdn': "Visit LHDN's official website",

  // Calendar FAQ
  'calendar.faq.title': 'Frequently Asked Questions',
  'calendar.faq.q1': 'What tax forms do I need to file in Malaysia?',
  'calendar.faq.a1': 'The forms depend on your entity type: Individuals use Form BE or Form B, Companies use Form C and CP204, Employers use Form E and CP58, and Partnerships use Form P.',
  'calendar.faq.q2': 'When is the deadline for individual tax filing?',
  'calendar.faq.a2': 'For individuals filing Form BE (e-Filing), the deadline is typically April 30 of the following year. For manual filing (Form B), the deadline is usually June 30.',
  'calendar.faq.q3': 'What happens if I miss a tax filing deadline?',
  'calendar.faq.a3': "Missing tax filing deadlines in Malaysia can result in penalties starting from RM200 to RM20,000, interest charges on unpaid tax amounts, and potential legal action from LHDN.",
  'calendar.faq.q4': 'How do I calculate my tax filing deadline based on my financial year end?',
  'calendar.faq.a4': 'For companies, Form C is typically due 7 months after your financial year end. Estimated tax payments (CP204) are due by installments throughout the year.',

  // Auth
  'auth.welcome.title': 'Welcome back',
  'auth.welcome.subtitle': 'Sign in to access your tax calculator',
  'auth.features.instant': 'Instant Calculations',
  'auth.features.instant.desc': 'Get real-time tax comparisons between Enterprise and Sdn Bhd',
  'auth.features.save': 'Save & Track',
  'auth.features.save.desc': 'Save your calculations and track changes over time',
  'auth.features.secure': 'Secure & Private',
  'auth.features.secure.desc': 'Your financial data is encrypted and never shared',
  'auth.signIn.google': 'Continue with Google',
  'auth.signIn.loading': 'Signing in...',
  'auth.back': 'Back',
  'auth.terms.prefix': 'By continuing, you agree to our',
  'auth.terms.link': 'Terms of Service',
  'auth.terms.and': 'and',
  'auth.privacy.link': 'Privacy Policy',

  // Footer
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'footer.disclaimer': 'Disclaimer',

  // Common
  'common.loading': 'Loading...',
  'common.error': 'Something went wrong',
  'common.back': 'Back',
} as const;

export default en;
export type TranslationKeys = keyof typeof en;
