import { lazy, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'phosphor-react';
import type { ComparisonResult, TaxCalculationInputs } from '@tax-engine/core';

// Lazy load the PDF components - only loaded when user clicks download
const PDFDownloadLink = lazy(() =>
  import('@react-pdf/renderer').then((mod) => ({ default: mod.PDFDownloadLink }))
);
const PDFReport = lazy(() => import('./PDFReport'));

interface LazyPDFButtonProps {
  inputs: TaxCalculationInputs;
  comparison: ComparisonResult;
}

export default function LazyPDFButton({ inputs, comparison }: LazyPDFButtonProps) {
  const { t } = useTranslation();
  const [showPDF, setShowPDF] = useState(false);

  // Show loading button until user clicks
  if (!showPDF) {
    return (
      <button
        onClick={() => setShowPDF(true)}
        className="inline-flex items-center justify-center gap-2 px-5 sm:px-5 h-12 sm:h-11 bg-card border border-border/50 text-xs sm:text-sm hover:bg-muted/50 hover:border-primary/30 active:scale-[0.98] transition-all duration-200 rounded-xl font-medium shadow-sm min-h-[48px] touch-target"
      >
        <Download weight="duotone" className="h-4 w-4 text-primary" />
        <span>{t('results.download')}</span>
      </button>
    );
  }

  // Once clicked, load the PDF library
  return (
    <Suspense
      fallback={
        <button
          disabled
          className="inline-flex items-center justify-center gap-2 px-5 sm:px-5 h-12 sm:h-11 bg-card border border-border/50 text-xs sm:text-sm rounded-xl font-medium shadow-sm min-h-[48px] touch-target opacity-50 cursor-not-allowed"
        >
          <Download weight="duotone" className="h-4 w-4 text-primary animate-pulse" />
          <span>{t('results.preparing')}</span>
        </button>
      }
    >
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore - PDFDownloadLink children type definition doesn't properly support render props */}
      <PDFDownloadLink
        document={
          <Suspense fallback={null}>
            <PDFReport inputs={inputs} comparison={comparison} />
          </Suspense>
        }
        fileName="tax-comparison.pdf"
      >
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        {({ loading }: { loading?: boolean }) => (
          <button
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-5 h-12 sm:h-11 bg-card border border-border/50 text-xs sm:text-sm hover:bg-muted/50 hover:border-primary/30 active:scale-[0.98] transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm min-h-[48px] touch-target"
          >
            <Download weight="duotone" className="h-4 w-4 text-primary" />
            <span>{loading ? t('results.downloading') : t('results.download')}</span>
          </button>
        )}
      </PDFDownloadLink>
    </Suspense>
  );
}
