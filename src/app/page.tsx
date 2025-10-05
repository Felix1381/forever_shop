'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations';
import { 
  Leaf, 
  Heart, 
  Shield, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Award,
  Users
} from 'lucide-react';

export default function HomePage() {
  const { heroRef, benefitsRef, productsRef, ctaRef } = useGSAPAnimations();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-forever-yellow/10 via-background to-forever-gold/5 py-5 lg:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Nutrition 
                  <span className="text-forever-yellow"> Naturelle</span>
                  <br />
                  Bien-être 
                  <span className="text-forever-gold"> Optimal</span>
                </h1>
                <p className="hero-subtitle text-xl text-muted-foreground leading-relaxed">
                  Découvrez les compléments alimentaires Forever Living Products, 
                  issus de l'Aloe Vera et de la nature, pour une santé optimale 
                  et un bien-être durable.
                </p>
              </div>

              <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="hover-lift bg-forever-yellow hover:bg-forever-gold text-black font-semibold text-lg px-8 py-6"
                >
                  <Link href="/boutique">
                    Découvrir nos produits
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="hover-lift text-lg px-8 py-6 border-forever-yellow text-forever-yellow hover:bg-forever-yellow hover:text-black"
                >
                  <Link href="/temoignages">
                    Voir les témoignages
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="hero-indicators flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-forever-yellow" />
                  <span className="text-sm text-muted-foreground">40+ ans d'expertise</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-forever-yellow" />
                  <span className="text-sm text-muted-foreground">160+ pays</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-forever-yellow" />
                  <span className="text-sm text-muted-foreground">100% naturel</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="hero-image aspect-square relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-forever-yellow/20 via-white to-forever-gold/20 dark:from-forever-yellow/10 dark:via-gray-800 dark:to-forever-gold/10">
                <Image
                  src="/images/gelee-aloes-2.webp"
                  alt="Produits Forever Living - Boissons Nutritives"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating Cards */}
              <div className="floating-card parallax-element absolute -top-6 -left-6 bg-background/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-border hover-lift">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-forever-yellow rounded-xl flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">100% Naturel</p>
                    <p className="text-sm text-muted-foreground">Aloe Vera pur</p>
                  </div>
                </div>
              </div>

              <div className="floating-card parallax-element absolute -bottom-6 -right-6 bg-background/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-border hover-lift">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-forever-gold rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Qualité Certifiée</p>
                    <p className="text-sm text-muted-foreground">Standards élevés</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="benefits-title text-3xl sm:text-4xl font-bold text-foreground">
              Pourquoi choisir Forever Living Products ?
            </h2>
            <p className="benefits-title text-xl text-muted-foreground max-w-3xl mx-auto">
              Depuis plus de 40 ans, Forever Living Products est le leader mondial 
              de l'Aloe Vera et des compléments alimentaires naturels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: "100% Naturel",
                description: "Nos produits sont élaborés à partir d'Aloe Vera pur, cultivé dans nos propres plantations.",
                color: "text-green-600 dark:text-green-400"
              },
              {
                icon: Shield,
                title: "Qualité Certifiée",
                description: "Tous nos produits respectent les plus hauts standards de qualité et de sécurité.",
                color: "text-blue-600 dark:text-blue-400"
              },
              {
                icon: Heart,
                title: "Bien-être Optimal",
                description: "Formulés pour soutenir votre santé et votre vitalité au quotidien.",
                color: "text-red-600 dark:text-red-400"
              },
              {
                icon: Zap,
                title: "Efficacité Prouvée",
                description: "Des millions de personnes dans le monde font confiance à nos produits.",
                color: "text-forever-yellow"
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="benefit-card hover-lift bg-background rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4`}>
                  <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section ref={productsRef} className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="products-title text-3xl sm:text-4xl font-bold text-foreground">
              Nos Compléments Alimentaires Phares
            </h2>
            <p className="products-title text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez notre sélection de produits essentiels pour votre nutrition 
              et votre bien-être quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Forever Aloe Vera Gel",
                category: "Boisson Nutritive",
                description: "Le gel d'Aloe Vera pur pour une digestion optimale et un bien-être général.",
                image: "https://fr.forever-all.com/wp-content/uploads/2020/03/Forever-Aloe-Vera-Gel.webp",
                price: "19 500 FCFA"
              },
              {
                name: "Forever Daily",
                category: "Multivitamines",
                description: "Complexe de vitamines et minéraux essentiels pour une nutrition complète.",
                image: "https://fr.forever-all.com/wp-content/uploads/2020/04/forever-daily-60-comprimes-maroc-forever-all.webp",
                price: "16 250 FCFA"
              },
              {
                name: "Forever Arctic Sea",
                category: "Oméga-3",
                description: "Huiles de poisson riches en oméga-3 pour la santé cardiovasculaire.",
                image: "https://fr.forever-all.com/wp-content/uploads/2020/04/Forever-Arctic-Sea-forever-all.webp",
                price: "26 000 FCFA"
              }
            ].map((product, index) => (
              <div 
                key={index}
                className="product-card hover-lift bg-background rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300 group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-forever-yellow text-black text-xs font-semibold px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-forever-yellow">
                      {product.price}
                    </span>
                    <Button 
                      size="sm"
                      className="bg-forever-yellow hover:bg-forever-gold text-black font-semibold"
                    >
                      Découvrir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-forever-yellow text-forever-yellow hover:bg-forever-yellow hover:text-black"
            >
              <Link href="/boutique">
                Voir tous nos produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 bg-gradient-to-r from-forever-yellow/10 to-forever-gold/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="cta-content max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Prêt à commencer votre voyage vers le bien-être ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Rejoignez des millions de personnes qui ont choisi Forever Living Products 
              pour améliorer leur qualité de vie naturellement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                className="hover-lift bg-forever-yellow hover:bg-forever-gold text-black font-semibold text-lg px-8 py-6"
              >
                <Link href="/boutique">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="hover-lift text-lg px-8 py-6 border-forever-yellow text-forever-yellow hover:bg-forever-yellow hover:text-black"
              >
                <Link href="/contact">
                  Nous contacter
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
