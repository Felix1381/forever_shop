export interface VideoTestimonial {
  id: string;
  name: string;
  location: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail?: string;
  duration: string;
  date: string;
  category: 'success-story' | 'product-review' | 'transformation' | 'business';
  featured: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  location: string;
  rating: number;
  title: string;
  review: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  beforeAfter?: {
    before: string;
    after: string;
    description: string;
  };
}

export interface TextTestimonial {
  id: string;
  name: string;
  location: string;
  title: string;
  content: string;
  date: string;
  category: 'health' | 'business' | 'lifestyle' | 'weight-loss';
  avatar?: string;
  rating: number;
}

export const videoTestimonials: VideoTestimonial[] = [
  {
    id: 'video-1',
    name: 'Marie Kouassi',
    location: 'Lomé, Togo',
    title: 'Ma transformation avec Forever Living Products',
    description: 'Découvrez comment les produits Forever Living ont transformé ma vie et ma santé en seulement 3 mois.',
    youtubeId: 'dQw4w9WgXcQ', // Exemple d'ID YouTube
    duration: '5:32',
    date: '2024-01-15',
    category: 'transformation',
    featured: true
  },
  {
    id: 'video-2',
    name: 'Jean-Baptiste Agbeko',
    location: 'Kara, Togo',
    title: 'Forever Aloe Vera Gel : Mon avis après 6 mois',
    description: 'Un témoignage honnête sur les bienfaits du gel d\'Aloe Vera Forever après 6 mois d\'utilisation quotidienne.',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '8:15',
    date: '2024-02-20',
    category: 'product-review',
    featured: true
  },
  {
    id: 'video-3',
    name: 'Fatou Diallo',
    location: 'Sokodé, Togo',
    title: 'Comment j\'ai développé mon business Forever Living',
    description: 'Mon parcours d\'entrepreneure avec Forever Living Products et les résultats obtenus.',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '12:45',
    date: '2024-03-10',
    category: 'business',
    featured: false
  },
  {
    id: 'video-4',
    name: 'Kofi Mensah',
    location: 'Atakpamé, Togo',
    title: 'Forever Arctic Sea : Mes résultats cardiovasculaires',
    description: 'Les bienfaits des oméga-3 Forever Arctic Sea sur ma santé cardiovasculaire, témoignage médical à l\'appui.',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '6:28',
    date: '2024-03-25',
    category: 'product-review',
    featured: true
  }
];

export const productReviews: ProductReview[] = [
  {
    id: 'review-1',
    productId: 'aloe-vera-gel',
    productName: 'Forever Aloe Vera Gel',
    customerName: 'Akosua Mensah',
    location: 'Lomé, Togo',
    rating: 5,
    title: 'Excellent pour la digestion !',
    review: 'Je prends le gel d\'Aloe Vera depuis 4 mois maintenant et les résultats sont impressionnants. Mes problèmes digestifs ont complètement disparu et j\'ai plus d\'énergie au quotidien. Je le recommande vivement !',
    date: '2024-03-15',
    verified: true,
    helpful: 23,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    ]
  },
  {
    id: 'review-2',
    productId: 'forever-daily',
    productName: 'Forever Daily',
    customerName: 'Edem Koffi',
    location: 'Kpalimé, Togo',
    rating: 5,
    title: 'Plus de fatigue depuis que je prends Forever Daily',
    review: 'Ces vitamines ont changé ma vie ! Fini la fatigue chronique et les coups de mou de l\'après-midi. Je me sens en pleine forme toute la journée. La qualité Forever Living fait vraiment la différence.',
    date: '2024-03-20',
    verified: true,
    helpful: 18
  },
  {
    id: 'review-3',
    productId: 'arctic-sea',
    productName: 'Forever Arctic Sea',
    customerName: 'Adjoa Tetteh',
    location: 'Tsévié, Togo',
    rating: 4,
    title: 'Bon produit, résultats visibles',
    review: 'J\'utilise Arctic Sea depuis 2 mois pour mes problèmes articulaires. Je ressens déjà une amélioration notable de ma mobilité. Le prix est un peu élevé mais la qualité est au rendez-vous.',
    date: '2024-03-08',
    verified: true,
    helpful: 12,
    beforeAfter: {
      before: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      after: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Amélioration de la mobilité articulaire après 2 mois'
    }
  },
  {
    id: 'review-4',
    productId: 'aloe-berry-nectar',
    productName: 'Forever Aloe Berry Nectar',
    customerName: 'Yao Kumah',
    location: 'Aného, Togo',
    rating: 5,
    title: 'Délicieux et efficace !',
    review: 'Le goût est vraiment agréable comparé au gel d\'Aloe classique. Parfait pour toute la famille. Mes enfants adorent et moi j\'ai constaté une amélioration de mon système immunitaire.',
    date: '2024-02-28',
    verified: true,
    helpful: 15
  },
  {
    id: 'review-5',
    productId: 'forever-bee-pollen',
    productName: 'Forever Bee Pollen',
    customerName: 'Ama Doe',
    location: 'Dapaong, Togo',
    rating: 4,
    title: 'Boost d\'énergie naturel',
    review: 'Très bon complément pour l\'énergie. Je le prends le matin et je sens la différence dans ma journée. Seul bémol : le goût est un peu particulier au début, mais on s\'y habitue.',
    date: '2024-03-12',
    verified: true,
    helpful: 9
  }
];

