import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-heading font-bold text-lg">SmartScholar</span>
        </div>
        <div className="flex gap-2">
          <Link to="/auth/login"><Button variant="outline" size="sm">Sign In</Button></Link>
          <Link to="/auth/signup"><Button size="sm">Get Started</Button></Link>
        </div>
      </div>
    </header>

    <main className="container mx-auto px-4 py-20 text-center max-w-3xl">
      <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
        Transparent • Decentralized • Impactful
      </div>
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">
        Decentralized Transparency for{' '}
        <span className="text-primary">Educational Philanthropy</span>
      </h1>
      <p className="text-muted-foreground mt-4 text-lg max-w-xl mx-auto">
        SmartScholar connects donors, students, and institutions through a transparent platform ensuring every scholarship reaches its intended recipient.
      </p>
      <div className="flex gap-3 justify-center mt-8">
        <Link to="/auth/signup"><Button size="lg">Start Contributing</Button></Link>
        <Link to="/auth/login"><Button variant="outline" size="lg">Sign In</Button></Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
        {[
          { icon: '💰', title: 'For Donors', desc: 'Track every dollar with full transparency and blockchain-verified transactions.' },
          { icon: '🎓', title: 'For Students', desc: 'Apply for scholarships, track progress, and receive funds directly.' },
          { icon: '✅', title: 'For Verifiers', desc: 'Review milestones, verify documents, and authorize fund releases.' },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-xl border border-border bg-card">
            <span className="text-2xl">{item.icon}</span>
            <h3 className="font-heading font-semibold mt-3 text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export default Index;
