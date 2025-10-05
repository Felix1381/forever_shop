'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  Linkedin,
  Globe
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi (remplacer par vraie API)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: 'general'
      });
      
      // Reset status après 5 secondes
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+228 XX XX XX XX',
      description: 'Lun-Ven: 8h-18h, Sam: 9h-15h',
      color: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@rita-aloe.tg',
      description: 'Réponse sous 24h',
      color: 'text-blue-600'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: 'Lomé, Togo',
      description: 'Quartier Administratif',
      color: 'text-red-600'
    },
    {
      icon: Clock,
      title: 'Horaires',
      value: 'Lun-Sam: 8h-18h',
      description: 'Fermé le dimanche',
      color: 'text-purple-600'
    }
  ];

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: '#', color: 'hover:text-blue-600' },
    { icon: Instagram, name: 'Instagram', url: '#', color: 'hover:text-pink-600' },
    { icon: Linkedin, name: 'LinkedIn', url: '#', color: 'hover:text-blue-700' },
    { icon: Globe, name: 'Site Web', url: '#', color: 'hover:text-forever-yellow' }
  ];

  const faqItems = [
    {
      question: 'Comment passer une commande ?',
      answer: 'Vous pouvez passer commande directement via notre boutique en ligne ou nous contacter par téléphone.'
    },
    {
      question: 'Quels sont les délais de livraison ?',
      answer: 'Nous livrons dans tout le Togo sous 2-5 jours ouvrables selon votre localisation.'
    },
    {
      question: 'Proposez-vous des conseils personnalisés ?',
      answer: 'Oui, nos experts en nutrition Forever Living sont disponibles pour vous conseiller gratuitement.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-12 bg-gradient-to-r from-forever-yellow/5 to-forever-gold/5 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <Badge className="bg-forever-yellow text-black">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contactez-nous
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Nous sommes là pour vous aider
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une question sur nos produits Forever Living ? Besoin de conseils personnalisés ? 
              Notre équipe d'experts est à votre disposition.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Send className="h-6 w-6 text-forever-yellow" />
                  Envoyez-nous un message
                </CardTitle>
                <p className="text-muted-foreground">
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Type de demande */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Type de demande</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                      required
                    >
                      <option value="general">Question générale</option>
                      <option value="product">Information produit</option>
                      <option value="order">Commande / Livraison</option>
                      <option value="support">Support technique</option>
                      <option value="partnership">Partenariat</option>
                    </select>
                  </div>

                  {/* Nom et Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom complet *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Téléphone et Sujet */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                          placeholder="+228 XX XX XX XX"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Sujet *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent"
                        placeholder="Sujet de votre message"
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-forever-yellow focus:border-transparent resize-none"
                      placeholder="Décrivez votre demande en détail..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      * Champs obligatoires
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-forever-yellow hover:bg-forever-gold text-black font-semibold px-8 py-3 min-w-[150px]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span>Message envoyé avec succès ! Nous vous répondrons sous 24h.</span>
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                      <AlertCircle className="h-5 w-5" />
                      <span>Erreur lors de l'envoi. Veuillez réessayer.</span>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`p-2 rounded-lg bg-muted ${info.color}`}>
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{info.title}</h4>
                      <p className="text-foreground font-medium">{info.value}</p>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Suivez-nous</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className={`flex items-center gap-2 p-3 rounded-lg border border-border hover:border-forever-yellow transition-all duration-300 ${social.color}`}
                    >
                      <social.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{social.name}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Quick */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Questions fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">{faq.question}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                    {index < faqItems.length - 1 && <hr className="border-border" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-forever-yellow/5 to-forever-gold/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Prêt à découvrir Forever Living Products ?
            </h2>
            <p className="text-lg text-muted-foreground">
              Explorez notre gamme complète de produits naturels et commencez votre voyage vers le bien-être.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-forever-yellow hover:bg-forever-gold text-black font-semibold px-8 py-3"
              >
                <a href="/boutique">
                  Voir nos produits
                </a>
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-forever-yellow text-forever-yellow hover:bg-forever-yellow hover:text-black px-8 py-3"
              >
                <a href="/">
                  Retour à l'accueil
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
