'use client';

import { useEffect, useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp,
  Users,
  Eye,
  DollarSign,
  Calendar
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalTestimonials: number;
  totalRevenue: number;
  pendingOrders: number;
  pendingTestimonials: number;
  recentOrders: any[];
  recentTestimonials: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API call for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalProducts: 8,
          totalOrders: 24,
          totalTestimonials: 12,
          totalRevenue: 485000,
          pendingOrders: 3,
          pendingTestimonials: 5,
          recentOrders: [
            { id: 'RA241001', customer: 'Marie Kouassi', total: 45000, status: 'pending' },
            { id: 'RA241002', customer: 'Jean Doe', total: 32000, status: 'confirmed' },
            { id: 'RA241003', customer: 'Fatou Diallo', total: 28000, status: 'shipped' },
          ],
          recentTestimonials: [
            { id: '1', name: 'Koffi Adjei', type: 'product-review', status: 'pending' },
            { id: '2', name: 'Ama Sika', type: 'video', status: 'approved' },
            { id: '3', name: 'Kofi Mensah', type: 'text', status: 'pending' },
          ],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Erreur lors du chargement des statistiques</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Produits',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      badge: stats.pendingOrders > 0 ? `${stats.pendingOrders} en attente` : undefined,
    },
    {
      title: 'Témoignages',
      value: stats.totalTestimonials,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      badge: stats.pendingTestimonials > 0 ? `${stats.pendingTestimonials} à modérer` : undefined,
    },
    {
      title: 'Chiffre d\'affaires',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-forever-yellow',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre boutique Rita Aloe Nutrition
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              {stat.badge && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  {stat.badge}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Commandes récentes</h2>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatPrice(order.total)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {order.status === 'pending' ? 'En attente' :
                     order.status === 'confirmed' ? 'Confirmée' : 'Expédiée'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Testimonials */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Témoignages récents</h2>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {stats.recentTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {testimonial.type === 'product-review' ? 'Avis produit' :
                     testimonial.type === 'video' ? 'Vidéo' : 'Texte'}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  testimonial.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {testimonial.status === 'pending' ? 'En attente' : 'Approuvé'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-forever-yellow/10 hover:bg-forever-yellow/20 rounded-lg transition-colors">
            <Package className="w-5 h-5 text-forever-yellow" />
            <span className="font-medium">Ajouter un produit</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Voir les commandes</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Modérer témoignages</span>
          </button>
        </div>
      </div>
    </div>
  );
}
