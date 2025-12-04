export default function Footer() {
  return (
    <footer className="border-t mt-12 py-6 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            <p>Tax rates based on <strong className="text-foreground">YA 2024/2025</strong></p>
            <p className="mt-1">Last updated: January 2025</p>
          </div>
          <div className="text-center sm:text-right">
            <p>This calculator provides estimates only.</p>
            <p className="mt-1">Always consult a qualified tax advisor.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

