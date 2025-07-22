'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Minus, ShoppingCart,  ChevronDown, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '../../../../components/CardDashboard';
import { Button } from '../../../../components/Button';

// --- Type-Safe Interfaces ---
interface Restaurant {
    _id: string;
    name: string;
}

interface Address {
    _id: string;
    address: string;
    title: string;
    isDefault?: boolean;
}

interface User {
    _id: string;
    addresses: Address[];
}

interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    restaurant: string; 
}

type CartItem = MenuItem & {
    quantity: number;
};

type PaymentMethod = 'Card' | 'Cash' | 'Mobile Money';

// --- Type-Safe API Response Interfaces ---
interface RestaurantsApiResponse {
    restaurants: Restaurant[];
}
interface MenusApiResponse {
    menuItems: MenuItem[];
}
interface UserApiResponse {
    user: User;
}

// --- AddMenuPage Component ---
export default function AddMenuPage() {
    const router = useRouter();

    // --- State Management ---
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    
    const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState<CartItem[]>([]);

    // REMOVED: Delivery address state
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
    
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuLoading, setIsMenuLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [menuError, setMenuError] = useState<string | null>(null);
    
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);


    // --- Effect 1: Fetch initial page data (restaurants and user) ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');
                const userId = storedUser ? JSON.parse(storedUser)._id : null;

                if (!token || !userId) throw new Error("Authentication required. Please log in.");

                const [restaurantRes, userRes] = await Promise.all([
                    fetch('https://bistroupulse-backend.onrender.com/api/restaurant', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`https://bistroupulse-backend.onrender.com/api/user/getOne/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (!restaurantRes.ok) throw new Error('Failed to fetch restaurants.');
                if (!userRes.ok) throw new Error('Failed to fetch user data.');
                
                const restaurantData: RestaurantsApiResponse = await restaurantRes.json();
                const userData: UserApiResponse = await userRes.json();
                
                setRestaurants(restaurantData.restaurants || []);
                setUser(userData.user || null);
                
                // REMOVED: Logic to set default delivery address

            } catch (err) {
              console.log(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // --- Effect 2: Fetch menu items ONLY when a restaurant is selected ---
    useEffect(() => {
        if (!selectedRestaurant) {
            setMenuItems([]);
            return;
        }

        const fetchMenuItems = async () => {
            setIsMenuLoading(true);
            setMenuError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Token not found.");
                
                const response = await fetch(`https://bistroupulse-backend.onrender.com/api/menu/restaurant/${selectedRestaurant}`, { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                });

                if (!response.ok) {
                    throw new Error('Could not fetch the menu for this restaurant.');
                }
                const menuData: MenusApiResponse = await response.json();
                setMenuItems(menuData.menuItems || []);

            } catch (err) {
               console.log(err);
                setMenuItems([]);
            } finally {
                setIsMenuLoading(false);
            }
        };

        fetchMenuItems();
    }, [selectedRestaurant]);

    // --- Derived State and Memoized Calculations ---
    const categories: string[] = useMemo(() => 
        ['All', ...Array.from(new Set(menuItems.map(item => item.category)))],
        [menuItems]
    );

    const filteredItems = useMemo(() => 
        menuItems.filter(item => 
            (activeCategory === 'All' || item.category === activeCategory) &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [menuItems, activeCategory, searchTerm]
    );

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

    // --- Event Handlers ---
    const handleRestaurantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (cart.length > 0 && !confirm('Changing restaurants will clear your current cart. Are you sure?')) {
            return; 
        }
        setCart([]);
        setSelectedRestaurant(e.target.value);
        setActiveCategory('All');
    };
    
    const addToCart = (item: MenuItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === id);
            if (existingItem?.quantity === 1) {
                return prevCart.filter(item => item._id !== id);
            }
            return prevCart.map(item =>
                item._id === id ? { ...item, quantity: item.quantity - 1 } : item
            );
        });
    };

    const handlePlaceOrder = async () => {
        // UPDATED: Removed deliveryAddress from the validation check
        if (!user || !selectedRestaurant || cart.length === 0 || !paymentMethod) {
            alert('Please ensure you have selected a restaurant, added items to your cart, and chosen a payment method.');
            return;
        }

        setIsPlacingOrder(true);
        try {
            const token = localStorage.getItem('token');
            const orderPayload = {
                user: user._id,
                restaurant: selectedRestaurant,
                items: cart.map(item => ({ menuItem: item._id, quantity: item.quantity })),
                totalPrice: total,
                paymentMethod,
                // REMOVED: deliveryAddress from the payload
            };

            const response = await fetch('https://bistroupulse-backend.onrender.com/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(orderPayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to place order.');
            }

            alert('Order placed successfully!');
            router.push('/customer/my-orders');

        } catch (err) {
           console.log(err);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    // --- Render Logic ---
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500 dark:bg-gray-900 p-4 text-center">{error}</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="container mx-auto p-4">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Menu Section */}
                    <div className="md:w-2/3">
                        <div className="mb-6">
                            <label htmlFor="restaurant-select" className="block text-lg font-medium mb-2 dark:text-white">Choose a Restaurant</label>
                            <select
                                id="restaurant-select"
                                value={selectedRestaurant}
                                onChange={handleRestaurantChange}
                                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            >
                                <option value="" disabled>-- Select a restaurant --</option>
                                {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                            </select>
                        </div>
                        
                        {isMenuLoading && (
                             <div className="flex justify-center items-center h-40">
                                <Loader2 className="animate-spin text-blue-500" size={32} />
                                <span className="ml-2 dark:text-white">Loading menu...</span>
                            </div>
                        )}

                        {menuError && (
                            <div className="text-center py-12 text-red-500">{menuError}</div>
                        )}

                        {!isMenuLoading && !menuError && selectedRestaurant && (
                            <>
                                {filteredItems.length === 0 && menuItems.length > 0 ? (
                                    <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                                        No menu items match your search.
                                    </div>
                                ) : menuItems.length === 0 ? (
                                    <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                                        This restaurant has no menu items yet.
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                <input type="text" placeholder="Search menu..." className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                            </div>
                                            <div className="relative">
                                                <select title='Filter by category' className="appearance-none pl-4 pr-10 py-2 w-full sm:w-auto border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} >
                                                    {categories.map(category => <option key={category} value={category}>{category}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {filteredItems.map(item => (
                                                <Card key={item._id} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border dark:border-gray-700">
                                                    <CardContent className="p-4">
                                                        <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden">
                                                            <Image src={item.image || '/images/pizza.jpg'} alt={item.name} width={300} height={200} className="w-full h-full object-cover" />
                                                        </div>
                                                        <h3 className="font-semibold text-lg dark:text-white">{item.name}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-bold dark:text-white">₵{item.price.toFixed(2)}</span>
                                                            <Button size="sm" onClick={() => addToCart(item)} className="bg-blue-600 hover:bg-blue-700"> <Plus className="h-4 w-4 mr-1" /> Add </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Cart Section */}
                    <div className="md:w-1/3">
                        <Card className="sticky top-4 dark:bg-gray-800 dark:border dark:border-gray-700">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <ShoppingCart className="text-blue-600" />
                                    <h2 className="text-xl font-bold dark:text-white">Your Order</h2>
                                    <span className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-sm"> {totalItemsInCart} </span>
                                </div>
                                {cart.length === 0 ? (<p className="text-center text-gray-500 dark:text-gray-400 py-4">Your cart is empty</p>) : (
                                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                        {cart.map(item => (
                                            <div key={item._id} className="flex justify-between items-center border-b dark:border-gray-700 pb-3">
                                                <div>
                                                    <h4 className="font-medium dark:text-white">{item.name}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">₵{item.price.toFixed(2)} × {item.quantity}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => removeFromCart(item._id)} className="h-8 w-8 p-0 dark:border-gray-600"> <Minus className="h-4 w-4" /> </Button>
                                                    <span className="w-6 text-center dark:text-white">{item.quantity}</span>
                                                    <Button variant="outline" size="sm" onClick={() => addToCart(item)} className="h-8 w-8 p-0 dark:border-gray-600"> <Plus className="h-4 w-4" /> </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>

                            {cart.length > 0 && (
                                <CardFooter className="flex flex-col gap-4 p-4 border-t dark:border-gray-700">
                                    <div className="w-full space-y-3">
                                        <div className="flex justify-between font-bold text-lg dark:text-white">
                                            <span>Total:</span>
                                            <span>₵{total.toFixed(2)}</span>
                                        </div>
                                       
                                        {/* REMOVED: Delivery address dropdown */}

                                        <div>
                                            <label htmlFor="payment-select" className="text-sm font-medium dark:text-gray-300">Payment Method</label>
                                            <select id="payment-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                                                <option value="Card">Card</option>
                                                <option value="Cash">Cash</option>
                                                <option value="Mobile Money">Mobile Money</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Button onClick={handlePlaceOrder} disabled={isPlacingOrder} className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg disabled:bg-gray-500">
                                        {isPlacingOrder ? <Loader2 className="animate-spin" /> : 'Place Order'}
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}