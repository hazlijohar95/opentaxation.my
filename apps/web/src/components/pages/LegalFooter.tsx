import { Link } from 'react-router-dom';
import { GithubLogo, YoutubeLogo, TwitterLogo } from 'phosphor-react';

export default function LegalFooter() {
  return (
    <footer className="border-t border-border/50 bg-muted/30 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/hazlijohar95/opentaxation.my"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
              aria-label="GitHub"
            >
              <GithubLogo weight="fill" className="h-5 w-5" />
            </a>
            <div className="group relative">
              <button
                className="text-muted-foreground/50 cursor-default"
                aria-label="YouTube - Coming Soon"
              >
                <YoutubeLogo weight="fill" className="h-5 w-5" />
              </button>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Coming Soon
              </span>
            </div>
            <div className="group relative">
              <button
                className="text-muted-foreground/50 cursor-default"
                aria-label="X (Twitter) - Coming Soon"
              >
                <TwitterLogo weight="fill" className="h-5 w-5" />
              </button>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Legal Links */}
          <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm text-muted-foreground">
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link
              to="/terms"
              className="hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link
              to="/disclaimer"
              className="hover:text-primary transition-colors duration-200"
            >
              Disclaimer
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} opentaxation.my
          </p>
        </div>
      </div>
    </footer>
  );
}

