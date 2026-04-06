import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore, validatePassword } from '@/store/authStore';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'One special character (@$!%*?&#)', test: (p: string) => /[@$!%*?&#]/.test(p) },
];

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [formError, setFormError] = useState<string | null>(null);
  const { signup } = useAuthStore();
  const navigate = useNavigate();

  const roles: { value: UserRole; label: string; icon: string; desc: string }[] = [
    { value: 'donor', label: 'Donor', icon: '💰', desc: 'Fund scholarships' },
    { value: 'student', label: 'Student', icon: '🎓', desc: 'Apply for aid' },
    { value: 'admin', label: 'NGO/Admin', icon: '🏢', desc: 'Manage platform' },
    { value: 'institution', label: 'Institution', icon: '🏫', desc: 'Verify enrollment' },
    { value: 'verifier', label: 'Verifier', icon: '✅', desc: 'Review documents' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const pwError = validatePassword(password);
    if (pwError) {
      setFormError(pwError);
      return;
    }
    setIsSubmitting(true);
    const result = await signup(name, email, password, role);
    setIsSubmitting(false);
    if (!result.success) {
      setFormError(result.error || 'Signup failed');
      return;
    }
    navigate(`/dashboard/${role}`);
  };

  const allRulesPassed = passwordRules.every((r) => r.test(password));

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-xl">S</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join SmartScholar today</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sign Up</CardTitle>
            <CardDescription>Choose your role to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {formError}
                </div>
              )}
              <div>
                <Label className="text-sm mb-2 block">I am a...</Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-medium transition-colors ${
                        role === r.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      <span className="text-lg">{r.icon}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFormError(null); }}
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
                {/* Password strength indicators */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(password);
                      return (
                        <div key={rule.label} className="flex items-center gap-1.5 text-xs">
                          {passed ? (
                            <Check className="h-3 w-3 text-primary" />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className={passed ? 'text-primary' : 'text-muted-foreground'}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || (!allRulesPassed && password.length > 0)}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
