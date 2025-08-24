import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import ErrorLogger from '@/utils/errorLogger';
import { 
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Users,
  BarChart3,
  Loader2
} from 'lucide-react';

interface AuthLayoutProps {
  onLogin: (role: string, user: any) => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Log component initialization
  React.useEffect(() => {
    console.log('🎬 [AuthLayout] Component mounted and ready for input');
    console.log('📝 [Form State] Initial mode: Login');
    return () => {
      console.log('🎬 [AuthLayout] Component unmounted');
    };
  }, []);

  // Log form state changes
  React.useEffect(() => {
    const isEmail = email.includes('@');
    console.log(`📝 [Form Update] Email/Name: "${email}" | Type: ${isEmail ? 'Email' : 'Name'}`);
  }, [email]);

  React.useEffect(() => {
    console.log(`🔒 [Form Update] Password: "${password}" (Length: ${password.length})`);
  }, [password]);

  React.useEffect(() => {
    console.log(`👤 [Form Update] Name: "${name}"`);
  }, [name]);

  React.useEffect(() => {
    console.log(`🔄 [Form Mode] ${isLogin ? 'Login' : 'Register'} mode`);
  }, [isLogin]);

  // Enhanced input handlers with detailed logging
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isEmail = value.includes('@');
    console.log(`📧 [Email/Name Input] "${value}" | Length: ${value.length} | Type: ${isEmail ? 'Email' : 'Name'} | Valid: ${isEmail ? value.includes('@') : value.length > 0}`);
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`🔑 [Password Input] "${value}" | Length: ${value.length} | Strength: ${value.length < 6 ? 'Weak' : value.length < 10 ? 'Medium' : 'Strong'}`);
    setPassword(value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`👤 [Name Input] "${value}" | Length: ${value.length}`);
    setName(value);
  };

  const handleFormModeToggle = () => {
    const newMode = !isLogin;
    console.log(`🔄 [Mode Switch] Switching to ${newMode ? 'Register' : 'Login'} mode`);
    setIsLogin(newMode);
    // Clear form when switching modes
    setEmail('');
    setPassword('');
    setName('');
    console.log(`🧹 [Form Clear] All fields cleared`);
  };

  const handleShowPasswordToggle = () => {
    const newState = !showPassword;
    console.log(`👁️ [Password Visibility] ${newState ? 'Showing' : 'Hiding'} password`);
    setShowPassword(newState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Log complete form submission
    console.group(`🚀 [Form Submit] ${isLogin ? 'Login' : 'Registration'} Attempt`);
    console.log(`📧 Email/Name: "${email}" | Type: ${email.includes('@') ? 'Email' : 'Name'}`);
    console.log(`🔑 Password: "${password}" (Length: ${password.length})`);
    if (!isLogin) console.log(`👤 Name: "${name}"`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.groupEnd();

    try {
      if (isLogin) {
        // Login
        console.log("🔐 Attempting login...");
        const response = await apiService.login({ email, password });
        console.log("✅ Login successful!");
        console.log("📊 Response data:", response); // Debug log to see structure
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        // Handle both flat structure (admin) and nested structure (employees)
        const user = response.user || response; // Use response.user if exists, otherwise use response itself
        const userRole = user.role || 'user'; // Default to 'user' if role is missing
        console.log("👤 User object:", user);
        console.log("🎭 User role:", userRole);
        onLogin(userRole, user);
      } else {
        // Register
        console.log("📝 Attempting registration...");
        await apiService.register({ name, email, password });
        console.log("✅ Registration successful!");
        toast({
          title: "Success", 
          description: "Account created successfully! Please login.",
        });
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error: any) {
      console.error("❌ Authentication failed:", error);
      ErrorLogger.log(error, 'Authentication Error', { email, isLogin });
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log("🏁 Form submission completed");
    }
  };

  const features = [
    {
      icon: Users,
      title: "Complete HR Management",
      description: "Employee lifecycle, attendance, payroll, and performance tracking"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time insights and predictive analytics powered by Azure AI"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Role-based access control with SOC2 compliance ready"
    }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-muted">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-16 xl:px-24">
        <div className="space-y-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary-gradient shadow-xl">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Omyra HRM
              </h1>
              <p className="text-muted-foreground">Enterprise HR & Finance Suite</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Everything you need to manage your workforce
            </h2>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-lg neu-surface group-hover:scale-110 transition-transform duration-200">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="p-4 rounded-xl neu-inset bg-muted/30">
            <h4 className="font-medium text-sm mb-2">Demo Credentials:</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Admin:</strong> admin@omyra.com OR "Admin" / password</p>
              <p><strong>Employee:</strong> user@omyra.com OR "Employee Name" / password</p>
              <p className="text-xs opacity-75 mt-2">💡 You can login with email or name</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex items-center justify-center p-8">
        <Card className="w-full max-w-md neu-surface p-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-primary-gradient shadow-lg">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Omyra HRM
            </h1>
          </div>

          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Get started with your HR management platform'
              }
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={handleNameChange}
                    onFocus={() => console.log('🎯 [Focus] Name field focused')}
                    onBlur={() => console.log('🎯 [Blur] Name field lost focus')}
                    className="pl-10 neu-inset border-0 bg-muted/50"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email or Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email or name"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => console.log('🎯 [Focus] Email/Name field focused')}
                  onBlur={() => console.log('🎯 [Blur] Email/Name field lost focus')}
                  onKeyDown={(e) => console.log(`⌨️ [Keypress] Email/Name: "${e.key}"`)}
                  className="pl-10 neu-inset border-0 bg-muted/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={() => console.log('🎯 [Focus] Password field focused')}
                  onBlur={() => console.log('🎯 [Blur] Password field lost focus')}
                  onKeyDown={(e) => console.log(`⌨️ [Keypress] Password: "${e.key}"`)}
                  className="pl-10 pr-10 neu-inset border-0 bg-muted/50"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={handleShowPasswordToggle}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Button variant="link" size="sm" className="p-0">
                  Forgot password?
                </Button>
              </div>
            )}

            <Button 
              type="submit" 
              variant="neu-primary" 
              className="w-full group"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <Separator className="my-4" />
            
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <Button 
                variant="link" 
                size="sm" 
                onClick={handleFormModeToggle}
                className="ml-1"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;