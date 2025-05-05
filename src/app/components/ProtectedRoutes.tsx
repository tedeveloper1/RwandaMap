'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ 
  children,
  allowedRoles = [] 
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, loading, checkSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (allowedRoles.length && !allowedRoles.includes(user.role)))) {
      router.push('/login');
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user || (allowedRoles.length && !allowedRoles.includes(user.role))) {
    return <div>Loading or verifying authentication...</div>;
  }

  return <>{children}</>;
}