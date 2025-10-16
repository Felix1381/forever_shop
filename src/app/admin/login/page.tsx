'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Connexion réussie ! Redirection...');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'admin@rita-aloe.com',
      password: 'admin123456',
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forever-yellow/10 to-forever-gold/20 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-forever-yellow/30 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-forever-yellow/20 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forever-yellow/5 via-forever-gold/10 to-orange-100/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-forever-yellow/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-forever-gold/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-forever-yellow/5 to-forever-gold/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-forever-yellow to-forever-gold rounded-2xl mb-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <Shield className="w-10 h-10 text-black drop-shadow-sm" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4 text-forever-gold animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Administration
          </h1>
          <h2 className="text-xl font-semibold text-forever-yellow mb-2">
            Rita Aloe Nutrition
          </h2>
          <p className="text-muted-foreground text-sm">
            Accès sécurisé au panneau d'administration
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-8 animate-slide-up">
          {/* Demo Credentials Button */}
          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={fillDemoCredentials}
              className="w-full border-forever-yellow/30 text-forever-yellow hover:bg-forever-yellow/10 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Utiliser les identifiants de démonstration
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Adresse email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-forever-yellow transition-colors" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-forever-yellow/50 focus:border-forever-yellow transition-all duration-300 placeholder:text-gray-400"
                  placeholder="admin@rita-aloe.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-forever-yellow transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-forever-yellow/50 focus:border-forever-yellow transition-all duration-300 placeholder:text-gray-400"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-forever-yellow transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center animate-fade-in">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center animate-shake">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || success !== ''}
              className="w-full bg-gradient-to-r from-forever-yellow to-forever-gold hover:from-forever-gold hover:to-forever-yellow text-black font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Connexion en cours...
                </div>
              ) : success ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Connecté !
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Se connecter
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <div className="flex items-center justify-between text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-forever-yellow transition-colors flex items-center group"
              >
                <ArrowRight className="w-4 h-4 mr-1 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Retour au site
              </Link>
              <div className="text-muted-foreground">
                v2.0
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center animate-fade-in-delay">
          <div className="inline-flex items-center px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full border border-white/20">
            <Shield className="w-4 h-4 text-forever-yellow mr-2" />
            <span className="text-sm text-gray-600 font-medium">
              Connexion sécurisée SSL
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.3s both;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
