export interface Customer {
  id:  string;
  names: string;
  phoneNumber: string;
  email: string;
  restaurant?: string;
  address: string;
  created?: string;
  avatar: string;
  category?: string;
  status?: string;
  orders?: { id: number; details: string; date: string; status: string }[];
}