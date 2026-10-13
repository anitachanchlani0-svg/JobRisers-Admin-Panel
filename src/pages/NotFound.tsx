import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-background p-4">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">404</h1>
        </div>
        <h2 className="text-lg font-semibold text-foreground">Page Not Found</h2>
        <p className="mt-3 text-sm text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </section>
    </div>
  );
}