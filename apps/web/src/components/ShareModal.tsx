import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Link as LinkIcon,
  WhatsappLogo,
  TelegramLogo,
  EnvelopeSimple,
  Copy,
  Check,
  Share,
  QrCode,
} from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { ComparisonResult, TaxCalculationInputs } from '@tax-engine/core';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: TaxCalculationInputs;
  comparison: ComparisonResult | null;
  generateShareableLink: () => string;
}

export default function ShareModal({
  isOpen,
  onClose,
  inputs,
  comparison,
  generateShareableLink,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showQr, setShowQr] = useState(false);

  // Generate share URL when modal opens
  useEffect(() => {
    if (isOpen) {
      setShareUrl(generateShareableLink());
      setCopied(false);
      setShowQr(false);
    }
  }, [isOpen, generateShareableLink]);

  const winner = comparison
    ? comparison.difference > 0
      ? 'Sdn Bhd'
      : 'Enterprise'
    : '';
  const savings = comparison ? Math.abs(comparison.difference) : 0;

  const shareTitle = 'Tax Comparison - OpenTaxation.my';
  const shareText = comparison
    ? `I compared Enterprise vs Sdn Bhd for RM${inputs.businessProfit.toLocaleString('en-MY')} profit. ${winner} saves ${formatCurrency(savings)}/year! Check it out:`
    : 'Compare Enterprise vs Sdn Bhd tax in Malaysia';

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const shareViaWhatsApp = useCallback(() => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [shareText, shareUrl]);

  const shareViaTelegram = useCallback(() => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [shareText, shareUrl]);

  const shareViaEmail = useCallback(() => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [shareTitle, shareText, shareUrl]);

  const shareNative = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error
      }
    }
  }, [shareTitle, shareText, shareUrl]);

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
          >
            <div className="bg-background rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 border-b border-border/50">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors"
                  aria-label="Close"
                >
                  <X weight="bold" className="h-4 w-4 text-muted-foreground" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Share weight="duotone" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 id="share-modal-title" className="text-lg font-semibold">
                      Share Your Results
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Let others see your tax comparison
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Preview */}
              {comparison && (
                <div className="px-6 py-4 bg-muted/30 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Business Profit</p>
                      <p className="font-semibold font-numbers">{formatCurrency(inputs.businessProfit)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Recommendation</p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {winner} saves {formatCurrency(savings)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Share Options */}
              <div className="px-6 py-5 space-y-4">
                {/* Share Link */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Share Link</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="w-full h-11 px-4 pr-10 bg-muted/50 border border-border/50 rounded-xl text-sm font-mono truncate focus:outline-none focus:ring-2 focus:ring-primary/20"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <LinkIcon
                        weight="duotone"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      />
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      variant={copied ? 'default' : 'outline'}
                      size="lg"
                      className={`h-11 px-4 rounded-xl transition-all ${
                        copied
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'
                          : ''
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check weight="bold" className="h-4 w-4 mr-1.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy weight="duotone" className="h-4 w-4 mr-1.5" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Share via</label>
                  <div className="grid grid-cols-4 gap-2">
                    {/* Native Share (if available) */}
                    {hasNativeShare && (
                      <button
                        onClick={shareNative}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Share weight="duotone" className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground">More</span>
                      </button>
                    )}

                    {/* WhatsApp */}
                    <button
                      onClick={shareViaWhatsApp}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="h-10 w-10 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <WhatsappLogo weight="fill" className="h-5 w-5 text-[#25D366]" />
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground">WhatsApp</span>
                    </button>

                    {/* Telegram */}
                    <button
                      onClick={shareViaTelegram}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="h-10 w-10 rounded-full bg-[#0088cc]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TelegramLogo weight="fill" className="h-5 w-5 text-[#0088cc]" />
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground">Telegram</span>
                    </button>

                    {/* Email */}
                    <button
                      onClick={shareViaEmail}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <EnvelopeSimple weight="duotone" className="h-5 w-5 text-amber-600" />
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground">Email</span>
                    </button>

                    {/* QR Code toggle */}
                    <button
                      onClick={() => setShowQr(!showQr)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors group ${
                        showQr ? 'bg-primary/10' : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
                        showQr ? 'bg-primary/20' : 'bg-slate-500/10'
                      }`}>
                        <QrCode weight="duotone" className={`h-5 w-5 ${showQr ? 'text-primary' : 'text-slate-600'}`} />
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground">QR Code</span>
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <AnimatePresence>
                  {showQr && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-border/50">
                        <div className="p-2 bg-white rounded-lg">
                          {/* Simple QR code using Google Charts API */}
                          <img
                            src={`https://chart.googleapis.com/chart?cht=qr&chs=180x180&chl=${encodeURIComponent(shareUrl)}&choe=UTF-8&chld=M|2`}
                            alt="QR Code"
                            className="w-[180px] h-[180px]"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Scan to open on another device
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-muted/20 border-t border-border/50">
                <p className="text-[10px] text-center text-muted-foreground">
                  Shared links contain your input values. Recipients will see your calculation results.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