export const textTestimonials: TextTestimonial[] = [
  {
    id: 'text-1',
    name: 'Koffi Adjei',
    location: 'Lomé, Togo',
    title: 'Distributeur Forever Living depuis 3 ans',
    content: 'Forever Living a changé ma vie à tous les niveaux. Non seulement j\'ai retrouvé une santé optimale grâce aux produits, mais j\'ai aussi pu développer une activité qui me permet d\'aider d\'autres personnes tout en générant des revenus complémentaires significatifs.',
    date: '2024-03-01',
    category: 'business',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'text-2',
    name: 'Efua Asante',
    location: 'Ho, Togo',
    title: 'Perte de poids réussie',
    content: 'Grâce au programme Forever Living et aux conseils de Rita, j\'ai perdu 15 kg en 4 mois de manière saine et durable. Je me sens plus confiante et en meilleure santé que jamais. Merci Forever Living !',
    date: '2024-02-15',
    category: 'weight-loss',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'text-3',
    name: 'Kwame Osei',
    location: 'Kara, Togo',
    title: 'Amélioration de ma santé générale',
    content: 'Diabétique depuis 10 ans, j\'ai vu une nette amélioration de mes analyses depuis que j\'ai intégré les produits Forever Living à mon mode de vie. Mon médecin est impressionné par les résultats.',
    date: '2024-01-20',
    category: 'health',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
];

export const testimonialCategories = [
  { id: 'all', name: 'Tous les témoignages', count: videoTestimonials.length + textTestimonials.length },
  { id: 'video', name: 'Témoignages vidéo', count: videoTestimonials.length },
  { id: 'product-reviews', name: 'Avis produits', count: productReviews.length },
  { id: 'success-stories', name: 'Histoires de succès', count: textTestimonials.length },
  { id: 'transformations', name: 'Transformations', count: 3 },
  { id: 'business', name: 'Réussites business', count: 2 }
];

export const getTestimonialsByCategory = (category: string) => {
  switch (category) {
    case 'video':
      return { videos: videoTestimonials, reviews: [], texts: [] };
    case 'product-reviews':
      return { videos: [], reviews: productReviews, texts: [] };
    case 'success-stories':
      return { videos: [], reviews: [], texts: textTestimonials };
    case 'transformations':
      return { 
        videos: videoTestimonials.filter(v => v.category === 'transformation'),
        reviews: productReviews.filter(r => r.beforeAfter),
        texts: textTestimonials.filter(t => t.category === 'weight-loss' || t.category === 'health')
      };
    case 'business':
      return { 
        videos: videoTestimonials.filter(v => v.category === 'business'),
        reviews: [],
        texts: textTestimonials.filter(t => t.category === 'business')
      };
    default:
      return { videos: videoTestimonials, reviews: productReviews, texts: textTestimonials };
  }
};
