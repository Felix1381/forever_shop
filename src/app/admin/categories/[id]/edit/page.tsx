'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save, 
  Eye,
  FolderTree,
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
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
}

interface ParentCategory {
  _id: string;
  name: string;
  slug: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Données du formulaire
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentCategory: '',
    isActive: true,
    sortOrder: 0,
    seoTitle: '',
    seoDescription: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  // Charger la catégorie à modifier
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/categories/${params.id}`);
      const data = await response.json();

      if (data.success) {
        const cat = data.data;
        setCategory(cat);
        setFormData({
          name: cat.name || '',
          slug: cat.slug || '',
          description: cat.description || '',
          parentCategory: cat.parentCategory?._id || '',
          isActive: cat.isActive,
          sortOrder: cat.sortOrder || 0,
          seoTitle: cat.seoTitle || '',
          seoDescription: cat.seoDescription || ''
        });
        setImagePreview(cat.image || null);
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

  // Charger les catégories parentes (exclure la catégorie actuelle et ses enfants)
  const fetchParentCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories?limit=100&parentId=null');
      const data = await response.json();
      if (data.success) {
        // Exclure la catégorie actuelle de la liste des parents possibles
        const filtered = data.data.filter((cat: ParentCategory) => cat._id !== params.id);
        setParentCategories(filtered);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories parentes:', error);
    }
  };

  // Générer le slug automatiquement
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Gérer les changements de champs
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Générer le slug automatiquement si le nom change et que le slug correspond à l'ancien nom
    if (field === 'name' && category && formData.slug === generateSlug(category.name)) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Gérer l'upload d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Veuillez sélectionner un fichier image valide' }));
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'L\'image ne doit pas dépasser 5MB' }));
        return;
      }
      
      setImageFile(file);
      setRemoveImage(false);
      setErrors(prev => ({ ...prev, image: '' }));
      
      // Créer la prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Supprimer l'image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la catégorie est requis';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Le slug est requis';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets';
    }
    
    if (formData.seoTitle && formData.seoTitle.length > 60) {
      newErrors.seoTitle = 'Le titre SEO ne peut pas dépasser 60 caractères';
    }
    
    if (formData.seoDescription && formData.seoDescription.length > 160) {
      newErrors.seoDescription = 'La description SEO ne peut pas dépasser 160 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setMessage(null);
      
      const submitData = new FormData();
      
      // Ajouter les données du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'parentCategory' && !value) {
          return; // Ne pas envoyer de parentCategory vide
        }
        submitData.append(key, value.toString());
      });
      
      // Ajouter l'image si présente
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      // Indiquer si on veut supprimer l'image
      if (removeImage) {
        submitData.append('removeImage', 'true');
      }
      
      const response = await fetch(`/api/admin/categories/${params.id}`, {
        method: 'PUT',
        body: submitData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Catégorie mise à jour avec succès !' });
        setTimeout(() => {
          router.push(`/admin/categories/${params.id}`);
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour de la catégorie' });
    } finally {
      setSaving(false);
    }
  };

  // Effets
  useEffect(() => {
    if (params.id) {
      fetchCategory();
      fetchParentCategories();
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/categories/${category._id}`}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Modifier la catégorie</h1>
            <p className="text-muted-foreground">{category.name}</p>
          </div>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de base */}
            <div className="bg-card rounded-lg bg-background border border-border p-6 text-foreground placeholder:text-muted-foreground">
              <h2 className="text-lg font-semibold text-foreground mb-4">Informations de base</h2>
              
              <div className="space-y-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nom de la catégorie *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-forever-yellow focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Ex: Compléments alimentaires"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-forever-yellow focus:border-transparent ${
                      errors.slug ? 'border-red-500' : 'border-border'
                    }`}
                    // placeholder="complements-alimentaires"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                  <p className="text-muted-foreground text-sm mt-1">
                    Utilisé dans l'URL. Lettres minuscules, chiffres et tirets uniquement.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-forever-yellow focus:border-transparent text-foreground placeholder:text-muted-foreground"
                    placeholder="Description de la catégorie..."
                  />
                  <p className="text-muted-foreground text-sm mt-1">
                    {formData.description.length}/500 caractères
                  </p>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-card rounded-lg bg-background border border-border p-6 text-foreground placeholder:text-muted-foreground">
              <h2 className="text-lg font-semibold text-foreground mb-4">Référencement (SEO)</h2>
              
              <div className="space-y-4">
                {/* Titre SEO */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Titre SEO
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-forever-yellow focus:border-transparent ${
                      errors.seoTitle ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Titre optimisé pour les moteurs de recherche"
                  />
                  {errors.seoTitle && (
                    <p className="text-red-500 text-sm mt-1">{errors.seoTitle}</p>
                  )}
                  <p className="text-muted-foreground text-sm mt-1">
                    {formData.seoTitle.length}/60 caractères
                  </p>
                </div>

                {/* Description SEO */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description SEO
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-forever-yellow focus:border-transparent ${
                      errors.seoDescription ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Description pour les moteurs de recherche"
                  />
                  {errors.seoDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.seoDescription}</p>
                  )}
                  <p className="text-muted-foreground text-sm mt-1">
                    {formData.seoDescription.length}/160 caractères
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image */}
            <div className="bg-card rounded-lg bg-background border border-border p-6 text-foreground placeholder:text-muted-foreground">
              <h3 className="text-lg font-semibold text-foreground mb-4">Image de la catégorie</h3>
              
              {imagePreview && !removeImage ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Prévisualisation"
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="bg-background border-2 border-dashed border-border rounded-lg p-6 text-center placeholder:text-muted-foreground">
                  <FolderTree className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center px-4 py-2 bg-forever-yellow text-black font-medium rounded-lg hover:bg-forever-yellow/90 transition-colors">
                        <Upload className="w-5 h-5 mr-2" />
                        Choisir une image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG jusqu'à 5MB
                    </p>
                  </div>
                </div>
              )}
              
              {errors.image && (
                <p className="text-red-500 text-sm mt-2">{errors.image}</p>
              )}
            </div>

            {/* Configuration */}
            <div className="bg-card rounded-lg bg-background border border-border p-6 text-foreground placeholder:text-muted-foreground">
              <h3 className="text-lg font-semibold text-foreground mb-4">Configuration</h3>
              
              <div className="space-y-4">
                {/* Catégorie parente */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Catégorie parente
                  </label>
                  <select
                    value={formData.parentCategory}
                    onChange={(e) => handleInputChange('parentCategory', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-forever-yellow focus:border-transparent text-foreground placeholder:text-muted-foreground"
                  >
                    <option value="">Catégorie principale</option>
                    {parentCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ordre de tri */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ordre de tri
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-forever-yellow focus:border-transparent text-foreground placeholder:text-muted-foreground"
                    min="0"
                  />
                  <p className="text-muted-foreground text-sm mt-1">
                    Plus le nombre est petit, plus la catégorie apparaît en premier
                  </p>
                </div>

                {/* Statut */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="rounded bg-background border-border text-forever-yellow focus:ring-forever-yellow placeholder:text-muted-foreground"
                    />
                    <span className="text-sm font-medium text-foreground">
                      Catégorie active
                    </span>
                  </label>
                  <p className="text-muted-foreground text-sm mt-1">
                    Les catégories inactives ne sont pas visibles sur le site
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-card rounded-lg bg-background border border-border p-6 text-foreground placeholder:text-muted-foreground">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center px-4 py-2 bg-forever-yellow text-black font-medium rounded-lg hover:bg-forever-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 bg-background border-b-2 border-black mr-2 text-foreground placeholder:text-muted-foreground"></div>
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Mettre à jour
                    </>
                  )}
                </button>
                
                <Link
                  href={`/admin/categories/${category._id}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-background border border-border text-foreground font-medium rounded-lg hover:bg-muted/50 transition-colors placeholder:text-muted-foreground"
                >
                  Annuler
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
