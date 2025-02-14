import React, { useState } from 'react';

interface OfferItem {
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  description: string;
  code?: string;
  validUntil: string;
  isNew?: boolean;
  category: string;
}

interface PriceTagProps {
  originalPrice: number;
  discountedPrice: number;
}

const PriceTag: React.FC<PriceTagProps> = ({ originalPrice, discountedPrice }) => {
  const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl font-bold text-orange-600">
        ₦{discountedPrice.toLocaleString()}
      </span>
      <span className="text-lg line-through text-gray-400">
         ₦{originalPrice.toLocaleString()}
      </span>
      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
        {discount}% OFF
      </span>
    </div>
  );
};

const OfferCard: React.FC<{ offer: OfferItem }> = ({ offer }) => {
  const [isCodeCopied, setIsCodeCopied] = useState(false);

  const copyCode = () => {
    if (offer.code) {
      navigator.clipboard.writeText(offer.code);
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={offer.image || "/api/placeholder/400/300"} 
          alt={offer.name}
          className="w-full h-48 object-cover" 
        />
        {offer.isNew && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            NEW
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.name}</h3>
        <p className="text-gray-600 mb-4">{offer.description}</p>
        
        <PriceTag 
          originalPrice={offer.originalPrice} 
          discountedPrice={offer.discountedPrice} 
        />
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Valid until:</span>
            <span>{offer.validUntil}</span>
          </div>
          
          {offer.code && (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-lg p-3">
                <div className="font-mono text-sm">{offer.code}</div>
              </div>
              <button
                onClick={copyCode}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                {isCodeCopied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OffersPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Offers' },
    { id: 'special', name: 'Special Days' },
    { id: 'combo', name: 'Combo Deals' },
    { id: 'seasonal', name: 'Seasonal' }
  ];

  const offers: OfferItem[] = [
    {
      id: 1,
      category: 'special',
      name: "Valentine's Day Special",
      description: "Romantic dinner for two featuring our signature steak, wine pairing, and special dessert",
      originalPrice: 150000,
      discountedPrice: 119000,
      image: "/api/placeholder/400/300",
      validUntil: "February 14, 2025",
      code: "LOVE25",
      isNew: true
    },
    {
      id: 2,
      category: 'special',
      name: "Children's Day Feast",
      description: "Kid's meal with special themed dessert, drink, and a surprise gift",
      originalPrice: 35000,
      discountedPrice: 25000,
      image: "/api/placeholder/400/300",
      validUntil: "May 5, 2025",
      code: "KIDS25"
    },
    {
      id: 3,
      category: 'combo',
      name: "Family Weekend Bundle",
      description: "Complete family meal with appetizers, main courses, desserts, and drinks for 4",
      originalPrice: 200000,
      discountedPrice: 159000,
      image: "/api/placeholder/400/300",
      validUntil: "December 31, 2025",
      code: "FAM40"
    },
    {
      id: 4,
      category: 'seasonal',
      name: "Summer BBQ Special",
      description: "Premium BBQ platter with seasonal sides and refreshing beverages",
      originalPrice: 89000,
      discountedPrice: 69000,
      image: "/api/placeholder/400/300",
      validUntil: "August 31, 2025",
      isNew: true
    }
  ];

  const filteredOffers = activeCategory === 'all' 
    ? offers 
    : offers.filter(offer => offer.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Special Offers</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our exclusive deals and limited-time offers. 
            Don't miss out on these amazing discounts!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
                ${activeCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOffers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersPage;