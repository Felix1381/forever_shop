'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, Settings } from 'lucide-react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{session.user.name}</span>
          {session.user.role === 'admin' && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {session.user.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-indigo-600"
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          )}
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/auth/signin"
        className="text-sm font-medium text-gray-700 hover:text-indigo-600"
      >
        Connexion
      </Link>
      <Link
        href="/auth/signup"
        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
      >
        Inscription
      </Link>
    </div>
  );
}
