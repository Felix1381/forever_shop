'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useGSAPAnimations = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Hero Section Animation
      if (heroRef.current) {
        const tl = gsap.timeline();
        
        tl.fromTo('.hero-title', 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
        .fromTo('.hero-subtitle', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 
          '-=0.5'
        )
        .fromTo('.hero-buttons', 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 
          '-=0.3'
        )
        .fromTo('.hero-indicators', 
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 
          '-=0.4'
        )
        .fromTo('.hero-image', 
          { opacity: 0, scale: 0.8, rotation: -5 },
          { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'power3.out' }, 
          '-=0.8'
        )
        .fromTo('.floating-card', 
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.2 }, 
          '-=0.4'
        );
      }

      // Benefits Section Animation
      if (benefitsRef.current) {
        gsap.fromTo('.benefit-card', 
          { opacity: 0, y: 60, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.8, 
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: benefitsRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        gsap.fromTo('.benefits-title', 
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: benefitsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Products Section Animation
      if (productsRef.current) {
        gsap.fromTo('.product-card', 
          { opacity: 0, y: 80, rotationY: 15 },
          { 
            opacity: 1, 
            y: 0, 
            rotationY: 0,
            duration: 1, 
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
              trigger: productsRef.current,
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        gsap.fromTo('.products-title', 
          { opacity: 0, scale: 0.9 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.8, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: productsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // CTA Section Animation
      if (ctaRef.current) {
        gsap.fromTo('.cta-content', 
          { opacity: 0, y: 50, scale: 0.95 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 1, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Hover animations for interactive elements
      gsap.utils.toArray('.hover-lift').forEach((element: any) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(element, { y: -10, scale: 1.05, duration: 0.3, ease: 'power2.out' });
        
        element.addEventListener('mouseenter', () => tl.play());
        element.addEventListener('mouseleave', () => tl.reverse());
      });

      // Parallax effect for floating cards
      gsap.utils.toArray('.parallax-element').forEach((element: any) => {
        gsap.to(element, {
          y: -50,
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      });

    });

    return () => ctx.revert(); // Cleanup
  }, []);

  return {
    heroRef,
    benefitsRef,
    productsRef,
    ctaRef
  };
};
