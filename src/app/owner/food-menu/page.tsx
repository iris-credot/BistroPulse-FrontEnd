"use client"; 

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";

import {  Power,Search, Filter, Plus, Download, MoreVertical, Eye, Edit, UserMinus } from 'lucide-react';

interface FoodItem {
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;
  status: 'Active' | 'Deactive';
}

const FoodManagement = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: 1,
      name: 'Beef onion pizza',
      image: '/images/beef-pizza.jpg',
      category: 'Pizza',
      price: 24.00,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Cheese Pizza',
      image: '/images/cheese-pizza.jpg',
      category: 'Pizza',
      price: 24.00,
      status: 'Deactive'
    },
    {
      id: 3,
      name: 'Chicken burger',
      image: '/images/chicken-burger.jpg',
      category: 'Burger',
      price: 24.00,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Beef burger',
      image: '/images/beef-burger.jpg',
      category: 'Burger',
      price: 24.00,
      status: 'Deactive'
    },
    {
      id: 5,
      name: 'Beef special pizza',
      image: '/images/special-pizza.jpg',
      category: 'Pizza',
      price: 24.00,
      status: 'Active'
    },
    {
      id: 6,
      name: 'Cheese Pizza',
      image: '/images/cheese-pizza.jpg',
      category: 'Appetizer',
      price: 24.00,
      status: 'Deactive'
    }
  ]);
  const router = useRouter();
    const [filterVisible, setFilterVisible] = useState(false);
      const [filters, setFilters] = useState({ 
        price: "", 
        category: "", 
        status: "" 
      });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const itemsPerPage = 5;

  const toggleStatus = (id: number) => {
    setFoodItems(foodItems.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'Active' ? 'Deactive' : 'Active' } 
        : item
    ));
  };

  const deleteItem = (id: number) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(foodItems.length / itemsPerPage);
  const handleAddFood = () => {
    router.push('/owner/add-food-menu');
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
       <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
               
                <h2 className="text-lg font-semibold text-gray-800">Food Items</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    title="Search customers by name, email, or phone"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    aria-label="Search customers"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setFilterVisible(!filterVisible)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    aria-label="Filter"
                  >
                    <Filter className="w-5 h-5" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>
                  
                  <button
                    onClick={handleAddFood}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    aria-label="Add customer"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Food</span>
                  </button>
                  
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    aria-label="Export"
                  >
                    <Download className="w-5 h-5" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
  {filterVisible && (
        <div className="absolute right-6 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Price</label>
              <select
                name="location"
                title="Filter by customer location"
                value={filters.price}
                onChange={(e) => setFilters({...filters, price: e.target.value})}
                className="mt-1 block w-full border text-gray-400 border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Available</option>
                <option value="Kigali">2k</option>
                <option value="Rwamagana">7k</option>
                <option value="Kayonza">10k</option>
                <option value="Nyamata">20k</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Category</label>
              <select
                name="category"
                title="Filter by customer category"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="AI">AI</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                title="Filter by customer status"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setFilters({ price: "", category: "", status: "" })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
              <button
                onClick={() => setFilterVisible(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Image</th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Category</th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="p-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{item.category}</td>
                <td className="p-4 text-sm text-gray-600">€ {item.price.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    item.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 relative">
                  <button
                  title='hh'
                    onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                  
                  {activeDropdown === item.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <button
                        onClick={() => {router.push('/owner/view-menu')}} // View action
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button
                        onClick={() => {router.push('/owner/edit-menu')}} // Edit action
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Power className="w-4 h-4" /> 
                        {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center gap-2"
                      >
                        <UserMinus className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
        <span className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, foodItems.length)} of {foodItems.length} items
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodManagement;