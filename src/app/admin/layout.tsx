'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  FolderTree,
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/me');
        const data = await response.json();

        if (data.success) {
          setAdmin(data.admin);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Don't show layout for login page
  if (pathname === '/admin/login') {
    return children;
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-forever-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!admin) {
    return null;
  }

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Produits',
      href: '/admin/products',
      icon: Package,
    },
    {
      name: 'Catégories',
      href: '/admin/categories',
      icon: FolderTree,
    },
    {
      name: 'Commandes',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      name: 'Témoignages',
      href: '/admin/testimonials',
      icon: MessageSquare,
    },
    {
      name: 'Utilisateurs',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-forever-yellow" />
              <span className="font-semibold text-lg">Rita Aloe Admin</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-forever-yellow text-black'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-border">
            <div className="mb-3">
              <p className="text-sm font-medium">{admin.name}</p>
              <p className="text-xs text-muted-foreground">{admin.email}</p>
              <p className="text-xs text-forever-yellow capitalize">{admin.role}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-background border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-forever-yellow transition-colors"
              >
                Voir le site →
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
