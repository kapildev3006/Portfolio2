
'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from 'lucide-react';

export default function AdminDashboardRedirectPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/admin/profile');
    }, [router]);
    
    return (
       <div className="flex flex-1 min-h-screen items-center justify-center bg-background">
         <Loader2 className="h-10 w-10 animate-spin text-primary" />
       </div>
    );
}
