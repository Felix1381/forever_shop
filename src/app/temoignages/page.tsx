'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  videoTestimonials, 
  productReviews, 
  textTestimonials, 
  testimonialCategories,
  getTestimonialsByCategory,
  type VideoTestimonial,
  type ProductReview,
  type TextTestimonial
} from '@/data/testimonials';
import { 
  Play, 
  Star, 
  ThumbsUp, 
  Calendar, 
  MapPin, 
  Quote,
  Video,
  MessageSquare,
  Award,
  TrendingUp,
  Users,
  CheckCircle,
  ExternalLink,
  Heart,
  Share2,
  Plus
} from 'lucide-react';
import TestimonialForm from '@/components/TestimonialForm';

export default function TestimonialsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { videos, reviews, texts } = getTestimonialsByCategory(selectedCategory);

  const handleFormSuccess = () => {
    setSubmitStatus('success');
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  const YouTubeEmbed = ({ videoId, title }: { videoId: string; title: string }) => (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );

  const VideoTestimonialCard = ({ video }: { video: VideoTestimonial }) => (
    <Card className="group overflow-hidden border border-border/50 hover:border-forever-yellow/50 shadow-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-0 relative">
        <div className="relative aspect-video bg-gradient-to-br from-muted/20 to-muted/40">
          {selectedVideo === video.id ? (
            <YouTubeEmbed videoId={video.youtubeId} title={video.title} />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Image
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={() => setSelectedVideo(video.id)}
                  className="bg-forever-yellow hover:bg-forever-gold text-black rounded-full h-16 w-16 p-0 shadow-xl"
                >
                  <Play className="h-8 w-8 ml-1" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <Badge className="bg-black/70 text-white text-xs">
                  <Video className="w-3 h-3 mr-1" />
                  {video.duration}
                </Badge>
              </div>
            </>
          )}
          
          {video.featured && (
            <Badge className="absolute top-3 left-3 bg-forever-yellow text-black">
              <Award className="w-3 h-3 mr-1" />
              À la une
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-forever-yellow transition-colors">
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="font-medium">{video.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{video.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{new Date(video.date).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="h-8 px-2">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 px-2">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductReviewCard = ({ review }: { review: ProductReview }) => (
    <Card className="border border-border/50 hover:border-forever-yellow/50 shadow-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {review.verified && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                  Vérifié
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-lg mb-1">{review.title}</h4>
            <Link 
              href={`/boutique/${review.productId}`}
              className="text-sm text-forever-yellow hover:underline font-medium"
            >
              {review.productName}
            </Link>
          </div>
        </div>
        
        <p className="text-muted-foreground leading-relaxed">{review.review}</p>
        
        {review.beforeAfter && (
          <div className="space-y-2">
            <h5 className="font-medium text-sm">Avant / Après</h5>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Image
                  src={review.beforeAfter.before}
                  alt="Avant"
                  width={200}
                  height={150}
                  className="rounded-lg object-cover w-full h-24"
                />
                <p className="text-xs text-center text-muted-foreground">Avant</p>
              </div>
              <div className="space-y-1">
                <Image
                  src={review.beforeAfter.after}
                  alt="Après"
                  width={200}
                  height={150}
                  className="rounded-lg object-cover w-full h-24"
                />
                <p className="text-xs text-center text-muted-foreground">Après</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">{review.beforeAfter.description}</p>
          </div>
        )}
        
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2">
            {review.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Photo ${index + 1}`}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="space-y-1">
            <p className="font-medium text-sm">{review.customerName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{review.location}</span>
              <span>•</span>
              <Calendar className="w-3 h-3" />
              <span>{new Date(review.date).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
              <ThumbsUp className="w-3 h-3 mr-1" />
              {review.helpful}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TextTestimonialCard = ({ testimonial }: { testimonial: TextTestimonial }) => (
    <Card className="border border-border/50 hover:border-forever-yellow/50 shadow-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          {testimonial.avatar && (
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={60}
              height={60}
              className="rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <h4 className="font-semibold text-lg mb-1">{testimonial.title}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{testimonial.name}</span>
              <span>•</span>
              <MapPin className="w-3 h-3" />
              <span>{testimonial.location}</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-forever-yellow/20" />
          <p className="text-muted-foreground leading-relaxed pl-6 italic">
            "{testimonial.content}"
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{new Date(testimonial.date).toLocaleDateString('fr-FR')}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {testimonial.category === 'business' && 'Business'}
            {testimonial.category === 'health' && 'Santé'}
            {testimonial.category === 'lifestyle' && 'Mode de vie'}
            {testimonial.category === 'weight-loss' && 'Perte de poids'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-12 bg-gradient-to-r from-forever-yellow/5 to-forever-gold/5 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <Badge className="bg-forever-yellow text-black">
              <MessageSquare className="w-4 h-4 mr-2" />
              Témoignages clients
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Ils ont testé, ils témoignent
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Découvrez les histoires inspirantes de nos clients qui ont transformé leur vie 
              grâce aux produits Forever Living Products. Témoignages vidéo, avis produits et histoires de réussite.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-forever-yellow">{videoTestimonials.length}</div>
              <div className="text-sm text-muted-foreground">Vidéos témoignages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-forever-yellow">{productReviews.length}</div>
              <div className="text-sm text-muted-foreground">Avis produits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-forever-yellow">4.8/5</div>
              <div className="text-sm text-muted-foreground">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-forever-yellow">98%</div>
              <div className="text-sm text-muted-foreground">Clients satisfaits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {testimonialCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? 'bg-forever-yellow text-black hover:bg-forever-gold' 
                    : 'hover:bg-forever-yellow hover:text-black hover:border-forever-yellow'
                }`}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Add Testimonial Button */}
      <section className="py-6 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Vous aussi, partagez votre expérience !</h3>
              <p className="text-sm text-muted-foreground">Aidez d'autres personnes en partageant votre témoignage</p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-forever-yellow hover:bg-forever-gold text-black font-semibold px-6 py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter mon témoignage
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Form Modal */}
      {showAddForm && (
        <TestimonialForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Témoignage envoyé avec succès !</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Nous examinerons votre témoignage et le publierons sous 48h.
          </p>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Video Testimonials */}
        {videos.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Video className="h-6 w-6 text-forever-yellow" />
              <h2 className="text-2xl font-bold">Témoignages Vidéo</h2>
              <Badge variant="outline">{videos.length}</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoTestimonialCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Product Reviews */}
        {reviews.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-6 w-6 text-forever-yellow" />
              <h2 className="text-2xl font-bold">Avis Produits</h2>
              <Badge variant="outline">{reviews.length}</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <ProductReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}

        {/* Text Testimonials */}
        {texts.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Quote className="h-6 w-6 text-forever-yellow" />
              <h2 className="text-2xl font-bold">Histoires de Réussite</h2>
              <Badge variant="outline">{texts.length}</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {texts.map((testimonial) => (
                <TextTestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-forever-yellow/5 to-forever-gold/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Prêt à vivre votre propre transformation ?
            </h2>
            <p className="text-lg text-muted-foreground">
              Rejoignez des milliers de personnes qui ont déjà transformé leur vie avec Forever Living Products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-forever-yellow hover:bg-forever-gold text-black font-semibold px-8 py-3"
              >
                <Link href="/boutique">
                  Découvrir nos produits
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-forever-yellow text-forever-yellow hover:bg-forever-yellow hover:text-black px-8 py-3"
              >
                <Link href="/contact">
                  Demander conseil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
