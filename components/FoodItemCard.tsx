import Image from 'next/image';
import React, { useState } from "react";
import { MoreVertical, Eye, Edit ,UserMinus} from 'lucide-react';
import { FoodItem } from './types';

interface FoodItemCardProps {
  item: FoodItem;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, onToggleStatus, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative h-48">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            item.status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {item.status}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{item.category}</p>
        <p className="font-semibold text-gray-900 mt-2">€ {item.price.toFixed(2)}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => onToggleStatus(item.id)}
            className={`px-3 py-1 rounded text-sm ${
              item.status === 'Active'
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {item.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
          
          <div className="relative">
            <button
            title='ff'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center gap-2"
                >
                  <UserMinus className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;