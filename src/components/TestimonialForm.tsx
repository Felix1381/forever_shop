'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Send,
  CheckCircle,
  X,
  Plus
} from 'lucide-react';

interface TestimonialFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TestimonialForm({ onClose, onSuccess }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    type: 'text',
    category: 'health',
    name: '',
    email: '',
    location: '',
    title: '',
    content: '',
    rating: 5,
    productId: '',
    youtubeUrl: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi (à remplacer par vraie API)
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Partager mon témoignage</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-2">
            Votre témoignage sera vérifié avant publication
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type de témoignage */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type de témoignage</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow"
                required
              >
                <option value="text">Témoignage écrit</option>
                <option value="video">Témoignage vidéo (YouTube)</option>
                <option value="product-review">Avis produit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Catégorie</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow"
                required
              >
                <option value="health">Santé & Bien-être</option>
                <option value="weight-loss">Perte de poids</option>
                <option value="business">Réussite business</option>
                <option value="lifestyle">Mode de vie</option>
                <option value="transformation">Transformation</option>
              </select>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom complet *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow"
                placeholder="Votre nom"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Localisation *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow"
                placeholder="Ville, Togo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow"
                placeholder="+228 XX XX XX XX"
              />
            </div>
          </div>

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium mb-2">Titre de votre témoignage *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow"
              placeholder="Ex: Forever Aloe Vera a transformé ma digestion"
              required
            />
          </div>

          {/* Contenu spécifique selon le type */}
          {formData.type === 'video' && (
            <div>
              <label className="block text-sm font-medium mb-2">Lien YouTube *</label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow"
                placeholder="https://www.youtube.com/watch?v=..."
                required={formData.type === 'video'}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Partagez le lien de votre vidéo témoignage YouTube
              </p>
            </div>
          )}

          {formData.type === 'product-review' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Produit concerné</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow"
                >
                  <option value="">Sélectionner un produit</option>
                  <option value="aloe-vera-gel">Forever Aloe Vera Gel</option>
                  <option value="forever-daily">Forever Daily</option>
                  <option value="arctic-sea">Forever Arctic Sea</option>
                  <option value="aloe-berry-nectar">Forever Aloe Berry Nectar</option>
                  <option value="forever-bee-pollen">Forever Bee Pollen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Note sur 5</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                  <option value={2}>⭐⭐ (2/5)</option>
                  <option value={1}>⭐ (1/5)</option>
                </select>
              </div>
            </div>
          )}

          {/* Contenu du témoignage */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {formData.type === 'video' ? 'Description de votre vidéo *' : 'Votre témoignage *'}
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow resize-none"
              placeholder={formData.type === 'video' 
                ? "Décrivez brièvement votre témoignage vidéo..."
                : "Partagez votre expérience avec les produits Forever Living..."}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum 50 caractères. Soyez précis et honnête dans votre témoignage.
            </p>
          </div>

          {/* Consentement */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-border text-forever-yellow focus:ring-forever-yellow"
              />
              <span className="text-muted-foreground">
                J'accepte que mon témoignage soit publié sur le site Rita Aloe Nutrition après vérification. 
                Je certifie que les informations fournies sont exactes et que j'ai réellement utilisé les produits Forever Living.
              </span>
            </label>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-forever-yellow hover:bg-forever-gold text-black font-semibold px-6 py-2 min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
