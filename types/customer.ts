export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  location: string;
  created: string;
  avatar: string;
  category?: string;
  status?: string;
  orders?: { id: number; details: string; date: string; status: string }[];
}