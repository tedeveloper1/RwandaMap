
// src/app/admin/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  const router = useRouter();
  return <AdminDashboard />;
}