import { Restaurant } from "./restaurant";
export interface OwnerFromAPI {
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