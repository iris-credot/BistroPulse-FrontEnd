export type OrderStatus = 'Pending' | 'Preparing' | 'Cancelled' | 'Delivered' | 'On the way';
export interface Order {
  id: string;
  date: string;
  details?: string;
  customer: {
    name: string;
    avatar: string;
  };
  price: number;
  status: OrderStatus;
}