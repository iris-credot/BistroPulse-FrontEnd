export interface FoodItem {
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;
  status?: 'Active' | 'Deactive';
 
  description?: string;

  
}