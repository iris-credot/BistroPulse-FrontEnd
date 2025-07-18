'use client';
 
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react'; // Import useEffect
import emailjs from '@emailjs/browser';
import { useRouter } from 'next/navigation';
import { FaBolt, FaUtensils, FaMotorcycle, FaStar, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Globe } from 'lucide-react';
import { MdDeliveryDining, MdFoodBank } from 'react-icons/md';

export default function LandingPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Create a ref for the dropdown

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!formRef.current) return;
      
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      
      setMessage('Message sent successfully ✅');
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      setMessage('Message not sent (service error) ❌');
      console.error('Email sending error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Close dropdown when a language is selected
  const handleLanguageSelect = (language: string) => {
    console.log(`Language selected: ${language}`); // Placeholder for language change logic
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex  items-center gap-2 cursor-pointer min-w-[3rem]"  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
             
            <Image 
              src="/icon.png" 
              alt="BistroPulse Logo" 
              width={48}
              height={48}
               
              className="rounded-full object-contain h-12 w-12"
               priority
            />
            
            <span className="text-2xl font-bold text-blue-600">BistroPulse</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-black">
            <a href="#features" className="font-medium hover:text-blue-600 transition">Features</a>
            <a href="#how-it-works" className="font-medium hover:text-blue-600 transition">How It Works</a>
            <a href="#restaurants" className="font-medium hover:text-blue-600 transition">Restaurants</a>
            <a href="#contact" className="font-medium hover:text-blue-600 transition">Contact</a>
          </div>
          <div className="flex gap-4 flex-wrap sm:flex-nowrap items-center">
            <button 
              onClick={() => router.push('/login')}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Login
            </button>
            <button 
              onClick={() => router.push('/signup')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
              <div className="relative" ref={dropdownRef}>
                <button 
                  title='Change Language'
                  className="p-2 rounded-full  dark:hover:bg-blue-500 transition-colors items-end"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Globe className="w-8 h-8 text-blue-500 hover:text-white " />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 ring-1 ring-black ring-opacity-5">
                    <button onClick={() => handleLanguageSelect('en')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English</button>
                    <button onClick={() => handleLanguageSelect('fr')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">French</button>
                    <button onClick={() => handleLanguageSelect('sw')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Kiswahili</button>
                    <button onClick={() => handleLanguageSelect('rw')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Kinyarwanda</button>
                  </div>
                )}
              </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
          <section className="relative bg-black text-white h-[90vh] flex items-center">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src="/homee.png"
      alt="Bus city background"
      fill
      priority
      className="object-cover w-full h-full"
    />
    <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay */}
  </div>

  {/* Content */}
  <div className="relative z-10 container mx-auto px-6">
    <div className="max-w-3xl">
     <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Food Delivery <span className="text-blue-600">At Lightning Speed</span>
            </h1>
      <p className="text-xl text-white mb-8">
              Order from your favorite local restaurants and get food delivered to your doorstep in minutes.
            </p>
       <button 
                onClick={() => router.push('/login')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Order Now
              </button>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose BistroPulse?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make food delivery fast, easy, and delicious
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBolt className="text-4xl text-blue-600" />,
                title: "Lightning Fast Delivery",
                description: "Get your food delivered in under 30 minutes or get it free"
              },
              {
                icon: <FaUtensils className="text-4xl text-blue-600" />,
                title: "100+ Restaurants",
                description: "Choose from a wide variety of cuisines and local favorites"
              },
              {
                icon: <MdDeliveryDining className="text-4xl text-blue-600" />,
                title: "Live Order Tracking",
                description: "Track your order in real-time from restaurant to your door"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-md transition hover:transform hover:-translate-y-2">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How BistroPulse Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get your favorite food in just a few taps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choose Your Restaurant",
                description: "Browse through our partner restaurants and select your favorite",
                icon: <MdFoodBank className="text-3xl text-blue-600" />
              },
              {
                step: "2",
                title: "Select Your Meal",
                description: "Pick from hundreds of delicious menu items",
                icon: <FaUtensils className="text-3xl text-blue-600" />
              },
              {
                step: "3",
                title: "Fast Delivery",
                description: "Track your order as it speeds to your location",
                icon: <FaMotorcycle className="text-3xl text-blue-600" />
              }
            ].map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">{step.step}</span>
                </div>
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section id="restaurants" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Restaurants</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing local eateries near you
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Boutique Hotel",
                tags: ["Fine Dining", "International", "Fusion"],
                image: "/boutique.png",
                location: "Kigali"
              },
              {
                name: "Repub Lounge",
                tags: ["African", "Grill", "Bar"],
                image: "/second.png",
                location: "Musanze"
              },
              {
                name: "Pili Pili",
                tags: ["Barbecue", "Pizza", "Scenic View"],
                image: "/third.png",
                location: "Kayonza"
              },
              {
                name: "Meze Fresh",
                tags: ["Mexican", "Fast Food", "Healthy"],
                image: "/fourth.png",
                location: "Bugesera"
              },
              {
                name: "Poivre Noir",
                tags: ["French", "Seafood", "Romantic"],
                image: "/fifth.png",
                location: "Muhazi"
              },
              {
                name: "Brachetto",
                tags: ["Italian", "Wine Bar", "Gourmet"],
                image: "/sixth.png",
                location: "Gisenyi"
              },
            ].map((restaurant, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer hover:transform hover:-translate-y-2"
                onClick={() => router.push(`/restaurants/${restaurant.name.toLowerCase().replace(/\s+/g, '-')}`)}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2 text-black">
                    <h3 className="text-xl font-bold">{restaurant.name}</h3>
                    <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    <span>In {restaurant.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-gray-200 px-2 py-1 rounded text-sm text-black">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Download our app and get 20% off your first order
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1" onClick={() => router.push('/signup')}>
              Download for iOS
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <p className="text-gray-600 mb-8">
                Have questions or feedback? We had love to hear from you!
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaPhoneAlt className="text-blue-600 mr-4" />
                  <span className='text-black'>+250 (785) 123-456</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-blue-600 mr-4" />
                  <span className='text-black'>support@bistropulse.com</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-blue-600 mr-4" />
                  <span className='text-black'>123 Food Street, Kigali, CA 94107</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h3>
              <form className="space-y-4" ref={formRef} onSubmit={sendEmail}>
                <div>
                  <input 
                    type="text" 
                    name="user_name"
                    placeholder="Your Name" 
                    className="w-full px-4 py-2 border text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    name="user_email"
                    placeholder="Your Email" 
                    className="w-full px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <textarea 
                    name="user_message"
                    placeholder="Your Message" 
                    rows={4}
                    className="w-full px-4 py-2 border text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                {message && (
                  <div className={`py-2 px-4 rounded ${
                    message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {message}
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full shadow hover:shadow-md ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="border-t border-gray-800 pt-8 pb-4 text-center text-gray-400">
            © {new Date().getFullYear()} BistroPulse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}