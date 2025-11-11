'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CreateClientInput, ApiResponse, Client } from '@/types/client';
import { Loader2, UserPlus } from 'lucide-react';

interface ClientFormProps {
  onClientAdded: () => void;
}

export function ClientForm({ onClientAdded }: ClientFormProps) {
  const [formData, setFormData] = useState<CreateClientInput>({
    name: '',
    email: '',
    business_name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result: ApiResponse<Client> = await response.json();

    if (result.success) {
      toast({
        title: 'Success! 🎉',
        description: result.message,
      });
      setFormData({ name: '', email: '', business_name: '' });
      onClientAdded();
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Client
        </CardTitle>
        <CardDescription>
          Enter client details to onboard them and send a welcome email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              placeholder="Acme Corp"
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Client...
              </>
            ) : (
              'Add Client & Send Welcome Email'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}