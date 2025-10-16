'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  FolderTree,
  Package,
  Calendar,
  Globe,
  Hash,
  FileText,
  ToggleLeft,
  ToggleRight,
  AlertCircle
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
  seoTitle?: string;
  seoDescription?: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Charger les détails de la catégorie
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/categories/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setCategory(data.data);
      } else {
        setMessage({ type: 'error', text: data.error || 'Catégorie non trouvée' });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la catégorie:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement' });
    } finally {
      setLoading(false);
    }
  };

  // Supprimer la catégorie
  const handleDelete = async () => {
    if (!category) return;

    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      return;
    }

    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/admin/categories/${category._id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Catégorie supprimée avec succès' });
        setTimeout(() => {
          router.push('/admin/categories');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la suppression' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Effets
  useEffect(() => {
    if (params.id) {
      fetchCategory();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 bg-background border-b-2 border-forever-yellow mx-auto mb-4 text-foreground placeholder:text-muted-foreground"></div>
          <p className="text-muted-foreground">Chargement de la catégorie...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <FolderTree className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Catégorie non trouvée</h2>
        <p className="text-muted-foreground mb-6">La catégorie demandée n'existe pas ou a été supprimée.</p>
        <Link
          href="/admin/categories"
          className="inline-flex items-center px-4 py-2 bg-forever-yellow text-black font-medium rounded-lg hover:bg-forever-yellow/90 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux catégories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/categories"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{category.name}</h1>
            <p className="text-muted-foreground">Détails de la catégorie</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/categories/${category._id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-forever-yellow text-black font-medium rounded-lg hover:bg-forever-yellow/90 transition-colors"
          >
            <Edit className="w-5 h-5 mr-2" />
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 bg-background border-b-2 border-white mr-2 text-foreground placeholder:text-muted-foreground"></div>
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5 mr-2" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Message de feedback */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations de base */}
          <div className="bg-card rounded-lg bg-background border border-border p-6 text-foreground placeholder:text-muted-foreground">
            <h2 className="text-lg font-semibold text-foreground mb-4">Informations générales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                <p className="text-foreground font-medium">{category.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Slug</label>
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <code className="text-sm bg-muted px-2 py-1 rounded">{category.slug}</code>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Statut</label>
                <div className="flex items-center space-x-2">
                  {category.isActive ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-green-500" />
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted text-foreground">
                        Inactive
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ordre de tri</label>
                <p className="text-foreground">{category.sortOrder}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre de produits</label>
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{category.productCount || 0}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Catégorie parente</label>
                {category.parentCategory ? (
                  <Link
                    href={`/admin/categories/${category.parentCategory._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {category.parentCategory.name}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Catégorie principale</span>
                )}
              </div>
            </div>
            
            {category.description && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <p className="text-foreground leading-relaxed">{category.description}</p>
              </div>
            )}
          </div>

          {/* SEO */}
          {(category.seoTitle || category.seoDescription) && (
            <div className="bg-card rounded-lg bg-background border border-border p-6 text-foreground placeholder:text-muted-foreground">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Référencement (SEO)
              </h2>
              
              <div className="space-y-4">
                {category.seoTitle && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Titre SEO</label>
                    <p className="text-foreground">{category.seoTitle}</p>
                    <p className="text-sm text-muted-foreground mt-1">{category.seoTitle.length}/60 caractères</p>
                  </div>
                )}
                
                {category.seoDescription && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description SEO</label>
                    <p className="text-foreground leading-relaxed">{category.seoDescription}</p>
                    <p className="text-sm text-muted-foreground mt-1">{category.seoDescription.length}/160 caractères</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sous-catégories */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="bg-card rounded-lg bg-background border border-border p-6 text-foreground placeholder:text-muted-foreground">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <FolderTree className="w-5 h-5 mr-2" />
                Sous-catégories ({category.subcategories.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory._id}
                    href={`/admin/categories/${subcategory._id}`}
                    className="p-4 bg-background border border-border rounded-lg hover:border-forever-yellow hover:bg-forever-yellow/5 transition-colors text-foreground placeholder:text-muted-foreground"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{subcategory.name}</h3>
                        <p className="text-sm text-muted-foreground">{subcategory.slug}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {subcategory.isActive ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image */}
          <div className="bg-card rounded-lg bg-background border border-border p-6 text-foreground placeholder:text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground mb-4">Image</h3>
            
            {category.image ? (
              <div className="relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FolderTree className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Aucune image</p>
                </div>
              </div>
            )}
          </div>

          {/* Métadonnées */}
          <div className="bg-card rounded-lg bg-background border border-border p-6 text-foreground placeholder:text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Métadonnées
            </h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-foreground mb-1">Créée le</label>
                <p className="text-muted-foreground">
                  {new Date(category.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <label className="block font-medium text-foreground mb-1">Modifiée le</label>
                <p className="text-muted-foreground">
                  {new Date(category.updatedAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <label className="block font-medium text-foreground mb-1">ID</label>
                <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                  {category._id}
                </code>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-card rounded-lg bg-background border border-border p-6 text-foreground placeholder:text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground mb-4">Actions rapides</h3>
            
            <div className="space-y-3">
              <Link
                href={`/admin/categories/${category._id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 bg-forever-yellow text-black font-medium rounded-lg hover:bg-forever-yellow/90 transition-colors"
              >
                <Edit className="w-5 h-5 mr-2" />
                Modifier
              </Link>
              
              <Link
                href="/admin/categories/new"
                className="w-full flex items-center justify-center px-4 py-2 bg-background border border-border text-foreground font-medium rounded-lg hover:bg-muted/50 transition-colors placeholder:text-muted-foreground"
              >
                <FolderTree className="w-5 h-5 mr-2" />
                Nouvelle catégorie
              </Link>
              
              <Link
                href="/admin/products?category=${category.slug}"
                className="w-full flex items-center justify-center px-4 py-2 bg-background border border-border text-foreground font-medium rounded-lg hover:bg-muted/50 transition-colors placeholder:text-muted-foreground"
              >
                <Package className="w-5 h-5 mr-2" />
                Voir les produits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
