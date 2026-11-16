import { ShieldCheck } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-700 shadow-lg shadow-sky-950/60">
          <ShieldCheck className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">Card Guard</span>
      </div>
    </header>
  );
}
