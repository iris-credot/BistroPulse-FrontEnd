// src/app/customer/new-order/page.tsx
'use client';

import { useState } from 'react';
import { Search, Plus, Minus, ShoppingCart, Clock, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '../../../../components/Button';
import { Card, CardContent, CardFooter } from '../../../../components/CardDashboard'

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

type CartItem = MenuItem & {
  quantity: number;
};

export default function NewOrder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sample menu data
  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic tomato and mozzarella',
      price: 12.99,
      category: 'Pizza',
      image: '/pizza-margherita.jpg'
    },
    {
      id: 2,
      name: 'Chicken Burger',
      description: 'Grilled chicken with lettuce and mayo',
      price: 9.99,
      category: 'Burgers',
      image: '/chicken-burger.jpg'
    },
    // Add more menu items...
  ];

  const categories = ['All', 'Pizza', 'Burgers', 'Pasta', 'Salads', 'Drinks'];

  const filteredItems = menuItems.filter(item => 
    (activeCategory === 'All' || item.category === activeCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === id 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      }
      return prevCart.filter(item => item.id !== id);
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Menu Section */}
        <div className="md:w-2/3">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search menu..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
              title='ff'
                className="appearance-none pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">${item.price.toFixed(2)}</span>
                    <Button 
                      size="sm" 
                      onClick={() => addToCart(item)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="md:w-1/3">
          <Card className="sticky top-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="text-blue-600" />
                <h2 className="text-xl font-bold">Your Order</h2>
                <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>

              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => addToCart(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            {cart.length > 0 && (
              <CardFooter className="flex flex-col gap-4 p-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Estimated delivery: 30-45 mins</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Delivery to: 123 Main St</span>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg">
                  Place Order
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}