'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useBoutiqueAnimations = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const productsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Header Animation
      if (headerRef.current) {
        gsap.fromTo('.boutique-title', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
        
        gsap.fromTo('.boutique-subtitle', 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
        );
      }

      // Filters Animation
      if (filtersRef.current) {
        gsap.fromTo('.filter-button', 
          { opacity: 0, scale: 0.9, y: 20 },
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.5, 
            ease: 'back.out(1.7)',
            stagger: 0.1,
            delay: 0.4
          }
        );
      }

      // Products Grid Animation
      if (productsGridRef.current) {
        gsap.fromTo('.product-item', 
          { opacity: 0, y: 60, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.8, 
            ease: 'power3.out',
            stagger: {
              amount: 0.8,
              grid: [3, 3],
              from: 'start'
            },
            delay: 0.6
          }
        );
      }

      // Product Card Hover Animations
      gsap.utils.toArray('.product-card-hover').forEach((card: any) => {
        const image = card.querySelector('.product-image');
        const overlay = card.querySelector('.product-overlay');
        const badge = card.querySelector('.product-badge');
        
        const tl = gsap.timeline({ paused: true });
        
        tl.to(card, { 
          y: -10, 
          scale: 1.02, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          duration: 0.3, 
          ease: 'power2.out' 
        })
        .to(image, { 
          scale: 1.1, 
          duration: 0.3, 
          ease: 'power2.out' 
        }, 0)
        .to(overlay, { 
          opacity: 1, 
          duration: 0.3 
        }, 0)
        .to(badge, { 
          scale: 1.1, 
          duration: 0.2, 
          ease: 'back.out(1.7)' 
        }, 0.1);
        
        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
      });

      // Filter Animation Function
      const animateFilterChange = () => {
        const tl = gsap.timeline();
        
        tl.to('.product-item', {
          opacity: 0,
          scale: 0.8,
          y: 20,
          duration: 0.3,
          ease: 'power2.in',
          stagger: 0.05
        })
        .set('.product-item', { display: 'none' })
        .set('.filtered-products .product-item', { display: 'block' })
        .fromTo('.filtered-products .product-item', 
          { opacity: 0, scale: 0.8, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: 'back.out(1.7)',
            stagger: 0.08
          }
        );
        
        return tl;
      };

      // Price Animation
      gsap.utils.toArray('.price-animate').forEach((price: any) => {
        gsap.fromTo(price,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: price,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Badge Pulse Animation
      gsap.utils.toArray('.badge-pulse').forEach((badge: any) => {
        gsap.to(badge, {
          scale: 1.05,
          duration: 1,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        });
      });

      // Scroll-triggered animations for product details
      gsap.utils.toArray('.product-benefit').forEach((benefit: any, index: number) => {
        gsap.fromTo(benefit,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power3.out',
            delay: index * 0.1,
            scrollTrigger: {
              trigger: benefit,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

    });

    return () => ctx.revert(); // Cleanup
  }, []);

  // Function to animate filter changes
  const animateFilterChange = (newCategory: string) => {
    const tl = gsap.timeline();
    
    tl.to('.product-item', {
      opacity: 0,
      scale: 0.9,
      y: 15,
      duration: 0.25,
      ease: 'power2.in',
      stagger: 0.03
    })
    .call(() => {
      // This would trigger the actual filter change in the component
      // The component should handle the state change
    })
    .fromTo('.product-item', 
      { opacity: 0, scale: 0.9, y: 15 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out(1.7)',
        stagger: 0.05,
        delay: 0.1
      }
    );
    
    return tl;
  };

  return {
    headerRef,
    filtersRef,
    productsGridRef,
    animateFilterChange
  };
};
