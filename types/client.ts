export interface Client {
    id: string;
    name: string;
    email: string;
    business_name: string;
    created_at: string;
  }
  
  export interface CreateClientInput {
    name: string;
    email: string;
    business_name: string;
  }
  
  export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
  }