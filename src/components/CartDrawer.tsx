'use client';

import { useCart } from '@/contexts/CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 opacity-100"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-screen w-full sm:w-[450px] bg-background border-l border-border shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-forever-yellow rounded-lg">
              <ShoppingBag className="h-5 w-5 text-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Mon Panier</h2>
              <p className="text-xs text-muted-foreground">
                {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
              <div className="p-6 bg-muted/20 rounded-full">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Votre panier est vide</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Découvrez nos produits et ajoutez-les à votre panier pour commencer vos achats
                </p>
              </div>
              <Button
                onClick={onClose}
                className="bg-forever-yellow hover:bg-forever-gold text-black font-semibold"
              >
                Voir la boutique
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemPrice = parseInt(item.product.price.replace(/[^0-9]/g, ''));
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 bg-muted/10 rounded-lg border border-border/50 hover:border-forever-yellow/30 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gradient-to-br from-muted/20 to-muted/40 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain p-2"
                        sizes="80px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-medium text-sm leading-tight line-clamp-2">
                          {item.product.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                          className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-semibold text-forever-yellow mb-2">
                        {formatPrice(itemTotal)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-7 w-7 p-0 rounded-none hover:bg-muted"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 text-sm font-medium min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-7 w-7 p-0 rounded-none hover:bg-muted"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatPrice(itemPrice)} / unité
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Clear Cart Button */}
              {items.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="w-full text-muted-foreground hover:text-destructive hover:border-destructive/50"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Vider le panier
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border bg-muted/10 p-4 space-y-4 flex-shrink-0">
            {/* Total */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-forever-yellow">{formatPrice(getTotalPrice())}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Livraison et taxes calculées à la prochaine étape
              </p>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full bg-forever-yellow hover:bg-forever-gold text-black font-bold py-6 text-base"
              size="lg"
            >
              Commander
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Continue Shopping */}
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full"
            >
              Continuer mes achats
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
