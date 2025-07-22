 interface OwnerFromAPI {
  _id: string;
  businessName?: string;
  createdAt: string;
  user?: {
    names?: string;
    username?: string;
    email?: string;
    
    " phoneNumber"?: string; // <<< Add the key exactly as it appears in the console
    phoneNumber?: string;     // <<< Keep the correct one for when you fix the backend
    address?: string;
    image?: string;
    verified?: boolean;
  };
   restaurants?: Restaurant[];
}
export type Restaurant = {
  _id: string;
  owner:OwnerFromAPI;
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