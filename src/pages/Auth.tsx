
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2, FileText, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';

const Auth = () => {
  const { signIn, signUp, resetPassword, user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
    setSuccess('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(formData.email, formData.password, formData.fullName);
    
    if (error) {
      setError(error.message);
    } else {
      setError('');
      setSuccess('Check your email for the confirmation link!');
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    const { error } = await resetPassword(formData.email);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password reset link sent to your email!');
      setShowForgotPassword(false);
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ResumeAI Pro</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Create stunning resumes in minutes</p>
        </div>

        {/* Auth Form */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center dark:text-white">
              {showForgotPassword ? 'Reset Password' : 'Welcome'}
            </CardTitle>
            <CardDescription className="text-center dark:text-gray-300">
              {showForgotPassword 
                ? 'Enter your email to receive a password reset link'
                : 'Sign in to your account or create a new one'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email" className="dark:text-gray-200">Email</Label>
                  <Input
                    id="reset-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to Sign In
                  </Button>
                </div>
              </form>
            ) : (
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4 mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email" className="dark:text-gray-200">Email</Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signin-password" className="dark:text-gray-200">Password</Label>
                      <Input
                        id="signin-password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                        <AlertDescription className="text-green-700 dark:text-green-300">
                          {success}
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4 mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name" className="dark:text-gray-200">Full Name</Label>
                      <Input
                        id="signup-name"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email" className="dark:text-gray-200">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="dark:text-gray-200">Password</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="At least 6 characters"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password" className="dark:text-gray-200">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                        <AlertDescription className="text-green-700 dark:text-green-300">
                          {success}
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
