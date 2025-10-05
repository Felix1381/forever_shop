'use client';

import { useCart } from '@/contexts/CartContext';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CartButtonProps {
  onClick: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { getTotalItems } = useCart();
  const [animate, setAnimate] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const totalItems = getTotalItems();

  // Ensure hydration is complete before showing cart count
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Animate when cart items change
  useEffect(() => {
    if (totalItems > 0 && isHydrated) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems, isHydrated]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="relative hover:bg-forever-yellow/10 hover:text-forever-yellow transition-colors"
    >
      <ShoppingCart className={`h-5 w-5 ${animate ? 'animate-bounce' : ''}`} />
      {isHydrated && totalItems > 0 && (
        <span
          className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-forever-yellow text-black text-xs font-bold rounded-full border-2 border-background transition-transform ${
            animate ? 'scale-125' : 'scale-100'
          }`}
        >
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
      <span className="sr-only">Panier</span>
    </Button>
  );
}
