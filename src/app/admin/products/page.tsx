'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Tag,
  MoreHorizontal,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: {
    public_id: string;
    secure_url: string;
    alt?: string;
  }[];
  inStock: boolean;
  stockQuantity: number;
  isPopular: boolean;
  isNew: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'boissons', label: 'Boissons' },
    { value: 'complements', label: 'Compléments' },
    { value: 'soins', label: 'Soins' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'in-stock', label: 'En stock' },
    { value: 'out-of-stock', label: 'Rupture de stock' },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
      });

      const response = await fetch(`/api/admin/products?${params}`);
      const data: ProductsResponse = await response.json();

      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
      } else {
        setError('Erreur lors du chargement des produits');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, selectedStatus]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts(); // Refresh the list
      } else {
        setError('Erreur lors de la suppression du produit');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  if (loading && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestion des produits</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-forever-yellow" />
            <p className="text-muted-foreground">Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gestion des produits</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits Forever Living Products
          </p>
        </div>
        <Button
          asChild
          className="bg-forever-yellow hover:bg-forever-gold text-black"
        >
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Package className="w-4 h-4 mr-2" />
            {pagination.total} produit{pagination.total > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Produit</th>
                <th className="text-left p-4 font-semibold">Catégorie</th>
                <th className="text-left p-4 font-semibold">Prix</th>
                <th className="text-left p-4 font-semibold">Stock</th>
                <th className="text-left p-4 font-semibold">Statut</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {product.images.length > 0 ? (
                          <Image
                            src={product.images[0].secure_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.isPopular && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700">
                              <Star className="w-3 h-3 mr-1" />
                              Populaire
                            </span>
                          )}
                          {product.isNew && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                              Nouveau
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                              Vedette
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      <Tag className="w-3 h-3 mr-1" />
                      {getCategoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <p className="font-semibold text-forever-yellow">
                        {formatPrice(product.price)}
                      </p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <p className="font-medium">{product.stockQuantity}</p>
                      <p className="text-xs text-muted-foreground">unités</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        product.inStock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.inStock ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      {product.inStock ? 'En stock' : 'Rupture'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0"
                      >
                        <Link href={`/admin/products/${product._id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0"
                      >
                        <Link href={`/admin/products/${product._id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Aucun produit ne correspond à vos critères de recherche.'
                : 'Commencez par ajouter votre premier produit.'}
            </p>
            <Button
              asChild
              className="bg-forever-yellow hover:bg-forever-gold text-black"
            >
              <Link href="/admin/products/new">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Affichage de {(pagination.page - 1) * pagination.limit + 1} à{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} sur{' '}
            {pagination.total} produits
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Précédent
            </Button>
            <span className="text-sm">
              Page {pagination.page} sur {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
