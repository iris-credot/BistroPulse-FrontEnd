export interface Restaurant {
  restaurantName: string;
  representativeName: string;
  phoneNumber: string;
  businessLicenseFile?: File | null;
  rating: string;
  
  ownerNIDFile?: File | null;
  established?: string;
  workingPeriod?: string;
  payment?: string;
  location?: string;
  restaurantImageFile?: File | null;
}