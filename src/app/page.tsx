'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FaBolt, FaUtensils, FaMotorcycle, FaStar, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Globe } from 'lucide-react';
import { MdDeliveryDining, MdFoodBank } from 'react-icons/md';

interface Restaurant {
  _id: string;
  name: string;
  image?: string | null;
  address?: { city: string };
  categories?: string[];
  description: string;
}

export default function LandingPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // --- State and Refs ---
  const formRef = useRef<HTMLFormElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- State for storing restaurant data from the API ---
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  const [restaurantsError, setRestaurantsError] = useState<string | null>(null);


  // --- Handlers ---
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsDropdownOpen(false);
  };

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

      setMessage(t('contact.form.successMessage'));
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      setMessage(t('contact.form.errorMessage'));
      console.error('Email sending error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // --- Effects ---
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
  }, []);


  // --- useEffect to fetch restaurants from the API ---
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoadingRestaurants(true);
        setRestaurantsError(null);
        const response = await fetch(`${apiBaseUrl}/restaurant`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants. Please try again later.');
        }
        const data = await response.json();

        if (data && Array.isArray(data.restaurants)) {
            setRestaurants(data.restaurants);
        } else {
            throw new Error("Unexpected API response format.");
        }
        
      } catch (error) {
        console.error("Error fetching restaurants:", error);
       
      } finally {
        setIsLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, [apiBaseUrl]);


  // --- Data for mapping (using translation keys) ---
  const features = [
    { key: 'fastDelivery', icon: <FaBolt className="text-4xl text-blue-600" /> },
    { key: 'restaurants', icon: <FaUtensils className="text-4xl text-blue-600" /> },
    { key: 'liveTracking', icon: <MdDeliveryDining className="text-4xl text-blue-600" /> }
  ];

  const howItWorksSteps = [
    { step: "1", key: "chooseRestaurant", icon: <MdFoodBank className="text-3xl text-blue-600" /> },
    { step: "2", key: "selectMeal", icon: <FaUtensils className="text-3xl text-blue-600" /> },
    { step: "3", key: "fastDelivery", icon: <FaMotorcycle className="text-3xl text-blue-600" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer min-w-[3rem]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Image src="/icon.png" alt="BistroPulse Logo" width={48} height={48} className="rounded-full object-contain h-12 w-12" priority />
            <span className="text-2xl font-bold text-blue-600">{t('nav.brand')}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-black">
            <a href="#features" className="font-medium hover:text-blue-600 transition">{t('nav.features')}</a>
            <a href="#how-it-works" className="font-medium hover:text-blue-600 transition">{t('nav.howItWorks')}</a>
            <a href="#restaurants" className="font-medium hover:text-blue-600 transition">{t('nav.restaurants')}</a>
            <a href="#contact" className="font-medium hover:text-blue-600 transition">{t('nav.contact')}</a>
          </div>
          <div className="flex gap-4 flex-wrap sm:flex-nowrap items-center">
            <button onClick={() => router.push('/login')} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              {t('nav.login')}
            </button>
            <button onClick={() => router.push('/signup')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              {t('nav.signUp')}
            </button>
            <div className="relative" ref={dropdownRef}>
              <button title={t('nav.changeLanguageTitle')} className="p-2 rounded-full hover:bg-blue-500 transition-colors items-end" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <Globe className="w-8 h-8 text-blue-500 hover:text-white" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 ring-1 ring-black ring-opacity-5">
                  <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('nav.lang.en')}</button>
                  <button onClick={() => changeLanguage('fr')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('nav.lang.fr')}</button>
                  <button onClick={() => changeLanguage('sw')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('nav.lang.sw')}</button>
                  <button onClick={() => changeLanguage('rw')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('nav.lang.rw')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-black text-white h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <Image src="/homee.png" alt="Bus city background" fill priority className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t('hero.title1')} <span className="text-blue-600">{t('hero.title2')}</span>
            </h1>
            <p className="text-xl text-white mb-8">{t('hero.subtitle')}</p>
            <button onClick={() => router.push('/login')} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              {t('hero.ctaButton')}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('features.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('features.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.key} className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-md transition hover:transform hover:-translate-y-2">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(`features.cards.${feature.key}.title`)}</h3>
                <p className="text-gray-600">{t(`features.cards.${feature.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('howItWorks.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step) => (
              <div key={step.key} className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-lg transition">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">{step.step}</span>
                </div>
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(`howItWorks.steps.${step.key}.title`)}</h3>
                <p className="text-gray-600">{t(`howItWorks.steps.${step.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Restaurants Section */}
      <section id="restaurants" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('restaurants.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('restaurants.subtitle')}</p>
          </div>

          {isLoadingRestaurants && <div className="text-center text-gray-600">Loading restaurants...</div>}
          {restaurantsError && <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{restaurantsError}</div>}
          
          {!isLoadingRestaurants && !restaurantsError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* --- THE FIX: Use .slice(0, 6) to get only the first 6 items --- */}
              {restaurants.slice(0, 6).map((restaurant) => {
               const apiBaseUrll = process.env.NEXT_PUBLIC_API;
                const placeholderImage = '/placeholder-image.png';
                
                let imageUrl = placeholderImage;

                if (restaurant.image) {
                  if (restaurant.image.startsWith('http')) {
                    imageUrl = restaurant.image;
                  } else {
                    imageUrl = `${apiBaseUrll}/${restaurant.image}`;
                  }
                }

                return (
                  <div key={restaurant._id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer hover:transform hover:-translate-y-2"
                    >
                    
                    <div className="relative h-48 w-full">
                      <Image src={imageUrl} alt={restaurant.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2 text-black">
                        <h3 className="text-xl font-bold">{restaurant.name}</h3>
                        <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span>4.5</span> 
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <FaMapMarkerAlt className="mr-2 text-blue-500" />
                        <span>{restaurant.address?.city || 'Location Unavailable'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {restaurant.categories?.map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-gray-200 px-2 py-1 rounded text-sm text-black">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{t('cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1" onClick={() => router.push('/signup')}>
              {t('cta.iosButton')}
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('contact.title')}</h2>
              <p className="text-gray-600 mb-8">{t('contact.subtitle')}</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaPhoneAlt className="text-blue-600 mr-4" />
                  <span className='text-black'>{t('contact.phone')}</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-blue-600 mr-4" />
                  <span className='text-black'>{t('contact.email')}</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-blue-600 mr-4" />
                  <span className='text-black'>{t('contact.address')}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{t('contact.form.title')}</h3>
              <form className="space-y-4" ref={formRef} onSubmit={sendEmail}>
                <div><input type="text" name="user_name" placeholder={t('contact.form.namePlaceholder')} className="w-full px-4 py-2 border text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
                <div><input type="email" name="user_email" placeholder={t('contact.form.emailPlaceholder')} className="w-full px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
                <div><textarea name="user_message" placeholder={t('contact.form.messagePlaceholder')} rows={4} className="w-full px-4 py-2 border text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required ></textarea></div>
                {message && (<div className={`py-2 px-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>)}
                <button type="submit" disabled={isLoading} className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full shadow hover:shadow-md ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}>
                  {isLoading ? t('contact.form.sendingButton') : t('contact.form.sendButton')}
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
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </div>
  );
}