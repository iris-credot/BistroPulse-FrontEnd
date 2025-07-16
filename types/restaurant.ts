export type Restaurant = {
  id: string;
  owner:string;
  name: string;
  email: string;
  description: string;
    image: string;
  openingHours: string;
  representative: string;
  address: {
    street?: string;
    city?: string;
    country?: string;
    state?: string;
    zipCode?: string;
  };
  createdAt:string;
  phone: string;
  rating: number; // Included for type safety
  status: "Open" | "Closed"; // Included for type safety
};