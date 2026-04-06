import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUsers } from '@/mock/users';
import { Eye, EyeOff, Copy, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { login, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      const user = useAuthStore.getState().user;
      navigate(`/dashboard/${user?.role}`);
    }
  };

  const fillCredentials = (mockEmail: string, mockPassword: string) => {
    setEmail(mockEmail);
    setPassword(mockPassword);
    clearError();
    setCopiedId(mockEmail);
    setTimeout(() => setCopiedId(null), 1500);
    toast({ title: 'Credentials filled', description: 'Click Sign In to continue' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="text-center lg:text-left mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto lg:mx-0 mb-4">
              <span className="text-primary-foreground font-bold text-xl">S</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to SmartScholar</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearError(); }}
                      placeholder="••••••••"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-primary hover:underline">Sign up</Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mock Credentials Panel */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="border-dashed border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                🧪 <span>Test Credentials</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Click any role below to auto-fill login credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => fillCredentials(u.email, u.password)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{u.name}</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {u.role}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                      {u.email} / {u.password}
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {copiedId === u.email ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
