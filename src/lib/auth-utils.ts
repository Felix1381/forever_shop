import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextRequest } from 'next/server';

/**
 * Vérifie si l'utilisateur est authentifié
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Authentication required');
  }
  
  return session;
}

/**
 * Vérifie si l'utilisateur est admin
 */
export async function requireAdmin() {
  const session = await requireAuth();
  
  if (session.user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return session;
}

/**
 * Vérifie si l'utilisateur peut accéder à une ressource
 */
export async function canAccess(resourceUserId?: string) {
  const session = await requireAuth();
  
  // Admin peut tout voir
  if (session.user.role === 'admin') {
    return { session, canAccess: true };
  }
  
  // Utilisateur peut voir ses propres ressources
  if (resourceUserId && session.user.id === resourceUserId) {
    return { session, canAccess: true };
  }
  
  return { session, canAccess: false };
}

/**
 * Types pour les réponses d'erreur standardisées
 */
export const AuthErrors = {
  UNAUTHORIZED: { error: 'Unauthorized - Authentication required', status: 401 },
  FORBIDDEN: { error: 'Forbidden - Insufficient permissions', status: 403 },
  ADMIN_REQUIRED: { error: 'Unauthorized - Admin access required', status: 403 },
} as const;
