import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { CartProvider } from '@/contexts/CartContext'
import LayoutWrapper from '@/components/LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rita Aloe Nutrition - Compléments Alimentaires Forever Living',
  description: 'Découvrez notre gamme complète de compléments alimentaires Forever Living Products. Nutrition naturelle, bien-être optimal et qualité supérieure.',
  keywords: 'Forever Living, compléments alimentaires, nutrition, aloe vera, bien-être, santé naturelle',
  authors: [{ name: 'Rita Aloe Nutrition' }],
  openGraph: {
    title: 'Rita Aloe Nutrition - Compléments Alimentaires Forever Living',
    description: 'Nutrition naturelle et bien-être optimal avec Forever Living Products',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="rita-aloe-theme"
        >
          <CartProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
