'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Minus,
  Save,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  benefits: string[];
  ingredients: string[];
  usage: string;
  inStock: boolean;
  stockQuantity: number;
  isPopular: boolean;
  isNew: boolean;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  weight: number;
}

export default function NewProductPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: 'boissons',
    description: '',
    longDescription: '',
    price: 0,
    originalPrice: 0,
    benefits: [''],
    ingredients: [''],
    usage: '',
    inStock: true,
    stockQuantity: 0,
    isPopular: false,
    isNew: false,
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
    weight: 0,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const categories = [
    { value: 'boissons', label: 'Boissons' },
    { value: 'complements', label: 'Compléments alimentaires' },
    { value: 'soins', label: 'Soins et cosmétiques' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (
    field: 'benefits' | 'ingredients',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: 'benefits' | 'ingredients') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field: 'benefits' | 'ingredients', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 5) {
      setError('Maximum 5 images autorisées');
      return;
    }

    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Le nom du produit est requis');
      }
      if (!formData.description.trim()) {
        throw new Error('La description est requise');
      }
      if (formData.price <= 0) {
        throw new Error('Le prix doit être supérieur à 0');
      }
      if (images.length === 0) {
        throw new Error('Au moins une image est requise');
      }

      // Clean up arrays (remove empty items)
      const cleanedData = {
        ...formData,
        benefits: formData.benefits.filter(b => b.trim()),
        ingredients: formData.ingredients.filter(i => i.trim()),
        seoTitle: formData.seoTitle || formData.name,
        seoDescription: formData.seoDescription || formData.description,
      };

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('data', JSON.stringify(cleanedData));
      
      images.forEach((image, index) => {
        submitData.append('images', image);
      });

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Produit créé avec succès !');
        setTimeout(() => {
          router.push('/admin/products');
        }, 2000);
      } else {
        setError(result.error || 'Erreur lors de la création du produit');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nouveau produit</h1>
          <p className="text-muted-foreground">
            Ajoutez un nouveau produit à votre catalogue
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Informations de base</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                    placeholder="Ex: Forever Aloe Vera Gel"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Catégorie *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description courte *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                    placeholder="Description courte du produit..."
                  />
                </div>

                <div>
                  <label htmlFor="longDescription" className="block text-sm font-medium mb-2">
                    Description détaillée *
                  </label>
                  <textarea
                    id="longDescription"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                    placeholder="Description détaillée du produit, ses bienfaits, son utilisation..."
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Images du produit</h2>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center mb-4">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">
                    Cliquez pour ajouter des images
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP jusqu'à 10MB (max 5 images)
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Benefits & Ingredients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Benefits */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Bienfaits</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('benefits')}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                        placeholder="Bienfait du produit..."
                      />
                      {formData.benefits.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('benefits', index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Ingrédients</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('ingredients')}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                        placeholder="Ingrédient..."
                      />
                      {formData.ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('ingredients', index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Usage */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Mode d'emploi</h2>
              <textarea
                name="usage"
                value={formData.usage}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                placeholder="Comment utiliser ce produit..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Prix</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-2">
                    Prix de vente (XOF) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="100"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium mb-2">
                    Prix original (XOF)
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Laissez vide si pas de promotion
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Inventaire</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="rounded border-border"
                  />
                  <label htmlFor="inStock" className="text-sm font-medium">
                    En stock
                  </label>
                </div>
                <div>
                  <label htmlFor="stockQuantity" className="block text-sm font-medium mb-2">
                    Quantité en stock
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Product Flags */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Badges</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPopular"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleInputChange}
                    className="rounded border-border"
                  />
                  <label htmlFor="isPopular" className="text-sm font-medium">
                    Produit populaire
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isNew"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleInputChange}
                    className="rounded border-border"
                  />
                  <label htmlFor="isNew" className="text-sm font-medium">
                    Nouveau produit
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="rounded border-border"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium">
                    Produit vedette
                  </label>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">SEO</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium mb-2">
                    Titre SEO
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                    placeholder="Titre pour les moteurs de recherche"
                  />
                </div>
                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-medium mb-2">
                    Description SEO
                  </label>
                  <textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                    placeholder="Description pour les moteurs de recherche"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-forever-yellow hover:bg-forever-gold text-black font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Création en cours...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Save className="w-4 h-4 mr-2" />
                  Créer le produit
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
