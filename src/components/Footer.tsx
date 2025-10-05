'use client';

import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-forever-yellow rounded-lg shadow-md">
                <Leaf className="h-6 w-6 text-black" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">Rita Aloe</span>
                <span className="text-sm text-muted-foreground block -mt-1">Nutrition</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Votre partenaire de confiance pour les compléments alimentaires 
              Forever Living Products. Nutrition naturelle et bien-être optimal.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/temoignages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Produits */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Nos Produits</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/boutique?category=nutrition" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Compléments Alimentaires
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=boissons" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Boissons Nutritives
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=soins" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Soins Naturels
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=bestsellers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Meilleures Ventes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">rita@aloe-nutrition.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">+228 90 03 47 17</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Lomé, Togo</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-forever-yellow transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-forever-yellow transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-forever-yellow transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Rita Aloe Nutrition. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/mentions-legales" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Confidentialité
              </Link>
              <Link href="/cgv" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
