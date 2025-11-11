'use client';

import { useEffect, useState } from 'react';
import { ClientForm } from '@/components/client-form';
import { ClientList } from '@/components/client-list';
import { Client, ApiResponse } from '@/types/client';
import { Briefcase } from 'lucide-react';

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    setIsLoading(true);
    const response = await fetch('/api/clients');
    const result: ApiResponse<Client[]> = await response.json();
    
    if (result.success && result.data) {
      setClients(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Client Onboarding Portal
          </h1>
          <p className="text-muted-foreground text-lg">
            Streamline your client onboarding process with automated welcome emails
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div>
            <ClientForm onClientAdded={fetchClients} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <ClientList clients={clients} isLoading={isLoading} />
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border">
              <div className="text-3xl font-bold text-primary mb-2">{clients.length}</div>
              <div className="text-sm text-muted-foreground">Total Clients</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border">
              <div className="text-3xl font-bold text-green-600 mb-2">{clients.length}</div>
              <div className="text-sm text-muted-foreground">Welcome Emails Sent</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Onboarding Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}