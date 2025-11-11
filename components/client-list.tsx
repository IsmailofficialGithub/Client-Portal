
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Client } from '@/types/client';
import { Building2, Mail, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
}

export function ClientList({ clients, isLoading }: ClientListProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>Loading clients...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Client Directory</CardTitle>
        <CardDescription>
          {clients.length} {clients.length === 1 ? 'client' : 'clients'} onboarded
        </CardDescription>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No clients yet. Add your first client above!</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead className="text-right">Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {client.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {client.business_name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(client.created_at), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}