'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { products, categories, getProductsByCategory, type Product } from '@/data/products';
import { useBoutiqueAnimations } from '@/hooks/useBoutiqueAnimations';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Filter,
  Search,
  Grid3X3,
  List,
  ArrowRight,
  Sparkles,
  Zap,
  SlidersHorizontal,
  X,
  Menu,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

export default function BoutiquePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number | '', number | '']>([0, 50000]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');
  
  const { headerRef, filtersRef, productsGridRef, animateFilterChange } = useBoutiqueAnimations();
  
  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
  
  const filteredProducts = getProductsByCategory(selectedCategory)
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const price = parseInt(product.price.replace(/[^0-9]/g, ''));
      const minPrice = typeof priceRange[0] === 'number' ? priceRange[0] : 0;
      const maxPrice = typeof priceRange[1] === 'number' ? priceRange[1] : 50000;
      const matchesPrice = price >= minPrice && price <= maxPrice;
      
      const matchesBenefits = selectedBenefits.length === 0 || 
        selectedBenefits.some(benefit => 
          product.benefits.some(pb => pb.toLowerCase().includes(benefit.toLowerCase()))
        );
      
      return matchesSearch && matchesPrice && matchesBenefits;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''));
        case 'price-desc':
          return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''));
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        case 'new':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleCategoryChange = (categoryId: string) => {
    animateFilterChange(categoryId);
    setTimeout(() => {
      setSelectedCategory(categoryId);
    }, 250);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setPriceRange([0, 50000]);
    setSelectedBenefits([]);
    setSortBy('name');
  };

  const allBenefits = Array.from(new Set(products.flatMap(p => p.benefits)));

  const ProductCard = ({ product, index }: { product: Product; index: number }) => {
    if (viewMode === 'list') {
      return (
        <Card className="product-item product-card-hover group overflow-hidden border border-border/50 hover:border-forever-yellow/50 shadow-sm hover:shadow-lg transition-all duration-300 bg-background">
          <div className="flex gap-4 p-4">
            <div className="w-32 h-24 relative bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="product-image object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                sizes="128px"
              />
              {product.isNew && (
                <Badge className="absolute top-1 left-1 text-xs bg-emerald-500 text-white">
                  Nouveau
                </Badge>
              )}
              {product.isPopular && (
                <Badge className="absolute top-1 right-1 text-xs bg-forever-yellow text-black">
                  Populaire
                </Badge>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg group-hover:text-forever-yellow transition-colors">
                  {product.name}
                </h3>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {product.benefits.slice(0, 3).map((benefit, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="price-animate">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-forever-yellow">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    asChild
                    size="sm"
                    className="bg-forever-yellow hover:bg-forever-gold text-black font-medium"
                    disabled={!product.inStock}
                  >
                    <Link href={`/boutique/${product.id}`}>
                      Voir détails
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="px-3 hover:bg-forever-yellow hover:text-black hover:border-forever-yellow"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      );
    }
    
    return (
      <Card className="product-item product-card-hover group overflow-hidden border border-border/50 hover:border-forever-yellow/50 shadow-sm hover:shadow-lg transition-all duration-300 bg-background">
        <CardHeader className="p-0 relative overflow-hidden">
          <div className="aspect-[4/3] relative bg-gradient-to-br from-muted/20 to-muted/40">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="product-image object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <Badge className="product-badge text-xs bg-emerald-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Nouveau
                </Badge>
              )}
              {product.isPopular && (
                <Badge className="product-badge text-xs bg-forever-yellow text-black">
                  <Zap className="w-3 h-3 mr-1" />
                  Populaire
                </Badge>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button size="sm" variant="secondary" className="h-7 w-7 p-0 rounded-full shadow-md">
                <Heart className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Stock Status */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm">
                  Rupture de stock
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-3 space-y-2">
          <h3 className="font-semibold text-sm leading-tight group-hover:text-forever-yellow transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="price-animate">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-forever-yellow">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-3 pt-0">
          <div className="flex gap-2 w-full">
            <Button 
              asChild
              size="sm"
              className="flex-1 bg-forever-yellow hover:bg-forever-gold text-black font-medium text-xs"
              disabled={!product.inStock}
            >
              <Link href={`/boutique/${product.id}`}>
                Détails
              </Link>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="px-2 hover:bg-forever-yellow hover:text-black hover:border-forever-yellow"
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-3 w-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section ref={headerRef} className="py-8 bg-gradient-to-r from-forever-yellow/5 to-forever-gold/5 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3">
            <h1 className="boutique-title text-2xl sm:text-3xl font-bold text-foreground">
              Notre Boutique
            </h1>
            <p className="boutique-subtitle text-base text-muted-foreground max-w-xl mx-auto">
              Découvrez notre gamme complète de produits Forever Living Products pour votre bien-être.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-forever-yellow hover:bg-forever-gold text-black rounded-full h-14 w-14 p-0 shadow-xl border-2 border-white"
            >
              <SlidersHorizontal className="h-6 w-6" />
            </Button>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {filteredProducts.length}
            </div>
          </div>

          {/* Sidebar */}
          <aside className={`
            fixed lg:sticky top-0 left-0 z-40 h-screen lg:h-auto w-80 lg:w-64 
            bg-background border-r border-border p-6 space-y-6 transition-transform duration-300 lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            {/* Mobile Header */}
            <div className="lg:hidden flex justify-between items-center mb-6 pb-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-lg">Filtres</h3>
                <p className="text-sm text-muted-foreground">{filteredProducts.length} produits</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-6">
              <h3 className="font-semibold text-lg mb-1">Filtres</h3>
              <p className="text-sm text-muted-foreground">{filteredProducts.length} produits trouvés</p>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Nom du produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div ref={filtersRef} className="space-y-3">
              <label className="text-sm font-medium">Catégories</label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`filter-button w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-forever-yellow text-black' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Prix (FCFA)</label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPriceRange([value === '' ? '' : parseInt(value) || 0, priceRange[1]]);
                      }}
                      className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-forever-yellow"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPriceRange([priceRange[0], value === '' ? '' : parseInt(value) || 50000]);
                      }}
                      className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-forever-yellow"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Bienfaits</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {allBenefits.slice(0, 8).map((benefit) => (
                  <label key={benefit} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedBenefits.includes(benefit)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBenefits([...selectedBenefits, benefit]);
                        } else {
                          setSelectedBenefits(selectedBenefits.filter(b => b !== benefit));
                        }
                      }}
                      className="rounded border-border text-forever-yellow focus:ring-forever-yellow"
                    />
                    <span className="text-muted-foreground hover:text-foreground">{benefit}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow"
                >
                  <option value="name">Nom A-Z</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="popular">Populaires</option>
                  <option value="new">Nouveautés</option>
                </select>
                
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-forever-yellow text-black hover:bg-forever-gold' : ''}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-forever-yellow text-black hover:bg-forever-gold' : ''}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div 
                ref={productsGridRef}
                className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="space-y-4">
                  <div className="text-6xl">🔍</div>
                  <h3 className="text-xl font-semibold">Aucun produit trouvé</h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.
                  </p>
                  <Button 
                    onClick={resetFilters}
                    className="bg-forever-yellow hover:bg-forever-gold text-black"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
