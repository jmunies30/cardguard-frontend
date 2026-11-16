import { SiteHeader } from '@/components/layout/SiteHeader';
import { Dashboard } from '@/components/dashboard/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.12),_transparent_70%)]" />
      <div className="relative">
        <SiteHeader />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
