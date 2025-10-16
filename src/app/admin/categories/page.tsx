'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Package,
  FolderTree,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategories?: Array<{
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
  }>;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Filtres
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    parentId: ''
  });

  // États pour les actions
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Charger les catégories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.parentId && { parentId: filters.parentId })
      });

      const response = await fetch(`/api/admin/categories?${params}`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
        setPagination(data.pagination);
      } else {
        console.error('Erreur:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une catégorie
  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ?`)) {
      return;
    }

    try {
      setDeleteLoading(categoryId);
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await fetchCategories();
      } else {
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Changer de page
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Appliquer les filtres
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Effets
  useEffect(() => {
    fetchCategories();
  }, [pagination.page, filters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Catégories</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les catégories de produits de votre boutique
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center px-4 py-2 bg-forever-yellow text-black font-medium rounded-lg hover:bg-forever-yellow/90 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle Catégorie
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-card rounded-lg bg-background border border-border p-4 text-foreground placeholder:text-muted-foreground">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-forever-yellow focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Statut */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-forever-yellow focus:border-transparent text-foreground placeholder:text-muted-foreground"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </select>

          {/* Type */}
          <select
            value={filters.parentId}
            onChange={(e) => handleFilterChange('parentId', e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-forever-yellow focus:border-transparent text-foreground placeholder:text-muted-foreground"
          >
            <option value="">Toutes les catégories</option>
            <option value="null">Catégories principales</option>
          </select>
        </div>
      </div>

      {/* Tableau des catégories */}
      <div className="bg-card rounded-lg bg-background border border-border overflow-hidden text-foreground placeholder:text-muted-foreground">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 bg-background border-b-2 border-forever-yellow mx-auto text-foreground placeholder:text-muted-foreground"></div>
            <p className="text-muted-foreground mt-2">Chargement des catégories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <FolderTree className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucune catégorie trouvée</h3>
            <p className="text-muted-foreground mb-4">
              {filters.search || filters.status || filters.parentId
                ? 'Aucune catégorie ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre première catégorie.'}
            </p>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center px-4 py-2 bg-forever-yellow text-black font-medium rounded-lg hover:bg-forever-yellow/90 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer une catégorie
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Parent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Produits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ordre
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-bg-background border text-foreground placeholder:text-muted-foreground">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {category.image ? (
                            <div className="flex-shrink-0 h-10 w-10">
                              <Image
                                src={category.image}
                                alt={category.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                              <FolderTree className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-foreground">
                              {category.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {category.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {category.parentCategory ? (
                          <span className="text-blue-600 dark:text-blue-400">
                            {category.parentCategory.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Principale</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {category.isActive ? (
                            <ToggleRight className="w-5 h-5 text-green-500 mr-2" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-muted-foreground mr-2" />
                          )}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            category.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-muted text-foreground'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-muted-foreground mr-1" />
                          {category.productCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {category.sortOrder}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/categories/${category._id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Voir"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/categories/${category._id}/edit`}
                            className="text-forever-yellow hover:text-forever-yellow/80 p-1 rounded"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(category._id, category.name)}
                            disabled={deleteLoading === category._id}
                            className="text-red-500 hover:text-red-900 p-1 rounded disabled:opacity-50"
                            title="Supprimer"
                          >
                            {deleteLoading === category._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 bg-background border-b-2 border-red-600 text-foreground placeholder:text-muted-foreground"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-card px-4 py-3 flex items-center justify-between bg-background border-t border-border sm:px-6 text-foreground placeholder:text-muted-foreground">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 bg-background border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 bg-background border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-foreground">
                      Affichage de{' '}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{' '}
                      à{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      sur{' '}
                      <span className="font-medium">{pagination.total}</span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md bg-background border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.page
                              ? 'z-10 bg-forever-yellow border-forever-yellow text-black'
                              : 'bg-card border-border text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md bg-background border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
