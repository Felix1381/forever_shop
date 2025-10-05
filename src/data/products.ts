export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: string;
  originalPrice?: string;
  image: string;
  images: string[];
  benefits: string[];
  ingredients: string[];
  usage: string;
  inStock: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

export const categories = [
  { id: 'all', name: 'Tous les produits', count: 12 },
  { id: 'boissons', name: 'Boissons Nutritives', count: 4 },
  { id: 'complements', name: 'Compléments Alimentaires', count: 5 },
  { id: 'soins', name: 'Soins Naturels', count: 3 },
];

export const products: Product[] = [
  {
    id: 'aloe-vera-gel',
    name: 'Forever Aloe Vera Gel',
    category: 'boissons',
    description: 'Le gel d\'Aloe Vera pur pour une digestion optimale et un bien-être général.',
    longDescription: 'Notre gel d\'Aloe Vera est extrait de la pulpe fraîche de nos plants d\'Aloe Vera cultivés dans nos propres plantations. Riche en vitamines, minéraux et acides aminés, il soutient la digestion et renforce le système immunitaire.',
    price: '19 500 FCFA',
    image: 'https://fr.forever-all.com/wp-content/uploads/2020/03/Forever-Aloe-Vera-Gel.webp',
    images: [
      'https://fr.forever-all.com/wp-content/uploads/2020/03/Forever-Aloe-Vera-Gel.webp',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    benefits: [
      'Soutient la digestion naturelle',
      'Renforce le système immunitaire',
      'Riche en vitamines et minéraux',
      'Hydrate de l\'intérieur'
    ],
    ingredients: ['Gel d\'Aloe Vera stabilisé (99,7%)', 'Acide citrique', 'Sorbate de potassium'],
    usage: 'Boire 30ml, 2 à 3 fois par jour de préférence avant les repas.',
    inStock: true,
    isPopular: true
  },
  {
    id: 'forever-daily',
    name: 'Forever Daily',
    category: 'complements',
    description: 'Complexe de vitamines et minéraux essentiels pour une nutrition complète.',
    longDescription: 'Forever Daily est un complexe multivitaminé et multiminéral conçu pour combler les carences nutritionnelles de l\'alimentation moderne. Formulé avec des nutriments biodisponibles pour une absorption optimale.',
    price: '16 250 FCFA',
    image: 'https://fr.forever-all.com/wp-content/uploads/2020/04/forever-daily-60-comprimes-maroc-forever-all.webp',
    images: [
      'https://fr.forever-all.com/wp-content/uploads/2020/04/forever-daily-60-comprimes-maroc-forever-all.webp',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    benefits: [
      'Apport complet en vitamines et minéraux',
      'Soutient l\'énergie et la vitalité',
      'Renforce les défenses naturelles',
      'Formule biodisponible'
    ],
    ingredients: ['Vitamines A, C, D, E, B', 'Minéraux essentiels', 'Antioxydants naturels'],
    usage: '2 comprimés par jour avec un repas.',
    inStock: true,
    isNew: true
  },
  {
    id: 'arctic-sea',
    name: 'Forever Arctic Sea',
    category: 'complements',
    description: 'Huiles de poisson riches en oméga-3 pour la santé cardiovasculaire.',
    longDescription: 'Forever Arctic Sea combine les huiles de poisson des mers froides et l\'huile d\'olive pour un apport optimal en oméga-3. Essentiel pour la santé cardiovasculaire, cérébrale et articulaire.',
    price: '26 000 FCFA',
    image: 'https://fr.forever-all.com/wp-content/uploads/2020/04/Forever-Arctic-Sea-forever-all.webp',
    images: [
      'https://fr.forever-all.com/wp-content/uploads/2020/04/Forever-Arctic-Sea-forever-all.webp',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    benefits: [
      'Soutient la santé cardiovasculaire',
      'Favorise les fonctions cérébrales',
      'Anti-inflammatoire naturel',
      'Riche en EPA et DHA'
    ],
    ingredients: ['Huile de poisson (EPA, DHA)', 'Huile d\'olive', 'Vitamine E'],
    usage: '2 capsules par jour avec les repas.',
    inStock: true,
    isPopular: true
  },
  {
    id: 'aloe-berry-nectar',
    name: 'Forever Aloe Berry Nectar',
    category: 'boissons',
    description: 'Gel d\'Aloe Vera aux extraits de canneberge et de pomme.',
    longDescription: 'Une délicieuse combinaison de gel d\'Aloe Vera pur avec des extraits naturels de canneberge et de pomme. Riche en antioxydants et au goût fruité naturel.',
    price: '21 000 FCFA',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    benefits: [
      'Goût fruité naturel',
      'Riche en antioxydants',
      'Soutient le système urinaire',
      'Hydratation optimale'
    ],
    ingredients: ['Gel d\'Aloe Vera (90,7%)', 'Concentré de canneberge', 'Concentré de pomme'],
    usage: '30ml, 2 à 3 fois par jour.',
    inStock: true
  },
  {
    id: 'forever-bee-pollen',
    name: 'Forever Bee Pollen',
    category: 'complements',
    description: 'Pollen d\'abeille naturel pour l\'énergie et la vitalité.',
    longDescription: 'Le pollen d\'abeille Forever est récolté dans des environnements préservés. Considéré comme un super-aliment, il est riche en protéines, vitamines et minéraux essentiels.',
    price: '18 750 FCFA',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    benefits: [
      'Boost d\'énergie naturel',
      'Riche en protéines',
      'Soutient l\'endurance',
      'Super-aliment complet'
    ],
    ingredients: ['Pollen d\'abeille pur (100%)'],
    usage: '1 à 2 comprimés par jour avec un repas.',
    inStock: true,
    isNew: true
  },
  {
    id: 'aloe-propolis-creme',
    name: 'Forever Aloe Propolis Crème',
    category: 'soins',
    description: 'Crème apaisante à l\'Aloe Vera et à la propolis.',
    longDescription: 'Cette crème combine les bienfaits de l\'Aloe Vera et de la propolis pour apaiser et protéger la peau. Idéale pour les peaux sensibles et irritées.',
    price: '15 500 FCFA',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    benefits: [
      'Apaise les irritations',
      'Hydrate en profondeur',
      'Propriétés antibactériennes',
      'Texture non grasse'
    ],
    ingredients: ['Gel d\'Aloe Vera', 'Propolis', 'Huiles végétales'],
    usage: 'Appliquer sur peau propre, 2 fois par jour.',
    inStock: true
  },
  {
    id: 'forever-calcium',
    name: 'Forever Calcium',
    category: 'complements',
    description: 'Complément de calcium et magnésium pour des os solides.',
    longDescription: 'Forever Calcium associe calcium, magnésium et vitamine D pour une absorption optimale. Essentiel pour la santé osseuse et dentaire à tout âge.',
    price: '14 200 FCFA',
    originalPrice: '16 800 FCFA',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    benefits: [
      'Renforce les os et les dents',
      'Améliore l\'absorption du calcium',
      'Soutient la fonction musculaire',
      'Formule synergique'
    ],
    ingredients: ['Carbonate de calcium', 'Oxyde de magnésium', 'Vitamine D3'],
    usage: '4 comprimés par jour avec les repas.',
    inStock: true
  },
  {
    id: 'aloe-peaches',
    name: 'Forever Aloe Peaches',
    category: 'boissons',
    description: 'Gel d\'Aloe Vera au délicieux goût de pêche.',
    longDescription: 'Savourez tous les bienfaits de l\'Aloe Vera avec une touche fruitée naturelle de pêche. Une boisson rafraîchissante et nutritive pour toute la famille.',
    price: '20 300 FCFA',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    benefits: [
      'Goût pêche naturel',
      'Tous les bienfaits de l\'Aloe Vera',
      'Rafraîchissant et nutritif',
      'Apprécié par toute la famille'
    ],
    ingredients: ['Gel d\'Aloe Vera (84,5%)', 'Concentré de pêche naturel', 'Fructose'],
    usage: '30ml, 2 à 3 fois par jour.',
    inStock: true,
    isPopular: true
  }
];

export const getProductsByCategory = (categoryId: string): Product[] => {
  if (categoryId === 'all') return products;
  return products.filter(product => product.category === categoryId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
