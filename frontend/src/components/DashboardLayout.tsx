import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';

const navItems: Record<UserRole, { label: string; path: string }[]> = {
  donor: [
    { label: 'Dashboard', path: '/dashboard/donor' },
    { label: 'Transactions', path: '/transactions' },
  ],
  student: [
    { label: 'Dashboard', path: '/dashboard/student' },
    { label: 'Transactions', path: '/transactions' },
  ],
  admin: [
    { label: 'Dashboard', path: '/dashboard/admin' },
    { label: 'Transactions', path: '/transactions' },
  ],
  institution: [
    { label: 'Dashboard', path: '/dashboard/institution' },
    { label: 'Transactions', path: '/transactions' },
  ],
  verifier: [
    { label: 'Dashboard', path: '/dashboard/verifier' },
    { label: 'Transactions', path: '/transactions' },
  ],
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const items = navItems[user.role];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={`/dashboard/${user.role}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-heading font-bold text-lg text-foreground">SmartScholar</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { logout(); navigate('/'); }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
